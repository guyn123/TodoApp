import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface ITodo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;       // ngày tạo (ISO string)
  deadline: string | null; // ngày hết hạn (ISO string)
  priority: "Low" | "Medium" | "High" | "Urgent";
}

interface TodoState {
  todos: ITodo[];
  filter: 'all' | 'active' | 'completed' | 'expired';
  addTodo: (text: string, deadline: string | null, priority: ITodo["priority"]) => void;
  editTodo: (id: string, text: string, deadline?: string | null, priority?: ITodo["priority"]) => void;
  removeTodo: (id: string) => void;
  completeMany: (ids: string[]) => void;
  removeMany: (ids: string[]) => void;
  setFilter: (filter: 'all' | 'active' | 'completed' | 'expired') => void;
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],
      filter: 'all',

      addTodo: (text, deadline, priority) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              id: uuidv4(),
              text,
              completed: false,
              createdAt: new Date().toISOString(),
              deadline,
              priority,
            },
          ],
        })),

      editTodo: (id, text, deadline, priority) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id
              ? { ...t, text, deadline: deadline ?? t.deadline, priority: priority ?? t.priority }
              : t
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
