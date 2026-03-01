import React from "react";
import { Task } from "@/types";
import { SortableTaskItem } from "./SortableTaskItem";

interface Props {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const SortableTaskList: React.FC<Props> = ({
  tasks,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <SortableTaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
