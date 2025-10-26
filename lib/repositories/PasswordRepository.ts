import axiosInstance from '@/lib/axios';
import { UpdatePasswordRequest, UpdatePasswordResponse } from '@/lib/types/password';

export class PasswordRepository {
  async updatePassword(data: UpdatePasswordRequest): Promise<UpdatePasswordResponse> {
    const response = await axiosInstance.put<UpdatePasswordResponse>('/account/password', data);
    return response.data;
  }
}

export default new PasswordRepository();
