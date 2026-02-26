import React, { useState, useEffect } from "react";
import { Task } from "@/types";

interface Props {
  onSubmit: (text: string) => void;
  editingTask: Task | null;
  onUpdate: (id: string, text: string) => void;
  onCancelEdit: () => void;
}

export const TaskForm: React.FC<Props> = ({
  onSubmit,
  editingTask,
  onUpdate,
  onCancelEdit,
}) => {
  const [text, setText] = useState("");

  useEffect(() => {
    if (editingTask) {
      setText(editingTask.text);
    } else {
      setText("");
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (editingTask) {
      onUpdate(editingTask.id, text);
      onCancelEdit();
    } else {
      onSubmit(text);
    }
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Новая задача..."
        className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          {editingTask ? "Сохранить" : "Добавить"}
        </button>
        {editingTask && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
          >
            Отмена
          </button>
        )}
      </div>
    </form>
  );
};
