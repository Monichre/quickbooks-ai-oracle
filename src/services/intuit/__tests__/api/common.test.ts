import { buildQueryString } from "../../_common/build-query-string";
import { quickbooksRequest } from "../../_common/quickbooks-request";
import { refreshTokensIfNeeded } from "../../auth/auth";

// Mock the auth module
jest.mock("../../auth", () => ({
	refreshTokensIfNeeded: jest.fn().mockResolvedValue({
		access_token: "mock-access-token",
		refresh_token: "mock-refresh-token",
		expires_in: 3600,
		x_refresh_token_expires_in: 8726400,
		token_type: "bearer",
		createdAt: Date.now(),
	}),
}));

// Mock fetch
global.fetch = jest.fn();

describe("Common Utilities", () => {
	describe("buildQueryString", () => {
		test("should return empty string for empty params", () => {
			expect(buildQueryString({})).toBe("");
		});

		test("should build WHERE clause with single condition", () => {
			expect(buildQueryString({ Active: "true" })).toBe(
				" WHERE Active = 'true'",
			);
		});

		test("should build WHERE clause with multiple conditions", () => {
			expect(buildQueryString({ Active: "true", Name: "Test" })).toBe(
				" WHERE Active = 'true' AND Name = 'Test'",
			);
		});

		test("should handle pagination parameters", () => {
			expect(buildQueryString({ limit: 10, offset: 5 })).toBe(
				" MAXRESULTS 10 STARTPOSITION 5",
			);
		});

		test("should handle sorting parameters", () => {
			expect(buildQueryString({ asc: "Name" })).toBe(" ORDERBY Name ASC");
			expect(buildQueryString({ desc: "Id" })).toBe(" ORDERBY Id DESC");
		});

		test("should combine conditions, sorting and pagination", () => {
			expect(
				buildQueryString({
					Active: "true",
					desc: "Name",
					limit: 20,
					offset: 10,
				}),
			).toBe(
				" WHERE Active = 'true' ORDERBY Name DESC MAXRESULTS 20 STARTPOSITION 10",
			);
		});

		test("should ignore undefined values", () => {
			expect(
				buildQueryString({
					Active: "true",
					Inactive: undefined,
				}),
			).toBe(" WHERE Active = 'true'");
		});
	});

	describe("quickbooksRequest", () => {
		beforeEach(() => {
			jest.clearAllMocks();
			// Set up environment variables for testing
			process.env.INTUIT_API_BASE_URL =
				"https://sandbox-quickbooks.api.intuit.com";
			process.env.NEXT_PUBLIC_INTUIT_API_BASE_URL =
				"https://sandbox-quickbooks.api.intuit.com";
			process.env.INTUIT_COMPANY_ID = "test-company-id";
			process.env.QB_ENVIRONMENT = "sandbox";
		});

		test("should make a GET request to the QuickBooks API", async () => {
			// Set up successful response mock
			const mockData = { Account: { Id: "123", Name: "Test Account" } };
			global.fetch = jest.fn().mockResolvedValue({
				ok: true,
				json: jest.fn().mockResolvedValue(mockData),
			});

			const result = await quickbooksRequest("account/123");

			expect(refreshTokensIfNeeded).toHaveBeenCalled();
			expect(global.fetch).toHaveBeenCalledWith(
				"https://sandbox-quickbooks.api.intuit.com/v3/company/test-company-id/account/123",
				expect.objectContaining({
					method: "GET",
					headers: expect.objectContaining({
						Authorization: "Bearer mock-access-token",
						Accept: "application/json",
						"Content-Type": "application/json",
					}),
				}),
			);
			expect(result).toEqual(mockData);
		});

		test("should make a POST request with data", async () => {
			const mockData = { Account: { Id: "123", Name: "Created Account" } };
			const postData = { Account: { Name: "New Account" } };

			global.fetch = jest.fn().mockResolvedValue({
				ok: true,
				json: jest.fn().mockResolvedValue(mockData),
			});

			const result = await quickbooksRequest("account", "POST", postData);

			expect(global.fetch).toHaveBeenCalledWith(
				"https://sandbox-quickbooks.api.intuit.com/v3/company/test-company-id/account",
				expect.objectContaining({
					method: "POST",
					headers: expect.objectContaining({
						Authorization: "Bearer mock-access-token",
						Accept: "application/json",
						"Content-Type": "application/json",
					}),
					body: JSON.stringify(postData),
				}),
			);
			expect(result).toEqual(mockData);
		});

		test("should throw an error when the request fails", async () => {
			const errorData = {
				Fault: {
					Error: [
						{
							Message: "Invalid entity",
							code: "400",
						},
					],
				},
			};

			global.fetch = jest.fn().mockResolvedValue({
				ok: false,
				status: 400,
				statusText: "Bad Request",
				json: jest.fn().mockResolvedValue(errorData),
				headers: {
					entries: () => [],
				},
			});

			await expect(quickbooksRequest("account", "POST", {})).rejects.toThrow(
				"QuickBooks API error: 400 Bad Request",
			);
		});

		test("should throw an error when QuickBooks authentication fails", async () => {
			// Mock the auth module to return null (not authenticated)
			(refreshTokensIfNeeded as jest.Mock).mockResolvedValueOnce(null);

			await expect(quickbooksRequest("account/123")).rejects.toThrow(
				"Not authenticated with QuickBooks",
			);
		});
	});
});
