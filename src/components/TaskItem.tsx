import React, { useState } from "react";
import { Task } from "@/types";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<Props> = ({ task, onEdit, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const date = new Date(task.createdAt).toLocaleString();

  const handleCopy = () => {
    navigator.clipboard.writeText(task.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-white/20 hover:shadow-2xl transition transform hover:-translate-y-1 relative overflow-hidden">
      <div className="flex justify-between items-start">
        <div className="flex-1 cursor-pointer" onClick={handleCopy}>
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
            className="text-indigo-600 hover:text-indigo-800"
          >
            ✎
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-500 hover:text-red-700"
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
  );
};
