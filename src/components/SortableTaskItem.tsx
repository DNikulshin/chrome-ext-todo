import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const SortableTaskItem: React.FC<Props> = ({
  task,
  onEdit,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);
  const date = new Date(task.createdAt).toLocaleString();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "auto",
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(task.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-white/20 hover:shadow-2xl transition relative overflow-hidden ${
        isDragging ? "shadow-2xl ring-2 ring-indigo-400" : ""
      }`}
    >
      <div className="flex justify-between items-start">
        <div
          className="flex-1 cursor-grab active:cursor-grabbing"
          onClick={handleCopy}
          {...attributes}
          {...listeners}
        >
          <p className="text-gray-800 text-lg group">
            {task.text}
            <span className="ml-2 text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition">
              (нажмите, чтобы скопировать)
            </span>
          </p>
          <p className="text-sm text-gray-500 mt-1">Создано: {date}</p>
        </div>

        <div className="flex gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
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

      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-30">
        ⋮⋮
      </div>
    </div>
  );
};
