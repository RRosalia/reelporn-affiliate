import { ClickRepository, clickRepository } from '@/lib/repositories/ClickRepository';
import { ClicksResponse, ClickFilters } from '@/lib/types/click';

export class ClickService {
  constructor(private repository: ClickRepository) {}

  async getAll(filters?: ClickFilters): Promise<ClicksResponse> {
    try {
      return await this.repository.getAll(filters);
    } catch (error: any) {
      console.error('Failed to fetch clicks:', error);
      throw new Error('Unable to load clicks. Please try again later.');
    }
  }
}

export const clickService = new ClickService(clickRepository);
