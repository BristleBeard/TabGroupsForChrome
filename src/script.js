/**
 * Main script
 */

console.log("Start Tab Groups script:");

var list_groups = new Array();
var activeGroup;

$( document ).ready(function() {

  activeGroup = createGroup();
  $("#group_id_" + activeGroup.id.toString()).addClass("active_group");

  chrome.windows.getAll({populate:true},function(windows)
  {
    // Retrieve currently open tabs
    windows.forEach(function(window){
      window.tabs.forEach(function(tab){

        if(!tab.pinned) // Ignore pinned tabs
        {
          // Create new tab object
          var new_tab = new classTab();

          new_tab.id = getNewIdForTab();
          new_tab.id_chrome = tab.id;
          new_tab.url = tab.url;
          new_tab.title = tab.title;
          new_tab.pinned = tab.pinned;
          new_tab.icon = tab.favIconUrl;
          new_tab.tab_group = -1;

          // Add the tab (without opening it)
          addTabToGroup(activeGroup, new_tab, true);
        }
      });
    });


    // Load previously stored tab groups
    loadGroups();

  });

});

