import { useCallback } from 'react';
import useAuthStore from '../store/authStore';
import authApi, { type LoginPayload, type RegisterPayload } from '../api/auth';
import type { RoleName } from '../types';

export const useAuth = () => {
  const { user, tenant, token, isAuthenticated, setAuth, clearAuth, hasRole } = useAuthStore();

  const login = useCallback(
    async (payload: LoginPayload) => {
      const response = await authApi.login(payload);
      const { token, user, tenant } = response.data;
      setAuth(token, user, tenant);
      return response.data;
    },
    [setAuth]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const response = await authApi.register(payload);
      const { token, user, tenant } = response.data;
      setAuth(token, user, tenant);
      return response.data;
    },
    [setAuth]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore error on logout
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const checkRole = useCallback(
    (role: RoleName | RoleName[]) => hasRole(role),
    [hasRole]
  );

  return {
    user,
    tenant,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    checkRole,
  };
};

export default useAuth;
