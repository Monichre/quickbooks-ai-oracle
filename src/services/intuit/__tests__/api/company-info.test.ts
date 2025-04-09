import {
  getCompanyInfo,
  getCompanyInfoById,
  findCompanyInfos,
  updateCompanyInfo
} from '../../company-info/company-info.api';
import * as api from '../../api';

// Mock the quickbooksRequest function
jest.mock('../../api', () => ({
  quickbooksRequest: jest.fn(),
  buildQueryString: jest.fn().mockImplementation(() => '')
}));

describe('Company Info API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockCompanyInfo = {
    Id: '123',
    SyncToken: '0',
    CompanyName: 'Test Company',
    LegalName: 'Test Legal Name',
    CompanyAddr: {
      Line1: '123 Test Street',
      City: 'Test City',
      CountrySubDivisionCode: 'CA',
      PostalCode: '12345'
    },
    Country: 'US',
    Email: { Address: 'test@example.com' }
  };

  describe('getCompanyInfo', () => {
    test('should call quickbooksRequest and extract first result', async () => {
      const mockResponse = {
        QueryResponse: {
          CompanyInfo: [mockCompanyInfo]
        }
      };
      
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce(mockResponse);
      
      const result = await getCompanyInfo();
      
      expect(api.quickbooksRequest).toHaveBeenCalledWith('query?query=select * from CompanyInfo');
      expect(result).toEqual(mockCompanyInfo);
    });
  });

  describe('getCompanyInfoById', () => {
    test('should call quickbooksRequest with correct parameters', async () => {
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce({ CompanyInfo: mockCompanyInfo });
      
      const result = await getCompanyInfoById('123');
      
      expect(api.quickbooksRequest).toHaveBeenCalledWith('companyinfo/123');
      expect(result).toEqual({ CompanyInfo: mockCompanyInfo });
    });
  });

  describe('findCompanyInfos', () => {
    test('should call quickbooksRequest with correct parameters and no filters', async () => {
      const mockResponse = {
        QueryResponse: {
          CompanyInfo: [mockCompanyInfo]
        }
      };
      
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce(mockResponse);
      
      const result = await findCompanyInfos();
      
      expect(api.buildQueryString).toHaveBeenCalledWith({});
      expect(api.quickbooksRequest).toHaveBeenCalledWith('query?query=select * from CompanyInfo');
      expect(result).toEqual(mockResponse);
    });
    
    test('should call quickbooksRequest with filters', async () => {
      const mockResponse = {
        QueryResponse: {
          CompanyInfo: [mockCompanyInfo]
        }
      };
      
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce(mockResponse);
      
      const result = await findCompanyInfos({ Country: 'US' });
      
      expect(api.buildQueryString).toHaveBeenCalledWith({ Country: 'US' });
      expect(api.quickbooksRequest).toHaveBeenCalledWith('query?query=select * from CompanyInfo');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateCompanyInfo', () => {
    test('should call quickbooksRequest with correct parameters', async () => {
      const updateData = {
        Id: '123',
        SyncToken: '0',
        CompanyName: 'Updated Company',
        LegalName: 'Updated Legal Name',
        Email: { Address: 'updated@example.com' }
      };
      
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce({ CompanyInfo: { ...updateData, SyncToken: '1' } });
      
      const result = await updateCompanyInfo(updateData);
      
      expect(api.quickbooksRequest).toHaveBeenCalledWith(
        'companyinfo',
        'POST',
        { CompanyInfo: updateData }
      );
      expect(result).toEqual({ CompanyInfo: { ...updateData, SyncToken: '1' } });
    });
  });
});