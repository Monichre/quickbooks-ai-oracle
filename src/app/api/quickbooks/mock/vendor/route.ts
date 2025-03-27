import { NextRequest, NextResponse } from "next/server";

// Mock vendor data
const mockVendors = [
  {
    Id: "1001",
    DisplayName: "ABC Suppliers",
    CompanyName: "ABC Suppliers, Inc.",
    Active: true,
    PrimaryEmailAddr: { Address: "contact@abcsuppliers.com" },
    Balance: 2500.00
  },
  {
    Id: "1002",
    DisplayName: "XYZ Manufacturing",
    CompanyName: "XYZ Manufacturing Co.",
    Active: true,
    PrimaryEmailAddr: { Address: "info@xyzmanufacturing.com" },
    Balance: 4750.50
  },
  {
    Id: "1003",
    DisplayName: "Global Parts Corp",
    CompanyName: "Global Parts Corporation",
    Active: true,
    PrimaryEmailAddr: { Address: "orders@globalparts.com" },
    Balance: 3200.75
  },
  {
    Id: "1004",
    DisplayName: "Tech Distributors",
    CompanyName: "Tech Distributors LLC",
    Active: false,
    PrimaryEmailAddr: { Address: "sales@techdist.com" },
    Balance: 0.00
  },
  {
    Id: "1005",
    DisplayName: "Office Supply Co",
    CompanyName: "Office Supply Company",
    Active: true,
    PrimaryEmailAddr: { Address: "support@officesupply.com" },
    Balance: 850.25
  }
];

/**
 * GET handler for mock vendor data
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const vendorId = searchParams.get("id");

    // If vendor ID is provided, return specific vendor
    if (vendorId) {
      const vendor = mockVendors.find(v => v.Id === vendorId);
      if (!vendor) {
        return NextResponse.json(
          { error: "Vendor not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ Vendor: vendor });
    }

    // Process limit and offset for pagination
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    
    // Get paginated vendors
    const paginatedVendors = mockVendors.slice(offset, offset + limit);

    return NextResponse.json({
      QueryResponse: {
        Vendor: paginatedVendors,
        maxResults: paginatedVendors.length,
        totalCount: mockVendors.length
      }
    });
  } catch (error) {
    console.error("Error with mock vendor data:", error);
    return NextResponse.json(
      { error: "Failed to fetch mock vendor data" },
      { status: 500 }
    );
  }
}