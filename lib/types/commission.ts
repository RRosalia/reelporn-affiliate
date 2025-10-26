export type CommissionStatus = 'pending' | 'approved' | 'paid' | 'cancelled';

export interface Commission {
  id: number;
  amount: number; // in cents
  status: CommissionStatus;
  click_id: string;
  payment_id: number;
  payment_amount: number; // in cents
  payment_completed_at: string;
  payout_id: number | null;
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

export interface CommissionsResponse {
  data: Commission[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface CommissionFilters {
  status?: CommissionStatus;
  payout_id?: number | 'null';
  from?: string;
  to?: string;
  sort_by?: 'created_at' | 'amount';
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}
