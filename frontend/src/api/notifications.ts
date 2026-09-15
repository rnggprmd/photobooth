import apiClient from './client';
import type { ApiResponse } from '../types';

export interface NotificationItem {
  id: number;
  type: string;
  channel: string;
  title: string;
  message: string;
  status: 'unread' | 'read';
  created_at: string;
  read_at?: string;
}

export interface NotificationListResponse {
  data: NotificationItem[];
  unread_count: number;
}

export const notificationsApi = {
  list: async (): Promise<ApiResponse<NotificationItem[]> & { unread_count?: number }> => {
    const res = await apiClient.get<ApiResponse<NotificationItem[]> & { unread_count?: number }>('/notifications');
    return res.data;
  },

  markAsRead: async (id: number): Promise<ApiResponse<NotificationItem>> => {
    const res = await apiClient.put<ApiResponse<NotificationItem>>(`/notifications/${id}`);
    return res.data;
  },

  markAllRead: async (): Promise<ApiResponse<null>> => {
    const res = await apiClient.post<ApiResponse<null>>('/notifications/mark-all-read');
    return res.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/notifications/${id}`);
    return res.data;
  },
};

export default notificationsApi;
