import { 
  createAccount, 
  getAccount, 
  findAccounts, 
  updateAccount, 
  deleteAccount 
} from '../../account/account.api';
import * as api from '../../api';

// Mock the quickbooksRequest function
jest.mock('../../api', () => ({
  quickbooksRequest: jest.fn(),
  buildQueryString: jest.fn().mockImplementation(() => ' WHERE Active = true')
}));

describe('Account API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockAccount = {
    Id: '123',
    SyncToken: '0',
    Name: 'Test Account',
    AccountType: 'Expense',
    Active: true
  };

  describe('createAccount', () => {
    test('should call quickbooksRequest with correct parameters', async () => {
      const newAccount = {
        Name: 'New Account',
        AccountType: 'Expense'
      };
      
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce({ Account: mockAccount });
      
      const result = await createAccount(newAccount);
      
      expect(api.quickbooksRequest).toHaveBeenCalledWith(
        'account',
        'POST',
        { Account: newAccount }
      );
      expect(result).toEqual({ Account: mockAccount });
    });
  });

  describe('getAccount', () => {
    test('should call quickbooksRequest with correct parameters', async () => {
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce({ Account: mockAccount });
      
      const result = await getAccount('123');
      
      expect(api.quickbooksRequest).toHaveBeenCalledWith('account/123');
      expect(result).toEqual({ Account: mockAccount });
    });
  });

  describe('findAccounts', () => {
    test('should call quickbooksRequest with correct parameters and no filters', async () => {
      const mockAccounts = {
        QueryResponse: {
          Account: [mockAccount]
        }
      };
      
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce(mockAccounts);
      
      const result = await findAccounts();
      
      expect(api.buildQueryString).toHaveBeenCalledWith({});
      expect(api.quickbooksRequest).toHaveBeenCalledWith(
        'query?query=select * from Account WHERE Active = true'
      );
      expect(result).toEqual(mockAccounts);
    });
    
    test('should call quickbooksRequest with filters', async () => {
      const mockAccounts = {
        QueryResponse: {
          Account: [mockAccount]
        }
      };
      
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce(mockAccounts);
      
      const result = await findAccounts({ Active: 'true', limit: 10 });
      
      expect(api.buildQueryString).toHaveBeenCalledWith({ Active: 'true', limit: 10 });
      expect(api.quickbooksRequest).toHaveBeenCalledWith(
        'query?query=select * from Account WHERE Active = true'
      );
      expect(result).toEqual(mockAccounts);
    });
  });

  describe('updateAccount', () => {
    test('should call quickbooksRequest with correct parameters', async () => {
      const updateData = {
        Id: '123',
        SyncToken: '0',
        Name: 'Updated Account',
        AccountType: 'Expense'
      };
      
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce({ Account: { ...updateData, SyncToken: '1' } });
      
      const result = await updateAccount(updateData);
      
      expect(api.quickbooksRequest).toHaveBeenCalledWith(
        'account',
        'POST',
        { Account: updateData }
      );
      expect(result).toEqual({ Account: { ...updateData, SyncToken: '1' } });
    });
  });

  describe('deleteAccount', () => {
    test('should call quickbooksRequest with correct parameters', async () => {
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce({ Account: { ...mockAccount, status: 'Deleted' } });
      
      const result = await deleteAccount('123', '0');
      
      expect(api.quickbooksRequest).toHaveBeenCalledWith(
        'account?operation=delete',
        'POST',
        { Id: '123', SyncToken: '0' }
      );
      expect(result).toEqual({ Account: { ...mockAccount, status: 'Deleted' } });
    });
  });
});