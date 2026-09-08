import apiClient from './client';
import type { ApiResponse, AuthResponse, User } from '../types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  tenant_name: string;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<ApiResponse<AuthResponse>> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', payload);
    return res.data;
  },

  register: async (payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', payload);
    return res.data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const res = await apiClient.post<ApiResponse<null>>('/auth/logout');
    return res.data;
  },

  me: async (): Promise<ApiResponse<{ user: User }>> => {
    const res = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me');
    return res.data;
  },

  forgotPassword: async (email: string): Promise<ApiResponse<null>> => {
    const res = await apiClient.post<ApiResponse<null>>('/auth/forgot-password', { email });
    return res.data;
  },

  resetPassword: async (data: Record<string, string>): Promise<ApiResponse<null>> => {
    const res = await apiClient.post<ApiResponse<null>>('/auth/reset-password', data);
    return res.data;
  },
};

export default authApi;
