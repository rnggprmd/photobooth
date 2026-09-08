import apiClient from './client';
import type { ApiResponse, Package } from '../types';

export const packagesApi = {
  list: async (params?: Record<string, unknown>): Promise<ApiResponse<Package[]>> => {
    const res = await apiClient.get<ApiResponse<Package[]>>('/packages', { params });
    return res.data;
  },

  get: async (id: number): Promise<ApiResponse<Package>> => {
    const res = await apiClient.get<ApiResponse<Package>>(`/packages/${id}`);
    return res.data;
  },

  create: async (data: Partial<Package>): Promise<ApiResponse<Package>> => {
    const res = await apiClient.post<ApiResponse<Package>>('/packages', data);
    return res.data;
  },

  update: async (id: number, data: Partial<Package>): Promise<ApiResponse<Package>> => {
    const res = await apiClient.put<ApiResponse<Package>>(`/packages/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/packages/${id}`);
    return res.data;
  },
};

export default packagesApi;
