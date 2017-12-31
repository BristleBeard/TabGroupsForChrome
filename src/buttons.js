$( document ).ready(function() {

  $("#create_group").click(function() {
    createGroup();
    // Save the groups to local storage
    saveGroups();
  });

  $("#groups_list").on( "click", ".group_remove", function() {
    if( ! confirm('Close this tab group?'))
    {
      return;
    }

    var group = getGroup(getGroupId($(this)));

    if(group.id == activeGroup.id)
    {
      // Define the next group as active
      var next_group = groupsList[0];// Get the first available group
      if(next_group.id == activeGroup.id)// Check if it is the same group
      {
        // There is at least one other group, so use the next one
        if(groupsList.length > 1)
        {
          next_group = groupsList[1];
        }
        // Otherwise, create a new one
        else
        {
          next_group = createGroup();
        }
      }

      // Close the tabs in the current group and open those in the next
      setActiveGroup(next_group);

      // Save the groups to local storage
      saveGroups();
    }

    // Remove the tab group from our extension's tab group manager page
    $("#group_id_" + group.id.toString()).remove();

    // Remove group from the list of groups
    groupsList.splice(groupsList.indexOf(group), 1);

    // Save the groups to local storage
    saveGroups();
  });

  $("#groups_list").on( "click", ".group_set_active", function() {
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

  $("#groups_list").on( "blur", ".group_name", function() {
    group = getGroup(getGroupId($(this)));
    group.name = $(this).val();

    // Save the groups to local storage
    saveGroups();
  });

});
