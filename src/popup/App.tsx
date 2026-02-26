import  { useEffect, useState, lazy, Suspense } from "react";

const HotkeyRecorder = lazy(() =>
  import("@/components/HotkeyRecorder").then((module) => ({
    default: module.HotkeyRecorder,
  }))
);

function App() {
  const [currentShortcut, setCurrentShortcut] = useState("Ctrl+B");

  useEffect(() => {
    chrome.commands.getAll((commands) => {
      const cmd = commands.find((c) => c.name === "open-sidepanel");
      if (cmd?.shortcut) {
        setCurrentShortcut(cmd.shortcut);
      }
    });
  }, []);

  const openSidepanel = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab?.id) {
      chrome.sidePanel.open({ tabId: tab.id });
    }
  };

  return (
    <div className="w-64 p-4 bg-linear-to-br from-indigo-100 to-purple-100 rounded-lg">
      <button
        onClick={openSidepanel}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition transform hover:scale-105 flex items-center justify-center gap-2"
      >
        <span>📋</span> Открыть список задач
      </button>

      <Suspense
        fallback={<div className="text-xs text-gray-400 mt-2">Загрузка...</div>}
      >
        <HotkeyRecorder currentShortcut={currentShortcut} />
      </Suspense>

      <p className="text-xs text-gray-400 mt-3 text-center border-t border-indigo-200 pt-2">
        Нажмите сочетание для быстрого доступа
      </p>
    </div>
  );
}

export default App;
