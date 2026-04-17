import React, { useEffect, useMemo, useState } from 'react';
import { Search, Plus, LayoutGrid, Tags } from 'lucide-react';
import { Task } from './types';
import { loadTasks, saveTasks, saveTask, deleteTask } from './utils';
import { Board } from './components/Board';
import { TaskModal } from './components/TaskModal';
import { ThemeToggle } from './components/ThemeToggle';
import { AuthPage } from './components/AuthPage';
import { UserDropdown } from './components/UserDropdown';
import { LabelManager } from './components/LabelManager';
import { useAuth } from './context/AuthContext';

export function App() {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLabelManagerOpen, setIsLabelManagerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  console.log('App render - user:', user ? 'logged in' : 'logged out', 'authLoading:', authLoading);

  // Load tasks on mount (must be called unconditionally)
  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      try {
        const loadedTasks = await loadTasks();
        if (loadedTasks && loadedTasks.length > 0) {
          setTasks(loadedTasks);
        } else {
          // Optional: Add some dummy data for first-time users
          const dummyTasks = [
            {
              id: '1',
              title: 'Research competitor features',
              description: 'Look into Linear and Notion board implementations.',
              priority: 'high' as const,
              labels: [
                {
                  id: 'design',
                  name: 'Design',
                  color: 'bg-purple-100 text-purple-700 border-purple-200'
                }
              ],
              assignee: 'Alex',
              columnId: 'todo' as const,
              createdAt: Date.now()
            },
            {
              id: '2',
              title: 'Implement drag and drop',
              description: 'Use @hello-pangea/dnd for smooth interactions.',
              priority: 'urgent' as const,
              labels: [
                {
                  id: 'frontend',
                  name: 'Frontend',
                  color: 'bg-teal-100 text-teal-700 border-teal-200'
                }
              ],
              assignee: 'Sam',
              columnId: 'in-progress' as const,
              createdAt: Date.now() - 10000
            }
          ];
          setTasks(dummyTasks);
          await saveTasks(dummyTasks);
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
        // Show dummy tasks as fallback
        setTasks([
          {
            id: '1',
            title: 'Research competitor features',
            description: 'Look into Linear and Notion board implementations.',
            priority: 'high' as const,
            labels: [
              {
                id: 'design',
                name: 'Design',
                color: 'bg-purple-100 text-purple-700 border-purple-200'
              }
            ],
            assignee: 'Alex',
            columnId: 'todo' as const,
            createdAt: Date.now()
          }
        ]);
      }
      setIsLoaded(true);
    };
    fetchTasks();
  }, [user]);
  // Save tasks on change
  useEffect(() => {
    if (isLoaded && tasks.length > 0) {
      saveTasks(tasks);
    }
  }, [tasks, isLoaded]);
  const handleSaveTask = (savedTask: Task) => {
    setTasks((prev) => {
      const exists = prev.find((t) => t.id === savedTask.id);
      if (exists) {
        return prev.map((t) => t.id === savedTask.id ? savedTask : t);
      }
      return [...prev, savedTask];
    });
    saveTask(savedTask);
  };
  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    deleteTask(taskId);
  };
  const openCreateModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };
  const openEditModal = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const query = searchQuery.toLowerCase();
    return tasks.filter(
      (task) =>
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      task.assignee.toLowerCase().includes(query)
    );
  }, [tasks, searchQuery]);

  // Show auth page if not logged in
  if (!authLoading && !user) {
    return <AuthPage />;
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-dark-text font-sans transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-dark-surface border-b border-slate-200 dark:border-dark-border px-6 py-4 sticky top-0 z-10 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 dark:bg-dark-card p-2 rounded-lg text-white transition-colors duration-200">
              <LayoutGrid size={20} />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">
              Matr!x
            </h1>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16} />
              
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-dark-input dark:text-dark-text border-transparent focus:bg-white dark:focus:bg-dark-hover border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 rounded-lg text-sm transition-all outline-none" />
              
            </div>
            <ThemeToggle />
            <button
              onClick={() => setIsLabelManagerOpen(true)}
              className="flex items-center gap-2 bg-slate-700 dark:bg-dark-card hover:bg-slate-600 dark:hover:bg-dark-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
              title="Manage Labels"
            >
              <Tags size={16} />
              Labels
            </button>
            <UserDropdown />
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap">
              
              <Plus size={16} />
              New Task
            </button>
          </div>
        </div>
      </header>

      {/* Main Board Area */}
      <main className="flex-1 overflow-hidden flex flex-col max-w-[1600px] mx-auto w-full p-6">
        {searchQuery &&
        <div className="mb-4 text-sm text-slate-500 dark:text-dark-text-tertiary flex items-center gap-2">
            <span>Showing results for "{searchQuery}"</span>
            <button
            onClick={() => setSearchQuery('')}
            className="text-blue-600 dark:text-blue-400 hover:underline">
            
              Clear search
            </button>
          </div>
        }

        <div className="flex-1 min-h-0">
          <Board
            tasks={filteredTasks}
            setTasks={setTasks}
            onEditTask={openEditModal}
            onDeleteTask={handleDeleteTask}
            isDragDisabled={!!searchQuery} // Disable drag when searching to prevent index issues
          />
        </div>
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit} />

      {isLabelManagerOpen && (
        <LabelManager onClose={() => setIsLabelManagerOpen(false)} />
      )}
      
    </div>);

}