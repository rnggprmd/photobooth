import apiClient from './client';
import type { ApiResponse, Template, TemplatePhotoSlot, TemplateVersion } from '../types';

export const templatesApi = {
  list: async (params?: Record<string, unknown>): Promise<ApiResponse<Template[]>> => {
    const res = await apiClient.get<ApiResponse<Template[]>>('/templates', { params });
    return res.data;
  },

  get: async (id: number): Promise<ApiResponse<Template>> => {
    const res = await apiClient.get<ApiResponse<Template>>(`/templates/${id}`);
    return res.data;
  },

  create: async (data: Partial<Template>): Promise<ApiResponse<Template>> => {
    const res = await apiClient.post<ApiResponse<Template>>('/templates', data);
    return res.data;
  },

  update: async (id: number, data: Partial<Template>): Promise<ApiResponse<Template>> => {
    const res = await apiClient.put<ApiResponse<Template>>(`/templates/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/templates/${id}`);
    return res.data;
  },

  getVersions: async (templateId: number): Promise<ApiResponse<TemplateVersion[]>> => {
    const res = await apiClient.get<ApiResponse<TemplateVersion[]>>(`/templates/${templateId}/versions`);
    return res.data;
  },

  createVersion: async (templateId: number, data: Partial<TemplateVersion>): Promise<ApiResponse<TemplateVersion>> => {
    const res = await apiClient.post<ApiResponse<TemplateVersion>>(`/templates/${templateId}/versions`, data);
    return res.data;
  },

  getSlots: async (versionId: number): Promise<ApiResponse<TemplatePhotoSlot[]>> => {
    const res = await apiClient.get<ApiResponse<TemplatePhotoSlot[]>>(`/template-versions/${versionId}/slots`);
    return res.data;
  },

  saveSlots: async (versionId: number, slots: Partial<TemplatePhotoSlot>[]): Promise<ApiResponse<TemplatePhotoSlot[]>> => {
    const res = await apiClient.post<ApiResponse<TemplatePhotoSlot[]>>(`/template-versions/${versionId}/slots`, { slots });
    return res.data;
  },
};

export default templatesApi;
