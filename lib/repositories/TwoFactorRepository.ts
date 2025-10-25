import axiosInstance from '@/lib/axios';
import {
  TwoFactorSetupResponse,
  TwoFactorConfirmRequest,
  TwoFactorConfirmResponse,
  TwoFactorQRCodeResponse,
  TwoFactorRecoveryCodesResponse,
  TwoFactorDisableRequest,
  TwoFactorDisableResponse,
} from '@/lib/types/twoFactor';

export class TwoFactorRepository {
  async enable(): Promise<TwoFactorSetupResponse> {
    const response = await axiosInstance.post<TwoFactorSetupResponse>('/account/two-factor-authentication');
    return response.data;
  }

  async confirm(data: TwoFactorConfirmRequest): Promise<TwoFactorConfirmResponse> {
    const response = await axiosInstance.post<TwoFactorConfirmResponse>('/account/confirmed-two-factor-authentication', data);
    return response.data;
  }

  async getQRCode(): Promise<TwoFactorQRCodeResponse> {
    const response = await axiosInstance.get<TwoFactorQRCodeResponse>('/account/two-factor-qr-code');
    return response.data;
  }

  async getRecoveryCodes(code: string): Promise<TwoFactorRecoveryCodesResponse> {
    const response = await axiosInstance.post<TwoFactorRecoveryCodesResponse>('/account/two-factor-recovery-codes/view', { code });
    return response.data;
  }

  async regenerateRecoveryCodes(code: string): Promise<TwoFactorRecoveryCodesResponse> {
    const response = await axiosInstance.post<TwoFactorRecoveryCodesResponse>('/account/two-factor-recovery-codes/regenerate', { code });
    return response.data;
  }

  async disable(data: TwoFactorDisableRequest): Promise<TwoFactorDisableResponse> {
    const response = await axiosInstance.delete<TwoFactorDisableResponse>('/account/two-factor-authentication', {
      data,
    });
    return response.data;
  }
}

export default new TwoFactorRepository();
