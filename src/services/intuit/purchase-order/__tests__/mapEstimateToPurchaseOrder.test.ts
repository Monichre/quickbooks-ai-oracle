import { mapEstimateToPurchaseOrder } from "../map-estimate-to-purchase-order";
import type { Estimate, EstimateLine } from "../../estimate/estimate.types";
import type { ReferenceType } from "../../estimate/estimate.types";

// Mock the config module
jest.mock("../config", () => ({
	getDefaultAPAccount: jest.fn(() => ({
		value: "30",
		name: "Accounts Payable (Test)",
	})),
}));

describe("mapEstimateToPurchaseOrder", () => {
	// Test fixtures
	const createEstimateLine = (
		vendorId: string,
		vendorName: string,
		amount = 100,
		itemId = "10",
		itemName = "Test Item",
		qty = 1,
		unitPrice = 100,
	): EstimateLine => ({
		Id: `LINE-${Math.random().toString(36).substring(2, 10)}`,
		LineNum: 1,
		Description: "Test Line Item",
		Amount: amount,
		DetailType: "SalesItemLineDetail",
		SalesItemLineDetail: {
			ItemRef: { value: itemId, name: itemName },
			Qty: qty,
			UnitPrice: unitPrice,
			VendorRef: { value: vendorId, name: vendorName },
		},
	});

	const createEstimate = (
		lines: EstimateLine[],
		docNumber = "EST-1234",
		txnDate = "2023-06-15",
		currencyValue = "USD",
		currencyName = "US Dollar",
	): Estimate => ({
		Id: `EST-${Math.random().toString(36).substring(2, 10)}`,
		DocNumber: docNumber,
		TxnDate: txnDate,
		CustomerRef: { value: "123", name: "Test Customer" },
		Line: lines,
		CurrencyRef: { value: currencyValue, name: currencyName },
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	test("maps single-vendor estimate to one PO", () => {
		// Arrange
		const vendor: ReferenceType = { value: "50", name: "Test Vendor" };
		const lines = [
			createEstimateLine(vendor.value, vendor.name, 100),
			createEstimateLine(vendor.value, vendor.name, 200),
		];
		const estimate = createEstimate(lines);

		// Act
		const result = mapEstimateToPurchaseOrder(estimate);

		// Assert
		expect(result).toHaveLength(1);
		expect(result[0].VendorRef).toEqual(vendor);
		expect(result[0].DocNumber).toBe("EST-1234-Test Vendor");
		expect(result[0].Line).toHaveLength(2);
		expect(result[0].Line?.[0].Amount).toBe(100);
		expect(result[0].Line?.[1].Amount).toBe(200);
		expect(result[0].TxnDate).toBe(estimate.TxnDate);
		expect(result[0].CurrencyRef).toEqual(estimate.CurrencyRef);
	});

	test("maps multi-vendor estimate to multiple POs (one per vendor)", () => {
		// Arrange
		const vendor1: ReferenceType = { value: "50", name: "Test Vendor 1" };
		const vendor2: ReferenceType = { value: "51", name: "Test Vendor 2" };
		const lines = [
			createEstimateLine(vendor1.value, vendor1.name, 100),
			createEstimateLine(vendor2.value, vendor2.name, 200),
			createEstimateLine(vendor1.value, vendor1.name, 300),
		];
		const estimate = createEstimate(lines);

		// Act
		const result = mapEstimateToPurchaseOrder(estimate);

		// Assert
		expect(result).toHaveLength(2);

		// First PO for vendor1
		const po1 = result.find((po) => po.VendorRef?.value === vendor1.value);
		expect(po1).toBeDefined();
		expect(po1?.VendorRef).toEqual(vendor1);
		expect(po1?.DocNumber).toBe("EST-1234-Test Vendor 1");
		expect(po1?.Line).toHaveLength(2);
		expect(po1?.Line?.[0].Amount).toBe(100);
		expect(po1?.Line?.[1].Amount).toBe(300);

		// Second PO for vendor2
		const po2 = result.find((po) => po.VendorRef?.value === vendor2.value);
		expect(po2).toBeDefined();
		expect(po2?.VendorRef).toEqual(vendor2);
		expect(po2?.DocNumber).toBe("EST-1234-Test Vendor 2");
		expect(po2?.Line).toHaveLength(1);
		expect(po2?.Line?.[0].Amount).toBe(200);
	});

	test("correctly handles lines with different item details", () => {
		// Arrange
		const vendor: ReferenceType = { value: "50", name: "Test Vendor" };
		const lines = [
			createEstimateLine(
				vendor.value,
				vendor.name,
				100,
				"10",
				"Item 1",
				1,
				100,
			),
			createEstimateLine(vendor.value, vendor.name, 250, "11", "Item 2", 5, 50),
		];
		const estimate = createEstimate(lines);

		// Act
		const result = mapEstimateToPurchaseOrder(estimate);

		// Assert
		expect(result).toHaveLength(1);
		expect(result[0].Line).toHaveLength(2);

		// Check first line item
		const line1 = result[0].Line?.[0];
		expect(line1?.ItemBasedExpenseLineDetail?.ItemRef?.value).toBe("10");
		expect(line1?.ItemBasedExpenseLineDetail?.ItemRef?.name).toBe("Item 1");
		expect(line1?.ItemBasedExpenseLineDetail?.Qty).toBe(1);
		expect(line1?.ItemBasedExpenseLineDetail?.UnitPrice).toBe(100);

		// Check second line item
		const line2 = result[0].Line?.[1];
		expect(line2?.ItemBasedExpenseLineDetail?.ItemRef?.value).toBe("11");
		expect(line2?.ItemBasedExpenseLineDetail?.ItemRef?.name).toBe("Item 2");
		expect(line2?.ItemBasedExpenseLineDetail?.Qty).toBe(5);
		expect(line2?.ItemBasedExpenseLineDetail?.UnitPrice).toBe(50);
	});

	test("throws error when estimate has no line items", () => {
		// Arrange
		const estimate = createEstimate([]);

		// Act & Assert
		expect(() => mapEstimateToPurchaseOrder(estimate)).toThrow(
			"Cannot map an empty Estimate (no line items)",
		);
	});

	test("throws error when line item has no VendorRef", () => {
		// Arrange
		const lineWithoutVendor: EstimateLine = {
			Id: "LINE-123",
			LineNum: 1,
			Description: "Test Line Item",
			Amount: 100,
			DetailType: "SalesItemLineDetail",
			SalesItemLineDetail: {
				ItemRef: { value: "10", name: "Test Item" },
				Qty: 1,
				UnitPrice: 100,
				// VendorRef is missing
			},
		};
		const estimate = createEstimate([lineWithoutVendor]);

		// Act & Assert
		expect(() => mapEstimateToPurchaseOrder(estimate)).toThrow(
			"Missing VendorRef for line item 1 in Estimate EST-1234",
		);
	});

	test("throws error when line item has empty VendorRef value", () => {
		// Arrange
		const lineWithEmptyVendorValue: EstimateLine = {
			Id: "LINE-123",
			LineNum: 1,
			Description: "Test Line Item",
			Amount: 100,
			DetailType: "SalesItemLineDetail",
			SalesItemLineDetail: {
				ItemRef: { value: "10", name: "Test Item" },
				Qty: 1,
				UnitPrice: 100,
				VendorRef: { value: "", name: "Test Vendor" },
			},
		};
		const estimate = createEstimate([lineWithEmptyVendorValue]);

		// Act & Assert
		expect(() => mapEstimateToPurchaseOrder(estimate)).toThrow(
			"Missing VendorRef for line item 1 in Estimate EST-1234",
		);
	});

	test("properly propagates TxnDate and CurrencyRef from estimate to PO", () => {
		// Arrange
		const vendor: ReferenceType = { value: "50", name: "Test Vendor" };
		const lines = [createEstimateLine(vendor.value, vendor.name)];
		const customDate = "2023-12-31";
		const customCurrency = { value: "EUR", name: "Euro" };
		const estimate = createEstimate(
			lines,
			"EST-1234",
			customDate,
			customCurrency.value,
			customCurrency.name,
		);

		// Act
		const result = mapEstimateToPurchaseOrder(estimate);

		// Assert
		expect(result).toHaveLength(1);
		expect(result[0].TxnDate).toBe(customDate);
		expect(result[0].CurrencyRef).toEqual(customCurrency);
	});

	test("skips non-SalesItemLineDetail line items", () => {
		// Arrange
		const vendor: ReferenceType = { value: "50", name: "Test Vendor" };
		const validLine = createEstimateLine(vendor.value, vendor.name);
		const invalidLine: EstimateLine = {
			Id: "LINE-456",
			LineNum: 2,
			Description: "Subtotal",
			Amount: 100,
			DetailType: "SubTotalLineDetail",
			SubTotalLineDetail: {},
		};
		const estimate = createEstimate([validLine, invalidLine]);

		// Act
		const result = mapEstimateToPurchaseOrder(estimate);

		// Assert
		expect(result).toHaveLength(1);
		expect(result[0].Line).toHaveLength(1);
		expect(result[0].Line?.[0].Description).toBe(validLine.Description);
	});
});
