/**
 * Functions directly associated with browser functionality - e.g. opening and closing tabs
 */

function createTab(tab, callback) {
    chrome.tabs.create({ url: tab.url, active: false, pinned: tab.pinned }, function(createdTab) {
        // Retrieve the Chrome tab ID
        tab.id_chrome = createdTab.id;
        callback();
    });
}

function closeTab(tab) {
    chrome.tabs.remove(tab.id_chrome);
}

function setActiveTab(tab) {
    chrome.tabs.update(tab.id_chrome, { active: true });
}

function getNewTabUrl() {
    return 'chrome://newtab/';
}
