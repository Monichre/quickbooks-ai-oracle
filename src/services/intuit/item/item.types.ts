import type { ReferenceType } from "../types";

export interface Item {
	Id: string;
	Name: string;
	Description?: string;
	Active?: boolean;
	FullyQualifiedName?: string;
	Taxable?: boolean;
	UnitPrice?: number;
	Type?: "Inventory" | "NonInventory" | "Service" | "Bundle";
	IncomeAccountRef?: ReferenceType;
	ExpenseAccountRef?: ReferenceType;
	AssetAccountRef?: ReferenceType;
	TrackQtyOnHand?: boolean;
	QtyOnHand?: number;
	InvStartDate?: string;
	PurchaseCost?: number;
	PurchaseDesc?: string;
	MetaData?: {
		CreateTime: string;
		LastUpdatedTime: string;
	};
	SyncToken?: string;
}

export interface ItemQueryResponse {
	QueryResponse: {
		Item: Item[];
		startPosition: number;
		maxResults: number;
		totalCount: number;
	};
	time: string;
}

export interface ItemResponse {
	Item: Item;
	time: string;
}
