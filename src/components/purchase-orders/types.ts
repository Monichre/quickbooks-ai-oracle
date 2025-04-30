import { z } from "zod";

export const purchaseOrderSchema = z.object({
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

export type PurchaseOrderFormData = z.infer<typeof purchaseOrderSchema>;
