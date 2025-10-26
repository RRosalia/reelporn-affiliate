import axiosInstance from '@/lib/axios';
import {
  AffiliatePayoutsResponse,
  AffiliatePayoutDetailResponse,
  AffiliatePayoutFilters,
} from '@/lib/types/affiliatePayout';

export class AffiliatePayoutRepository {
  async getAll(filters?: AffiliatePayoutFilters): Promise<AffiliatePayoutsResponse> {
    const params = new URLSearchParams();

    if (filters?.status) params.append('status', filters.status);
    if (filters?.from) params.append('from', filters.from);
    if (filters?.to) params.append('to', filters.to);
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);
    if (filters?.sort_order) params.append('sort_order', filters.sort_order);
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());
    if (filters?.page) params.append('page', filters.page.toString());

    const queryString = params.toString();
    const url = queryString ? `/affiliate-payouts?${queryString}` : '/affiliate-payouts';

    const response = await axiosInstance.get<AffiliatePayoutsResponse>(url);
    return response.data;
  }

  async getById(payoutId: number): Promise<AffiliatePayoutDetailResponse> {
    const response = await axiosInstance.get<AffiliatePayoutDetailResponse>(
      `/affiliate-payouts/${payoutId}`
    );
    return response.data;
  }
}

export const affiliatePayoutRepository = new AffiliatePayoutRepository();
