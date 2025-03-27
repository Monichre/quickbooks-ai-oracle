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
export type CompanyInfoResponse = {
	QueryResponse: {
		CompanyInfo: CompanyInfo[];
		maxResults: number;
	};
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
