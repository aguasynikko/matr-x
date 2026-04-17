import { ColumnType, Label } from './types';

export const COLUMNS: ColumnType[] = [
{ id: 'todo', title: 'To Do' },
{ id: 'in-progress', title: 'In Progress' },
{ id: 'in-review', title: 'In Review' },
{ id: 'done', title: 'Done' }];


export const AVAILABLE_LABELS: Label[] = [
{ id: 'bug', name: 'Bug', color: 'bg-red-100 text-red-700 border-red-200' },
{
  id: 'feature',
  name: 'Feature',
  color: 'bg-blue-100 text-blue-700 border-blue-200'
},
{
  id: 'design',
  name: 'Design',
  color: 'bg-purple-100 text-purple-700 border-purple-200'
},
{
  id: 'backend',
  name: 'Backend',
  color: 'bg-slate-200 text-slate-700 border-slate-300'
},
{
  id: 'frontend',
  name: 'Frontend',
  color: 'bg-teal-100 text-teal-700 border-teal-200'
}];


export const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'border-l-red-500',
  high: 'border-l-orange-500',
  medium: 'border-l-yellow-500',
  low: 'border-l-blue-500'
};