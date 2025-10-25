import axiosInstance from '@/lib/axios';
import { Country } from '@/lib/types/country';

export class CountryRepository {
  /**
   * Fetch all countries from the API
   */
  async getAll(): Promise<Country[]> {
    const response = await axiosInstance.get('/countries');
    return response.data.data;
  }

  /**
   * Fetch a single country by ID
   */
  async getById(id: number): Promise<Country> {
    const response = await axiosInstance.get(`/countries/${id}`);
    return response.data.data;
  }

  /**
   * Fetch a single country by slug
   */
  async getBySlug(slug: string): Promise<Country> {
    const response = await axiosInstance.get(`/countries/${slug}`);
    return response.data.data;
  }
}

// Export a singleton instance
export const countryRepository = new CountryRepository();
