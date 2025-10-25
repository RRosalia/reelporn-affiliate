import { countryRepository, CountryRepository } from '@/lib/repositories/CountryRepository';
import { Country } from '@/lib/types/country';

export class CountryService {
  constructor(private repository: CountryRepository) {}

  /**
   * Get all countries
   */
  async getAllCountries(): Promise<Country[]> {
    try {
      return await this.repository.getAll();
    } catch (error) {
      console.error('Failed to fetch countries:', error);
      throw new Error('Unable to load countries. Please try again later.');
    }
  }

  /**
   * Get a country by ID
   */
  async getCountryById(id: number): Promise<Country> {
    try {
      return await this.repository.getById(id);
    } catch (error) {
      console.error(`Failed to fetch country with ID ${id}:`, error);
      throw new Error('Unable to load country. Please try again later.');
    }
  }

  /**
   * Get a country by slug
   */
  async getCountryBySlug(slug: string): Promise<Country> {
    try {
      return await this.repository.getBySlug(slug);
    } catch (error) {
      console.error(`Failed to fetch country with slug ${slug}:`, error);
      throw new Error('Unable to load country. Please try again later.');
    }
  }

  /**
   * Search countries by name
   */
  async searchCountries(query: string): Promise<Country[]> {
    try {
      const countries = await this.repository.getAll();
      const lowerQuery = query.toLowerCase();
      return countries.filter(
        (country) =>
          country.name.toLowerCase().includes(lowerQuery) ||
          country.official_name.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('Failed to search countries:', error);
      throw new Error('Unable to search countries. Please try again later.');
    }
  }
}

// Export a singleton instance
export const countryService = new CountryService(countryRepository);
