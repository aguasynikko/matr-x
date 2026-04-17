import { Task } from './types';
import { supabase } from './supabaseClient';

export const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

export const loadTasks = async (): Promise<Task[]> => {
  if (!supabase) {
    console.warn('Supabase not initialized');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load tasks from Supabase:', error);
      return [];
    }

    return (data || []).map((task: any) => ({
      id: task.id,
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      labels: task.labels || [],
      assignee: task.assignee || '',
      columnId: task.column_id,
      createdAt: new Date(task.created_at).getTime(),
    }));
  } catch (e) {
    console.error('Failed to load tasks from Supabase', e);
    return [];
  }
};

export const saveTask = async (task: Task): Promise<void> => {
  if (!supabase) {
    console.warn('Supabase not initialized');
    return;
  }

  try {
    console.log('Saving task:', task.id, 'to column:', task.columnId);
    
    const { error: upsertError, data } = await supabase
      .from('tasks')
      .upsert([
        {
          id: task.id,
          title: task.title,
          description: task.description,
          priority: task.priority,
          labels: task.labels,
          assignee: task.assignee,
          column_id: task.columnId,
          created_at: new Date(task.createdAt).toISOString(),
          updated_at: new Date().toISOString(),
        },
      ], { onConflict: 'id' });

    if (upsertError) {
      console.error('Failed to save task:', upsertError);
    } else {
      console.log('Task saved successfully:', data);
    }
  } catch (e) {
    console.error('Failed to save task to Supabase', e);
  }
};

export const deleteTask = async (taskId: string): Promise<void> => {
  if (!supabase) {
    console.warn('Supabase not initialized');
    return;
  }

  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Failed to delete task:', error);
    }
  } catch (e) {
    console.error('Failed to delete task from Supabase', e);
  }
};

export const saveTasks = async (tasks: Task[]): Promise<void> => {
  if (!supabase) {
    console.warn('Supabase not initialized');
    return;
  }

  try {
    const tasksToSave = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      labels: task.labels,
      assignee: task.assignee,
      column_id: task.columnId,
      created_at: new Date(task.createdAt).toISOString(),
      updated_at: new Date().toISOString(),
    }));

    console.log('Saving tasks:', tasksToSave);

    const { error, data } = await supabase
      .from('tasks')
      .insert(tasksToSave, { defaultToNull: false })
      .select();

    if (error) {
      console.error('Failed to save tasks - Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Full error:', JSON.stringify(error, null, 2));
    } else {
      console.log('Tasks saved successfully:', data);
    }
  } catch (e) {
    console.error('Failed to save tasks to Supabase', e);
  }
};