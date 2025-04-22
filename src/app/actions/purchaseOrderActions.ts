"use server";

import { z } from "zod";
import { action } from "@/lib/safe-action";
import {
	createPurchase,
	updatePurchase,
} from "@/services/intuit/purchase/purchase.api";
import type { Purchase } from "@/services/intuit/types";

// Schema for purchase order creation/update
const purchaseOrderSchema = z.object({
	VendorRef: z.object({
		value: z.string().min(1, "Vendor is required"),
	}),
	Line: z
		.array(
			z.object({
				DetailType: z.literal("ItemBasedExpenseLineDetail"),
				Amount: z.number().min(0),
				ItemBasedExpenseLineDetail: z.object({
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
	PaymentType: z.enum(["Cash", "Check", "CreditCard"]),
	PrivateNote: z.string().optional(),
	Id: z.string().optional(),
	SyncToken: z.string().optional(),
});

export const createPurchaseOrderAction = action(
	purchaseOrderSchema,
	async (data) => {
		try {
			// If Id and SyncToken are present, we're updating
			if (data.Id && data.SyncToken) {
				const response = await updatePurchase(
					data as Purchase & { Id: string; SyncToken: string },
				);
				return { success: true, data: response };
			} else {
				// Otherwise, creating new
				const response = await createPurchase(data as Purchase);
				return { success: true, data: response };
			}
		} catch (error) {
			console.error("Failed to handle purchase order:", error);
			return {
				success: false,
				error:
					error instanceof Error
						? error.message
						: "Failed to handle purchase order",
			};
		}
	},
);
