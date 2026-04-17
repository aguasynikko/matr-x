import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Edit2, Trash2, User, AlignLeft } from 'lucide-react';
import { Task } from '../types';
import { PRIORITY_COLORS } from '../constants';
interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  isDragDisabled?: boolean;
}
export function TaskCard({
  task,
  index,
  onEdit,
  onDelete,
  isDragDisabled
}: TaskCardProps) {
  return (
    <Draggable
      draggableId={task.id}
      index={index}
      isDragDisabled={isDragDisabled}>
      
      {(provided, snapshot) =>
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`group relative bg-white dark:bg-dark-card rounded-lg p-4 mb-3 border border-slate-200 dark:border-dark-border shadow-sm hover:shadow-md transition-all ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500/20 rotate-2' : ''} ${PRIORITY_COLORS[task.priority]} border-l-4`}
        style={provided.draggableProps.style}>
        
          {/* Actions (visible on hover) */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm rounded-md shadow-sm border border-slate-100 dark:border-dark-border p-1">
            <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="p-1 text-slate-400 dark:text-dark-text-tertiary hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors"
            title="Edit task">
            
              <Edit2 size={14} />
            </button>
            <button
            onClick={(e) => {
              e.stopPropagation();
              if (
              window.confirm('Are you sure you want to delete this task?'))
              {
                onDelete(task.id);
              }
            }}
            className="p-1 text-slate-400 dark:text-dark-text-tertiary hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
            title="Delete task">
            
              <Trash2 size={14} />
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-2">
            {task.labels.map((label) =>
          <span
            key={label.id}
            className={`px-2 py-0.5 rounded text-[10px] font-medium border ${label.color}`}>
            
                {label.name}
              </span>
          )}
          </div>

          <h4 className="text-sm font-semibold text-slate-800 dark:text-dark-text mb-1 leading-snug pr-12">
            {task.title}
          </h4>

          {task.description &&
        <div className="flex items-center text-slate-400 dark:text-dark-text-tertiary mb-3">
              <AlignLeft size={14} className="mr-1" />
              <span className="text-xs truncate">{task.description}</span>
            </div>
        }

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-dark-border">
            <div className="flex items-center text-xs font-medium text-slate-500 dark:text-dark-text-tertiary capitalize">
              <span
              className={`w-2 h-2 rounded-full mr-1.5 ${task.priority === 'urgent' ? 'bg-red-500' : task.priority === 'high' ? 'bg-orange-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
            
              {task.priority}
            </div>

            {task.assignee &&
          <div className="flex items-center text-xs text-slate-600 dark:text-dark-text-tertiary bg-slate-50 dark:bg-dark-input px-2 py-1 rounded-md border border-slate-100 dark:border-dark-border">
                <User size={12} className="mr-1 text-slate-400 dark:text-dark-text-tertiary" />
                <span className="truncate max-w-[80px]">{task.assignee}</span>
              </div>
          }
          </div>
        </div>
      }
    </Draggable>);

}