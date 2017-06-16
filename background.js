chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.executeScript(tab.ib, {
    file: 'jquery-3.2.1.min.js'
  });
  chrome.tabs.executeScript(tab.ib, {
    file: 'popup.js'
  });
});
