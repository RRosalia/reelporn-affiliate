export type PaymentMethod = 'paypal' | 'wise' | 'wire';

export interface WireTransferDetails {
  first_name: string;
  last_name: string;
  business_name?: string;
  city: string;
  state?: string;
  address: string;
  zip_code: string;
  iban: string;
  swift_code: string;
}

export interface PaypalDetails {
  email: string;
}

export interface WiseDetails {
  email: string;
}

export interface PayoutOption {
  id: string;
  method: PaymentMethod;
  is_default: boolean;
  details: WireTransferDetails | PaypalDetails | WiseDetails;
  created_at: string;
  updated_at: string;
}

export interface CreatePayoutRequest {
  method: PaymentMethod;
  details: WireTransferDetails | PaypalDetails | WiseDetails;
}

export interface UpdatePayoutRequest {
  method?: PaymentMethod;
  details?: WireTransferDetails | PaypalDetails | WiseDetails;
}

export interface PayoutResponse {
  status: string;
  data: PayoutOption;
}

export interface PayoutListResponse {
  status: string;
  data: PayoutOption[];
}
