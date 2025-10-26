import { LeadRepository, leadRepository } from '@/lib/repositories/LeadRepository';
import { LeadsResponse, LeadFilters } from '@/lib/types/lead';

export class LeadService {
  constructor(private repository: LeadRepository) {}

  async getAll(filters?: LeadFilters): Promise<LeadsResponse> {
    try {
      return await this.repository.getAll(filters);
    } catch (error: any) {
      console.error('Failed to fetch leads:', error);
      throw new Error('Unable to load leads. Please try again later.');
    }
  }
}

export const leadService = new LeadService(leadRepository);
