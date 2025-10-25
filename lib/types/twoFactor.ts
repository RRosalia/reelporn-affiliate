export interface TwoFactorSetupResponse {
  message: string;
  data: {
    svg: string;
    secret: string;
  };
}

export interface TwoFactorConfirmRequest {
  code: string;
}

export interface TwoFactorConfirmResponse {
  message: string;
}

export interface TwoFactorQRCodeResponse {
  qr_code: string;
}

export interface TwoFactorRecoveryCodesResponse {
  data: {
    recovery_codes: string[];
  };
}

export interface TwoFactorDisableRequest {
  code: string;
}

export interface TwoFactorDisableResponse {
  message: string;
}
