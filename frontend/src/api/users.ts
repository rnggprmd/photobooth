import apiClient from './client';
import type { ApiResponse, User } from '../types';

export const usersApi = {
  list: async (params?: Record<string, unknown>): Promise<ApiResponse<User[]>> => {
    const res = await apiClient.get<ApiResponse<User[]>>('/users', { params });
    return res.data;
  },
  create: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const res = await apiClient.post<ApiResponse<User>>('/users', data);
    return res.data;
  },
  update: async (id: number, data: Partial<User>): Promise<ApiResponse<User>> => {
    const res = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
    return res.data;
  },
  delete: async (id: number): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/users/${id}`);
    return res.data;
  },
};

export default usersApi;
