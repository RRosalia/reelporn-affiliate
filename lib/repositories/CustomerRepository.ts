import axiosInstance from '@/lib/axios';
import { CustomersResponse, CustomerFilters } from '@/lib/types/customer';

export class CustomerRepository {
  async getAll(filters?: CustomerFilters): Promise<CustomersResponse> {
    const params = new URLSearchParams();

    if (filters?.status) params.append('status', filters.status);
    if (filters?.from) params.append('from', filters.from);
    if (filters?.to) params.append('to', filters.to);
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);
    if (filters?.sort_order) params.append('sort_order', filters.sort_order);
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());
    if (filters?.page) params.append('page', filters.page.toString());

    const queryString = params.toString();
    const url = queryString ? `/customers?${queryString}` : '/customers';

    const response = await axiosInstance.get<CustomersResponse>(url);
    return response.data;
  }
}

export const customerRepository = new CustomerRepository();
