import { postbackRepository, PostbackRepository } from '@/lib/repositories/PostbackRepository';
import {
  Postback,
  CreatePostbackRequest,
  UpdatePostbackRequest,
} from '@/lib/types/postback';

export class PostbackService {
  constructor(private repository: PostbackRepository) {}

  /**
   * Get all postbacks
   */
  async getAllPostbacks(): Promise<Postback[]> {
    try {
      return await this.repository.getAll();
    } catch (error) {
      console.error('Failed to fetch postbacks:', error);
      throw new Error('Unable to load postbacks. Please try again later.');
    }
  }

  /**
   * Create a new postback
   */
  async createPostback(data: CreatePostbackRequest): Promise<Postback> {
    try {
      return await this.repository.create(data);
    } catch (error: any) {
      console.error('Failed to create postback:', error);

      // Handle validation errors
      if (error.response?.status === 422) {
        const errorMessage = error.response?.data?.message || 'Validation failed';
        throw new Error(errorMessage);
      }

      throw new Error('Unable to create postback. Please try again later.');
    }
  }

  /**
   * Update a postback
   */
  async updatePostback(id: string, data: UpdatePostbackRequest): Promise<Postback> {
    try {
      return await this.repository.update(id, data);
    } catch (error: any) {
      console.error('Failed to update postback:', error);

      if (error.response?.status === 404) {
        throw new Error('Postback not found');
      }

      if (error.response?.status === 422) {
        const errorMessage = error.response?.data?.message || 'Validation failed';
        throw new Error(errorMessage);
      }

      throw new Error('Unable to update postback. Please try again later.');
    }
  }

  /**
   * Toggle postback active status
   */
  async togglePostback(id: string): Promise<Postback> {
    try {
      return await this.repository.toggle(id);
    } catch (error: any) {
      console.error('Failed to toggle postback:', error);

      if (error.response?.status === 404) {
        throw new Error('Postback not found');
      }

      throw new Error('Unable to toggle postback. Please try again later.');
    }
  }

  /**
   * Delete a postback
   */
  async deletePostback(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error: any) {
      console.error('Failed to delete postback:', error);

      if (error.response?.status === 404) {
        throw new Error('Postback not found');
      }

      throw new Error('Unable to delete postback. Please try again later.');
    }
  }
}

// Export a singleton instance
export const postbackService = new PostbackService(postbackRepository);
