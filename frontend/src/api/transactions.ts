import apiClient from './client';
import type { ApiResponse } from '../types';

export const transactionsApi = {
  list: async (params?: Record<string, unknown>): Promise<ApiResponse<any>> => {
    const res = await apiClient.get<ApiResponse<any>>('/transactions', { params });
    return res.data;
  },
  get: async (id: number): Promise<ApiResponse<any>> => {
    const res = await apiClient.get<ApiResponse<any>>(`/transactions/${id}`);
    return res.data;
  },
  create: async (data: any): Promise<ApiResponse<any>> => {
    const res = await apiClient.post<ApiResponse<any>>('/transactions', data);
    return res.data;
  },
};

export default transactionsApi;
