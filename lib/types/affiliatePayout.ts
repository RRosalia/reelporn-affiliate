export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface PayoutPaymentData {
  transaction_id?: string;
  method?: string;
  reference?: string;
  initiated_at?: string;
  batch_id?: string;
  error?: string;
}

export interface AffiliatePayout {
  id: number;
  amount: number; // in cents
  commission_count: number;
  status: PayoutStatus;
  scheduled_at: string;
  paid_at: string | null;
  payment_data: PayoutPaymentData | null;
  created_at: string;
}

export interface AffiliatePayoutWithCommissions extends AffiliatePayout {
  commissions: PayoutCommission[];
}

export interface PayoutCommission {
  id: number;
  amount: number; // in cents
  status: string;
  click_id: string;
  payment_id: number;
  payment_amount: number; // in cents
  payment_completed_at: string;
  created_at: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface AffiliatePayoutsResponse {
  data: AffiliatePayout[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface AffiliatePayoutDetailResponse {
  data: AffiliatePayoutWithCommissions;
}

export interface AffiliatePayoutFilters {
  status?: PayoutStatus;
  from?: string;
  to?: string;
  sort_by?: 'scheduled_at' | 'paid_at' | 'created_at' | 'amount';
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}
