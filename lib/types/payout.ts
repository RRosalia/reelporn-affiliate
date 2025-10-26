export type PaymentMethod = 'paypal' | 'wise' | 'wire';

export interface WireTransferFields {
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

export interface PaypalFields {
  email: string;
}

export interface WiseFields {
  email: string;
}

export type PayoutFields = WireTransferFields | PaypalFields | WiseFields;

export interface PayoutOption {
  id: number;
  affiliate_user_id: number;
  type: PaymentMethod;
  fields: PayoutFields;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePayoutRequest {
  type: PaymentMethod;
  fields: PayoutFields;
  is_primary?: boolean;
}

export interface PayoutResponse {
  message: string;
  data: PayoutOption;
}

export interface PayoutListResponse {
  data: PayoutOption[];
}
