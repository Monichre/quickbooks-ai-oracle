"use server";

import { z } from "zod";
import { action } from "@/lib/safe-action";
import {
	createEstimate,
	getEstimate,
} from "@/services/intuit/estimate/estimate.api";
import { createPurchase } from "@/services/intuit/purchase/purchase.api";
import type { Estimate } from "@/services/intuit/estimate/estimate.types";

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

export const createEstimateAction = action(estimateSchema, async (data) => {
	try {
		const response = await createEstimate(data as Estimate);
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

const createPOsSchema = z.object({
	estimateId: z.string().min(1, "Estimate ID is required"),
});

export const createPurchaseOrdersFromEstimateAction = action(
	createPOsSchema,
	async ({ estimateId }) => {
		try {
			const estimateResponse = await getEstimate(estimateId);
			const estimate = estimateResponse.Estimate;

			// Group line items by vendor (simplified example)
			const dummyVendorId = "1"; // Just for example

			const purchaseData = {
				VendorRef: { value: dummyVendorId },
				Line: estimate.Line.map((line) => ({
					DetailType: "ItemBasedExpenseLineDetail",
					Amount: line.Amount,
					ItemBasedExpenseLineDetail: {
						ItemRef: line.SalesItemLineDetail?.ItemRef,
						Qty: line.SalesItemLineDetail?.Qty,
						UnitPrice: line.SalesItemLineDetail?.UnitPrice,
					},
				})),
			};

			const response = await createPurchase(purchaseData);

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
	},
);
