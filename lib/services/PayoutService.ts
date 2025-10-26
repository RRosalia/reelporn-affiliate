import PayoutRepository from '@/lib/repositories/PayoutRepository';
import {
  PayoutOption,
  CreatePayoutRequest,
} from '@/lib/types/payout';

export class PayoutService {
  constructor(private repository: typeof PayoutRepository) {}

  async getAllPayouts(): Promise<PayoutOption[]> {
    try {
      return await this.repository.getAll();
    } catch (error: any) {
      throw new Error('Unable to fetch payout options. Please try again later.');
    }
  }

  async createPayout(data: CreatePayoutRequest): Promise<PayoutOption> {
    try {
      return await this.repository.create(data);
    } catch (error: any) {
      if (error.response?.status === 422) {
        const message = error.response?.data?.message || 'Invalid payout data';
        throw new Error(message);
      }
      throw new Error('Unable to create payout option. Please try again later.');
    }
  }

  async setPrimaryPayout(id: number): Promise<PayoutOption> {
    try {
      return await this.repository.setPrimary(id);
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Payout option not found');
      }
      throw new Error('Unable to set primary payout. Please try again later.');
    }
  }

  async deletePayout(id: number): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Payout option not found');
      }
      if (error.response?.status === 422) {
        const message = error.response?.data?.message || 'Cannot delete the last payout method. You must have at least one payout method.';
        throw new Error(message);
      }
      throw new Error('Unable to delete payout option. Please try again later.');
    }
  }
}

export default new PayoutService(PayoutRepository);
