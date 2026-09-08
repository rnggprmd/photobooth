import apiClient from './client';
import type { ApiResponse } from '../types';

export const dashboardApi = {
  get: async (): Promise<ApiResponse<any>> => {
    const res = await apiClient.get<ApiResponse<any>>('/dashboard');
    return res.data;
  },
};

export default dashboardApi;
