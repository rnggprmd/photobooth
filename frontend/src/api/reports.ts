import apiClient from './client';
import type { ApiResponse } from '../types';

export const reportsApi = {
  business: async (): Promise<ApiResponse<Record<string, unknown>>> => {
    const res = await apiClient.get<ApiResponse<Record<string, unknown>>>('/reports/business');
    return res.data;
  },

  events: async (): Promise<ApiResponse<Record<string, unknown>>> => {
    const res = await apiClient.get<ApiResponse<Record<string, unknown>>>('/reports/events');
    return res.data;
  },

  sessions: async (): Promise<ApiResponse<Record<string, unknown>>> => {
    const res = await apiClient.get<ApiResponse<Record<string, unknown>>>('/reports/sessions');
    return res.data;
  },

  transactions: async (): Promise<ApiResponse<Record<string, unknown>>> => {
    const res = await apiClient.get<ApiResponse<Record<string, unknown>>>('/reports/transactions');
    return res.data;
  },
};

export default reportsApi;
