import {
  createItem,
  getItem,
  findItems,
  updateItem,
  deleteItem
} from '../../item/item.api';
import * as api from '../../api';

// Mock the quickbooksRequest function
jest.mock('../../api', () => ({
  quickbooksRequest: jest.fn(),
  buildQueryString: jest.fn().mockImplementation(() => ' WHERE Active = true')
}));

describe('Item API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockItem = {
    Id: '123',
    SyncToken: '0',
    Name: 'Test Item',
    Type: 'Inventory' as const,
    Active: true,
    UnitPrice: 99.99
  };

  describe('createItem', () => {
    test('should call quickbooksRequest with correct parameters', async () => {
      const newItem = {
        Name: 'New Item',
        Type: 'Service' as const,
        UnitPrice: 149.99
      };
      
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce({ Item: mockItem });
      
      const result = await createItem(newItem);
      
      expect(api.quickbooksRequest).toHaveBeenCalledWith(
        'item',
        'POST',
        { Item: newItem }
      );
      expect(result).toEqual({ Item: mockItem });
    });
  });

  describe('getItem', () => {
    test('should call quickbooksRequest with correct parameters', async () => {
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce({ Item: mockItem });
      
      const result = await getItem('123');
      
      expect(api.quickbooksRequest).toHaveBeenCalledWith('item/123');
      expect(result).toEqual({ Item: mockItem });
    });
  });

  describe('findItems', () => {
    test('should call quickbooksRequest with correct parameters and no filters', async () => {
      const mockItems = {
        QueryResponse: {
          Item: [mockItem]
        }
      };
      
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce(mockItems);
      
      const result = await findItems();
      
      expect(api.buildQueryString).toHaveBeenCalledWith({});
      expect(api.quickbooksRequest).toHaveBeenCalledWith(
        'query?query=select * from Item WHERE Active = true'
      );
      expect(result).toEqual(mockItems);
    });
    
    test('should call quickbooksRequest with filters', async () => {
      const mockItems = {
        QueryResponse: {
          Item: [mockItem]
        }
      };
      
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce(mockItems);
      
      const result = await findItems({ Type: 'Inventory', limit: 10 });
      
      expect(api.buildQueryString).toHaveBeenCalledWith({ Type: 'Inventory', limit: 10 });
      expect(api.quickbooksRequest).toHaveBeenCalledWith(
        'query?query=select * from Item WHERE Active = true'
      );
      expect(result).toEqual(mockItems);
    });
  });

  describe('updateItem', () => {
    test('should call quickbooksRequest with correct parameters', async () => {
      const updateData = {
        Id: '123',
        SyncToken: '0',
        Name: 'Updated Item',
        Type: 'Inventory' as const,
        UnitPrice: 129.99
      };
      
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce({ Item: { ...updateData, SyncToken: '1' } });
      
      const result = await updateItem(updateData);
      
      expect(api.quickbooksRequest).toHaveBeenCalledWith(
        'item',
        'POST',
        { Item: updateData }
      );
      expect(result).toEqual({ Item: { ...updateData, SyncToken: '1' } });
    });
  });

  describe('deleteItem', () => {
    test('should call quickbooksRequest with correct parameters', async () => {
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce({ Item: { ...mockItem, status: 'Deleted' } });
      
      const result = await deleteItem('123', '0');
      
      expect(api.quickbooksRequest).toHaveBeenCalledWith(
        'item?operation=delete',
        'POST',
        { Id: '123', SyncToken: '0' }
      );
      expect(result).toEqual({ Item: { ...mockItem, status: 'Deleted' } });
    });
  });
});