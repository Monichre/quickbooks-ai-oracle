"use server";

import { z } from "zod";
import { action } from "@/lib/safe-action";
import {
	createCustomer,
	updateCustomer,
} from "@/services/intuit/customer/customer.api";
import type { Customer } from "@/services/intuit/types";

// Schema for customer creation/update
const customerSchema = z.object({
	DisplayName: z.string().min(1, "Display name is required"),
	GivenName: z.string().optional(),
	FamilyName: z.string().optional(),
	CompanyName: z.string().optional(),
	PrimaryEmailAddr: z
		.object({
			Address: z.string().email("Invalid email").optional(),
		})
		.optional(),
	PrimaryPhone: z
		.object({
			FreeFormNumber: z.string().optional(),
		})
		.optional(),
	BillAddr: z
		.object({
			Line1: z.string().optional(),
			City: z.string().optional(),
			CountrySubDivisionCode: z.string().optional(),
			PostalCode: z.string().optional(),
			Country: z.string().optional(),
		})
		.optional(),
	Id: z.string().optional(),
	SyncToken: z.string().optional(),
});

export const createCustomerAction = action(customerSchema, async (data) => {
	try {
		// If Id and SyncToken are present, we're updating
		if (data.Id && data.SyncToken) {
			const response = await updateCustomer(
				data as Customer & { Id: string; SyncToken: string },
			);
			return { success: true, data: response };
		} else {
			// Otherwise, creating new
			const response = await createCustomer(data as Customer);
			return { success: true, data: response };
		}
	} catch (error) {
		console.error("Failed to handle customer:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to handle customer",
		};
	}
});
