import axiosInstance from '@/lib/axios';
import { ClicksResponse, ClickFilters } from '@/lib/types/click';

export class ClickRepository {
  async getAll(filters?: ClickFilters): Promise<ClicksResponse> {
    const params = new URLSearchParams();

    if (filters?.from) params.append('from', filters.from);
    if (filters?.to) params.append('to', filters.to);
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);
    if (filters?.sort_order) params.append('sort_order', filters.sort_order);
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());
    if (filters?.page) params.append('page', filters.page.toString());

    const queryString = params.toString();
    const url = queryString ? `/clicks?${queryString}` : '/clicks';

    const response = await axiosInstance.get<ClicksResponse>(url);
    return response.data;
  }
}

export const clickRepository = new ClickRepository();
