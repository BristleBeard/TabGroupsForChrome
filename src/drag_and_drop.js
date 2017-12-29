function allowDrop(ev)
{
  ev.preventDefault();
}

function dragTabBegin(ev)
{
  ev.dataTransfer.setData("Id_lien",ev.target.id);
}

function dropTabOnGroup(ev)
{
  ev.preventDefault();
  
  // Recuperation de l'id de la cible
  var id = getGroupId($(ev.target));
  
  // Suppression du lien initial
  var tab = removeTabFromGroup(ev.dataTransfer.getData("Id_lien"));
  
  // Rajout dans le groupe
  addTabToGroup(getGroup(id), tab);
  
  // Sauvegarde
  saveGroup();
  
  // On a fini de gerer le drop a tous les niveaux
  ev.stopPropagation();
} 
