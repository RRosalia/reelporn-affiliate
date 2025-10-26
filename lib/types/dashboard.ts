export interface DashboardStats {
  total_clicks: number;
  total_leads: number;
  total_customers: number;
  total_earnings: number;
}

export interface DashboardStatsResponse {
  data: DashboardStats;
}
