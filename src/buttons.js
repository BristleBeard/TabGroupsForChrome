/**
 * Functionality initiated when buttons and other interface elements on
 * the tab group manager page are clicked upon and/or interacted with
 */

$(document).ready(function() {
    var elemGroupsList = $("#groups_list");

    $("#create_group").click(function() {
        createGroup();
        // Save the groups to local storage
        saveGroups();
    });

    elemGroupsList.on("click", ".group_remove", function() {
        if( ! confirm('Close this tab group?')) {
            return;
        }

        removeGroup(getGroup(getGroupId($(this))));
        // Save the groups to local storage
        saveGroups();
    });

    elemGroupsList.on("click", ".group_set_active", function() {
        setActiveGroup(getGroup(getGroupId($(this))), function() {
            // Use callback to avoid race condition where the current tab is closed before
            // the new group has been opened (could potentially close the windows or terminate
            // the script before complete execution)
            // Save the groups to local storage
            saveGroups(function() {
                close();
            });
        });
    });

    elemGroupsList.on("click", ".tabs_list li", function() {
        switchToTab($(this).attr("id"));
    });

    elemGroupsList.on("click", ".tabCloseButton", function() {
        removeTabFromGroup($(this).attr("id").replace("close_", ""));
        saveGroups();
    });

    elemGroupsList.on("blur", ".group_name", function() {
        group = getGroup(getGroupId($(this)));
        group.name = $(this).val();

        // Save the groups to local storage
        saveGroups();
    });

});
