import { DashboardRepository, dashboardRepository } from '@/lib/repositories/DashboardRepository';
import { DashboardStats } from '@/lib/types/dashboard';

export class DashboardService {
  constructor(private repository: DashboardRepository) {}

  async getStats(): Promise<DashboardStats> {
    try {
      return await this.repository.getStats();
    } catch (error: any) {
      console.error('Failed to fetch dashboard stats:', error);
      throw new Error('Unable to load dashboard statistics. Please try again later.');
    }
  }
}

export const dashboardService = new DashboardService(dashboardRepository);
