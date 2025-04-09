/**
 * Type definitions for QuickBooks Employee API
 */

// Define the common reference type
interface ReferenceType {
	value: string;
	name?: string;
}

/**
 * Interface for Physical Address
 */
export interface PhysicalAddress {
	Id?: string;
	Line1?: string;
	Line2?: string;
	Line3?: string;
	Line4?: string;
	Line5?: string;
	City?: string;
	Country?: string;
	CountrySubDivisionCode?: string;
	PostalCode?: string;
	Note?: string;
	Lat?: string;
	Long?: string;
}

/**
 * Interface for Email Address
 */
export interface EmailAddress {
	Address?: string;
}

/**
 * Interface for Telephone Number
 */
export interface TelephoneNumber {
	FreeFormNumber?: string;
}

/**
 * Interface for ModificationMetaData
 */
export interface ModificationMetaData {
	CreateTime: string;
	LastUpdatedTime: string;
}

/**
 * Interface for the Employee entity
 */
export interface Employee {
	Id?: string;
	SyncToken?: string;
	DisplayName?: string;
	Title?: string;
	GivenName?: string;
	MiddleName?: string;
	FamilyName?: string;
	Suffix?: string;
	PrintOnCheckName?: string;
	Active?: boolean;
	PrimaryAddr?: PhysicalAddress;
	PrimaryEmailAddr?: EmailAddress;
	PrimaryPhone?: TelephoneNumber;
	Mobile?: TelephoneNumber;
	SSN?: string;
	EmployeeNumber?: string;
	BillableTime?: boolean;
	BillRate?: number;
	CostRate?: number;
	BirthDate?: string;
	Gender?: "Male" | "Female" | null;
	HiredDate?: string;
	ReleasedDate?: string;
	Organization?: boolean;
	MetaData?: ModificationMetaData;
	V4IDPseudonym?: string;
}

/**
 * Interface for the Employee create request
 */
export interface EmployeeCreateRequest {
	DisplayName?: string;
	Title?: string;
	GivenName?: string;
	MiddleName?: string;
	FamilyName?: string;
	Suffix?: string;
	PrintOnCheckName?: string;
	Active?: boolean;
	PrimaryAddr?: PhysicalAddress;
	PrimaryEmailAddr?: EmailAddress;
	PrimaryPhone?: TelephoneNumber;
	Mobile?: TelephoneNumber;
	SSN?: string;
	EmployeeNumber?: string;
	BillableTime?: boolean;
	BillRate?: number;
	CostRate?: number;
	BirthDate?: string;
	Gender?: "Male" | "Female";
	HiredDate?: string;
	ReleasedDate?: string;
	Organization?: boolean;
}

/**
 * Interface for the Employee update request
 */
export interface EmployeeUpdateRequest extends EmployeeCreateRequest {
	Id: string;
	SyncToken: string;
}

/**
 * Interface for the Employee delete request (deactivation)
 */
export interface EmployeeDeleteRequest {
	Id: string;
	SyncToken: string;
}

/**
 * Interface for the Employee query parameters
 */
export interface EmployeeQueryParams {
	limit?: number;
	offset?: number;
	asc?: string;
	desc?: string;
	DisplayName?: string;
	GivenName?: string;
	FamilyName?: string;
	Active?: boolean;
	[key: string]: string | number | boolean | undefined;
}

/**
 * Interface for the Employee query response
 */
export interface EmployeeQueryResponse {
	QueryResponse: {
		Employee?: Employee[];
		startPosition?: number;
		maxResults?: number;
		totalCount?: number;
	};
	time?: string;
}
