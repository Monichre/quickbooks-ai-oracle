// Standardized entity object type that all specific entities will extend
export type EntityObject = Record<string, unknown>;

// Generic entity response structure
export interface EntityResponse<T extends EntityObject> {
	QueryResponse?: {
		[entityKey: string]: T[];
	} & {
		startPosition?: number;
		maxResults?: number;
		totalCount?: number;
	};
	[key: string]: unknown;
}

// Customer entity type
export interface Customer extends EntityObject {
	Id?: string;
	DisplayName?: string;
	CompanyName?: string;
	Active?: boolean;
	Balance?: number;
	CurrencyRef?: {
		value?: string;
		name?: string;
	};
	PrimaryEmailAddr?: {
		Address?: string;
	};
	PrimaryPhone?: {
		FreeFormNumber?: string;
	};
}

// Vendor entity type
export interface Vendor extends EntityObject {
	Id?: string;
	DisplayName?: string;
	CompanyName?: string;
	Active?: boolean;
	Balance?: number;
	CurrencyRef?: {
		value?: string;
		name?: string;
	};
	PrimaryEmailAddr?: {
		Address?: string;
	};
	PrimaryPhone?: {
		FreeFormNumber?: string;
	};
}

// Purchase entity type
export interface Purchase extends EntityObject {
	Id?: string;
	DocNumber?: string;
	TotalAmt?: number;
	TxnDate?: string;
	PaymentType?: string;
	AccountRef?: {
		value?: string;
		name?: string;
	};
	CurrencyRef?: {
		value?: string;
		name?: string;
	};
	PaymentMethodRef?: {
		value?: string;
		name?: string;
	};
}

// Invoice entity type
export interface Invoice extends EntityObject {
	Id?: string;
	DocNumber?: string;
	TotalAmt?: number;
	Balance?: number;
	TxnDate?: string;
	DueDate?: string;
	CustomerRef?: {
		value?: string;
		name?: string;
	};
}

// Item entity type
export interface Item extends EntityObject {
	Id?: string;
	Name?: string;
	Description?: string;
	Active?: boolean;
	UnitPrice?: number;
	Type?: string;
	QtyOnHand?: number;
	IncomeAccountRef?: {
		value?: string;
		name?: string;
	};
}

// Account entity type
export interface Account extends EntityObject {
	Id?: string;
	Name?: string;
	AccountType?: string;
	AccountSubType?: string;
	CurrentBalance?: number;
	Active?: boolean;
	Classification?: string;
}

// Payment entity type
export interface Payment extends EntityObject {
	Id?: string;
	TotalAmt?: number;
	CustomerRef?: {
		value?: string;
		name?: string;
	};
	PaymentRefNum?: string;
	TxnDate?: string;
	UnappliedAmt?: number;
}

// Bill entity type
export interface Bill extends EntityObject {
	Id?: string;
	DocNumber?: string;
	TotalAmt?: number;
	Balance?: number;
	DueDate?: string;
	TxnDate?: string;
	VendorRef?: {
		value?: string;
		name?: string;
	};
}

// Purchase Order entity type
export interface PurchaseOrder extends EntityObject {
	Id?: string;
	DocNumber?: string;
	TotalAmt?: number;
	POStatus?: string;
	TxnDate?: string;
	DueDate?: string;
	VendorRef?: {
		value?: string;
		name?: string;
	};
}

// Type maps to help with dynamic type handling
export const entityTypeToResponseKey: Record<string, string> = {
	accounts: "Account",
	customers: "Customer",
	vendors: "Vendor",
	invoices: "Invoice",
	items: "Item",
	products: "Item", // Products use the Item entity in QuickBooks
	purchases: "Purchase",
	"purchase-orders": "PurchaseOrder",
	payments: "Payment",
	bills: "Bill",
};

// Type mapping for specific entity types in responses
export type EntityTypeMap = {
	accounts: Account;
	customers: Customer;
	vendors: Vendor;
	invoices: Invoice;
	items: Item;
	products: Item;
	purchases: Purchase;
	"purchase-orders": PurchaseOrder;
	payments: Payment;
	bills: Bill;
};

// Generic response type that can be used with any entity type
export type QuickBooksResponse<
	T extends keyof EntityTypeMap = keyof EntityTypeMap,
> = EntityResponse<EntityTypeMap[T]>;
