import apiClient from './client';
import type { ApiResponse, Event, EventStatus } from '../types';

export const eventsApi = {
  list: async (params?: Record<string, unknown>): Promise<ApiResponse<Event[]>> => {
    const res = await apiClient.get<ApiResponse<Event[]>>('/events', { params });
    return res.data;
  },

  get: async (id: number): Promise<ApiResponse<Event>> => {
    const res = await apiClient.get<ApiResponse<Event>>(`/events/${id}`);
    return res.data;
  },

  create: async (data: Partial<Event>): Promise<ApiResponse<Event>> => {
    const res = await apiClient.post<ApiResponse<Event>>('/events', data);
    return res.data;
  },

  update: async (id: number, data: Partial<Event>): Promise<ApiResponse<Event>> => {
    const res = await apiClient.put<ApiResponse<Event>>(`/events/${id}`, data);
    return res.data;
  },

  updateStatus: async (id: number, status: EventStatus): Promise<ApiResponse<Event>> => {
    const res = await apiClient.patch<ApiResponse<Event>>(`/events/${id}/status`, { status });
    return res.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/events/${id}`);
    return res.data;
  },

  assignOperators: async (eventId: number, userIds: number[]): Promise<ApiResponse<null>> => {
    const res = await apiClient.post<ApiResponse<null>>(`/events/${eventId}/operators`, { user_ids: userIds });
    return res.data;
  },

  removeOperator: async (eventId: number, userId: number): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/events/${eventId}/operators/${userId}`);
    return res.data;
  },

  assignTemplates: async (eventId: number, templateIds: number[]): Promise<ApiResponse<null>> => {
    const res = await apiClient.post<ApiResponse<null>>(`/events/${eventId}/templates`, { template_ids: templateIds });
    return res.data;
  },
};

export default eventsApi;
