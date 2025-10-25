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

  async setDefault(id: string): Promise<PayoutOption> {
    const response = await axiosInstance.patch<PayoutResponse>(`/payouts/${id}/set-default`);
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`/payouts/${id}`);
  }
}

export default new PayoutRepository();
