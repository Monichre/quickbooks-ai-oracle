import { NextRequest, NextResponse } from "next/server";

// Mock purchase data
const mockPurchases = [
  {
    Id: "2001",
    PaymentType: "Check",
    AccountRef: { value: "60", name: "Professional Fees" },
    EntityRef: { value: "1001", name: "ABC Suppliers", type: "Vendor" },
    Line: [
      {
        Id: "1",
        DetailType: "AccountBasedExpenseLineDetail",
        Amount: 1250.00,
        Description: "Monthly service fee",
        AccountBasedExpenseLineDetail: {
          AccountRef: { value: "60", name: "Professional Fees" }
        }
      }
    ],
    TxnDate: "2023-02-15",
    DocNumber: "PUR-001"
  },
  {
    Id: "2002",
    PaymentType: "CreditCard",
    AccountRef: { value: "65", name: "Supplies" },
    EntityRef: { value: "1002", name: "XYZ Manufacturing", type: "Vendor" },
    Line: [
      {
        Id: "1",
        DetailType: "ItemBasedExpenseLineDetail",
        Amount: 750.50,
        Description: "Office equipment",
        ItemBasedExpenseLineDetail: {
          ItemRef: { value: "37", name: "Office Chair" },
          UnitPrice: 250.16,
          Qty: 3
        }
      }
    ],
    TxnDate: "2023-03-10",
    DocNumber: "PUR-002"
  },
  {
    Id: "2003",
    PaymentType: "Cash",
    AccountRef: { value: "68", name: "Utilities" },
    EntityRef: { value: "1003", name: "Global Parts Corp", type: "Vendor" },
    Line: [
      {
        Id: "1",
        DetailType: "AccountBasedExpenseLineDetail",
        Amount: 450.00,
        Description: "Utilities payment",
        AccountBasedExpenseLineDetail: {
          AccountRef: { value: "68", name: "Utilities" }
        }
      }
    ],
    TxnDate: "2023-04-05",
    DocNumber: "PUR-003"
  },
  {
    Id: "2004",
    PaymentType: "Check",
    AccountRef: { value: "70", name: "Software" },
    EntityRef: { value: "1004", name: "Tech Distributors", type: "Vendor" },
    Line: [
      {
        Id: "1",
        DetailType: "ItemBasedExpenseLineDetail",
        Amount: 1200.00,
        Description: "Software licenses",
        ItemBasedExpenseLineDetail: {
          ItemRef: { value: "42", name: "Software License" },
          UnitPrice: 300.00,
          Qty: 4
        }
      }
    ],
    TxnDate: "2023-05-20",
    DocNumber: "PUR-004"
  },
  {
    Id: "2005",
    PaymentType: "CreditCard",
    AccountRef: { value: "65", name: "Supplies" },
    EntityRef: { value: "1005", name: "Office Supply Co", type: "Vendor" },
    Line: [
      {
        Id: "1",
        DetailType: "ItemBasedExpenseLineDetail",
        Amount: 325.75,
        Description: "Office supplies",
        ItemBasedExpenseLineDetail: {
          ItemRef: { value: "45", name: "Paper" },
          UnitPrice: 5.25,
          Qty: 62
        }
      }
    ],
    TxnDate: "2023-06-12",
    DocNumber: "PUR-005"
  }
];

/**
 * GET handler for mock purchase data
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const purchaseId = searchParams.get("id");

    // If purchase ID is provided, return specific purchase
    if (purchaseId) {
      const purchase = mockPurchases.find(p => p.Id === purchaseId);
      if (!purchase) {
        return NextResponse.json(
          { error: "Purchase not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ Purchase: purchase });
    }

    // Process limit and offset for pagination
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    
    // Get paginated purchases
    const paginatedPurchases = mockPurchases.slice(offset, offset + limit);

    return NextResponse.json({
      QueryResponse: {
        Purchase: paginatedPurchases,
        maxResults: paginatedPurchases.length,
        totalCount: mockPurchases.length
      }
    });
  } catch (error) {
    console.error("Error with mock purchase data:", error);
    return NextResponse.json(
      { error: "Failed to fetch mock purchase data" },
      { status: 500 }
    );
  }
}