import TwoFactorRepository from '@/lib/repositories/TwoFactorRepository';
import {
  TwoFactorSetupResponse,
  TwoFactorConfirmRequest,
  TwoFactorRecoveryCodesResponse,
  TwoFactorDisableRequest,
} from '@/lib/types/twoFactor';

export class TwoFactorService {
  constructor(private repository: typeof TwoFactorRepository) {}

  async enableTwoFactor(): Promise<TwoFactorSetupResponse> {
    try {
      return await this.repository.enable();
    } catch (error: any) {
      throw new Error('Unable to enable two-factor authentication. Please try again later.');
    }
  }

  async confirmTwoFactor(code: string): Promise<void> {
    try {
      await this.repository.confirm({ code });
    } catch (error: any) {
      if (error.response?.status === 422) {
        const message = error.response?.data?.message || 'The provided two factor authentication code was invalid.';
        throw new Error(message);
      }
      throw new Error('Unable to confirm two-factor authentication. Please try again later.');
    }
  }

  async getQRCode(): Promise<string> {
    try {
      const response = await this.repository.getQRCode();
      return response.qr_code;
    } catch (error: any) {
      throw new Error('Unable to retrieve QR code. Please try again later.');
    }
  }

  async getRecoveryCodes(code: string): Promise<string[]> {
    try {
      const response = await this.repository.getRecoveryCodes(code);
      return response.data.recovery_codes;
    } catch (error: any) {
      console.error('Error fetching recovery codes:', error);
      if (error.response?.status === 422) {
        const message = error.response?.data?.message || 'Invalid verification code.';
        throw new Error(message);
      }
      throw new Error('Unable to retrieve recovery codes. Please try again later.');
    }
  }

  async regenerateRecoveryCodes(code: string): Promise<string[]> {
    try {
      const response = await this.repository.regenerateRecoveryCodes(code);
      return response.data.recovery_codes;
    } catch (error: any) {
      console.error('Error regenerating recovery codes:', error);
      if (error.response?.status === 422) {
        const message = error.response?.data?.message || 'Invalid verification code.';
        throw new Error(message);
      }
      throw new Error('Unable to regenerate recovery codes. Please try again later.');
    }
  }

  async disableTwoFactor(code: string): Promise<void> {
    try {
      await this.repository.disable({ code });
    } catch (error: any) {
      if (error.response?.status === 422) {
        const message = error.response?.data?.message || 'The provided two factor authentication code was invalid.';
        throw new Error(message);
      }
      throw new Error('Unable to disable two-factor authentication. Please try again later.');
    }
  }
}

export default new TwoFactorService(TwoFactorRepository);
