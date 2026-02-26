import React from "react";

interface Props {
  currentShortcut: string;
}

export const HotkeyRecorder: React.FC<Props> = ({ currentShortcut }) => {
  const openShortcutsPage = () => {
    chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
  };

  return (
    <div className="mt-3 text-sm">
      <p className="text-gray-600 mb-1">Текущее сочетание:</p>
      <div className="flex items-center gap-2">
        <kbd className="px-2 py-1 bg-gray-100 border rounded font-mono text-xs">
          {currentShortcut}
        </kbd>
        <button
          onClick={openShortcutsPage}
          className="text-indigo-600 hover:underline text-xs"
        >
          Изменить
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-1">
        Откроется страница настроек Chrome, где можно изменить горячие клавиши.
      </p>
    </div>
  );
};
