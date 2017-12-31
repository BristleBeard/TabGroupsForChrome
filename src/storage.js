function loadGroups()
{
  var hugeStorage = new HugeStorageSync();
  hugeStorage.get("lg", function(strLoadedGroups){
    chrome.storage.sync.get(["active_group_name"], function(items){
      if(items["active_group_name"])
      {
	activeGroup.name = items["active_group_name"];
	$("#group_id_" + activeGroup.id.toString()).find(".group_name").val(activeGroup.name);
      }
      else
      {
	console.log("First launch...");
      }

      if(strLoadedGroups != "")
      {
	var loadedGroupsList = JSON.parse(strLoadedGroups);

	for(var i=0; i < loadedGroupsList.length; ++i)
	{
	  var newGroup = createGroup();
	  newGroup.name = loadedGroupsList[i].name;
	  $("#group_id_" + newGroup.id.toString()).find(".group_name").val(newGroup.name);

	  for(var j=0 ; j < loadedGroupsList[i].list_tabs.length; ++j)
	  {
	    // Create tab in loaded group
	    var new_tab = new classTab();

	    new_tab.id = getNewIdForTab();
	    new_tab.id_chrome = -1;
	    new_tab.url = loadedGroupsList[i].list_tabs[j].url;
	    new_tab.title = loadedGroupsList[i].list_tabs[j].title;
            new_tab.pinned = loadedGroupsList[i].list_tabs[j].pinned;
	    new_tab.icon = loadedGroupsList[i].list_tabs[j].icon;
	    new_tab.tab_group = -1;

	    // Add the tab (without opening it)
	    addTabToGroup(newGroup, new_tab);
	  }
	}
      }
      else
      {
	console.log("No saved tab groups found");
      }
    });
  });
}

function saveGroups(callback)
{
  //chrome.storage.sync.clear(function() {
    var saveGroupsList = new Array();
    for(var i=0 ; i < groupsList.length; ++i)
    {
      // Save all groups except the active group
      if(groupsList[i].id != activeGroup.id)
      {
	saveGroupsList.push(groupsList[i]);
      }
    }
    // Save the name of the active group
    chrome.storage.sync.set({"active_group_name": activeGroup.name});

    // Split the list of groups into 'chunks', and save them to local storage
    var hugeStorage = new HugeStorageSync();
    hugeStorage.set('lg', JSON.stringify(saveGroupsList), callback);
    //chrome.storage.sync.set({"groups_list":storageSplit});
  //});
}
