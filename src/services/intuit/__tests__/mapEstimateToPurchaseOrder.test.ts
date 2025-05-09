import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import type { Estimate } from "../estimate/estimate.types";
import { PurchaseOrder } from "../types";
import { mapEstimateToPurchaseOrder } from "../purchase-order/map-estimate-to-purchase-order";

describe("mapEstimateToPurchaseOrder", () => {
	const mockAPAccountRef = {
		value: "accounts-payable-123",
		name: "Accounts Payable",
	};

	// Save original environment variables
	const originalAPAccountId = process.env.DEFAULT_AP_ACCOUNT_ID;
	const originalAPAccountName = process.env.DEFAULT_AP_ACCOUNT_NAME;

	beforeEach(() => {
		// Set environment variables for testing
		process.env.DEFAULT_AP_ACCOUNT_ID = mockAPAccountRef.value;
		process.env.DEFAULT_AP_ACCOUNT_NAME = mockAPAccountRef.name;
	});

	afterEach(() => {
		// Restore original environment variables
		process.env.DEFAULT_AP_ACCOUNT_ID = originalAPAccountId;
		process.env.DEFAULT_AP_ACCOUNT_NAME = originalAPAccountName;
	});

	it("should convert a single-vendor estimate to one purchase order", () => {
		// Arrange
		const mockEstimate: Estimate = {
			Id: "est-123",
			DocNumber: "EST-001",
			CustomerRef: { value: "cust-123", name: "Test Customer" },
			TxnDate: "2023-04-15",
			CurrencyRef: { value: "USD", name: "US Dollar" },
			Line: [
				{
					Id: "line-1",
					DetailType: "SalesItemLineDetail",
					Amount: 100,
					SalesItemLineDetail: {
						ItemRef: { value: "item-1", name: "Item 1" },
						Qty: 2,
						UnitPrice: 50,
						// Add vendor reference to the line item
						VendorRef: { value: "vendor-1", name: "Vendor A" },
					},
				},
				{
					Id: "line-2",
					DetailType: "SalesItemLineDetail",
					Amount: 150,
					SalesItemLineDetail: {
						ItemRef: { value: "item-2", name: "Item 2" },
						Qty: 3,
						UnitPrice: 50,
						// Same vendor
						VendorRef: { value: "vendor-1", name: "Vendor A" },
					},
				},
			],
		};

		// Act
		const result = mapEstimateToPurchaseOrder(mockEstimate);

		// Assert
		expect(result).toHaveLength(1);
		const po = result[0];
		expect(po.VendorRef).toEqual({ value: "vendor-1", name: "Vendor A" });
		expect(po.APAccountRef).toEqual(mockAPAccountRef);
		expect(po.DocNumber).toBe("EST-001-Vendor A");
		expect(po.Line).toHaveLength(2);
		expect(po.TxnDate).toBe("2023-04-15");
		expect(po.CurrencyRef).toEqual({ value: "USD", name: "US Dollar" });
	});

	it("should convert a multi-vendor estimate to multiple purchase orders", () => {
		// Arrange
		const mockEstimate: Estimate = {
			Id: "est-123",
			DocNumber: "EST-001",
			CustomerRef: { value: "cust-123", name: "Test Customer" },
			TxnDate: "2023-04-15",
			CurrencyRef: { value: "USD", name: "US Dollar" },
			Line: [
				{
					Id: "line-1",
					DetailType: "SalesItemLineDetail",
					Amount: 100,
					SalesItemLineDetail: {
						ItemRef: { value: "item-1", name: "Item 1" },
						Qty: 2,
						UnitPrice: 50,
						// First vendor
						VendorRef: { value: "vendor-1", name: "Vendor A" },
					},
				},
				{
					Id: "line-2",
					DetailType: "SalesItemLineDetail",
					Amount: 150,
					SalesItemLineDetail: {
						ItemRef: { value: "item-2", name: "Item 2" },
						Qty: 3,
						UnitPrice: 50,
						// Second vendor
						VendorRef: { value: "vendor-2", name: "Vendor B" },
					},
				},
				{
					Id: "line-3",
					DetailType: "SalesItemLineDetail",
					Amount: 75,
					SalesItemLineDetail: {
						ItemRef: { value: "item-3", name: "Item 3" },
						Qty: 1,
						UnitPrice: 75,
						// First vendor again
						VendorRef: { value: "vendor-1", name: "Vendor A" },
					},
				},
			],
		};

		// Act
		const result = mapEstimateToPurchaseOrder(mockEstimate);

		// Assert
		expect(result).toHaveLength(2);

		// Check first PO (Vendor A)
		const poVendorA = result.find((po) => po.VendorRef?.value === "vendor-1");
		expect(poVendorA).toBeDefined();
		expect(poVendorA?.VendorRef).toEqual({
			value: "vendor-1",
			name: "Vendor A",
		});
		expect(poVendorA?.Line).toHaveLength(2);
		expect(poVendorA?.DocNumber).toBe("EST-001-Vendor A");

		// Check second PO (Vendor B)
		const poVendorB = result.find((po) => po.VendorRef?.value === "vendor-2");
		expect(poVendorB).toBeDefined();
		expect(poVendorB?.VendorRef).toEqual({
			value: "vendor-2",
			name: "Vendor B",
		});
		expect(poVendorB?.Line).toHaveLength(1);
		expect(poVendorB?.DocNumber).toBe("EST-001-Vendor B");
	});

	it("should throw an error when a line item is missing a VendorRef", () => {
		// Arrange
		const mockEstimate: Estimate = {
			Id: "est-123",
			DocNumber: "EST-001",
			CustomerRef: { value: "cust-123", name: "Test Customer" },
			Line: [
				{
					Id: "line-1",
					DetailType: "SalesItemLineDetail",
					Amount: 100,
					SalesItemLineDetail: {
						ItemRef: { value: "item-1", name: "Item 1" },
						Qty: 2,
						UnitPrice: 50,
						// No VendorRef
					},
				},
			],
		};

		// Act & Assert
		expect(() => mapEstimateToPurchaseOrder(mockEstimate)).toThrow(
			/Missing VendorRef for line item/,
		);
	});

	it("should copy over TxnDate and CurrencyRef from Estimate to PurchaseOrder", () => {
		// Arrange
		const mockEstimate: Estimate = {
			Id: "est-123",
			DocNumber: "EST-001",
			CustomerRef: { value: "cust-123", name: "Test Customer" },
			TxnDate: "2023-05-15",
			CurrencyRef: { value: "EUR", name: "Euro" },
			Line: [
				{
					Id: "line-1",
					DetailType: "SalesItemLineDetail",
					Amount: 100,
					SalesItemLineDetail: {
						ItemRef: { value: "item-1", name: "Item 1" },
						Qty: 2,
						UnitPrice: 50,
						VendorRef: { value: "vendor-1", name: "Vendor A" },
					},
				},
			],
		};

		// Act
		const result = mapEstimateToPurchaseOrder(mockEstimate);

		// Assert
		expect(result[0].TxnDate).toBe("2023-05-15");
		expect(result[0].CurrencyRef).toEqual({ value: "EUR", name: "Euro" });
	});
});
