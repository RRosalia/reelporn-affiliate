import { ProfileRepository, profileRepository } from '@/lib/repositories/ProfileRepository';
import { UpdateProfileRequest, AffiliateProfile } from '@/lib/types/profile';

export class ProfileService {
  constructor(private repository: ProfileRepository) {}

  async getProfile(): Promise<AffiliateProfile> {
    try {
      return await this.repository.getProfile();
    } catch (error: any) {
      console.error('Failed to fetch profile:', error);
      throw new Error('Unable to load profile. Please try again later.');
    }
  }

  async updateProfile(data: UpdateProfileRequest): Promise<AffiliateProfile> {
    try {
      return await this.repository.updateProfile(data);
    } catch (error: any) {
      if (error.response?.status === 422) {
        const errors = error.response?.data?.errors;
        if (errors?.email) {
          throw new Error(errors.email[0]);
        }
        if (errors?.website) {
          throw new Error(errors.website[0]);
        }
        const message = error.response?.data?.message || 'Validation failed.';
        throw new Error(message);
      }
      throw new Error('Unable to update profile. Please try again later.');
    }
  }
}

export const profileService = new ProfileService(profileRepository);
