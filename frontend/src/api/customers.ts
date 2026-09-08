import apiClient from './client';
import type { ApiResponse, Customer } from '../types';

export const customersApi = {
  list: async (params?: Record<string, unknown>): Promise<ApiResponse<Customer[]>> => {
    const res = await apiClient.get<ApiResponse<Customer[]>>('/customers', { params });
    return res.data;
  },

  get: async (id: number): Promise<ApiResponse<Customer>> => {
    const res = await apiClient.get<ApiResponse<Customer>>(`/customers/${id}`);
    return res.data;
  },

  create: async (data: Partial<Customer>): Promise<ApiResponse<Customer>> => {
    const res = await apiClient.post<ApiResponse<Customer>>('/customers', data);
    return res.data;
  },

  update: async (id: number, data: Partial<Customer>): Promise<ApiResponse<Customer>> => {
    const res = await apiClient.put<ApiResponse<Customer>>(`/customers/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/customers/${id}`);
    return res.data;
  },
};

export default customersApi;
