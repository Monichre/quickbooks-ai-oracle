import { NextRequest, NextResponse } from "next/server";

// Mock company info data
const mockCompanyInfo = {
  Id: "5000",
  SyncToken: "1",
  CompanyName: "Sample Company Inc.",
  LegalName: "Sample Company Incorporated",
  CompanyAddr: {
    Id: "1",
    Line1: "123 Business Ave",
    City: "San Francisco",
    CountrySubDivisionCode: "CA",
    PostalCode: "94107",
    Country: "USA"
  },
  CustomerCommunicationAddr: {
    Id: "2",
    Line1: "123 Business Ave",
    City: "San Francisco",
    CountrySubDivisionCode: "CA",
    PostalCode: "94107",
    Country: "USA"
  },
  LegalAddr: {
    Id: "3",
    Line1: "123 Business Ave",
    City: "San Francisco",
    CountrySubDivisionCode: "CA",
    PostalCode: "94107",
    Country: "USA"
  },
  PrimaryPhone: { FreeFormNumber: "(555) 555-5555" },
  CompanyEmail: { Address: "contact@samplecompany.com" },
  WebAddr: { URI: "https://www.samplecompany.com" },
  SupportedLanguages: "en",
  Country: "US",
  Email: { Address: "admin@samplecompany.com" },
  FiscalYearStartMonth: "January",
  CompanyStartDate: "2020-01-01",
  MetaData: {
    CreateTime: "2020-01-01T00:00:00-08:00",
    LastUpdatedTime: "2023-01-01T00:00:00-08:00"
  }
};

/**
 * GET handler for mock company info data
 */
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      QueryResponse: {
        CompanyInfo: [mockCompanyInfo],
        maxResults: 1
      }
    });
  } catch (error) {
    console.error("Error with mock company info data:", error);
    return NextResponse.json(
      { error: "Failed to fetch mock company info data" },
      { status: 500 }
    );
  }
}