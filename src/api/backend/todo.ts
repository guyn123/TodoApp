import axios from 'axios';

const API_URL = 'http://localhost:8079/api/todos';

export interface TodoRequest {
  text: string;
  completed?: boolean;
  deadline?: string | null;
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
}

export interface TodoResponse {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  deadline: string | null;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
}

export const getTodos = async (token: string): Promise<TodoResponse[]> => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data || 'Không thể tải danh sách công việc');
  }
};

export const createTodo = async (data: TodoRequest, token: string): Promise<TodoResponse> => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data || 'Không thể thêm công việc');
  }
};

export const updateTodo = async (id: number, data: TodoRequest, token: string): Promise<TodoResponse> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data || 'Không thể cập nhật công việc');
  }
};

export const deleteTodo = async (id: number, token: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    throw new Error(error.response?.data || 'Không thể xóa công việc');
  }
};