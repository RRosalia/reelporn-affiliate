import { affiliatePayoutRepository } from '@/lib/repositories/AffiliatePayoutRepository';
import {
  AffiliatePayoutsResponse,
  AffiliatePayoutDetailResponse,
  AffiliatePayoutFilters,
} from '@/lib/types/affiliatePayout';

export class AffiliatePayoutService {
  async getAll(filters?: AffiliatePayoutFilters): Promise<AffiliatePayoutsResponse> {
    try {
      return await affiliatePayoutRepository.getAll(filters);
    } catch (error) {
      console.error('Failed to fetch affiliate payouts:', error);
      throw error;
    }
  }

  async getById(payoutId: number): Promise<AffiliatePayoutDetailResponse> {
    try {
      return await affiliatePayoutRepository.getById(payoutId);
    } catch (error) {
      console.error(`Failed to fetch payout ${payoutId}:`, error);
      throw error;
    }
  }
}

export const affiliatePayoutService = new AffiliatePayoutService();
