import PasswordRepository from '@/lib/repositories/PasswordRepository';
import { UpdatePasswordRequest } from '@/lib/types/password';

export class PasswordService {
  constructor(private repository: typeof PasswordRepository) {}

  async updatePassword(data: UpdatePasswordRequest): Promise<string> {
    try {
      const response = await this.repository.updatePassword(data);
      return response.message;
    } catch (error: any) {
      if (error.response?.status === 422) {
        // Validation errors
        const message = error.response?.data?.message || 'Validation failed.';
        throw new Error(message);
      }
      throw new Error('Unable to update password. Please try again later.');
    }
  }
}

export default new PasswordService(PasswordRepository);
