import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

export interface Label {
  id: string;
  name: string;
  color: string;
}

interface LabelsContextType {
  labels: Label[];
  loading: boolean;
  addLabel: (name: string, color: string) => Promise<void>;
  deleteLabel: (id: string) => Promise<void>;
  updateLabel: (id: string, name: string, color: string) => Promise<void>;
}

const LabelsContext = createContext<LabelsContextType | undefined>(undefined);

export const LabelsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);

  // Load labels when user changes
  useEffect(() => {
    if (!user) {
      setLabels([]);
      setLoading(false);
      return;
    }

    const loadLabels = async () => {
      try {
        const { data, error } = await supabase
          .from('labels')
          .select('id, name, color')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error loading labels:', error);
        } else {
          setLabels(data || []);
        }
      } catch (err) {
        console.error('Error loading labels:', err);
      } finally {
        setLoading(false);
      }
    };

    loadLabels();
  }, [user]);

  const addLabel = async (name: string, color: string) => {
    if (!user) return;

    try {
      const id = Math.random().toString(36).substring(2, 9);
      const { error } = await supabase
        .from('labels')
        .insert([
          {
            id,
            user_id: user.id,
            name,
            color,
          },
        ]);

      if (error) throw error;

      setLabels([...labels, { id, name, color }]);
    } catch (err) {
      console.error('Error adding label:', err);
      throw err;
    }
  };

  const deleteLabel = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('labels')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setLabels(labels.filter((l) => l.id !== id));
    } catch (err) {
      console.error('Error deleting label:', err);
      throw err;
    }
  };

  const updateLabel = async (id: string, name: string, color: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('labels')
        .update({ name, color })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setLabels(
        labels.map((l) => (l.id === id ? { id, name, color } : l))
      );
    } catch (err) {
      console.error('Error updating label:', err);
      throw err;
    }
  };

  return (
    <LabelsContext.Provider value={{ labels, loading, addLabel, deleteLabel, updateLabel }}>
      {children}
    </LabelsContext.Provider>
  );
};

export const useLabels = () => {
  const context = useContext(LabelsContext);
  if (context === undefined) {
    throw new Error('useLabels must be used within a LabelsProvider');
  }
  return context;
};
