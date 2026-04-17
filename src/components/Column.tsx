import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { ColumnType, Task } from '../types';
import { TaskCard } from './TaskCard';
interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  isDragDisabled?: boolean;
}
export function Column({
  column,
  tasks,
  onEditTask,
  onDeleteTask,
  isDragDisabled
}: ColumnProps) {
  return (
    <div className="flex flex-col w-80 shrink-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-medium text-sm text-slate-700 dark:text-dark-text-secondary flex items-center gap-2">
          {column.title}
          <span className="bg-slate-200 dark:bg-dark-card text-slate-600 dark:text-dark-text-secondary text-xs py-0.5 px-2 rounded-full font-medium">
            {tasks.length}
          </span>
        </h3>
      </div>

      <Droppable droppableId={column.id} isDropDisabled={isDragDisabled}>
        {(provided, snapshot) =>
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`flex-1 min-h-[150px] rounded-xl p-2 transition-colors ${snapshot.isDraggingOver ? 'bg-slate-200/50 dark:bg-dark-card/50 ring-1 ring-slate-300 dark:ring-dark-border' : 'bg-slate-100/50 dark:bg-dark-surface/30'}`}>
          
            {tasks.map((task, index) =>
          <TaskCard
            key={task.id}
            task={task}
            index={index}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            isDragDisabled={isDragDisabled} />

          )}
            {provided.placeholder}

            {tasks.length === 0 && !snapshot.isDraggingOver &&
          <div className="h-full flex items-center justify-center text-sm text-slate-400 dark:text-dark-text-subtle border-2 border-dashed border-slate-200 dark:border-dark-border rounded-lg m-2 py-8">
                No tasks yet
              </div>
          }
          </div>
        }
      </Droppable>
    </div>);

}