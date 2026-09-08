import apiClient from './client';
import type { ApiResponse, Event, PhotoResult, PhotoSession } from '../types';

export const sessionsApi = {
  list: async (params?: Record<string, unknown>): Promise<ApiResponse<PhotoSession[]>> => {
    const res = await apiClient.get<ApiResponse<PhotoSession[]>>('/sessions', { params });
    return res.data;
  },

  get: async (id: number): Promise<ApiResponse<PhotoSession>> => {
    const res = await apiClient.get<ApiResponse<PhotoSession>>(`/sessions/${id}`);
    return res.data;
  },

  // Onsite booth actions
  getOperatorEvents: async (): Promise<ApiResponse<Event[]>> => {
    const res = await apiClient.get<ApiResponse<Event[]>>('/booth/onsite/events');
    return res.data;
  },

  startOnsiteSession: async (payload: { event_id: number; customer_name?: string; customer_email?: string; customer_phone?: string }): Promise<ApiResponse<PhotoSession>> => {
    const res = await apiClient.post<ApiResponse<PhotoSession>>('/booth/onsite/start', payload);
    return res.data;
  },

  // Online booth actions
  getOnlineEventInfo: async (slug: string): Promise<ApiResponse<Event>> => {
    const res = await apiClient.get<ApiResponse<Event>>(`/booth/online/${slug}`);
    return res.data;
  },

  startOnlineSession: async (slug: string, payload: { customer_name?: string; customer_email?: string; customer_phone?: string }): Promise<ApiResponse<PhotoSession>> => {
    const res = await apiClient.post<ApiResponse<PhotoSession>>(`/booth/online/${slug}/start`, payload);
    return res.data;
  },

  // Session execution actions
  getSessionStatus: async (token: string): Promise<ApiResponse<PhotoSession>> => {
    const res = await apiClient.get<ApiResponse<PhotoSession>>(`/booth/session/${token}`);
    return res.data;
  },

  selectTemplate: async (token: string, templateVersionId: number): Promise<ApiResponse<PhotoSession>> => {
    const res = await apiClient.post<ApiResponse<PhotoSession>>(`/booth/session/${token}/template`, {
      template_version_id: templateVersionId,
    });
    return res.data;
  },

  capturePhoto: async (token: string, formData: FormData): Promise<ApiResponse<unknown>> => {
    const res = await apiClient.post<ApiResponse<unknown>>(`/booth/session/${token}/capture`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  retakePhoto: async (token: string, sequence: number): Promise<ApiResponse<unknown>> => {
    const res = await apiClient.post<ApiResponse<unknown>>(`/booth/session/${token}/retake`, { sequence });
    return res.data;
  },

  generateResult: async (token: string): Promise<ApiResponse<PhotoResult>> => {
    const res = await apiClient.post<ApiResponse<PhotoResult>>(`/booth/session/${token}/generate`);
    return res.data;
  },

  getSessionResult: async (token: string): Promise<ApiResponse<PhotoResult>> => {
    const res = await apiClient.get<ApiResponse<PhotoResult>>(`/booth/session/${token}/result`);
    return res.data;
  },

  reprint: async (id: number): Promise<ApiResponse<unknown>> => {
    const res = await apiClient.post<ApiResponse<unknown>>(`/sessions/${id}/reprint`);
    return res.data;
  },
};

export default sessionsApi;
