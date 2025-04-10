import {
	findAccounts,
	findCustomers,
	findVendors,
	findInvoices,
	findItems,
	findProducts,
	findPurchases,
	findPurchaseOrders,
	findEstimates,
	findPayments,
	findEmployees,
	findBills,
	getAccountListDetail,
	getProfitAndLossReport,
} from "@/services/intuit/api";
import type { EntityType } from "@/services/intuit/types";
import { notFound } from "next/navigation";
type ApiFunction = (params?: {
	limit?: number;
	[key: string]: any;
}) => Promise<any>;

export const entityApiFunctionMap: Record<EntityType, ApiFunction> = {
	accounts: findAccounts,
	customers: findCustomers,
	vendors: findVendors,
	invoices: findInvoices,
	items: findItems,
	products: findProducts,
	purchases: findPurchases,
	"purchase-orders": findPurchaseOrders,
	estimates: findEstimates,
	payments: findPayments,
	employees: findEmployees,
	bills: findBills,
	"account-list-detail": getAccountListDetail,
	"profit-and-loss": getProfitAndLossReport,
};

// Server Component to handle data fetching
export async function fetchEntityData(entity: string) {
	if (!entity || !entityApiFunctionMap[entity as EntityType]) {
		return notFound();
	}

	try {
		// Call the appropriate API function with default parameters
		const response: any = await entityApiFunctionMap[entity as EntityType]({
			limit: 100,
		});

		console.log("🚀 ~ fetchEntityData ~ response:", response);

		// Convert entity string to capitalized singular form for accessing QueryResponse
		const capitalizedEntity = entity
			.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
			.replace(/s$/, "")
			.replace(/^[a-z]/, (c) => c.toUpperCase());

		// Most API responses have a QueryResponse property containing the actual data
		// Try to access the data using QueryResponse[CapitalEntityKey] pattern
		if (
			response.QueryResponse &&
			Object.prototype.hasOwnProperty.call(
				response.QueryResponse,
				capitalizedEntity,
			)
		) {
			return response.QueryResponse[capitalizedEntity];
		}

		// Fallback to the entire QueryResponse or response if specific key not found
		return response.QueryResponse || response;
	} catch (error) {
		console.error(`Error fetching ${entity} data:`, error);
		throw new Error(
			`Failed to fetch ${entity} data: ${(error as Error).message}`,
		);
	}
}
