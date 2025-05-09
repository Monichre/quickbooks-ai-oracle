import type { Estimate, EstimateLine } from "../estimate/estimate.types";
import type { PurchaseOrder, ReferenceType } from "../types";
import { getDefaultAPAccount } from "./config";

interface MapEstimateToPurchaseOrderOptions {
	/**
	 * If true, throw an error when line items are missing vendor references.
	 * If false, silently skip line items without vendor references.
	 * @default false
	 */
	strictVendorValidation?: boolean;
}

/**
 * Checks if an estimate has any line items with vendor references.
 * Useful to determine if purchase orders can be created from this estimate.
 *
 * @param est The estimate to check
 * @returns Object containing whether any vendor references exist and count of missing references
 */
export function checkEstimateVendorReferences(est: Estimate): {
	hasVendorReferences: boolean;
	totalItems: number;
	itemsWithVendors: number;
	itemsMissingVendors: number;
} {
	if (!est.Line || est.Line.length === 0) {
		return {
			hasVendorReferences: false,
			totalItems: 0,
			itemsWithVendors: 0,
			itemsMissingVendors: 0,
		};
	}

	let itemsWithVendors = 0;
	let totalSalesItems = 0;

	est.Line.forEach((line) => {
		if (line.DetailType === "SalesItemLineDetail" && line.SalesItemLineDetail) {
			totalSalesItems++;

			if (line.SalesItemLineDetail.VendorRef?.value) {
				itemsWithVendors++;
			}
		}
	});

	return {
		hasVendorReferences: itemsWithVendors > 0,
		totalItems: totalSalesItems,
		itemsWithVendors,
		itemsMissingVendors: totalSalesItems - itemsWithVendors,
	};
}

/**
 * Maps a QuickBooks Estimate to one or more PurchaseOrder objects.
 * Creates one PO per distinct Vendor present in the Estimate's line items.
 *
 * @param est The Estimate to convert
 * @param options Configuration options for the mapping process
 * @returns An array of PurchaseOrder objects
 * @throws Error if strictVendorValidation is true and any line item is missing a VendorRef
 */
export function mapEstimateToPurchaseOrder(
	est: Estimate,
	options: MapEstimateToPurchaseOrderOptions = {},
): PurchaseOrder[] {
	const { strictVendorValidation = false } = options;

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

	// Count skipped items for diagnostic purposes
	let skippedItems = 0;

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
			if (strictVendorValidation) {
				throw new Error(
					`Missing VendorRef for line item ${index + 1} in Estimate ${est.DocNumber || est.Id}`,
				);
			}
			// Skip this line item since it has no vendor reference
			skippedItems++;
			return;
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

	// Log diagnostic information if items were skipped
	if (skippedItems > 0) {
		console.warn(
			`Skipped ${skippedItems} line item(s) without vendor references in Estimate ${
				est.DocNumber || est.Id
			}`,
		);

		// If all items were skipped, return empty array
		if (linesByVendor.size === 0) {
			return [];
		}
	}

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
