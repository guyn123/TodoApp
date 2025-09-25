import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${BASE_URL}/auth`;

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
    try {
        const response = await axios.post(`${API_URL}/login`, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data || 'Đăng nhập thất bại');
    }
};

export const register = async (data: RegisterRequest): Promise<string> => {
    try {
        const response = await axios.post(`${API_URL}/register`, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data || 'Đăng ký thất bại');
    }
};
