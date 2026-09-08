import { create } from 'zustand';
import type { RoleName, Tenant, User } from '../types';

interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User, tenant?: Tenant) => void;
  setUser: (user: User) => void;
  setTenant: (tenant: Tenant) => void;
  clearAuth: () => void;
  hasRole: (roles: RoleName | RoleName[]) => boolean;
}

const getStoredToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const getStoredUser = (): User | null => {
  const user = localStorage.getItem('auth_user');
  if (!user) return null;
  try {
    return JSON.parse(user) as User;
  } catch {
    return null;
  }
};

const getStoredTenant = (): Tenant | null => {
  const tenant = localStorage.getItem('auth_tenant');
  if (!tenant) return null;
  try {
    return JSON.parse(tenant) as Tenant;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getStoredUser(),
  tenant: getStoredTenant(),
  token: getStoredToken(),
  isAuthenticated: Boolean(getStoredToken()),

  setAuth: (token: string, user: User, tenant?: Tenant) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    if (tenant) {
      localStorage.setItem('auth_tenant', JSON.stringify(tenant));
    }
    set({
      token,
      user,
      tenant: tenant || null,
      isAuthenticated: true,
    });
  },

  setUser: (user: User) => {
    localStorage.setItem('auth_user', JSON.stringify(user));
    set({ user });
  },

  setTenant: (tenant: Tenant) => {
    localStorage.setItem('auth_tenant', JSON.stringify(tenant));
    set({ tenant });
  },

  clearAuth: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_tenant');
    set({
      token: null,
      user: null,
      tenant: null,
      isAuthenticated: false,
    });
  },

  hasRole: (roles: RoleName | RoleName[]) => {
    const user = get().user;
    if (!user || !user.roles) return false;
    const roleList = Array.isArray(roles) ? roles : [roles];
    return user.roles.some((r) => roleList.includes(r.name));
  },
}));

export default useAuthStore;
