/**
* Fonctions de manipulation des goupes et onglets
*/

function createGroup()
{
  // Creation du groupe
  var new_group = new classGroup();

  new_group.id = getNewId();
  new_group.name = "Group " + new_group.id.toString();

  // Ajout du groupe
  list_groups.push(new_group);

  // Actualisation de l'affichage
  $("#list_groups").append(
    '<div id="group_id_' + new_group.id.toString() + '" class="group_id" >' +
      '<p class="group_head">' +
	'<input type="text" class="group_name" value="' + new_group.name + '" >' +
	'<button type="button" class="group_set_actif" >Open Tab Group</button>' +
	'<button type="button" class="group_remove" title="Close Group">X</button>' +
	'<button type="button" class="group_move" draggable="true" >M</button>' +
      '</p>' +
      '<ul class="list_onglet">' +
      '</u>' +
    '</div>'
  );

  // Autorisation du Drag&Drop
  $('#group_id_' + new_group.id.toString()).get(0).addEventListener('dragover', allowDrop, false);
  $('#group_id_' + new_group.id.toString()).get(0).addEventListener('drop', dropLienVersGroupe, false);

  return new_group;
}

function addGroupTab(group, tab, onFirstLaunch)
{
  // On ne peut pas ajouter notre extention
  if(tab.url != chrome.extension.getURL('manager.html'))
  {
    // Rajout au groupe
    tab.tab_group = group.id;
    group.list_tabs.push(tab);

    // Actualisation de l'affichage
    var elementOngletListe = '<li draggable="true" id="tab_id_' + tab.id + '" title="' + tab.url + '" >';

    elementOngletListe += '<div class="tabButtons" >';
      elementOngletListe += '<input type="checkbox" class="tabCheckButton" />';
      elementOngletListe += '<button type="button" class="tabGoButton" >-&rsaquo;</button>';
      elementOngletListe += '<button type="button" class="tabCloseButton" >-</button>';
    elementOngletListe += '</div>';

    if(tab.icon)
    {
      elementOngletListe += '<img src="' + tab.icon + '" alt="" height="17px" /> ';
    }
    if(tab.title)
    {
      elementOngletListe += tab.title;
    }
    else
    {
      elementOngletListe += tab.url;
    }
    if(tab.pinned)
    {
      elementOngletListe += ' (P)';
    }
    elementOngletListe += '</li>';

    $("#group_id_" + group.id.toString()).find(".list_onglet").append(elementOngletListe);

    /*$("#group_id_" + group.id.toString()).find(".list_onglet").append(
      '<li draggable="true" id="tab_id_' + tab.id + '" >' + tab.url + '<button type="button" class="tabCloseButton" >-</button></li>'
    );*/

    // Autorisation du Drag&Drop
    $('#tab_id_' + tab.id.toString()).get(0).addEventListener('dragstart', dragLienBegin, false);

    // Creation de l'onglet si group actif
    if(group.id == activeGroup.id)
    {
      createTab(tab, onFirstLaunch);
    }
  }

}

function removeTabGroup(id_tab)
{
  // Suppression de l'affichage
  $('#' + id_tab).remove();

  // Suppression du groupe
  var group = getGroupByTab(id_tab);
  id_tab = parseInt(id_tab.replace("tab_id_",""));

  for(var i=0 ; i < group.list_tabs.length ; i++)
  {
    if(group.list_tabs[i].id == id_tab)
    {
      // Sauvegarde
      var tab = group.list_tabs[i];

      // Effacement
      group.list_tabs.splice(i, 1);

      // Fermeture de l'onglet si group actif
      if(group.id == activeGroup.id)
      {
	closeTab(tab);

	// Verification qu'il reste un onglet apres
	if(activeGroup.list_tabs.length == 0)
	{
	  // On creer un onglet a vide charger
	  var empty_tab = new classTab();
	  empty_tab.id = getNewIdTab();
	  empty_tab.id_chrome = -1;
	  empty_tab.url = "chrome://newtab/";
          empty_tab.pinned = false;
	  empty_tab.title = "Nouvel onglet";
	  empty_tab.icon = "";
	  empty_tab.tab_group = -1;

	  addGroupTab(activeGroup, empty_tab);
	}
      }

      tab.tab_group = -1;
      tab.id_chrome = -1;

      // On retourne l'onglet efface
      return tab;
    }
  }
}

function setGroupActif(group, callback)
{
  $(".active_group").removeClass("active_group");

  // On ferme les onglets du groupe courant
  for(var i=0 ; i < activeGroup.list_tabs.length ; ++i)
  {
    closeTab(activeGroup.list_tabs[i], true);
  }

  // On actualise le nouveau groupe actif
  activeGroup = group;

  if(activeGroup.list_tabs.length == 0)
  {
    // On creer un onglet a vide charger
    var empty_tab = new classTab();
    empty_tab.id = getNewIdTab();
    empty_tab.id_chrome = -1;
    empty_tab.url = "chrome://newtab/";
    empty_tab.pinned = false;
    empty_tab.title = "Nouvel onglet";
    empty_tab.icon = "";
    empty_tab.tab_group = -1;

    addGroupTab(activeGroup, empty_tab);
  }

  $("#group_id_" + activeGroup.id.toString()).addClass("active_group");

  // On ouvre les onglets
  console.log("Ouverture :" + activeGroup.name);
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
