import axiosInstance from '@/lib/axios';
import { UpdateProfileRequest, UpdateProfileResponse, AffiliateProfile } from '@/lib/types/profile';

export class ProfileRepository {
  async getProfile(): Promise<AffiliateProfile> {
    const response = await axiosInstance.get<{ data: AffiliateProfile }>('/profile');
    return response.data.data;
  }

  async updateProfile(data: UpdateProfileRequest): Promise<AffiliateProfile> {
    const response = await axiosInstance.put<UpdateProfileResponse>('/profile', data);
    return response.data.data;
  }
}

export const profileRepository = new ProfileRepository();
