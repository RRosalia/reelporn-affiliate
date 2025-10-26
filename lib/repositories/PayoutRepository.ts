import axiosInstance from '@/lib/axios';
import {
  PayoutOption,
  CreatePayoutRequest,
  PayoutResponse,
  PayoutListResponse,
} from '@/lib/types/payout';

export class PayoutRepository {
  async getAll(): Promise<PayoutOption[]> {
    const response = await axiosInstance.get<PayoutListResponse>('/payouts');
    return response.data.data;
  }

  async create(data: CreatePayoutRequest): Promise<PayoutOption> {
    const response = await axiosInstance.post<PayoutResponse>('/payouts', data);
    return response.data.data;
  }

  async setPrimary(id: number): Promise<PayoutOption> {
    const response = await axiosInstance.patch<PayoutResponse>(`/payouts/${id}/set-primary`);
    return response.data.data;
  }

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/payouts/${id}`);
  }
}

export default new PayoutRepository();
