export interface ClickExternalData {
  sub1?: string;
  sub2?: string;
  sub3?: string;
}

export interface Click {
  click_id: string;
  ip_address: string;
  user_agent: string;
  external_data: ClickExternalData | null;
  country: string | null;
  user_id: number | null;
  expiration_date: string;
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

export interface ClicksResponse {
  data: Click[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface ClickFilters {
  from?: string;
  to?: string;
  sort_by?: 'created_at';
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}
