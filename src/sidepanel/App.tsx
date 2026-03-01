import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Task } from "@/types";
import { TaskForm } from "@/components/TaskForm";
import { SortableTaskList } from "@/components/SortableTaskList";

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Миграция старых задач (добавление поля order)
  useEffect(() => {
    const needsMigration = tasks.some((t) => t.order === undefined);
    if (needsMigration) {
      const migratedTasks = tasks.map((task, index) => ({
        ...task,
        order: index,
      }));
      setTasks(migratedTasks);
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor)
  );

  const addTask = (text: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      createdAt: Date.now(),
      order: 0,
    };
    // Сдвигаем существующие задачи вниз
    const updatedTasks = tasks.map((task) => ({
      ...task,
      order: task.order + 1,
    }));
    setTasks([newTask, ...updatedTasks]);
  };

  const updateTask = (id: string, newText: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, text: newText } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        // Обновляем order в соответствии с новой позицией
        return newItems.map((item, index) => ({
          ...item,
          order: index,
        }));
      });
    }
  };

  // Сортируем по order для отображения
  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

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

        {sortedTasks.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">
            Пока нет задач. Создайте первую!
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedTasks.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <SortableTaskList
                tasks={sortedTasks}
                onEdit={setEditingTask}
                onDelete={deleteTask}
              />
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}

export default App;
