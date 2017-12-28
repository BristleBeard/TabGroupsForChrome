chrome.browserAction.onClicked.addListener(function(wtf) {
  // Open extension's manager.html page in new tab
  chrome.tabs.query({'url':chrome.extension.getURL('manager.html')}, function(tabs) {
    // Close any existing tabs which are currently displaying manager.html
    for(var i = 0 ; i < tabs.length ; ++i)
    {
      chrome.tabs.remove(tabs[i]['id']);
    }

    // Create new tab for manager.html
    chrome.tabs.create({'url': chrome.extension.getURL('manager.html')}, function(tab) {
      // Tab opened.
    });
  });
});
