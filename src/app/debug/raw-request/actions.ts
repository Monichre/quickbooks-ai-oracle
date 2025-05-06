"use server";

import { refreshTokensIfNeeded } from "@/services/intuit/auth";
import { quickbooksRequest } from "@/services/intuit/_common/quickbooks-request";

export async function makeRawRequest(
	endpoint: string,
	method: string,
	data?: any,
) {
	console.log(
		`Making raw QuickBooks API request to ${endpoint} with method ${method}`,
	);

	try {
		// Ensure we have fresh tokens
		console.log("Refreshing tokens if needed before request");
		const tokens = await refreshTokensIfNeeded();

		if (!tokens) {
			throw new Error("Not authenticated with QuickBooks");
		}

		// Log request details
		console.log("Raw request endpoint:", endpoint);
		console.log("Raw request method:", method);

		if (data) {
			console.log("Raw request payload summary:", {
				payloadKeys: Object.keys(data),
				payloadSize: JSON.stringify(data).length,
				firstLevelSample: Object.entries(data)
					.slice(0, 3)
					.map(([k, v]) => `${k}: ${typeof v}`),
			});
		}

		// Execute the request with detailed error handling
		try {
			const response = await quickbooksRequest(endpoint, method as any, data);
			console.log("Raw request successful");
			return {
				success: true,
				data: response,
			};
		} catch (requestError) {
			console.error("QuickBooks request error:", requestError);

			// Extract detailed error information
			const errorDetails = {
				message: requestError.message,
				cause: requestError.cause,
				stack: requestError.stack,
			};

			return {
				success: false,
				error: errorDetails,
			};
		}
	} catch (error) {
		console.error("Error in makeRawRequest:", error);
		throw error;
	}
}
