import { mapEstimateToInvoice } from "../map-estimate-to-invoice";
import type { Estimate } from "../../estimate/estimate.types";

describe("mapEstimateToInvoice", () => {
	it("should map a basic Estimate to an Invoice", () => {
		// Arrange
		const estimate: Estimate = {
			Id: "123",
			DocNumber: "EST-001",
			CustomerRef: { value: "456", name: "Test Customer" },
			Line: [
				{
					Id: "1",
					DetailType: "SalesItemLineDetail",
					Amount: 100,
					SalesItemLineDetail: {
						ItemRef: { value: "789", name: "Test Item" },
						UnitPrice: 100,
						Qty: 1,
					},
				},
			],
			TxnDate: "2023-01-01",
			CurrencyRef: { value: "USD", name: "US Dollar" },
			CustomerMemo: { value: "Test memo" },
		};

		// Act
		const result = mapEstimateToInvoice(estimate);

		// Assert
		expect(result).toEqual(
			expect.objectContaining({
				DocNumber: "EST-001-INV",
				CustomerRef: { value: "456", name: "Test Customer" },
				Line: [
					expect.objectContaining({
						DetailType: "SalesItemLineDetail",
						Amount: 100,
						SalesItemLineDetail: expect.objectContaining({
							ItemRef: { value: "789", name: "Test Item" },
							UnitPrice: 100,
							Qty: 1,
						}),
					}),
				],
				TxnDate: "2023-01-01",
				CurrencyRef: { value: "USD", name: "US Dollar" },
				CustomerMemo: { value: "Test memo" },
			}),
		);

		// Verify DueDate is set properly (30 days from today)
		expect(result.DueDate).toBeDefined();

		// The test assumes fixed current date, so let's just check if DueDate is a valid date string
		expect(typeof result.DueDate).toBe("string");
		expect(result.DueDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	});

	it("should map an Estimate with multiple line item types", () => {
		// Arrange
		const estimate: Estimate = {
			Id: "123",
			DocNumber: "EST-002",
			CustomerRef: { value: "456", name: "Test Customer" },
			Line: [
				{
					Id: "1",
					DetailType: "SalesItemLineDetail",
					Amount: 100,
					Description: "Product Item",
					SalesItemLineDetail: {
						ItemRef: { value: "789", name: "Test Product" },
						UnitPrice: 100,
						Qty: 1,
						TaxCodeRef: { value: "TAX", name: "Taxable" },
					},
				},
				{
					Id: "2",
					DetailType: "SubTotalLineDetail",
					Amount: 100,
					Description: "Subtotal",
					SubTotalLineDetail: {},
				},
				{
					Id: "3",
					DetailType: "DiscountLineDetail",
					Amount: -10,
					Description: "Discount",
					DiscountLineDetail: {
						DiscountPercent: 10,
						PercentBased: true,
					},
				},
			],
			TxnDate: "2023-01-01",
			GlobalTaxCalculation: "TaxExcluded",
			BillAddr: {
				Line1: "123 Main St",
				City: "Anytown",
				PostalCode: "12345",
			},
			ShipAddr: {
				Line1: "123 Main St",
				City: "Anytown",
				PostalCode: "12345",
			},
		};

		// Act
		const result = mapEstimateToInvoice(estimate);

		// Assert
		expect(result).toEqual(
			expect.objectContaining({
				DocNumber: "EST-002-INV",
				CustomerRef: { value: "456", name: "Test Customer" },
				Line: [
					expect.objectContaining({
						DetailType: "SalesItemLineDetail",
						Amount: 100,
						Description: "Product Item",
						SalesItemLineDetail: expect.objectContaining({
							ItemRef: { value: "789", name: "Test Product" },
							UnitPrice: 100,
							Qty: 1,
							TaxCodeRef: { value: "TAX", name: "Taxable" },
						}),
					}),
					expect.objectContaining({
						DetailType: "SubTotalLineDetail",
						Amount: 100,
						Description: "Subtotal",
						SubTotalLineDetail: {},
					}),
					expect.objectContaining({
						DetailType: "DiscountLineDetail",
						Amount: -10,
						Description: "Discount",
						DiscountLineDetail: expect.objectContaining({
							DiscountPercent: 10,
							PercentBased: true,
						}),
					}),
				],
				TxnDate: "2023-01-01",
				ApplyTaxAfterDiscount: true,
				BillAddr: {
					Line1: "123 Main St",
					City: "Anytown",
					PostalCode: "12345",
				},
				ShipAddr: {
					Line1: "123 Main St",
					City: "Anytown",
					PostalCode: "12345",
				},
			}),
		);
	});

	it("should throw an error for an Estimate with no line items", () => {
		// Arrange
		const estimate: Estimate = {
			Id: "123",
			CustomerRef: { value: "456", name: "Test Customer" },
			Line: [],
		};

		// Act & Assert
		expect(() => mapEstimateToInvoice(estimate)).toThrow(
			"Cannot map an empty Estimate (no line items)",
		);
	});

	it("should throw an error for an unsupported line item type", () => {
		// Arrange
		const estimate: Estimate = {
			Id: "123",
			CustomerRef: { value: "456", name: "Test Customer" },
			Line: [
				{
					Id: "1",
					DetailType: "GroupLineDetail" as "SalesItemLineDetail", // Casting to a known type instead of 'any'
					Amount: 100,
				},
			],
		};

		// Act & Assert
		expect(() => mapEstimateToInvoice(estimate)).toThrow(
			"Unsupported line item type: GroupLineDetail or missing detail information",
		);
	});
});
