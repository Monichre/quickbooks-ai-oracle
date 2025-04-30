// Current entity types
export type EntityType =
	| "accounts"
	| "customers"
	| "vendors"
	| "invoices"
	| "items"
	| "products"
	| "purchases"
	| "purchase-orders"
	| "estimates"
	| "payments"
	| "employees"
	| "bills"
	| "account-list-detail"
	| "profit-and-loss";

// Common interfaces

export interface ReferenceType {
	name: string;
	value: string;
}

export interface Address {
	Id?: string;
	Line1?: string;
	Line2?: string;
	City?: string;
	CountrySubDivisionCode?: string;
	Country?: string;
	PostalCode?: string;
}

export interface EmailAddress {
	Address?: string;
}

export interface PhoneNumber {
	FreeFormNumber?: string;
}

// Entity-specific interfaces

export interface Customer {
	Id: string;
	DisplayName?: string;
	CompanyName?: string;
	PrimaryEmailAddr?: EmailAddress;
	PrimaryPhone?: PhoneNumber;
	BillAddr?: Address;
	ShipAddr?: Address;
	Balance?: number;
	Active?: boolean;
	Notes?: string;
	WebAddr?: { URI?: string };
	Taxable?: boolean;
}

export interface Vendor {
	Id: string;
	DisplayName?: string;
	CompanyName?: string;
	PrimaryEmailAddr?: EmailAddress;
	PrimaryPhone?: PhoneNumber;
	BillAddr?: Address;
	Balance?: number;
	Active?: boolean;
	Notes?: string;
	WebAddr?: { URI?: string };
	TaxIdentifier?: string;
}

export interface Invoice {
	Id: string;
	DocNumber?: string;
	CustomerRef?: ReferenceType;
	TxnDate?: string;
	DueDate?: string;
	TotalAmt?: number;
	Balance?: number;
	Line?: Array<{
		Id?: string;
		LineNum?: number;
		Description?: string;
		Amount?: number;
		SalesItemLineDetail?: {
			ItemRef?: ReferenceType;
			Qty?: number;
			UnitPrice?: number;
		};
	}>;
}

export interface PurchaseOrder {
	Id: string;
	DocNumber?: string;
	VendorRef?: ReferenceType;
	APAccountRef?: ReferenceType;
	TotalAmt?: number;
	Line?: Array<{
		Id?: string;
		LineNum?: number;
		Description?: string;
		Amount?: number;
		ItemBasedExpenseLineDetail?: {
			ItemRef?: ReferenceType;
			Qty?: number;
			UnitPrice?: number;
		};
	}>;
}

export interface Account {
	Id: string;
	Name?: string;
	AccountType?: string;
	AccountSubType?: string;
	CurrentBalance?: number;
	Active?: boolean;
	Description?: string;
}

export interface Estimate {
	Id: string;
	DocNumber?: string;
	CustomerRef?: ReferenceType;
	TxnDate?: string;
	DueDate?: string;
	TotalAmt?: number;
	Line?: Array<{
		Id?: string;
		LineNum?: number;
		Description?: string;
		Amount?: number;
		SalesItemLineDetail?: {
			ItemRef?: ReferenceType;
			Qty?: number;
			UnitPrice?: number;
		};
	}>;
}

// Type mapping for entity to interface
export type EntityTypeToInterface = {
	customers: Customer;
	vendors: Vendor;
	invoices: Invoice;
	"purchase-orders": PurchaseOrder;
	accounts: Account;
	estimates: Estimate;
	// Add other entities as needed
	[key: string]: any; // Fallback for unknown entities
};
