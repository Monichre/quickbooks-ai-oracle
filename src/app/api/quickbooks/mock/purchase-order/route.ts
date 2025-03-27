import { NextRequest, NextResponse } from "next/server";

// Mock purchase order data
const mockPurchaseOrders = [
  {
    Id: "3001",
    APAccountRef: { value: "80", name: "Accounts Payable" },
    VendorRef: { value: "1001", name: "ABC Suppliers" },
    Line: [
      {
        Id: "1",
        DetailType: "ItemBasedExpenseLineDetail",
        Amount: 2500.00,
        Description: "Raw materials",
        ItemBasedExpenseLineDetail: {
          ItemRef: { value: "101", name: "Manufacturing Materials" },
          UnitPrice: 25.00,
          Qty: 100
        }
      }
    ],
    POStatus: "Open",
    TxnDate: "2023-01-15",
    DocNumber: "PO-001"
  },
  {
    Id: "3002",
    APAccountRef: { value: "80", name: "Accounts Payable" },
    VendorRef: { value: "1002", name: "XYZ Manufacturing" },
    Line: [
      {
        Id: "1",
        DetailType: "ItemBasedExpenseLineDetail",
        Amount: 1750.00,
        Description: "Machine parts",
        ItemBasedExpenseLineDetail: {
          ItemRef: { value: "102", name: "Machine Parts" },
          UnitPrice: 350.00,
          Qty: 5
        }
      }
    ],
    POStatus: "Closed",
    TxnDate: "2023-02-20",
    DocNumber: "PO-002"
  },
  {
    Id: "3003",
    APAccountRef: { value: "80", name: "Accounts Payable" },
    VendorRef: { value: "1003", name: "Global Parts Corp" },
    Line: [
      {
        Id: "1",
        DetailType: "ItemBasedExpenseLineDetail",
        Amount: 3200.00,
        Description: "Electronic components",
        ItemBasedExpenseLineDetail: {
          ItemRef: { value: "103", name: "Electronics" },
          UnitPrice: 16.00,
          Qty: 200
        }
      }
    ],
    POStatus: "Open",
    TxnDate: "2023-03-25",
    DocNumber: "PO-003"
  },
  {
    Id: "3004",
    APAccountRef: { value: "80", name: "Accounts Payable" },
    VendorRef: { value: "1004", name: "Tech Distributors" },
    Line: [
      {
        Id: "1",
        DetailType: "ItemBasedExpenseLineDetail",
        Amount: 5000.00,
        Description: "Computer equipment",
        ItemBasedExpenseLineDetail: {
          ItemRef: { value: "104", name: "Computers" },
          UnitPrice: 1000.00,
          Qty: 5
        }
      }
    ],
    POStatus: "Closed",
    TxnDate: "2023-04-10",
    DocNumber: "PO-004"
  },
  {
    Id: "3005",
    APAccountRef: { value: "80", name: "Accounts Payable" },
    VendorRef: { value: "1005", name: "Office Supply Co" },
    Line: [
      {
        Id: "1",
        DetailType: "ItemBasedExpenseLineDetail",
        Amount: 850.00,
        Description: "Office furniture",
        ItemBasedExpenseLineDetail: {
          ItemRef: { value: "105", name: "Furniture" },
          UnitPrice: 425.00,
          Qty: 2
        }
      }
    ],
    POStatus: "Open",
    TxnDate: "2023-05-15",
    DocNumber: "PO-005"
  }
];

/**
 * GET handler for mock purchase order data
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const purchaseOrderId = searchParams.get("id");

    // If purchase order ID is provided, return specific purchase order
    if (purchaseOrderId) {
      const purchaseOrder = mockPurchaseOrders.find(po => po.Id === purchaseOrderId);
      if (!purchaseOrder) {
        return NextResponse.json(
          { error: "Purchase order not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ PurchaseOrder: purchaseOrder });
    }

    // Process limit and offset for pagination
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    
    // Get paginated purchase orders
    const paginatedPOs = mockPurchaseOrders.slice(offset, offset + limit);

    return NextResponse.json({
      QueryResponse: {
        PurchaseOrder: paginatedPOs,
        maxResults: paginatedPOs.length,
        totalCount: mockPurchaseOrders.length
      }
    });
  } catch (error) {
    console.error("Error with mock purchase order data:", error);
    return NextResponse.json(
      { error: "Failed to fetch mock purchase order data" },
      { status: 500 }
    );
  }
}