import {
  createPurchaseOrder,
  getPurchaseOrder,
  findPurchaseOrders,
  updatePurchaseOrder,
  deletePurchaseOrder
} from '../../purchase-order/purchase-order.api';
import * as api from '../../api';

// Mock the quickbooksRequest function
jest.mock('../../api', () => ({
  quickbooksRequest: jest.fn(),
  buildQueryString: jest.fn().mockImplementation(() => ' WHERE POStatus = \'Open\'')
}));

describe('Purchase Order API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockPurchaseOrder = {
    Id: '123',
    SyncToken: '0',
    VendorRef: { value: 'vendor-1', name: 'Test Vendor' },
    APAccountRef: { value: 'account-1', name: 'Accounts Payable' },
    Line: [
      {
        DetailType: 'ItemBasedExpenseLineDetail',
        Amount: 200,
        Description: 'Test Item',
        ItemBasedExpenseLineDetail: {
          ItemRef: { value: 'item-1', name: 'Test Item' },
          UnitPrice: 50,
          Qty: 4
        }
      }
    ],
    POStatus: 'Open',
    TxnDate: '2023-01-15',
    DocNumber: 'PO-001'
  };

  describe('createPurchaseOrder', () => {
    test('should call quickbooksRequest with correct parameters', async () => {
      const newPurchaseOrder = {
        VendorRef: { value: 'vendor-1' },
        APAccountRef: { value: 'account-1' },
        Line: [
          {
            DetailType: 'ItemBasedExpenseLineDetail',
            Amount: 200,
            ItemBasedExpenseLineDetail: {
              ItemRef: { value: 'item-1' },
              UnitPrice: 50,
              Qty: 4
            }
          }
        ]
      };
      
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce({ PurchaseOrder: mockPurchaseOrder });
      
      const result = await createPurchaseOrder(newPurchaseOrder);
      
      expect(api.quickbooksRequest).toHaveBeenCalledWith(
        'purchaseorder',
        'POST',
        { PurchaseOrder: newPurchaseOrder }
      );
      expect(result).toEqual({ PurchaseOrder: mockPurchaseOrder });
    });
  });

  describe('getPurchaseOrder', () => {
    test('should call quickbooksRequest with correct parameters', async () => {
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce({ PurchaseOrder: mockPurchaseOrder });
      
      const result = await getPurchaseOrder('123');
      
      expect(api.quickbooksRequest).toHaveBeenCalledWith('purchaseorder/123');
      expect(result).toEqual({ PurchaseOrder: mockPurchaseOrder });
    });
  });

  describe('findPurchaseOrders', () => {
    test('should call quickbooksRequest with correct parameters and no filters', async () => {
      const mockPurchaseOrders = {
        QueryResponse: {
          PurchaseOrder: [mockPurchaseOrder]
        }
      };
      
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce(mockPurchaseOrders);
      
      const result = await findPurchaseOrders();
      
      expect(api.buildQueryString).toHaveBeenCalledWith({});
      expect(api.quickbooksRequest).toHaveBeenCalledWith(
        'query?query=select * from PurchaseOrder WHERE POStatus = \'Open\''
      );
      expect(result).toEqual(mockPurchaseOrders);
    });
    
    test('should call quickbooksRequest with filters', async () => {
      const mockPurchaseOrders = {
        QueryResponse: {
          PurchaseOrder: [mockPurchaseOrder]
        }
      };
      
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce(mockPurchaseOrders);
      
      const result = await findPurchaseOrders({ VendorRef: 'vendor-1', limit: 10 });
      
      expect(api.buildQueryString).toHaveBeenCalledWith({ VendorRef: 'vendor-1', limit: 10 });
      expect(api.quickbooksRequest).toHaveBeenCalledWith(
        'query?query=select * from PurchaseOrder WHERE POStatus = \'Open\''
      );
      expect(result).toEqual(mockPurchaseOrders);
    });
  });

  describe('updatePurchaseOrder', () => {
    test('should call quickbooksRequest with correct parameters', async () => {
      const updateData = {
        Id: '123',
        SyncToken: '0',
        VendorRef: { value: 'vendor-1' },
        APAccountRef: { value: 'account-1' },
        Line: [
          {
            DetailType: 'ItemBasedExpenseLineDetail',
            Amount: 300,
            ItemBasedExpenseLineDetail: {
              ItemRef: { value: 'item-1' },
              UnitPrice: 50,
              Qty: 6
            }
          }
        ]
      };
      
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce({ PurchaseOrder: { ...updateData, SyncToken: '1' } });
      
      const result = await updatePurchaseOrder(updateData);
      
      expect(api.quickbooksRequest).toHaveBeenCalledWith(
        'purchaseorder',
        'POST',
        { PurchaseOrder: updateData }
      );
      expect(result).toEqual({ PurchaseOrder: { ...updateData, SyncToken: '1' } });
    });
  });

  describe('deletePurchaseOrder', () => {
    test('should call quickbooksRequest with correct parameters', async () => {
      (api.quickbooksRequest as jest.Mock).mockResolvedValueOnce({ PurchaseOrder: { ...mockPurchaseOrder, status: 'Deleted' } });
      
      const result = await deletePurchaseOrder('123', '0');
      
      expect(api.quickbooksRequest).toHaveBeenCalledWith(
        'purchaseorder?operation=delete',
        'POST',
        { Id: '123', SyncToken: '0' }
      );
      expect(result).toEqual({ PurchaseOrder: { ...mockPurchaseOrder, status: 'Deleted' } });
    });
  });
});