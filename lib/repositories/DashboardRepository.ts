import axiosInstance from '@/lib/axios';
import { DashboardStatsResponse, DashboardStats } from '@/lib/types/dashboard';

export class DashboardRepository {
  async getStats(): Promise<DashboardStats> {
    const response = await axiosInstance.get<DashboardStatsResponse>('/stats/dashboard');
    return response.data.data;
  }
}

export const dashboardRepository = new DashboardRepository();
