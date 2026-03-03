import React, { useState } from "react";
import { Task } from "@/types";
import { ConfirmDialog } from "./ConfirmDialog";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<Props> = ({ task, onEdit, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const date = new Date(task.createdAt).toLocaleString();

  const handleCopy = () => {
    navigator.clipboard.writeText(task.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDeleteClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(task.id);
    setConfirmOpen(false);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-white/20 hover:shadow-2xl transition transform hover:-translate-y-1 relative overflow-hidden">
        <div className="flex items-center gap-3">
          {/* Drag Handle Placeholder (for visual consistency) */}
          <div className="p-2 -ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-gray-400 opacity-0"
            >
              <circle cx="9" cy="12" r="1" />
              <circle cx="9" cy="5" r="1" />
              <circle cx="9" cy="19" r="1" />
              <circle cx="15" cy="12" r="1" />
              <circle cx="15" cy="5" r="1" />
              <circle cx="15" cy="19" r="1" />
            </svg>
          </div>

          <div
            className="flex-1 cursor-pointer select-text"
            onClick={handleCopy}
          >
            <p className="text-gray-800 text-lg group">
              {task.text}
              <span className="ml-2 text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition">
                (нажмите, чтобы скопировать)
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-1">Создано: {date}</p>
          </div>

          <div className="flex gap-2 ml-4">
            <button
              onClick={() => onEdit(task)}
              className="text-indigo-600 cursor-pointer hover:text-indigo-800"
            >
              ✎
            </button>
            <button
              onClick={handleDeleteClick}
              className="text-red-500 cursor-pointer hover:text-red-700"
            >
              🗑
            </button>
          </div>
        </div>

        {copied && (
          <div className="absolute bottom-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
            Скопировано!
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Подтвердите удаление"
        message="Вы уверены, что хотите удалить эту задачу?"
      />
    </>
  );
};
