/**
 * Configuration defaults for Purchase Orders
 */

import type { ReferenceType } from "../types";

/**
 * Gets the default AP Account reference to use for Purchase Orders
 */
export function getDefaultAPAccount(): ReferenceType {
	const apAccountRef: ReferenceType = {
		value: process.env.DEFAULT_AP_ACCOUNT_ID || "",
		name: process.env.DEFAULT_AP_ACCOUNT_NAME || "Accounts Payable",
	};

	if (!apAccountRef.value) {
		throw new Error(
			"DEFAULT_AP_ACCOUNT_ID environment variable is not configured. This is required for Purchase Order creation.",
		);
	}

	return apAccountRef;
}
