import { linkRepository, LinkRepository } from '@/lib/repositories/LinkRepository';
import {
  AffiliateLink,
  CreateAffiliateLinkRequest,
  PaginatedLinksResponse,
} from '@/lib/types/link';

export class LinkBuilderService {
  constructor(private repository: LinkRepository) {}

  /**
   * Create a new affiliate link
   */
  async createLink(data: CreateAffiliateLinkRequest): Promise<AffiliateLink> {
    try {
      return await this.repository.create(data);
    } catch (error: any) {
      console.error('Failed to create affiliate link:', error);

      // Handle validation errors
      if (error.response?.status === 422) {
        const errorMessage = error.response?.data?.message || 'Validation failed';
        throw new Error(errorMessage);
      }

      throw new Error('Unable to create affiliate link. Please try again later.');
    }
  }

  /**
   * Get all affiliate links with pagination
   */
  async getAllLinks(page: number = 1): Promise<PaginatedLinksResponse> {
    try {
      return await this.repository.getAll(page);
    } catch (error) {
      console.error('Failed to fetch affiliate links:', error);
      throw new Error('Unable to load affiliate links. Please try again later.');
    }
  }

  /**
   * Validate an affiliate link
   */
  async validateLink(url: string): Promise<any> {
    try {
      return await this.repository.validate(url);
    } catch (error: any) {
      console.error('Failed to validate link:', error);

      // Handle validation errors
      if (error.response?.status === 404) {
        throw new Error('Link not found or invalid');
      }

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      throw new Error('Unable to validate link. Please try again later.');
    }
  }
}

// Export a singleton instance
export const linkBuilderService = new LinkBuilderService(linkRepository);
