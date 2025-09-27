// import axios from 'axios';

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
// const API_URL = `${BASE_URL}/todos`;

// export interface TodoRequest {
//   text: string;
//   completed?: boolean;
//   deadline?: string | null;
//   priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
// }

// export interface TodoResponse {
//   id: number;
//   text: string;
//   completed: boolean;
//   createdAt: string;
//   deadline: string | null;
//   priority: 'Low' | 'Medium' | 'High' | 'Urgent';
// }

// // ✅ Dùng kiểu dữ liệu phân trang mới từ backend
// export interface PagedResponse<T> {
//   content: T[];
//   page: number;
//   size: number;
//   totalElements: number;
//   totalPages: number;
//   last: boolean;
// }

// // ✅ Lấy danh sách Todo có phân trang, tìm kiếm, lọc
// export const getTodos = async (
//   token: string,
//   page: number,
//   size: number,
//   search?: string,
//   filter?: 'all' | 'active' | 'completed' | 'expired',
//   priority?: string
// ): Promise<PagedResponse<TodoResponse>> => {
//   try {
//     let completed: boolean | undefined = undefined;

//     if (filter === 'active') completed = false;
//     else if (filter === 'completed') completed = true;
//     // expired: không gửi completed, xử lý ở frontend

//     const response = await axios.get(API_URL, {
//       headers: { Authorization: `Bearer ${token}` },
//       params: { page, size, search, completed, priority },
//     });
//     return response.data;
//   } catch (error: any) {
//     throw new Error(
//       error.response?.data ||
//       'Không thể tải danh sách công việc, vui lòng đăng nhập lại'
//     );
//   }
// };

// export const createTodo = async (data: TodoRequest, token: string): Promise<TodoResponse> => {
//   try {
//     const response = await axios.post(API_URL, data, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error: any) {
//     throw new Error(error.response?.data || 'Không thể thêm công việc ');
//   }
// };

// export const updateTodo = async (id: number, data: TodoRequest, token: string): Promise<TodoResponse> => {
//   try {
//     const response = await axios.put(`${API_URL}/${id}`, data, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error: any) {
//     throw new Error(error.response?.data || 'Không thể cập nhật công việc');
//   }
// };

// export const deleteTodo = async (id: number, token: string): Promise<void> => {
//   try {
//     await axios.delete(`${API_URL}/${id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//   } catch (error: any) {
//     throw new Error(error.response?.data || 'Không thể xóa công việc');
//   }
// };

// export const deleteManyTodos = async (ids: number[], token: string): Promise<void> => {
//   try {
//     await axios.delete(API_URL, {
//       headers: { Authorization: `Bearer ${token}` },
//       data: ids,
//     });
//   } catch (error: any) {
//     throw new Error(error.response?.data || 'Không thể xóa nhiều công việc');
//   }
// };
