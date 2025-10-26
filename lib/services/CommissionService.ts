import { commissionRepository } from '@/lib/repositories/CommissionRepository';
import { CommissionsResponse, CommissionFilters } from '@/lib/types/commission';

export class CommissionService {
  async getAll(filters?: CommissionFilters): Promise<CommissionsResponse> {
    try {
      return await commissionRepository.getAll(filters);
    } catch (error) {
      console.error('Failed to fetch commissions:', error);
      throw error;
    }
  }
}

export const commissionService = new CommissionService();
