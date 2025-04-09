import { quickbooksRequest, buildQueryString } from "../api";
import type {
	Payment,
	PaymentCreateRequest,
	PaymentUpdateRequest,
	PaymentDeleteRequest,
	PaymentQueryParams,
	PaymentQueryResponse,
} from "./payment.types";

/**
 * Create a new payment in QuickBooks
 * @param payment The payment data to create
 * @returns Promise with the created payment
 */
export async function createPayment(
	payment: PaymentCreateRequest,
): Promise<Payment> {
	return quickbooksRequest<Payment, { Payment: PaymentCreateRequest }>(
		"payment",
		"POST",
		{
			Payment: payment,
		},
	);
}

/**
 * Update an existing payment in QuickBooks
 * @param payment The payment data to update (must include Id and SyncToken)
 * @returns Promise with the updated payment
 */
export async function updatePayment(
	payment: PaymentUpdateRequest,
): Promise<Payment> {
	return quickbooksRequest<Payment, { Payment: PaymentUpdateRequest }>(
		"payment",
		"POST",
		{
			Payment: payment,
		},
	);
}

/**
 * Delete a payment from QuickBooks
 * @param paymentToDelete The payment info to delete (must include Id and SyncToken)
 * @returns Promise with the deletion response
 */
export async function deletePayment(
	paymentToDelete: PaymentDeleteRequest,
): Promise<{ success: boolean }> {
	const { Id, SyncToken } = paymentToDelete;
	return quickbooksRequest<
		{ success: boolean },
		{ Id: string; SyncToken: string; operation: string }
	>("payment?operation=delete", "POST", { Id, SyncToken, operation: "delete" });
}

/**
 * Void a payment in QuickBooks
 * @param paymentToVoid The payment info to void (must include Id and SyncToken)
 * @returns Promise with the void response
 */
export async function voidPayment(
	paymentToVoid: PaymentDeleteRequest,
): Promise<{ success: boolean }> {
	const { Id, SyncToken } = paymentToVoid;
	return quickbooksRequest<
		{ success: boolean },
		{ Id: string; SyncToken: string; operation: string }
	>("payment?operation=void", "POST", { Id, SyncToken, operation: "void" });
}

/**
 * Get a specific payment by ID
 * @param paymentId The ID of the payment to retrieve
 * @returns Promise with the payment data
 */
export async function getPayment(
	paymentId: string,
): Promise<{ Payment: Payment }> {
	return quickbooksRequest<{ Payment: Payment }>(`payment/${paymentId}`);
}

/**
 * Query payments with optional filtering parameters
 * @param params Optional query parameters
 * @returns Promise with the payments query response
 */
export async function findPayments(
	params: PaymentQueryParams = {},
): Promise<PaymentQueryResponse> {
	const queryString = buildQueryString(params);
	const endpoint = `query?query=select * from Payment${queryString}`;

	return quickbooksRequest<PaymentQueryResponse>(endpoint);
}
