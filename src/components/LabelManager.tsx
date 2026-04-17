import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useLabels } from '../context/LabelsContext';

const LABEL_COLORS = [
  'bg-red-100 text-red-700 border-red-200',
  'bg-orange-100 text-orange-700 border-orange-200',
  'bg-yellow-100 text-yellow-700 border-yellow-200',
  'bg-green-100 text-green-700 border-green-200',
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-indigo-100 text-indigo-700 border-indigo-200',
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-pink-100 text-pink-700 border-pink-200',
  'bg-gray-100 text-gray-700 border-gray-200',
  'bg-teal-100 text-teal-700 border-teal-200',
];

interface LabelManagerProps {
  onClose: () => void;
}

export function LabelManager({ onClose }: LabelManagerProps) {
  const { labels, addLabel, deleteLabel } = useLabels();
  const [newLabelName, setNewLabelName] = useState('');
  const [selectedColor, setSelectedColor] = useState(LABEL_COLORS[3]); // default green
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddLabel = async () => {
    if (!newLabelName.trim()) {
      setError('Label name is required');
      return;
    }

    setError('');
    setIsAdding(true);

    try {
      await addLabel(newLabelName, selectedColor);
      setNewLabelName('');
      setSelectedColor(LABEL_COLORS[3]);
    } catch (err) {
      setError('Failed to add label');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteLabel = async (id: string) => {
    try {
      await deleteLabel(id);
    } catch (err) {
      console.error('Failed to delete label:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-dark-text">
            Manage Labels
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:hover:text-dark-text-secondary"
          >
            <X size={20} />
          </button>
        </div>

        {/* Current Labels */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Your Labels
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {labels.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-dark-text-tertiary">
                No labels yet. Create one below.
              </p>
            ) : (
              labels.map((label) => (
                <div
                  key={label.id}
                  className="flex items-center justify-between gap-2 p-2 bg-slate-50 dark:bg-dark-input rounded"
                >
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${label.color}`}
                  >
                    {label.name}
                  </span>
                  <button
                    onClick={() => handleDeleteLabel(label.id)}
                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add New Label */}
        <div className="border-t border-slate-200 dark:border-dark-border pt-4">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Create New Label
          </h3>

          <div className="space-y-3">
            <input
              type="text"
              value={newLabelName}
              onChange={(e) => setNewLabelName(e.target.value)}
              placeholder="Label name..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-input border border-slate-200 dark:border-dark-border rounded text-slate-900 dark:text-dark-text placeholder-slate-500 dark:placeholder-dark-text-subtle focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />

            {/* Color Picker */}
            <div>
              <p className="text-sm text-slate-600 dark:text-dark-text-tertiary mb-2">
                Choose Color
              </p>
              <div className="grid grid-cols-5 gap-2">
                {LABEL_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded border-2 transition ${
                      selectedColor === color
                        ? 'border-slate-900 dark:border-dark-text'
                        : 'border-transparent'
                    } ${color}`}
                    title="Color option"
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="p-2 bg-slate-50 dark:bg-dark-input rounded">
              <p className="text-xs text-slate-600 dark:text-dark-text-tertiary mb-2">
                Preview:
              </p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${selectedColor}`}
              >
                {newLabelName || 'Label Name'}
              </span>
            </div>

            {error && (
              <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
            )}

            <button
              onClick={handleAddLabel}
              disabled={isAdding || !newLabelName.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded font-medium transition"
            >
              <Plus size={16} />
              {isAdding ? 'Adding...' : 'Add Label'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
