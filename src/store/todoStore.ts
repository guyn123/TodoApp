// src/app/todo/context/todoStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface ITodo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoState {
  todos: ITodo[];
  filter: 'all' | 'active' | 'completed';
  addTodo: (text: string) => void;
  editTodo: (id: string, text: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  completeMany: (ids: string[]) => void;
  removeMany: (ids: string[]) => void;
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],
      filter: 'all',

      addTodo: (text) =>
        set((state) => ({
          todos: [...state.todos, { id: uuidv4(), text, completed: false }],
        })),

      editTodo: (id, text) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, text } : t
          ),
        })),

      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),

      removeTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((t) => t.id !== id),
        })),

      completeMany: (ids) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            ids.includes(t.id) ? { ...t, completed: true } : t
          ),
        })),

      removeMany: (ids) =>
        set((state) => ({
          todos: state.todos.filter((t) => !ids.includes(t.id)),
        })),

      setFilter: (filter) => set(() => ({ filter })),
    }),
    { name: 'todo-storage', storage: createJSONStorage(() => localStorage) }
  )
);
