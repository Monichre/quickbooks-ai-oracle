import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages } = await req.json();

	const result = streamText({
		model: openai("gpt-4o"),
		messages,
		tools: {
			// QuickBooks Tools
			queryQuickbooksCustomers: {
				description: "Query customers from Quickbooks",
				parameters: z.object({
					limit: z
						.number()
						.optional()
						.describe("Maximum number of customers to return"),
					active: z.boolean().optional().describe("Filter by active status"),
					searchTerm: z
						.string()
						.optional()
						.describe("Search term to filter customers"),
				}),
				execute: async ({
					limit = 10,
					active,
					searchTerm,
				}: {
					limit?: number;
					active?: boolean;
					searchTerm?: string;
				}) => {
					// Implement actual QuickBooks API integration here
					// This is a placeholder implementation
					console.log("Querying QuickBooks customers:", {
						limit,
						active,
						searchTerm,
					});
					return {
						success: true,
						data: [
							{
								id: "1",
								name: "Acme Corp",
								email: "contact@acme.com",
								active: true,
							},
							{
								id: "2",
								name: "Globex Inc",
								email: "info@globex.com",
								active: true,
							},
						],
					};
				},
			},

			queryQuickbooksInvoices: {
				description: "Query invoices from Quickbooks",
				parameters: z.object({
					limit: z
						.number()
						.optional()
						.describe("Maximum number of invoices to return"),
					status: z
						.enum(["paid", "unpaid", "overdue", "all"])
						.optional()
						.describe("Filter by invoice status"),
					customerId: z.string().optional().describe("Filter by customer ID"),
				}),
				execute: async ({
					limit = 10,
					status,
					customerId,
				}: {
					limit?: number;
					status?: "paid" | "unpaid" | "overdue" | "all";
					customerId?: string;
				}) => {
					// Implement actual QuickBooks API integration here
					console.log("Querying QuickBooks invoices:", {
						limit,
						status,
						customerId,
					});
					return {
						success: true,
						data: [
							{
								id: "inv001",
								customerId: "1",
								amount: 1200.0,
								status: "paid",
								date: "2023-05-15",
							},
							{
								id: "inv002",
								customerId: "2",
								amount: 850.5,
								status: "unpaid",
								date: "2023-06-01",
							},
						],
					};
				},
			},

			queryQuickbooksItems: {
				description: "Query items/products from Quickbooks",
				parameters: z.object({
					limit: z
						.number()
						.optional()
						.describe("Maximum number of items to return"),
					active: z.boolean().optional().describe("Filter by active status"),
					searchTerm: z
						.string()
						.optional()
						.describe("Search term to filter items"),
				}),
				execute: async ({
					limit = 10,
					active,
					searchTerm,
				}: {
					limit?: number;
					active?: boolean;
					searchTerm?: string;
				}) => {
					// Implement actual QuickBooks API integration here
					console.log("Querying QuickBooks items:", {
						limit,
						active,
						searchTerm,
					});
					return {
						success: true,
						data: [
							{ id: "item001", name: "Product A", price: 99.99, active: true },
							{ id: "item002", name: "Service B", price: 149.99, active: true },
						],
					};
				},
			},

			// Sage Tools
			querySageProducts: {
				description: "Query products from Sage",
				parameters: z.object({
					categories: z
						.string()
						.optional()
						.describe("Product categories to filter by"),
					searchTerm: z
						.string()
						.optional()
						.describe("Search term to filter products"),
				}),
				execute: async ({
					categories,
					searchTerm,
				}: {
					categories?: string;
					searchTerm?: string;
				}) => {
					// Implement actual Sage API integration
					// This would use the format shown in sage-products.mdc
					console.log("Querying Sage products:", { categories, searchTerm });

					// Mock response data
					return {
						success: true,
						data: [
							{
								productId: 1578894,
								name: "LED Flashlight",
								category: "Flashlights",
								price: 24.99,
							},
							{
								productId: 1578895,
								name: "Tactical Flashlight",
								category: "Flashlights",
								price: 49.99,
							},
						],
					};
				},
			},

			querySageInventory: {
				description: "Query inventory from Sage",
				parameters: z.object({
					productId: z.number().describe("Product ID to check inventory for"),
				}),
				execute: async ({ productId }: { productId: number }) => {
					// Implement actual Sage API integration
					// This would use the format shown in sage-products.mdc
					console.log("Querying Sage inventory:", { productId });

					// Mock response data
					return {
						success: true,
						data: {
							productId: productId,
							quantityAvailable: 42,
							lastUpdated: new Date().toISOString(),
							warehouseLocation: "Main Warehouse",
						},
					};
				},
			},
		},
	});

	return result.toDataStreamResponse();
}
