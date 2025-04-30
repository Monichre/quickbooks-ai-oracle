// src/config/quickbooks.ts
const {
	INTUIT_COMPANY_ID,
	NEXT_PUBLIC_INTUIT_API_BASE_URL,
	QB_ENVIRONMENT = "sandbox",
} = process.env;
if (!INTUIT_COMPANY_ID || !NEXT_PUBLIC_INTUIT_API_BASE_URL) {
	throw new Error(
		"Missing QuickBooks config: set INTUIT_COMPANY_ID & NEXT_PUBLIC_INTUIT_API_BASE_URL",
	);
}
export const quickbooksConfig = {
	environment: QB_ENVIRONMENT,
	companyId: process.env.INTUIT_COMPANY_ID,
	apiRoot: `${process.env.NEXT_PUBLIC_INTUIT_API_BASE_URL}/v3/company/${process.env.INTUIT_COMPANY_ID}`,
};
