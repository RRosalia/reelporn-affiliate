export interface AffiliateLink {
  id: string;
  reference_id: string;
  url: string;
  clicks_count: number;
  created_at: string;
}

export interface CreateAffiliateLinkRequest {
  reference_id?: string;
}

export interface CreateAffiliateLinkResponse {
  data: AffiliateLink;
}

export interface PaginatedLinksResponse {
  data: AffiliateLink[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
    website_url?: string;
  };
}
