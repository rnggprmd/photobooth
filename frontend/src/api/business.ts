import apiClient from './client';
import type { ApiResponse } from '../types';

export const businessApi = {
  get: async (): Promise<ApiResponse<any>> => {
    const res = await apiClient.get<ApiResponse<any>>('/business');
    return res.data;
  },
  update: async (data: any): Promise<ApiResponse<any>> => {
    const res = await apiClient.put<ApiResponse<any>>('/business', data);
    return res.data;
  },
};

export default businessApi;
