import { quickbooksRequest, buildQueryString } from "../api";
import type {
	Estimate,
	EstimateCreateRequest,
	EstimateUpdateRequest,
	EstimateDeleteRequest,
	EstimateQueryParams,
	EstimateQueryResponse,
} from "./estimate.types";

/**
 * Create a new estimate in QuickBooks
 * @param estimate The estimate data to create
 * @returns Promise with the created estimate
 */
export async function createEstimate(
	estimate: EstimateCreateRequest,
): Promise<Estimate> {
	return quickbooksRequest<Estimate, EstimateCreateRequest>(
		"estimate",
		"POST",
		estimate,
	);
}

/**
 * Update an existing estimate in QuickBooks
 * @param estimate The estimate data to update (must include Id and SyncToken)
 * @returns Promise with the updated estimate
 */
export async function updateEstimate(
	estimate: EstimateUpdateRequest,
): Promise<Estimate> {
	return quickbooksRequest<Estimate, EstimateUpdateRequest>(
		"estimate",
		"POST",
		estimate,
	);
}

/**
 * Delete an estimate from QuickBooks
 * @param estimateToDelete The estimate info to delete (must include Id and SyncToken)
 * @returns Promise with the deletion response
 */
export async function deleteEstimate(
	estimateToDelete: EstimateDeleteRequest,
): Promise<{ success: boolean }> {
	const { Id, SyncToken } = estimateToDelete;
	return quickbooksRequest<
		{ success: boolean },
		{ Id: string; SyncToken: string; operation: string }
	>("estimate", "POST", { Id, SyncToken, operation: "delete" });
}

/**
 * Get a specific estimate by ID
 * @param estimateId The ID of the estimate to retrieve
 * @returns Promise with the estimate data
 */
export async function getEstimate(
	estimateId: string,
): Promise<EstimateQueryResponse> {
	return quickbooksRequest<EstimateQueryResponse>(`estimate/${estimateId}`);
}

/**
 * Query estimates with optional filtering parameters
 * @param params Optional query parameters
 * @returns Promise with the estimates query response
 */
export async function findEstimates(
	params: EstimateQueryParams = {},
): Promise<EstimateQueryResponse> {
	const queryString = buildQueryString(params);
	const endpoint = `query?query=select * from Estimate${queryString}`;

	return quickbooksRequest<EstimateQueryResponse>(endpoint);
}
