import  { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Task } from "@/types";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const addTask = (text: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      createdAt: Date.now(),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, newText: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, text: newText } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-800 mb-6 text-center">
          📋 Мои задачи
        </h1>
        <TaskForm
          onSubmit={addTask}
          editingTask={editingTask}
          onUpdate={updateTask}
          onCancelEdit={() => setEditingTask(null)}
        />
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">
            Пока нет задач. Создайте первую!
          </p>
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={setEditingTask}
            onDelete={deleteTask}
          />
        )}
      </div>
    </div>
  );
}

export default App;
