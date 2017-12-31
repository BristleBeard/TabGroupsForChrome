function createTab(tab, onFirstLaunch, callback)
{
  if(!onFirstLaunch)// Do not re-open tabs which are already open
  {
      chrome.tabs.create({url:tab.url, active:false, pinned:tab.pinned}, function(createdTab) {
      // Retrieve the Chrome tab ID
      tab.id_chrome = createdTab.id;
      callback();
    });
  }
}

function closeTab(tab)
{
  chrome.tabs.remove(tab.id_chrome);
}
