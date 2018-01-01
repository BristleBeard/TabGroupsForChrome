/**
 * Functions to manipulate groups and associated tabs
 */

function createGroup() {
    // Group creation
    var new_group = new classGroup();

    new_group.id = getNewIdForGroup();
    new_group.name = "Group " + new_group.id.toString();

    // Add the group to the groups list
    groupsList.push(new_group);

    // Update the displayed tab groups on our extension's tab group manager page
    $("#groups_list").append(
        '<div id="group_id_' + new_group.id.toString() + '" class="group_id" >' +
            '<p class="group_head">' +
                '<input type="text" class="group_name" value="' + new_group.name + '" >' +
                '<button type="button" class="group_set_active" >Open Tab Group</button>' +
                '<button type="button" class="group_remove" title="Close Group">X</button>' +
                '<button type="button" class="group_move" draggable="true" >M</button>' +
            '</p>' +
            '<ul class="tabs_list">' +
            '</u>' +
        '</div>'
    );

    // Set up Drag & Drop functionality for new tab group
    var elemNewGroup = $('#group_id_' + new_group.id.toString());
    elemNewGroup.get(0).addEventListener('dragover', allowDrop, false);
    elemNewGroup.get(0).addEventListener('drop', dropTabOnGroup, false);

    return new_group;
}

function addTabToGroup(group, tab, disableTabCreation) {
    // don't add our extension's tab group manager page as a tab
    if(tab.url == chrome.extension.getURL('manager.html')) {
        return;
    }

    // Add tab to the relevant tab group
    tab.tab_group = group.id;
    group.tabs_list.push(tab);

    // Update the displayed tabs in this group (on our extension's tab group manager page)
    var tabListElement = '<li draggable="true" id="tab_id_' + tab.id + '" title="' + tab.url + '" >';

    tabListElement +=   '<div class="tabButtons" >';
    tabListElement +=       '<input type="checkbox" class="tabCheckButton" />';
    tabListElement +=       '<button type="button" class="tabGoButton" >-&rsaquo;</button>';
    tabListElement +=       '<button type="button" class="tabCloseButton" >-</button>';
    tabListElement +=   '</div>';

    if(tab.icon) {
        tabListElement += '<img src="' + tab.icon + '" alt="" height="17px" /> ';
    }

    if(tab.title) {
        tabListElement += tab.title;
    } else {
        tabListElement += tab.url;
    }

    if(tab.pinned) {
        tabListElement += ' (P)';
    }

    tabListElement += '</li>';

    $("#group_id_" + group.id.toString()).find(".tabs_list").append(tabListElement);

    /*$("#group_id_" + group.id.toString()).find(".tabs_list").append(
     '<li draggable="true" id="tab_id_' + tab.id + '" >' + tab.url + '<button type="button" class="tabCloseButton" >-</button></li>'
     );*/

    // Set up Drag & Drop functionality for new tab
    $('#tab_id_' + tab.id.toString()).get(0).addEventListener('dragstart', dragTabBegin, false);

    // Create tab within browser if this is enabled and current tab group is the active group
    if( ! disableTabCreation && group.id == activeGroup.id) {
        createTab(tab);
    }

}

function createNewEmptyTab(group) {
    // Create a new 'empty' tab (set to default 'New Tab' page) for browser to load
    var empty_tab = new classTab();
    empty_tab.id = getNewIdForTab();
    empty_tab.id_chrome = -1;
    empty_tab.url = getNewTabUrl();
    empty_tab.pinned = false;
    empty_tab.title = "New Tab";
    empty_tab.icon = "";
    empty_tab.tab_group = -1;

    addTabToGroup(group, empty_tab);
}

function removeTabFromGroup(id_tab) {
    // Remove this tab from the display on our extension's tab group manager page
    $('#' + id_tab).remove();

    // Remove tab from the specified tab group
    var group = getGroupByTab(id_tab);
    id_tab = parseInt(id_tab.replace("tab_id_", ""));

    for(var i = 0; i < group.tabs_list.length; i++) {
        if(group.tabs_list[i].id != id_tab) {
            continue;
        }

        // Store tab details for future reference
        var tab = group.tabs_list[i];

        // Remove tab from list of tabs associated with this group
        group.tabs_list.splice(i, 1);

        // Close tab within browser if this group is the active group
        if(group.id == activeGroup.id) {
            closeTab(tab);

            // Check whether any remaining tabs are open in the active group
            if(activeGroup.tabs_list.length == 0) {
                // Create a new 'empty' tab (set to default 'New Tab' page) for browser to load
                createNewEmptyTab(activeGroup);
            }
        }

        tab.tab_group = -1;
        tab.id_chrome = -1;

        // Return details of the removed tab
        return tab;
    }
}

function setActiveGroup(group, callback) {
    $(".active_group").removeClass("active_group");

    // Close tabs in currently active group
    for(var i = 0; i < activeGroup.tabs_list.length; ++i) {
        closeTab(activeGroup.tabs_list[i], true);
    }

    // Update the currently active group
    activeGroup = group;

    // Check whether the new active group has any tabs
    if(activeGroup.tabs_list.length == 0) {
        // Create a new 'empty' tab (set to default 'New Tab' page) for browser to load
        createNewEmptyTab(activeGroup);
    }

    $("#group_id_" + activeGroup.id.toString()).addClass("active_group");

    // Open the tabs within the new active group in the browser
    console.log("Opening tab group: " + activeGroup.name);
    var counter = 0;
    for(i = 0; i < activeGroup.tabs_list.length; i++) {
        createTab(activeGroup.tabs_list[i], function() {
            counter++; // Apparently Js is single threaded so no need to use semaphore or other protection
            if(counter == activeGroup.tabs_list.length) { // When the last tab has been opened, we call the callback
                callback();
            }
        });
    }
}

function removeGroup(group) {
    if(group.id == activeGroup.id) {
        // Define the next group as active
        var next_group = groupsList[0];// Get the first available group
        if(next_group.id == activeGroup.id) { // Check if it is the same group
            // There is at least one other group, so use the next one
            if(groupsList.length > 1) {
                next_group = groupsList[1];
            } else { // Otherwise, create a new one
                next_group = createGroup();
            }
        }

        // Close the tabs in the current group and open those in the next
        setActiveGroup(next_group);
    }

    // Remove the tab group from our extension's tab group manager page
    $("#group_id_" + group.id.toString()).remove();

    // Remove group from the list of groups
    groupsList.splice(groupsList.indexOf(group), 1);
}
