import axiosClient from '@/api/axiosClient';

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

export interface PagedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export const getTodos = async (
    page: number,
    size: number,
    search?: string,
    filter?: 'all' | 'active' | 'completed' | 'expired',
    priority?: string
): Promise<PagedResponse<TodoResponse>> => {
    try {
        let completed: boolean | undefined = undefined;

        if (filter === 'active') completed = false;
        else if (filter === 'completed') completed = true;
        // expired: không gửi completed, xử lý ở frontend

        const response = await axiosClient.get('/todos', {
            params: { page, size, search, completed, priority },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data ||
            'Không thể tải danh sách công việc, vui lòng đăng nhập lại'
        );
    }
};

export const createTodo = async (data: TodoRequest): Promise<TodoResponse> => {
    try {
        const response = await axiosClient.post('/todos', data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data || 'Không thể thêm công việc ');
    }
};

export const updateTodo = async (id: number, data: TodoRequest): Promise<TodoResponse> => {
    try {
        const response = await axiosClient.put(`/todos/${id}`, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data || 'Không thể cập nhật công việc');
    }
};

export const deleteTodo = async (id: number): Promise<void> => {
    try {
        await axiosClient.delete(`/todos/${id}`);
    } catch (error: any) {
        throw new Error(error.response?.data || 'Không thể xóa công việc');
    }
};

export const deleteManyTodos = async (ids: number[]): Promise<void> => {
    try {
        await axiosClient.delete('/todos', {
            data: ids,
        });
    } catch (error: any) {
        throw new Error(error.response?.data || 'Không thể xóa nhiều công việc');
    }
};