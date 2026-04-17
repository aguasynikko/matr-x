import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Task, Priority, Label } from '../types';
import { generateId } from '../utils';
import { useLabels } from '../context/LabelsContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  taskToEdit?: Task | null;
}
export function TaskModal({
  isOpen,
  onClose,
  onSave,
  taskToEdit
}: TaskModalProps) {
  const { labels } = useLabels();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);
  const [assignee, setAssignee] = useState('');
  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description);
        setPriority(taskToEdit.priority);
        setSelectedLabels(taskToEdit.labels || []);
        setAssignee(taskToEdit.assignee || '');
      } else {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setSelectedLabels([]);
        setAssignee('');
      }
    }
  }, [isOpen, taskToEdit]);
  if (!isOpen) return null;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const task: Task = {
      id: taskToEdit ? taskToEdit.id : generateId(),
      title: title.trim(),
      description: description.trim(),
      priority,
      labels: selectedLabels,
      assignee: assignee.trim(),
      columnId: taskToEdit ? taskToEdit.columnId : 'todo',
      createdAt: taskToEdit ? taskToEdit.createdAt : Date.now()
    };
    onSave(task);
    onClose();
  };
  const toggleLabel = (label: Label) => {
    setSelectedLabels((prev) =>
    prev.find((l) => l.id === label.id) ?
    prev.filter((l) => l.id !== label.id) :
    [...prev, label]
    );
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-dark-border">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-dark-text">
            {taskToEdit ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 dark:text-dark-text-tertiary hover:text-slate-600 dark:hover:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-dark-hover rounded-md transition-colors">
            
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-dark-border dark:bg-dark-input dark:text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-shadow"
              placeholder="Task title..."
              autoFocus />
            
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 dark:border-dark-border dark:bg-dark-input dark:text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-shadow resize-none"
              placeholder="Add more details..." />
            
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-dark-border dark:bg-dark-input dark:text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-shadow">
                
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary mb-1">
                Assignee
              </label>
              <input
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-dark-border dark:bg-dark-input dark:text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-shadow"
                placeholder="e.g. Alex" />
              
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary mb-2">
              Labels
            </label>
            {labels.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-dark-text-tertiary">
                No labels yet. Create one in the Labels manager.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {labels.map((label) => {
                  const isSelected = selectedLabels.some((l) => l.id === label.id);
                  return (
                    <button
                      type="button"
                      key={label.id}
                      onClick={() => toggleLabel(label)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${isSelected ? label.color : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}>
                      
                      {label.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </form>

        <div className="px-6 py-4 border-t border-slate-100 dark:border-dark-border bg-slate-50 dark:bg-dark-surface flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-dark-text-secondary bg-white dark:bg-dark-input border border-slate-200 dark:border-dark-border rounded-lg hover:bg-slate-50 dark:hover:bg-dark-hover transition-colors">
            
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-dark-card rounded-lg hover:bg-slate-800 dark:hover:bg-dark-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
            
            {taskToEdit ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>);

}