/**
 * Type definitions for QuickBooks API interactions
 */

// Common interface for query parameters
export interface QueryParams {
	limit?: number;
	offset?: number;
	asc?: string;
	desc?: string;
	[key: string]: string | number | boolean | undefined;
}

/**
 * Company information type definition
 */
export type CompanyInfo = {
	Id?: string;
	SyncToken?: string;
	CompanyName: string;
	LegalName?: string;
	CompanyAddr?: {
		Id?: string;
		Line1?: string;
		Line2?: string;
		City?: string;
		CountrySubDivisionCode?: string;
		PostalCode?: string;
		Country?: string;
		Lat?: string;
		Long?: string;
	};
	CustomerCommunicationAddr?: {
		Id?: string;
		Line1?: string;
		Line2?: string;
		City?: string;
		CountrySubDivisionCode?: string;
		PostalCode?: string;
		Country?: string;
		Lat?: string;
		Long?: string;
	};
	CustomerCommunicationEmailAddr?: {
		Address?: string;
	};
	LegalAddr?: {
		Id?: string;
		Line1?: string;
		Line2?: string;
		City?: string;
		CountrySubDivisionCode?: string;
		PostalCode?: string;
		Country?: string;
		Lat?: string;
		Long?: string;
	};
	PrimaryPhone?: { FreeFormNumber?: string };
	CompanyEmail?: { Address?: string };
	WebAddr?: { URI?: string };
	SupportedLanguages?: string;
	Country?: string;
	Email?: { Address?: string };
	FiscalYearStartMonth?: string;
	CompanyStartDate?: string;
	DefaultTimeZone?: string;
	NameValue?: Array<{
		Name: string;
		Value: string;
	}>;
	MetaData?: {
		CreateTime?: string;
		LastUpdatedTime?: string;
	};
	domain?: string;
	sparse?: boolean;
};

/**
 * Type definition for company info query response
 */
export type CompanyInfoResponse = any & {
	CompanyInfo?: CompanyInfo[];
};

/**
 * Customer entity type definition
 */
export type Customer = {
	Id?: string;
	SyncToken?: string;
	DisplayName: string;
	Title?: string;
	GivenName?: string;
	MiddleName?: string;
	FamilyName?: string;
	Suffix?: string;
	CompanyName?: string;
	Active?: boolean;
	Notes?: string;
	Balance?: number;
	PrimaryEmailAddr?: { Address: string };
	PrimaryPhone?: { FreeFormNumber: string };
	Mobile?: { FreeFormNumber: string };
	WebAddr?: { URI: string };
	BillAddr?: {
		Line1?: string;
		Line2?: string;
		Line3?: string;
		City?: string;
		CountrySubDivisionCode?: string;
		PostalCode?: string;
		Country?: string;
	};
	ShipAddr?: {
		Line1?: string;
		Line2?: string;
		Line3?: string;
		City?: string;
		CountrySubDivisionCode?: string;
		PostalCode?: string;
		Country?: string;
	};
	Taxable?: boolean;
	DefaultTaxCodeRef?: { value: string; name?: string };
	PreferredDeliveryMethod?: string;
};

/**
 * Vendor entity type definition
 */
export type Vendor = {
	Id?: string;
	SyncToken?: string;
	DisplayName: string;
	Title?: string;
	GivenName?: string;
	MiddleName?: string;
	FamilyName?: string;
	Suffix?: string;
	CompanyName?: string;
	Active?: boolean;
	Vendor1099?: boolean;
	Balance?: number;
	AcctNum?: string;
	PrintOnCheckName?: string;
	PrimaryEmailAddr?: { Address: string };
	PrimaryPhone?: { FreeFormNumber: string };
	Mobile?: { FreeFormNumber: string };
	WebAddr?: { URI: string };
	BillAddr?: {
		Line1?: string;
		Line2?: string;
		Line3?: string;
		City?: string;
		CountrySubDivisionCode?: string;
		PostalCode?: string;
		Country?: string;
	};
	TermRef?: { value: string; name?: string };
	TaxIdentifier?: string;
};

/**
 * Purchase entity type definition
 */
export type Purchase = {
	Id?: string;
	SyncToken?: string;
	PaymentType: "Cash" | "Check" | "CreditCard";
	AccountRef: { value: string; name?: string };
	EntityRef?: { value: string; name?: string; type?: string };
	Line: Array<{
		Id?: string;
		DetailType: "AccountBasedExpenseLineDetail" | "ItemBasedExpenseLineDetail";
		Amount: number;
		Description?: string;
		AccountBasedExpenseLineDetail?: {
			AccountRef: { value: string; name?: string };
			TaxCodeRef?: { value: string };
			BillableStatus?: string;
			ClassRef?: { value: string; name?: string };
		};
		ItemBasedExpenseLineDetail?: {
			ItemRef: { value: string; name?: string };
			UnitPrice: number;
			Qty: number;
			TaxCodeRef?: { value: string };
			BillableStatus?: string;
			ClassRef?: { value: string; name?: string };
		};
	}>;
	TxnDate?: string;
	CurrencyRef?: { value: string; name?: string };
	PrivateNote?: string;
	DocNumber?: string;
	TxnTaxDetail?: {
		TotalTax: number;
		TaxLine: Array<{
			Amount: number;
			DetailType: string;
			TaxLineDetail: {
				TaxRateRef: { value: string; name?: string };
				PercentBased?: boolean;
				TaxPercent?: number;
				NetAmountTaxable?: number;
				TaxInclusiveAmount?: number;
			};
		}>;
	};
	Credit?: boolean;
	DepartmentRef?: { value: string; name?: string };
};

/**
 * PurchaseOrder entity type definition
 */
export type PurchaseOrder = {
	Id?: string;
	SyncToken?: string;
	APAccountRef: { value: string; name?: string };
	VendorRef: { value: string; name?: string };
	Line: Array<{
		Id?: string;
		DetailType: "AccountBasedExpenseLineDetail" | "ItemBasedExpenseLineDetail";
		Amount: number;
		Description?: string;
		ItemBasedExpenseLineDetail?: {
			ItemRef: { value: string; name?: string };
			UnitPrice: number;
			Qty: number;
			TaxCodeRef?: { value: string };
			BillableStatus?: string;
			ClassRef?: { value: string; name?: string };
		};
	}>;
	POStatus?: "Open" | "Closed";
	TxnDate?: string;
	CurrencyRef?: { value: string; name?: string };
	PrivateNote?: string;
	Memo?: string;
	DocNumber?: string;
	ShipAddr?: {
		Line1?: string;
		Line2?: string;
		Line3?: string;
		City?: string;
		CountrySubDivisionCode?: string;
		PostalCode?: string;
		Country?: string;
	};
	ShipMethodRef?: { value: string; name?: string };
	EmailStatus?: "NotSet" | "NeedToSend" | "EmailSent";
	POEmail?: { Address: string };
};

/**
 * Account entity type definition
 */
export type Account = {
	Id?: string;
	SyncToken?: string;
	Name: string;
	AccountType: string;
	AccountSubType?: string;
	Active?: boolean;
	Description?: string;
	Classification?: "Asset" | "Liability" | "Equity" | "Revenue" | "Expense";
	CurrentBalance?: number;
	CurrentBalanceWithSubAccounts?: number;
	CurrencyRef?: { value: string; name?: string };
	AcctNum?: string;
	ParentRefType?: string;
	ParentRef?: { value: string; name?: string };
	TaxCodeRef?: { value: string; name?: string };
};

/**
 * Item (Product/Service) entity type definition
 */
export type Item = {
	Id?: string;
	SyncToken?: string;
	Name: string;
	Description?: string;
	Active?: boolean;
	SubItem?: boolean;
	ParentRef?: { value: string; name?: string };
	Level?: number;
	FullyQualifiedName?: string;
	Type: "Inventory" | "Service" | "NonInventory" | "Group";
	Taxable?: boolean;
	SalesTaxIncluded?: boolean;
	UnitPrice?: number;
	RatePercent?: number;
	PurchaseCost?: number;
	ExpenseAccountRef?: { value: string; name?: string };
	PurchaseTaxIncluded?: boolean;
	AssetAccountRef?: { value: string; name?: string };
	TrackQtyOnHand?: boolean;
	QtyOnHand?: number;
	InvStartDate?: string;
	IncomeAccountRef?: { value: string; name?: string };
	ReorderPoint?: number;
	ManPartNum?: string;
};

/**
 * Invoice entity type definition
 */
export type Invoice = {
	Id?: string;
	SyncToken?: string;
	CustomerId?: string;
	CustomerRef: { value: string; name?: string };
	CustomerMemo?: { value: string };
	TxnDate?: string;
	Line: Array<{
		Id?: string;
		LineNum?: number;
		Description?: string;
		Amount: number;
		DetailType:
			| "SalesItemLineDetail"
			| "SubTotalLineDetail"
			| "DiscountLineDetail"
			| "GroupLineDetail";
		SalesItemLineDetail?: {
			ItemRef: { value: string; name?: string };
			TaxCodeRef?: { value: string };
			UnitPrice?: number;
			Qty?: number;
			ServiceDate?: string;
		};
		SubTotalLineDetail?: Record<string, unknown>;
		DiscountLineDetail?: {
			DiscountPercent?: number;
			PercentBased?: boolean;
			DiscountAccountRef?: { value: string; name?: string };
		};
	}>;
	TxnTaxDetail?: {
		TotalTax: number;
		TaxLine: Array<{
			Amount: number;
			DetailType: string;
			TaxLineDetail: {
				TaxRateRef: { value: string; name?: string };
				PercentBased?: boolean;
				TaxPercent?: number;
				NetAmountTaxable?: number;
			};
		}>;
	};
	CurrencyRef?: { value: string; name?: string };
	ExchangeRate?: number;
	ShipAddr?: {
		Id?: string;
		Line1?: string;
		Line2?: string;
		Line3?: string;
		City?: string;
		CountrySubDivisionCode?: string;
		PostalCode?: string;
		Country?: string;
	};
	BillAddr?: {
		Id?: string;
		Line1?: string;
		Line2?: string;
		Line3?: string;
		City?: string;
		CountrySubDivisionCode?: string;
		PostalCode?: string;
		Country?: string;
	};
	DueDate?: string;
	TotalAmt?: number;
	ApplyTaxAfterDiscount?: boolean;
	PrintStatus?: "NotSet" | "NeedToPrint" | "PrintComplete";
	EmailStatus?: "NotSet" | "NeedToSend" | "EmailSent";
	BillEmail?: { Address?: string };
	BillEmailCC?: { Address?: string };
	BillEmailBCC?: { Address?: string };
	Balance?: number;
	DocNumber?: string;
	AllowIPNPayment?: boolean;
	AllowOnlinePayment?: boolean;
	AllowOnlineCreditCardPayment?: boolean;
	AllowOnlineACHPayment?: boolean;
	DeliveryInfo?: {
		DeliveryType?: "Email" | "Print";
		DeliveryTime?: string;
	};
	PrivateNote?: string;
	LinkedTxn?: Array<{
		TxnId: string;
		TxnType: string;
		TxnLineId?: string;
	}>;
};

/**
 * Product entity type definition (alias for Item)
 */
export type Product = Item;
