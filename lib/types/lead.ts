export interface Lead {
  id: number;
  email: string;
  status: string;
  total_commission_earned: number;
  country: string | null;
  signed_up_at: string;
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

export interface LeadsResponse {
  data: Lead[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface LeadFilters {
  status?: string;
  from?: string;
  to?: string;
  sort_by?: 'created_at';
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}
