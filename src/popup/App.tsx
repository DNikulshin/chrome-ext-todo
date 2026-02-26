import { useEffect, useState, lazy, Suspense } from "react";

const HotkeyRecorder = lazy(() =>
  import("@/components/HotkeyRecorder").then((module) => ({
    default: module.HotkeyRecorder,
  }))
);

function App() {
  const [currentShortcut, setCurrentShortcut] = useState("Ctrl+B");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Получаем текущую горячую клавишу
    chrome.commands.getAll((commands) => {
      const cmd = commands.find((c) => c.name === "open-sidepanel");
      if (cmd?.shortcut) {
        setCurrentShortcut(cmd.shortcut);
      }
    });

    // 2. Спрашиваем Service Worker, открыта ли панель прямо сейчас
    chrome.runtime.sendMessage({ type: "GET_PANEL_STATUS" }, (response) => {
      if (chrome.runtime.lastError) return;
      if (response) setIsPanelOpen(response.isOpen);
    });

    // 3. Слушаем обновления статуса от Service Worker в реальном времени
    const statusListener = (message: any) => {
      if (message.type === "PANEL_STATUS") {
        setIsPanelOpen(message.isOpen);
      }
    };
    chrome.runtime.onMessage.addListener(statusListener);

    return () => chrome.runtime.onMessage.removeListener(statusListener);
  }, []);

  const handleTogglePanel = async () => {
    setError(null);

    // Получаем активную вкладку, чтобы знать tabId и windowId
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab?.id || !tab?.windowId) return;

    if (isPanelOpen) {
      // ЗАКРЫТИЕ: обязательно передаем windowId
      try {
        await chrome.sidePanel.close({ windowId: tab.windowId });
        // Состояние обновится само через слушатель PANEL_STATUS
      } catch (err) {
        console.error("Ошибка при закрытии:", err);
        setError("Не удалось закрыть панель");
      }
    } else {
      // ОТКРЫТИЕ: проверяем, не системная ли это страница
      const isSystemPage =
        tab.url?.startsWith("chrome://") || tab.url?.startsWith("edge://");

      if (isSystemPage) {
        setError("Панель недоступна на этой странице");
        return;
      }

      try {
        await chrome.sidePanel.open({ tabId: tab.id });
        // Закрываем popup, чтобы не мешал обзору
        window.close();
      } catch (err) {
        console.error("Ошибка при открытии:", err);
        setError("Ошибка запуска панели");
      }
    }
  };

  return (
    <div className="w-64 p-4 bg-linear-to-br from-indigo-100 to-purple-100 rounded-lg shadow-xl">
      <button
        onClick={handleTogglePanel}
        className={`w-full py-2 px-4 rounded-lg text-white font-medium transition transform hover:scale-105 flex items-center justify-center gap-2 shadow-md ${
          isPanelOpen
            ? "bg-red-500 hover:bg-red-600"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        <span>📋</span>
        {isPanelOpen ? "Закрыть список задач" : "Открыть список задач"}
      </button>

      {error && (
        <p className="text-[11px] text-red-600 mt-2 text-center font-medium animate-pulse">
          {error}
        </p>
      )}

      <div className="mt-4 border-t border-indigo-200 pt-3">
        <Suspense
          fallback={
            <div className="text-xs text-gray-400 mt-2">Загрузка...</div>
          }
        >
          <HotkeyRecorder currentShortcut={currentShortcut} />
        </Suspense>
      </div>

      <p className="text-[10px] text-gray-500 mt-3 text-center italic">
        {isPanelOpen
          ? "Панель активна в правой части экрана"
          : "Нажмите кнопку или горячую клавишу"}
      </p>
    </div>
  );
}

export default App;
