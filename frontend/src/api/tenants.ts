import apiClient from './client';
import type { ApiResponse, Tenant, TenantStatus } from '../types';

export const tenantsApi = {
  list: async (params?: Record<string, unknown>): Promise<ApiResponse<Tenant[]>> => {
    const res = await apiClient.get<ApiResponse<Tenant[]>>('/superadmin/tenants', { params });
    return res.data;
  },

  get: async (id: number): Promise<ApiResponse<Tenant>> => {
    const res = await apiClient.get<ApiResponse<Tenant>>(`/superadmin/tenants/${id}`);
    return res.data;
  },

  create: async (data: Partial<Tenant>): Promise<ApiResponse<Tenant>> => {
    const res = await apiClient.post<ApiResponse<Tenant>>('/superadmin/tenants', data);
    return res.data;
  },

  update: async (id: number, data: Partial<Tenant>): Promise<ApiResponse<Tenant>> => {
    const res = await apiClient.put<ApiResponse<Tenant>>(`/superadmin/tenants/${id}`, data);
    return res.data;
  },

  updateStatus: async (id: number, status: TenantStatus): Promise<ApiResponse<Tenant>> => {
    const res = await apiClient.patch<ApiResponse<Tenant>>(`/superadmin/tenants/${id}/status`, { status });
    return res.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/superadmin/tenants/${id}`);
    return res.data;
  },
};

export default tenantsApi;
