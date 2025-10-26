export interface UpdateProfileRequest {
  company_name: string;
  email: string;
  lc_country_id: number;
  contact_person?: string;
  phone?: string;
  website?: string;
  telegram?: string;
  address?: string;
}

export interface AffiliateProfile {
  id: number;
  company_name: string;
  email: string;
  contact_person: string | null;
  phone: string | null;
  website: string | null;
  telegram: string | null;
  lc_country_id: number;
  address: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface UpdateProfileResponse {
  message: string;
  data: AffiliateProfile;
}
