import { quickbooksRequest } from "../api";
import { buildQueryString } from "../api";
import type { Invoice, QueryParams } from "../types";

/**
 * Creates a new invoice in QuickBooks
 * @param invoiceData - Invoice data to create
 * @returns Promise with the created invoice
 */
export async function createInvoice(invoiceData: Invoice) {
	return quickbooksRequest<{ Invoice: Invoice }, { Invoice: Invoice }>(
		"invoice",
		"POST",
		{ Invoice: invoiceData },
	);
}

/**
 * Retrieves an invoice by ID from QuickBooks
 * @param invoiceId - ID of the invoice to retrieve
 * @returns Promise with the invoice data
 */
export async function getInvoice(invoiceId: string) {
	return quickbooksRequest<{ Invoice: Invoice }>(`invoice/${invoiceId}`);
}

/**
 * Queries invoices in QuickBooks with optional filters
 * @param params - Query parameters and filters
 * @returns Promise with the list of invoices matching the query
 */
export async function findInvoices(params: QueryParams = {}) {
	const queryString = buildQueryString(params);
	return quickbooksRequest<{ QueryResponse: { Invoice: Invoice[] } }>(
		`query?query=select * from Invoice${queryString}`,
	);
}

/**
 * Updates an existing invoice in QuickBooks
 * @param invoiceData - Invoice data with Id and SyncToken
 * @returns Promise with the updated invoice
 */
export async function updateInvoice(
	invoiceData: Invoice & { Id: string; SyncToken: string },
) {
	return quickbooksRequest<{ Invoice: Invoice }, { Invoice: Invoice }>(
		"invoice",
		"POST",
		{ Invoice: invoiceData },
	);
}

/**
 * Deletes an invoice in QuickBooks
 * @param invoiceId - ID of the invoice to delete
 * @param syncToken - SyncToken of the invoice to delete
 * @returns Promise with the deletion result
 */
export async function deleteInvoice(invoiceId: string, syncToken: string) {
	return quickbooksRequest<
		{ Invoice: Invoice },
		{ Id: string; SyncToken: string }
	>("invoice?operation=delete", "POST", {
		Id: invoiceId,
		SyncToken: syncToken,
	});
}

/**
 * Retrieves an invoice as PDF from QuickBooks
 * @param invoiceId - ID of the invoice to retrieve as PDF
 * @returns Promise with the invoice PDF data
 */
export async function getInvoicePdf(invoiceId: string) {
	return quickbooksRequest<Blob>(`invoice/${invoiceId}/pdf`, "GET");
}

/**
 * Sends an invoice via email
 * @param invoiceId - ID of the invoice to send
 * @param email - Optional email address to send to (if different from customer's email)
 * @returns Promise with the send result
 */
export async function sendInvoicePdf(invoiceId: string, email?: string) {
	const endpoint = email
		? `invoice/${invoiceId}/send?sendTo=${email}`
		: `invoice/${invoiceId}/send`;

	return quickbooksRequest<{ Invoice: Invoice }>(endpoint, "POST");
}
