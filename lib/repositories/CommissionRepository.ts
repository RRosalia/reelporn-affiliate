import axiosInstance from '@/lib/axios';
import { CommissionsResponse, CommissionFilters } from '@/lib/types/commission';

export class CommissionRepository {
  async getAll(filters?: CommissionFilters): Promise<CommissionsResponse> {
    const params = new URLSearchParams();

    if (filters?.status) params.append('status', filters.status);
    if (filters?.payout_id !== undefined) {
      params.append('payout_id', filters.payout_id === 'null' ? 'null' : filters.payout_id.toString());
    }
    if (filters?.from) params.append('from', filters.from);
    if (filters?.to) params.append('to', filters.to);
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);
    if (filters?.sort_order) params.append('sort_order', filters.sort_order);
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());
    if (filters?.page) params.append('page', filters.page.toString());

    const queryString = params.toString();
    const url = queryString ? `/commissions?${queryString}` : '/commissions';

    const response = await axiosInstance.get<CommissionsResponse>(url);
    return response.data;
  }
}

export const commissionRepository = new CommissionRepository();
