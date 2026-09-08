import apiClient from './client';
import type { ApiResponse, PhotoResult } from '../types';

export const galleryApi = {
  list: async (params?: Record<string, unknown>): Promise<ApiResponse<PhotoResult[]>> => {
    const res = await apiClient.get<ApiResponse<PhotoResult[]>>('/gallery', { params });
    return res.data;
  },

  get: async (id: number): Promise<ApiResponse<PhotoResult>> => {
    const res = await apiClient.get<ApiResponse<PhotoResult>>(`/gallery/${id}`);
    return res.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/gallery/${id}`);
    return res.data;
  },

  // Public result by unique token
  getPublicResult: async (resultToken: string): Promise<ApiResponse<PhotoResult>> => {
    const res = await apiClient.get<ApiResponse<PhotoResult>>(`/results/${resultToken}`);
    return res.data;
  },
};

export default galleryApi;
