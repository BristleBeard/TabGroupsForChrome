/**
 * Search/retrieval functions
 */

function getNewIdForGroup()
{
  var valid = false;
  var id = 0;
  while(!valid)
  {
    valid = true;

    for (var i = 0 ; i < groupsList.length ; ++i)
    {
      // Check if the ID does not already exist within the list of groups
      if(groupsList[i].id == id)
      {
	valid = false;
      }
    }

    id++;
  }
  return id-1;
}


var id_counter = 0;

function getNewIdForTab()
{
  id_counter++;
  return id_counter;
}

function getGroupId(element)
{
  var group_id = "-1";

  // First check whether the supplied element is already a group
  if(element.hasClass("group_id"))
  {
    group_id = element.attr("id");
  }
  else
  {
    group_id = element.closest(".group_id").attr("id");
  }

  return parseInt(group_id.replace("group_id_",""));
}

function getGroup(id)
{
  for(var i=0 ; i < groupsList.length ; i++)
  {
    if(groupsList[i].id == id)
    {
      return groupsList[i];
    }
  }
  console.error("Group not found: " + id.toString());
}

function getGroupByTab(tab_id)
{
  tab_id = parseInt(tab_id.replace("tab_id_",""));

  for(var i=0 ; i < groupsList.length ; i++)
  {
    for(var j=0 ; j < groupsList[i].tabs_list.length ; j++)
    {
      if(groupsList[i].tabs_list[j].id == tab_id)
      {
	return groupsList[i];
      }
    }
  }
  console.error("No group contains tab: " + tab_id.toString());
}
