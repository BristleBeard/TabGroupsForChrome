/**
 * Event page launched when tab groups browser action button clicked.
 * Opens tab group manager page in new tab.
 */

chrome.browserAction.onClicked.addListener(function(tab) {
    // Open extension's manager.html page in new tab
    chrome.tabs.query({ 'url': chrome.extension.getURL('manager.html') }, function(tabs) {
        // Close any existing tabs which are currently displaying manager.html
        for(var i = 0; i < tabs.length; i++) {
            chrome.tabs.remove(tabs[i]['id']);
        }

        // Create new tab for manager.html
        chrome.tabs.create({ 'url': chrome.extension.getURL('manager.html') }, function(tab) {
            // Tab opened.
        });
    });
});
