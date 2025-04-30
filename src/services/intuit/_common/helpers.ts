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
import type { EntityType, QueryParams } from "@/services/intuit/types";
import { notFound } from "next/navigation";

// Modified to accept any response type that can be treated as a record
export type ApiFunction = (params?: QueryParams) => Promise<unknown>;

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
export async function fetchEntityData(
	entity: string,
	searchParams?: Record<string, unknown>,
) {
	if (!entity || !entityApiFunctionMap[entity as EntityType]) {
		return notFound();
	}

	try {
		// Call the appropriate API function with default parameters
		const response = await entityApiFunctionMap[entity as EntityType]({
			limit: 100,
			...(searchParams || {}),
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
			response &&
			typeof response === "object" &&
			"QueryResponse" in response &&
			response.QueryResponse &&
			typeof response.QueryResponse === "object" &&
			Object.prototype.hasOwnProperty.call(
				response.QueryResponse,
				capitalizedEntity,
			)
		) {
			return (response.QueryResponse as Record<string, unknown>)[
				capitalizedEntity
			];
		}

		// Fallback to the entire QueryResponse or response if specific key not found
		return response &&
			typeof response === "object" &&
			"QueryResponse" in response
			? response.QueryResponse
			: response;
	} catch (error) {
		console.error(`Error fetching ${entity} data:`, error);
		throw new Error(
			`Failed to fetch ${entity} data: ${(error as Error).message}`,
		);
	}
}

// Helper function to fetch entity data by ID
export async function fetchEntityById(
	entity: string,
	id: string,
	params?: Record<string, unknown>,
) {
	if (!entity || !entityApiFunctionMap[entity as EntityType]) {
		return notFound();
	}

	try {
		// Use the existing API function with an ID parameter
		const response = await entityApiFunctionMap[entity as EntityType]({
			id,
			...(params || {}),
		});

		// Convert entity string to capitalized singular form for accessing QueryResponse
		const capitalizedEntity = entity
			.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
			.replace(/s$/, "")
			.replace(/^[a-z]/, (c) => c.toUpperCase());

		// Handle QueryResponse pattern similar to fetchEntityData
		const queryResponse =
			response && typeof response === "object" && "QueryResponse" in response
				? response.QueryResponse
				: response;

		if (
			queryResponse &&
			typeof queryResponse === "object" &&
			Object.prototype.hasOwnProperty.call(queryResponse, capitalizedEntity)
		) {
			// For a single entity, we expect an array with one item
			const data = (queryResponse as Record<string, unknown>)[
				capitalizedEntity
			];
			// If it's an array with one item, return that item
			if (Array.isArray(data) && data.length === 1) {
				return data[0];
			}
			// Otherwise return the entire data
			return data;
		}

		// Fallback to the entire response if specific key not found
		return queryResponse;
	} catch (error) {
		console.error(`Error fetching ${entity} detail for ID ${id}:`, error);
		throw new Error(
			`Failed to fetch ${entity} detail: ${(error as Error).message}`,
		);
	}
}
