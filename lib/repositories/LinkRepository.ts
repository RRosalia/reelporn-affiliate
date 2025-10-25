import axiosInstance from '@/lib/axios';
import {
  AffiliateLink,
  CreateAffiliateLinkRequest,
  CreateAffiliateLinkResponse,
  PaginatedLinksResponse,
} from '@/lib/types/link';

export class LinkRepository {
  /**
   * Create a new affiliate link
   */
  async create(data: CreateAffiliateLinkRequest): Promise<AffiliateLink> {
    const response = await axiosInstance.post<CreateAffiliateLinkResponse>(
      '/links',
      data
    );
    return response.data.data;
  }

  /**
   * Fetch all affiliate links with pagination
   */
  async getAll(page: number = 1): Promise<PaginatedLinksResponse> {
    const response = await axiosInstance.get<PaginatedLinksResponse>(
      '/links',
      {
        params: { page },
      }
    );
    return response.data;
  }

  /**
   * Validate a link
   */
  async validate(url: string): Promise<any> {
    const response = await axiosInstance.get('/links/validate', {
      params: { url },
    });
    return response.data;
  }
}

// Export a singleton instance
export const linkRepository = new LinkRepository();
