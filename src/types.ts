export type Priority = 'urgent' | 'high' | 'medium' | 'low';
export type ColumnId = 'todo' | 'in-progress' | 'in-review' | 'done';

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  labels: Label[];
  assignee: string;
  columnId: ColumnId;
  createdAt: number;
}

export interface ColumnType {
  id: ColumnId;
  title: string;
}