import type { Estimate, EstimateLine } from "../estimate/estimate.types";
import type { PurchaseOrder, ReferenceType } from "../types";
import { getDefaultAPAccount } from "./config";

/**
 * Maps a QuickBooks Estimate to one or more PurchaseOrder objects.
 * Creates one PO per distinct Vendor present in the Estimate's line items.
 *
 * @param est The Estimate to convert
 * @returns An array of PurchaseOrder objects
 * @throws Error if any line item is missing a VendorRef
 */
export function mapEstimateToPurchaseOrder(est: Estimate): PurchaseOrder[] {
	if (!est.Line || est.Line.length === 0) {
		throw new Error("Cannot map an empty Estimate (no line items)");
	}

	// Group lines by VendorRef.value
	const linesByVendor = new Map<
		string,
		{
			vendorRef: ReferenceType;
			lines: EstimateLine[];
		}
	>();

	// Validate and group lines
	est.Line.forEach((line, index) => {
		if (
			line.DetailType !== "SalesItemLineDetail" ||
			!line.SalesItemLineDetail
		) {
			return; // Skip non-SalesItemLineDetail lines
		}

		const vendorRef = line.SalesItemLineDetail.VendorRef;
		if (!vendorRef || !vendorRef.value) {
			throw new Error(
				`Missing VendorRef for line item ${index + 1} in Estimate ${est.DocNumber || est.Id}`,
			);
		}

		const vendorId = vendorRef.value;
		if (!linesByVendor.has(vendorId)) {
			linesByVendor.set(vendorId, {
				vendorRef,
				lines: [],
			});
		}

		linesByVendor.get(vendorId)!.lines.push(line);
	});

	// Get default AP Account from configuration
	const apAccountRef = getDefaultAPAccount();

	// Create one PO per vendor
	return Array.from(linesByVendor.values()).map(({ vendorRef, lines }) => {
		// Map Estimate fields to Purchase Order
		const purchaseOrder: PurchaseOrder = {
			VendorRef: vendorRef,
			APAccountRef: apAccountRef,
			Line: mapEstimateLinesToPurchaseOrderLines(lines),
			DocNumber: est.DocNumber
				? `${est.DocNumber}-${vendorRef.name}`
				: undefined,
		};

		// Copy additional fields from Estimate when present
		if (est.TxnDate) purchaseOrder.TxnDate = est.TxnDate;
		if (est.CurrencyRef) purchaseOrder.CurrencyRef = est.CurrencyRef;

		return purchaseOrder;
	});
}

/**
 * Maps Estimate line items to Purchase Order line items
 */
function mapEstimateLinesToPurchaseOrderLines(
	estimateLines: EstimateLine[],
): PurchaseOrder["Line"] {
	return estimateLines.map((line) => {
		if (!line.SalesItemLineDetail) {
			throw new Error("Cannot map line item without SalesItemLineDetail");
		}

		return {
			Description: line.Description,
			Amount: line.Amount,
			DetailType: "ItemBasedExpenseLineDetail",
			ItemBasedExpenseLineDetail: {
				ItemRef: line.SalesItemLineDetail.ItemRef,
				Qty: line.SalesItemLineDetail.Qty,
				UnitPrice: line.SalesItemLineDetail.UnitPrice,
			},
		};
	});
}
