# chrome-task-manager — AI Rules

## Overview
Chrome-расширение для управления списком задач с боковой панелью, drag-and-drop и горячими клавишами.

## Architecture
chrome-task-manager/
├── public/ # иконки расширения
├── src/
│ ├── background/ # Service Worker (Manifest V3)
│ ├── popup/ # Popup окно (быстрое открытие/закрытие панели)
│ ├── sidepanel/ # Боковая панель с основным интерфейсом
│ ├── components/ # Общие React-компоненты
│ ├── hooks/ # useLocalStorage
│ ├── styles/ # Tailwind CSS
│ └── types.ts # Типы Task
├── manifest.config.ts # Манифест через @crxjs/vite-plugin
└── vite.config.ts # Vite + CRXJS + Tailwind

text

## Tech Stack
- React 19, TypeScript
- Vite, @crxjs/vite-plugin (сборка расширения)
- Tailwind CSS v4
- @dnd-kit (drag-and-drop)
- Chrome Extension APIs: Side Panel, Commands, Storage

## Conventions
- Компоненты именуются в PascalCase (TaskForm, SortableTaskItem)
- Хуки – camelCase (useLocalStorage)
- Состояние панели управляется через Service Worker и передаётся через `chrome.runtime.sendMessage`
- Для открытия/закрытия панели используется `chrome.sidePanel.open/close` с проверкой на системные страницы

## Testing
Вручную, юнит-тесты не добавлены.