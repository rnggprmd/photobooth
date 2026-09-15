import apiClient from './client';
import type { ApiResponse, AuthResponse, Tenant, User } from '../types';

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

const DEMO_TENANT: Tenant = {
  id: 1,
  name: 'Lumina Studio & Co.',
  slug: 'lumina-studio',
  status: 'active',
  max_operators: 10,
  max_events_per_month: 50,
  max_storage_mb: 20000,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const authApi = {
  login: async (payload: LoginPayload): Promise<ApiResponse<AuthResponse>> => {
    try {
      const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', payload);
      return res.data;
    } catch (err: any) {
      // Graceful fallback for demo accounts when Laravel backend is offline or network error occurs
      const isNetworkError =
        !err.response ||
        err.message === 'Network Error' ||
        err.code === 'ERR_NETWORK' ||
        err.code === 'ECONNABORTED' ||
        err.code === 'ERR_CONNECTION_REFUSED';

      if (isNetworkError && payload.password === 'password') {
        const cleanEmail = payload.email.trim().toLowerCase();
        if (cleanEmail === 'superadmin@photobooth.test') {
          return {
            success: true,
            message: 'Login successful (Demo Mode)',
            data: {
              token: 'demo-superadmin-token-' + Date.now(),
              user: {
                id: 1,
                name: 'Super Admin',
                email: 'superadmin@photobooth.test',
                status: 'active',
                roles: [{ id: 1, name: 'super_admin', guard_name: 'web' }],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            },
          };
        }
        if (cleanEmail === 'tenant@photobooth.test') {
          return {
            success: true,
            message: 'Login successful (Demo Mode)',
            data: {
              token: 'demo-tenant-token-' + Date.now(),
              user: {
                id: 2,
                name: 'Tenant Admin',
                email: 'tenant@photobooth.test',
                status: 'active',
                roles: [{ id: 2, name: 'tenant_admin', guard_name: 'web' }],
                tenant_id: 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              tenant: DEMO_TENANT,
            },
          };
        }
        if (cleanEmail === 'operator@photobooth.test') {
          return {
            success: true,
            message: 'Login successful (Demo Mode)',
            data: {
              token: 'demo-operator-token-' + Date.now(),
              user: {
                id: 3,
                name: 'Operator Kru',
                email: 'operator@photobooth.test',
                status: 'active',
                roles: [{ id: 3, name: 'operator', guard_name: 'web' }],
                tenant_id: 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              tenant: DEMO_TENANT,
            },
          };
        }
      }

      // If backend responded with validation/auth error, throw friendly message
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw err;
    }
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
