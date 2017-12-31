function allowDrop(ev)
{
  ev.preventDefault();
}

function dragTabBegin(ev)
{
  ev.dataTransfer.setData("tab_id",ev.target.id);
}

function dropTabOnGroup(ev)
{
  ev.preventDefault();

  // Retrieve the ID of the target group
  var id = getGroupId($(ev.target));

  // Remove the original tab link
  var tab = removeTabFromGroup(ev.dataTransfer.getData("tab_id"));

  // Add tab to the target group
  addTabToGroup(getGroup(id), tab);

  // Save the groups to local storage
  saveGroups();

  // Prevent any further propagation of drop event
  ev.stopPropagation();
}
