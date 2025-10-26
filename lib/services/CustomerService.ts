import { CustomerRepository, customerRepository } from '@/lib/repositories/CustomerRepository';
import { CustomersResponse, CustomerFilters } from '@/lib/types/customer';

export class CustomerService {
  constructor(private repository: CustomerRepository) {}

  async getAll(filters?: CustomerFilters): Promise<CustomersResponse> {
    try {
      return await this.repository.getAll(filters);
    } catch (error: any) {
      console.error('Failed to fetch customers:', error);
      throw new Error('Unable to load customers. Please try again later.');
    }
  }
}

export const customerService = new CustomerService(customerRepository);
