import {
  createCustomer,
  getCustomer,
  findCustomers,
  updateCustomer,
  deleteCustomer
} from '../../customer/customer.api';
import * as api from '../../api';

// Mock the quickbooksRequest function
jest.mock('../../api', () => ({
  quickbooksRequest: jest.fn(),
  buildQueryString: jest.fn().mockImplementation(() => ' WHERE Active = true')
}));

describe('Customer API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockCustomer = {
    Id: '123',
    SyncToken: '0',
    DisplayName: 'Test Customer',
    GivenName: 'Test',
    FamilyName: 'Customer',
    Active: true
  };

  describe('createCustomer', () => {
    test('should call quickbooksRequest with correct parameters', async () => {
      const newCustomer = {
        DisplayName: 'New Customer',
        GivenName: 'New',
        FamilyName: 'Customer'
      };
      
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce({ Customer: mockCustomer });
      
      const result = await createCustomer(newCustomer);
      
      expect(api.quickbooksRequest).toHaveBeenCalledWith(
        'customer',
        'POST',
        { Customer: newCustomer }
      );
      expect(result).toEqual({ Customer: mockCustomer });
    });
  });

  describe('getCustomer', () => {
    test('should call quickbooksRequest with correct parameters', async () => {
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce({ Customer: mockCustomer });
      
      const result = await getCustomer('123');
      
      expect(api.quickbooksRequest).toHaveBeenCalledWith('customer/123');
      expect(result).toEqual({ Customer: mockCustomer });
    });
  });

  describe('findCustomers', () => {
    test('should call quickbooksRequest with correct parameters and no filters', async () => {
      const mockCustomers = {
        QueryResponse: {
          Customer: [mockCustomer]
        }
      };
      
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce(mockCustomers);
      
      const result = await findCustomers();
      
      expect(api.buildQueryString).toHaveBeenCalledWith({});
      expect(api.quickbooksRequest).toHaveBeenCalledWith(
        'query?query=select * from Customer WHERE Active = true'
      );
      expect(result).toEqual(mockCustomers);
    });
    
    test('should call quickbooksRequest with filters', async () => {
      const mockCustomers = {
        QueryResponse: {
          Customer: [mockCustomer]
        }
      };
      
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce(mockCustomers);
      
      const result = await findCustomers({ DisplayName: 'Test', limit: 10 });
      
      expect(api.buildQueryString).toHaveBeenCalledWith({ DisplayName: 'Test', limit: 10 });
      expect(api.quickbooksRequest).toHaveBeenCalledWith(
        'query?query=select * from Customer WHERE Active = true'
      );
      expect(result).toEqual(mockCustomers);
    });
  });

  describe('updateCustomer', () => {
    test('should call quickbooksRequest with correct parameters', async () => {
      const updateData = {
        Id: '123',
        SyncToken: '0',
        DisplayName: 'Updated Customer',
        GivenName: 'Updated',
        FamilyName: 'Customer'
      };
      
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce({ Customer: { ...updateData, SyncToken: '1' } });
      
      const result = await updateCustomer(updateData);
      
      expect(api.quickbooksRequest).toHaveBeenCalledWith(
        'customer',
        'POST',
        { Customer: updateData }
      );
      expect(result).toEqual({ Customer: { ...updateData, SyncToken: '1' } });
    });
  });

  describe('deleteCustomer', () => {
    test('should call quickbooksRequest with correct parameters', async () => {
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce({ Customer: { ...mockCustomer, status: 'Deleted' } });
      
      const result = await deleteCustomer('123', '0');
      
      expect(api.quickbooksRequest).toHaveBeenCalledWith(
        'customer?operation=delete',
        'POST',
        { Id: '123', SyncToken: '0' }
      );
      expect(result).toEqual({ Customer: { ...mockCustomer, status: 'Deleted' } });
    });
  });
});