let isPanelOpen = false;

// 1. Утилита для уведомления Popup (если он открыт в данный момент)
function broadcastStatus() {
  chrome.runtime
    .sendMessage({ type: "PANEL_STATUS", isOpen: isPanelOpen })
    .catch(() => {
      // Ошибка неизбежна, если Popup закрыт — это нормально, просто игнорируем
    });
}

// 2. Отслеживаем состояние панели через порт
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "sidepanel") {
    isPanelOpen = true;
    broadcastStatus();

    port.onDisconnect.addListener(() => {
      isPanelOpen = false;
      broadcastStatus();
    });
  }
});

// 3. Обработка запросов статуса (от Popup при его открытии)
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "GET_PANEL_STATUS") {
    sendResponse({ isOpen: isPanelOpen });
  }
  // НОВЫЙ БЛОК: Принудительное закрытие из SW
  if (message.type === "FORCE_CLOSE_PANEL") {
    chrome.sidePanel.close({ windowId: message.windowId }).catch(console.error);
  }
});

// 4. Логика Toggle (через горячую клавишу)
chrome.commands.onCommand.addListener((command) => {
  if (command === "open-sidepanel") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab?.id) return;

      // Проверка на системные страницы (ошибка User Gesture часто вылетает именно на них)
      if (tab.url?.startsWith("chrome://") || tab.url?.startsWith("edge://")) {
        return;
      }

      if (isPanelOpen) {
        chrome.sidePanel.close({ windowId: tab.windowId });
      } else {
        // Вызываем БЕЗ await, чтобы не потерять "User Gesture"
        chrome.sidePanel.open({ tabId: tab.id }).catch(console.error);
      }
    });
  }
});
