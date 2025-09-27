import { create } from 'zustand';

export interface ITodo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  deadline: string | null;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
}

interface TodoState {
  todos: ITodo[];
  filter: 'all' | 'active' | 'completed' | 'expired';
  addTodo: (todo: ITodo) => void;
  editTodo: (id: number, text: string, deadline?: string | null, priority?: ITodo['priority']) => void;
  removeTodo: (id: number) => void;
  completeMany: (ids: number[]) => void;
  setFilter: (filter: 'all' | 'active' | 'completed' | 'expired') => void;
  setTodos: (todos: ITodo[]) => void;
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  filter: 'all',
  addTodo: (todo) =>
    set((state) => ({
      todos: [...state.todos, todo],
    })),
  editTodo: (id, text, deadline, priority) =>
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === id ? { ...t, text, deadline: deadline ?? t.deadline, priority: priority ?? t.priority } : t
      ),
    })),
  removeTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
    })),
  completeMany: (ids) =>
    set((state) => ({
      todos: state.todos.map((t) => (ids.includes(t.id) ? { ...t, completed: true } : t)),
    })),
  setFilter: (filter) => set(() => ({ filter })),
  setTodos: (todos) => set(() => ({ todos })),
}));
