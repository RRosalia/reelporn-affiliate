import axiosInstance from '@/lib/axios';
import { LeadsResponse, LeadFilters } from '@/lib/types/lead';

export class LeadRepository {
  async getAll(filters?: LeadFilters): Promise<LeadsResponse> {
    const params = new URLSearchParams();

    if (filters?.status) params.append('status', filters.status);
    if (filters?.from) params.append('from', filters.from);
    if (filters?.to) params.append('to', filters.to);
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);
    if (filters?.sort_order) params.append('sort_order', filters.sort_order);
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());
    if (filters?.page) params.append('page', filters.page.toString());

    const queryString = params.toString();
    const url = queryString ? `/leads?${queryString}` : '/leads';

    const response = await axiosInstance.get<LeadsResponse>(url);
    return response.data;
  }
}

export const leadRepository = new LeadRepository();
