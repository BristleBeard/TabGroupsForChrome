/**
* Functions to manipulate groups and associated tabs
*/

function createGroup()
{
  // Group creation
  var new_group = new classGroup();

  new_group.id = getNewIdForGroup();
  new_group.name = "Group " + new_group.id.toString();

  // Add the group to the groups list
  list_groups.push(new_group);

  // Update the displayed tab groups on our extension's tab group manager page
  $("#list_groups").append(
    '<div id="group_id_' + new_group.id.toString() + '" class="group_id" >' +
      '<p class="group_head">' +
	'<input type="text" class="group_name" value="' + new_group.name + '" >' +
	'<button type="button" class="group_set_active" >Open Tab Group</button>' +
	'<button type="button" class="group_remove" title="Close Group">X</button>' +
	'<button type="button" class="group_move" draggable="true" >M</button>' +
      '</p>' +
      '<ul class="list_tabs">' +
      '</u>' +
    '</div>'
  );

  // Set up Drag & Drop functionality for new tab group
  $('#group_id_' + new_group.id.toString()).get(0).addEventListener('dragover', allowDrop, false);
  $('#group_id_' + new_group.id.toString()).get(0).addEventListener('drop', dropTabOnGroup, false);

  return new_group;
}

function addTabToGroup(group, tab, onFirstLaunch)
{
  // don't add our extension's tab group manager page as a tab
  if(tab.url != chrome.extension.getURL('manager.html'))
  {
    // Add tab to the relevant tab group
    tab.tab_group = group.id;
    group.list_tabs.push(tab);

    // Update the displayed tabs in this group (on our extension's tab group manager page)
    var tabListElement = '<li draggable="true" id="tab_id_' + tab.id + '" title="' + tab.url + '" >';

    tabListElement += '<div class="tabButtons" >';
      tabListElement += '<input type="checkbox" class="tabCheckButton" />';
      tabListElement += '<button type="button" class="tabGoButton" >-&rsaquo;</button>';
      tabListElement += '<button type="button" class="tabCloseButton" >-</button>';
    tabListElement += '</div>';

    if(tab.icon)
    {
      tabListElement += '<img src="' + tab.icon + '" alt="" height="17px" /> ';
    }
    if(tab.title)
    {
      tabListElement += tab.title;
    }
    else
    {
      tabListElement += tab.url;
    }
    if(tab.pinned)
    {
      tabListElement += ' (P)';
    }
    tabListElement += '</li>';

    $("#group_id_" + group.id.toString()).find(".list_tabs").append(tabListElement);

    /*$("#group_id_" + group.id.toString()).find(".list_tabs").append(
      '<li draggable="true" id="tab_id_' + tab.id + '" >' + tab.url + '<button type="button" class="tabCloseButton" >-</button></li>'
    );*/

    // Set up Drag & Drop functionality for new tab
    $('#tab_id_' + tab.id.toString()).get(0).addEventListener('dragstart', dragTabBegin, false);

    // Create tab within browser if this tab group is the active group
    if(group.id == activeGroup.id)
    {
      createTab(tab, onFirstLaunch);
    }
  }

}

function removeTabFromGroup(id_tab)
{
  // Remove this tab from the display on our extension's tab group manager page
  $('#' + id_tab).remove();

  // Remove tab from the specified tab group
  var group = getGroupByTab(id_tab);
  id_tab = parseInt(id_tab.replace("tab_id_",""));

  for(var i=0 ; i < group.list_tabs.length ; i++)
  {
    if(group.list_tabs[i].id == id_tab)
    {
      // Store tab details for future reference
      var tab = group.list_tabs[i];

      // Remove tab from list of tabs associated with this group
      group.list_tabs.splice(i, 1);

      // Close tab within browser if this group is the active group
      if(group.id == activeGroup.id)
      {
	closeTab(tab);

	// Check whether any remaining tabs are open in the active group
	if(activeGroup.list_tabs.length == 0)
	{
	  // Create a new 'empty' tab (set to default 'New Tab' page) for browser to load
	  var empty_tab = new classTab();
	  empty_tab.id = getNewIdForTab();
	  empty_tab.id_chrome = -1;
	  empty_tab.url = "chrome://newtab/";
          empty_tab.pinned = false;
	  empty_tab.title = "New Tab";
	  empty_tab.icon = "";
	  empty_tab.tab_group = -1;

	  addTabToGroup(activeGroup, empty_tab);
	}
      }

      tab.tab_group = -1;
      tab.id_chrome = -1;

      // Return details of the removed tab
      return tab;
    }
  }
}

function setActiveGroup(group, callback)
{
  $(".active_group").removeClass("active_group");

  // Close tabs in currently active group
  for(var i=0 ; i < activeGroup.list_tabs.length ; ++i)
  {
    closeTab(activeGroup.list_tabs[i], true);
  }

  // Update the currently active group
  activeGroup = group;

  // Check whether the new active group has any tabs
  if(activeGroup.list_tabs.length == 0)
  {
    // Create a new 'empty' tab (set to default 'New Tab' page) for browser to load
    var empty_tab = new classTab();
    empty_tab.id = getNewIdForTab();
    empty_tab.id_chrome = -1;
    empty_tab.url = "chrome://newtab/";
    empty_tab.pinned = false;
    empty_tab.title = "New Tab";
    empty_tab.icon = "";
    empty_tab.tab_group = -1;

    addTabToGroup(activeGroup, empty_tab);
  }

  $("#group_id_" + activeGroup.id.toString()).addClass("active_group");

  // Open the tabs within the new active group in the browser
  console.log("Opening tab group: " + activeGroup.name);
  var counter = 0;
  for(var i=0 ; i < activeGroup.list_tabs.length ; ++i)
  {
    createTab(activeGroup.list_tabs[i], undefined, function () {
        ++counter; // Apparently Js is single threaded so no need to use semaphore or other protection
        if (counter == activeGroup.list_tabs.length) { // When the last tab has been opened, we call the callback
            callback();
        }
    });
  }
}
