import React from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Task } from '../types';
import { COLUMNS } from '../constants';
import { Column } from './Column';
import { saveTask } from '../utils';

interface BoardProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  isDragDisabled?: boolean;
}
export function Board({
  tasks,
  setTasks,
  onEditTask,
  onDeleteTask,
  isDragDisabled
}: BoardProps) {
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index)
    {
      return;
    }
    const sourceColumnId = source.droppableId;
    const destColumnId = destination.droppableId;
    // We need to reorder the main tasks array.
    // Since tasks are filtered per column during render, we must find the exact task
    // and update its columnId, then re-insert it at the correct relative position.
    const newTasks = Array.from(tasks);
    const draggedTaskIndex = newTasks.findIndex((t) => t.id === draggableId);
    const draggedTask = newTasks[draggedTaskIndex];
    // Remove from original position
    newTasks.splice(draggedTaskIndex, 1);
    // Update column if moved
    const updatedTask = {
      ...draggedTask,
      columnId: destColumnId as any
    };

    console.log('Task moved from', sourceColumnId, 'to', destColumnId, updatedTask);
    
    // Find where to insert in the global array based on the destination index
    // Get all tasks in the destination column (excluding the dragged one)
    const destColumnTasks = newTasks.filter((t) => t.columnId === destColumnId);
    if (
    destColumnTasks.length === 0 ||
    destination.index >= destColumnTasks.length)
    {
      // Append to the end of the destination column tasks
      // We'll just push it to the end of the main array
      newTasks.push(updatedTask);
    } else {
      // Find the task that currently occupies the destination index
      const taskAtDestIndex = destColumnTasks[destination.index];
      const insertIndex = newTasks.findIndex((t) => t.id === taskAtDestIndex.id);
      newTasks.splice(insertIndex, 0, updatedTask);
    }
    setTasks(newTasks);
    
    // Save the task immediately to Supabase
    await saveTask(updatedTask);
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 h-full overflow-x-auto pb-8 pt-2 px-2">
        {COLUMNS.map((column) => {
          const columnTasks = tasks.filter(
            (task) => task.columnId === column.id
          );
          return (
            <Column
              key={column.id}
              column={column}
              tasks={columnTasks}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              isDragDisabled={isDragDisabled} />);


        })}
      </div>
    </DragDropContext>);

}