import apiClient from './client';

export interface SuperAdminDashboardData {
  metrics: {
    total_tenants: number;
    active_tenants: number;
    inactive_tenants: number;
    active_subscriptions: number;
    saas_mrr: number;
    saas_arr: number;
    mrr_growth_rate: string;
    tenant_growth_rate: string;
    total_photo_sessions: number;
    total_events_conducted: number;
    total_platform_users: number;
    storage_used_gb: number;
    storage_limit_gb: number;
    active_kiosk_terminals: number;
    api_uptime: string;
  };
  expiring_subscriptions: Array<{
    id: number;
    tenant_name: string;
    plan_name: string;
    ends_at: string;
    days_left: number;
    contact_email: string;
  }>;
  plan_distribution: Array<{
    name: string;
    count: number;
    price: number;
  }>;
  recent_tenants: Array<{
    id: number;
    name: string;
    slug: string;
    status: string;
    plan_name: string;
    created_at: string;
    owner_email: string;
    kiosks_count: number;
  }>;
  system_health: {
    database_status: string;
    storage_service: string;
    image_worker: string;
    backup_status: string;
  };
}

export const superAdminApi = {
  getDashboard: () =>
    apiClient.get<{ success: boolean; message: string; data: SuperAdminDashboardData }>('/superadmin/dashboard'),
  getTenants: () => apiClient.get('/superadmin/tenants'),
  updateTenantStatus: (id: number | string, status: 'active' | 'suspended') =>
    apiClient.patch(`/superadmin/tenants/${id}/status`, { status }),
  getPlans: () => apiClient.get('/superadmin/subscription-plans'),
};

export default superAdminApi;
