import axiosInstance from '@/lib/axios';
import {
  Postback,
  CreatePostbackRequest,
  UpdatePostbackRequest,
  PostbackResponse,
  PostbacksListResponse,
} from '@/lib/types/postback';

export class PostbackRepository {
  /**
   * Fetch all postbacks
   */
  async getAll(): Promise<Postback[]> {
    const response = await axiosInstance.get<PostbacksListResponse>('/postbacks');
    return response.data.data;
  }

  /**
   * Create a new postback
   */
  async create(data: CreatePostbackRequest): Promise<Postback> {
    const response = await axiosInstance.post<PostbackResponse>('/postbacks', data);
    return response.data.data;
  }

  /**
   * Update a postback
   */
  async update(id: string, data: UpdatePostbackRequest): Promise<Postback> {
    const response = await axiosInstance.put<PostbackResponse>(`/postbacks/${id}`, data);
    return response.data.data;
  }

  /**
   * Toggle postback active status
   */
  async toggle(id: string): Promise<Postback> {
    const response = await axiosInstance.patch<PostbackResponse>(`/postbacks/${id}/toggle`);
    return response.data.data;
  }

  /**
   * Delete a postback
   */
  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`/postbacks/${id}`);
  }
}

// Export a singleton instance
export const postbackRepository = new PostbackRepository();
