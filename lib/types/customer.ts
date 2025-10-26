export type CustomerStatus = 'active' | 'suspended' | 'banned' | 'inactive';

export interface Customer {
  id: number;
  email: string;
  status: CustomerStatus;
  total_commission_earned: number;
  total_spent: number;
  purchase_count: number;
  country: string | null;
  first_purchase_at: string;
  last_purchase_at: string;
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

export interface CustomersResponse {
  data: Customer[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface CustomerFilters {
  status?: CustomerStatus;
  from?: string;
  to?: string;
  sort_by?: 'completed_at';
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}
