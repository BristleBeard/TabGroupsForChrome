/**
 * Define the classes/objects which will store tab and tab group data
 */

var classTab = function() {
    this.id;
    this.id_chrome;
    this.url;
    this.pinned;
    this.title;
    this.icon;
    this.thumbnail;
    this.tab_group;
};

var classGroup = function() {
    this.id;
    this.name;
    this.tabs_list = new Array();
};
