import {
  createVendor,
  getVendor,
  findVendors,
  updateVendor,
  deleteVendor
} from '../../vendor/vendor.api';
import * as api from '../../api';

// Mock the quickbooksRequest function
jest.mock('../../api', () => ({
  quickbooksRequest: jest.fn(),
  buildQueryString: jest.fn().mockImplementation(() => ' WHERE Active = true')
}));

describe('Vendor API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockVendor = {
    Id: '123',
    SyncToken: '0',
    DisplayName: 'Test Vendor',
    CompanyName: 'Test Company',
    Active: true
  };

  describe('createVendor', () => {
    test('should call quickbooksRequest with correct parameters', async () => {
      const newVendor = {
        DisplayName: 'New Vendor',
        CompanyName: 'New Company'
      };
      
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce({ Vendor: mockVendor });
      
      const result = await createVendor(newVendor);
      
      expect(api.quickbooksRequest).toHaveBeenCalledWith(
        'vendor',
        'POST',
        { Vendor: newVendor }
      );
      expect(result).toEqual({ Vendor: mockVendor });
    });
  });

  describe('getVendor', () => {
    test('should call quickbooksRequest with correct parameters', async () => {
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce({ Vendor: mockVendor });
      
      const result = await getVendor('123');
      
      expect(api.quickbooksRequest).toHaveBeenCalledWith('vendor/123');
      expect(result).toEqual({ Vendor: mockVendor });
    });
  });

  describe('findVendors', () => {
    test('should call quickbooksRequest with correct parameters and no filters', async () => {
      const mockVendors = {
        QueryResponse: {
          Vendor: [mockVendor]
        }
      };
      
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce(mockVendors);
      
      const result = await findVendors();
      
      expect(api.buildQueryString).toHaveBeenCalledWith({});
      expect(api.quickbooksRequest).toHaveBeenCalledWith(
        'query?query=select * from Vendor WHERE Active = true'
      );
      expect(result).toEqual(mockVendors);
    });
    
    test('should call quickbooksRequest with filters', async () => {
      const mockVendors = {
        QueryResponse: {
          Vendor: [mockVendor]
        }
      };
      
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce(mockVendors);
      
      const result = await findVendors({ Active: 'true', limit: 10 });
      
      expect(api.buildQueryString).toHaveBeenCalledWith({ Active: 'true', limit: 10 });
      expect(api.quickbooksRequest).toHaveBeenCalledWith(
        'query?query=select * from Vendor WHERE Active = true'
      );
      expect(result).toEqual(mockVendors);
    });
  });

  describe('updateVendor', () => {
    test('should call quickbooksRequest with correct parameters', async () => {
      const updateData = {
        Id: '123',
        SyncToken: '0',
        DisplayName: 'Updated Vendor',
        CompanyName: 'Updated Company'
      };
      
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce({ Vendor: { ...updateData, SyncToken: '1' } });
      
      const result = await updateVendor(updateData);
      
      expect(api.quickbooksRequest).toHaveBeenCalledWith(
        'vendor',
        'POST',
        { Vendor: updateData }
      );
      expect(result).toEqual({ Vendor: { ...updateData, SyncToken: '1' } });
    });
  });

  describe('deleteVendor', () => {
    test('should call quickbooksRequest with correct parameters', async () => {
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce({ Vendor: { ...mockVendor, status: 'Deleted' } });
      
      const result = await deleteVendor('123', '0');
      
      expect(api.quickbooksRequest).toHaveBeenCalledWith(
        'vendor?operation=delete',
        'POST',
        { Id: '123', SyncToken: '0' }
      );
      expect(result).toEqual({ Vendor: { ...mockVendor, status: 'Deleted' } });
    });
  });
});