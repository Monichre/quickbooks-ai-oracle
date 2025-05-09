import { renderEstimatePdf } from "../estimate-pdf";
import { Estimate } from "../../types";
import { chromium } from "@playwright/test";

// Mock Playwright
jest.mock("@playwright/test", () => {
	const mockPdfBuffer = Buffer.from("Mock PDF content");

	// Mock page implementation
	const mockPage = {
		setContent: jest.fn().mockResolvedValue(undefined),
		pdf: jest.fn().mockResolvedValue(mockPdfBuffer),
		close: jest.fn().mockResolvedValue(undefined),
	};

	// Mock browser implementation
	const mockBrowser = {
		newPage: jest.fn().mockResolvedValue(mockPage),
		close: jest.fn().mockResolvedValue(undefined),
	};

	return {
		chromium: {
			launch: jest.fn().mockResolvedValue(mockBrowser),
		},
	};
});

// Set up console.error spy to verify logging
jest.spyOn(console, "error").mockImplementation(() => {});

describe("renderEstimatePdf", () => {
	// Mock valid estimate data
	const validEstimate: Estimate = {
		Id: "123",
		DocNumber: "EST-1001",
		TxnDate: "2023-05-15",
		CustomerRef: {
			value: "CUST-001",
			name: "Sample Customer",
		},
		Line: [
			{
				Id: "LINE-1",
				DetailType: "SalesItemLineDetail",
				Amount: 100,
				Description: "Sample Item",
				SalesItemLineDetail: {
					ItemRef: {
						value: "ITEM-001",
						name: "Product A",
					},
					UnitPrice: 25,
					Qty: 4,
				},
			},
		],
		TotalAmt: 100,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should generate a PDF buffer for valid estimate", async () => {
		const result = await renderEstimatePdf(validEstimate);

		// Verify the returned buffer has content
		expect(result).toBeInstanceOf(Buffer);
		expect(result.length).toBeGreaterThan(0);

		// Verify Playwright was called correctly
		expect(chromium.launch).toHaveBeenCalledTimes(1);
		expect(chromium.launch).toHaveBeenCalledWith({
			headless: true,
		});
	});

	it("should throw error for estimate with missing DocNumber", async () => {
		const invalidEstimate = {
			...validEstimate,
			DocNumber: undefined,
		};

		await expect(
			renderEstimatePdf(invalidEstimate as Estimate),
		).rejects.toThrow("Estimate missing DocNumber");

		expect(console.error).toHaveBeenCalled();
	});

	it("should throw error for estimate with missing CustomerRef", async () => {
		const invalidEstimate = {
			...validEstimate,
			CustomerRef: undefined,
		};

		await expect(
			renderEstimatePdf(invalidEstimate as Estimate),
		).rejects.toThrow("Estimate missing CustomerRef");

		expect(console.error).toHaveBeenCalled();
	});

	it("should throw error for estimate with empty Line items", async () => {
		const invalidEstimate = {
			...validEstimate,
			Line: [],
		};

		await expect(
			renderEstimatePdf(invalidEstimate as Estimate),
		).rejects.toThrow("Estimate has no line items");

		expect(console.error).toHaveBeenCalled();
	});

	it("should handle large number of line items efficiently", async () => {
		// Create estimate with 50+ line items
		const largeEstimate = {
			...validEstimate,
			Line: Array(55)
				.fill(null)
				.map((_, i) => ({
					Id: `LINE-${i}`,
					DetailType: "SalesItemLineDetail",
					Amount: 10,
					Description: `Item ${i}`,
					SalesItemLineDetail: {
						ItemRef: {
							value: `ITEM-00${i}`,
							name: `Product ${i}`,
						},
						UnitPrice: 10,
						Qty: 1,
					},
				})),
		};

		// Set timing threshold
		const startTime = performance.now();

		await renderEstimatePdf(largeEstimate as Estimate);

		const endTime = performance.now();
		const duration = endTime - startTime;

		// Should complete in under 3 seconds (test env may be faster)
		expect(duration).toBeLessThan(3000);
	});
});
