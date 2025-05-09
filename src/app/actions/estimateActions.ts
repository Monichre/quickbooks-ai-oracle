"use server";

import { z } from "zod";
import { action } from "@/lib/safe-action";
import {
	createEstimate,
	getEstimate,
	updateEstimate,
} from "@/services/intuit/estimate/estimate.api";
import { createPurchaseOrder } from "@/services/intuit/purchase-order/purchase-order.api";
import { findAccounts } from "@/services/intuit/account/account.api";
import type {
	Estimate,
	EstimateQueryResponse,
	EstimateUpdateRequest,
} from "@/services/intuit/estimate/estimate.types";
import type { PurchaseOrder } from "@/services/intuit/types";
import { QuickbooksApiError } from "@/services/intuit/_common/quickbooks-errors";
// Define ReferenceType interface here since it's not exported from the right module
interface ReferenceType {
	value: string;
	name?: string;
}

// Schema for estimate creation validation
const estimateSchema = z.object({
	CustomerRef: z.object({
		value: z.string().min(1, "Customer is required"),
	}),
	Line: z
		.array(
			z.object({
				DetailType: z.literal("SalesItemLineDetail"),
				Amount: z.number().min(0),
				SalesItemLineDetail: z.object({
					ItemRef: z.object({
						value: z.string().min(1, "Item is required"),
						name: z.string().optional(),
					}),
					UnitPrice: z.number().min(0),
					Qty: z.number().min(1),
				}),
			}),
		)
		.min(1, "At least one line item is required"),
	DocNumber: z.string().optional(),
	TxnDate: z.string().optional(),
	PrivateNote: z.string().optional(),
	Id: z.string().optional(),
	SyncToken: z.string().optional(),
});

export const createEstimateAction = action
	.schema(estimateSchema)
	.action(async ({ parsedInput }) => {
		try {
			const response = await createEstimate(parsedInput as Estimate);
			return { success: true, data: response };
		} catch (error) {
			console.error("Failed to create estimate:", error);
			return {
				success: false,
				error:
					error instanceof Error ? error.message : "Failed to create estimate",
			};
		}
	});

// Schema for estimate update validation
const updateEstimateSchema = z.object({
	CustomerRef: z.object({
		value: z.string().min(1, "Customer is required"),
	}),
	Line: z
		.array(
			z.object({
				DetailType: z.literal("SalesItemLineDetail"),
				Amount: z.number().min(0),
				SalesItemLineDetail: z.object({
					ItemRef: z.object({
						value: z.string().min(1, "Item is required"),
						name: z.string().optional(),
					}),
					UnitPrice: z.number().min(0),
					Qty: z.number().min(1),
				}),
			}),
		)
		.min(1, "At least one line item is required"),
	DocNumber: z.string().optional(),
	TxnDate: z.string().optional(),
	PrivateNote: z.string().optional(),
	Id: z.string().min(1, "Estimate ID is required"),
	SyncToken: z.string().min(1, "SyncToken is required"),
});

/**
 * Action to update an estimate with retry logic for concurrent user errors
 */
export const updateEstimateAction = action
	.schema(updateEstimateSchema)
	.action(async ({ parsedInput }) => {
		let retryCount = 0;
		const MAX_RETRIES = 3;

		// Function to handle the update with retry logic
		const tryUpdateWithRetry = async (
			estimateData: EstimateUpdateRequest,
		): Promise<{ success: boolean; data?: Estimate; error?: string }> => {
			try {
				const response = await updateEstimate(estimateData);
				return { success: true, ...response };
			} catch (error) {
				// Check if it's a concurrent user error (code 5010)
				if (
					error instanceof QuickbooksApiError &&
					typeof error.apiError === "object" &&
					error.apiError &&
					"Fault" in (error.apiError as Record<string, unknown>) &&
					(error.apiError as { Fault: { Error: Array<{ code: string }> } })
						.Fault.Error?.[0]?.code === "5010"
				) {
					// If we've already retried too many times, return error
					if (retryCount >= MAX_RETRIES) {
						return {
							success: false,
							error: "Maximum retry attempts reached. Please try again later.",
						};
					}

					retryCount++;
					console.log(
						`Detected concurrent update error. Retry attempt ${retryCount}...`,
					);

					try {
						// Get the latest estimate with fresh SyncToken
						const latestEstimateResponse = await getEstimate(estimateData.Id);
						// Extract the estimate from the response
						const latestEstimate =
							latestEstimateResponse.Estimate ||
							latestEstimateResponse.QueryResponse?.Estimate?.[0];

						if (!latestEstimate) {
							throw new Error("Failed to fetch the latest estimate version");
						}

						// Merge the updates with the latest version (keeping the user's changes but using the new SyncToken)
						const updatedEstimateData: EstimateUpdateRequest = {
							...estimateData,
							SyncToken: latestEstimate.SyncToken,
						};

						// Retry the update with the fresh SyncToken
						return tryUpdateWithRetry(updatedEstimateData);
					} catch (refreshError) {
						console.error("Error refreshing estimate data:", refreshError);
						return {
							success: false,
							error:
								refreshError instanceof Error
									? refreshError.message
									: "Failed to refresh estimate data",
						};
					}
				}

				// For other errors, return the error message
				console.error("Failed to update estimate:", error);
				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to update estimate",
				};
			}
		};

		// Start the update process with retry logic
		return tryUpdateWithRetry(parsedInput as EstimateUpdateRequest);
	});

const createPOsSchema = z.object({
	estimateId: z.string().min(1, "Estimate ID is required"),
});

export const createPurchaseOrdersFromEstimateAction = action
	.schema(createPOsSchema)
	.action(async ({ parsedInput }) => {
		console.log("🚀 ~ .action ~ parsedInput:", parsedInput);

		try {
			// 1. Fetch all accounts to find an Accounts Payable account
			const accountsResponse = await findAccounts({
				Name: "Accounts Payable (A/P)",
			});

			console.log("🚀 ~ Accounts:", accountsResponse);

			// Find an AP account to use
			const apAccounts = accountsResponse.QueryResponse?.Account || [];

			if (apAccounts.length === 0) {
				throw new Error(
					"Accounts Payable (A/P) account not found in QuickBooks. Please verify your chart of accounts.",
				);
			}

			// Use the first AP account found (should be the only one with this name)
			const apAccount = apAccounts[0];
			const apAccountRef: ReferenceType = {
				value: apAccount.Id,
				name: apAccount.Name,
			};

			// 2. Get the estimate data
			const estimateResponse = await getEstimate(parsedInput.estimateId);
			console.log("🚀 ~ .action ~ estimateResponse:", estimateResponse);

			// Get the estimate from the response - now handling both response formats
			// Fixed with optional chaining as per linter suggestion
			const estimate =
				estimateResponse.Estimate ||
				estimateResponse.QueryResponse?.Estimate?.[0];

			if (!estimate) {
				throw new Error("Estimate not found");
			}

			// Group line items by vendor (simplified example)
			const dummyVendorId = "1";

			const purchaseOrderData: PurchaseOrder = {
				VendorRef: { value: dummyVendorId },
				APAccountRef: apAccountRef,
				Line: estimate.Line.map((line) => ({
					DetailType: "ItemBasedExpenseLineDetail",
					Amount: line.Amount,
					ItemBasedExpenseLineDetail: {
						ItemRef: line.SalesItemLineDetail?.ItemRef,
						Qty: line.SalesItemLineDetail?.Qty || 1,
						UnitPrice: line.SalesItemLineDetail?.UnitPrice || 0,
					},
				})),
			};

			const response = await createPurchaseOrder(purchaseOrderData);

			return {
				success: true,
				data: response,
			};
		} catch (error) {
			console.error("Failed to create purchase orders:", error);
			return {
				success: false,
				error:
					error instanceof Error
						? error.message
						: "Failed to create purchase orders",
			};
		}
	});
