// Слушаем команду открытия sidepanel
chrome.commands.onCommand.addListener((command) => {
  if (command === "open-sidepanel") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (tabId) {
        chrome.sidePanel.open({ tabId });
      }
    });
  }
});

// При установке/обновлении расширения никаких действий с commands.update не делаем
// Можно, например, просто логировать или ничего не делать
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});
