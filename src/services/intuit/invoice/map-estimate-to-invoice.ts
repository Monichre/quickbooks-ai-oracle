import type {
	Estimate,
	EstimateLine,
	TxnTaxDetail,
} from "../estimate/estimate.types";
import type { Invoice } from "../types";

/**
 * Maps a QuickBooks Estimate to an Invoice object.
 *
 * @param est The Estimate to convert
 * @returns An Invoice object
 * @throws Error if the Estimate has no line items
 */
export function mapEstimateToInvoice(est: Estimate): Invoice {
	if (!est.Line || est.Line.length === 0) {
		throw new Error("Cannot map an empty Estimate (no line items)");
	}

	// Map Estimate fields to Invoice
	const invoice: Invoice = {
		CustomerRef: est.CustomerRef,
		Line: mapEstimateLinesToInvoiceLines(est.Line),
		DocNumber: est.DocNumber ? `${est.DocNumber}-INV` : undefined,
	};

	// Copy additional fields from Estimate when present
	if (est.TxnDate) invoice.TxnDate = est.TxnDate;
	if (est.CurrencyRef) invoice.CurrencyRef = est.CurrencyRef;
	if (est.CustomerMemo) invoice.CustomerMemo = est.CustomerMemo;
	if (est.BillAddr) invoice.BillAddr = est.BillAddr;
	if (est.ShipAddr) invoice.ShipAddr = est.ShipAddr;
	if (est.GlobalTaxCalculation) {
		invoice.ApplyTaxAfterDiscount = est.GlobalTaxCalculation === "TaxExcluded";
	}

	// Handle tax details - ensure required fields are present
	if (est.TxnTaxDetail && est.TxnTaxDetail.TotalTax !== undefined) {
		invoice.TxnTaxDetail = {
			TotalTax: est.TxnTaxDetail.TotalTax,
			TaxLine: est.TxnTaxDetail.TaxLine || [],
		};
	}

	// Set DueDate to 30 days from now if not specified (common invoice practice)
	if (!invoice.DueDate) {
		const dueDate = new Date();
		dueDate.setDate(dueDate.getDate() + 30);
		invoice.DueDate = dueDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
	}

	return invoice;
}

/**
 * Maps Estimate line items to Invoice line items
 */
function mapEstimateLinesToInvoiceLines(
	estimateLines: EstimateLine[],
): Invoice["Line"] {
	return estimateLines.map((line) => {
		// Handle different line item types
		if (line.DetailType === "SalesItemLineDetail" && line.SalesItemLineDetail) {
			return {
				Description: line.Description,
				Amount: line.Amount,
				DetailType: "SalesItemLineDetail",
				SalesItemLineDetail: {
					ItemRef: line.SalesItemLineDetail.ItemRef,
					Qty: line.SalesItemLineDetail.Qty,
					UnitPrice: line.SalesItemLineDetail.UnitPrice,
					TaxCodeRef: line.SalesItemLineDetail.TaxCodeRef,
					ServiceDate: line.SalesItemLineDetail.ServiceDate,
				},
			};
		}

		if (line.DetailType === "SubTotalLineDetail" && line.SubTotalLineDetail) {
			return {
				Description: line.Description,
				Amount: line.Amount,
				DetailType: "SubTotalLineDetail",
				SubTotalLineDetail: line.SubTotalLineDetail,
			};
		}

		if (line.DetailType === "DiscountLineDetail" && line.DiscountLineDetail) {
			return {
				Description: line.Description,
				Amount: line.Amount,
				DetailType: "DiscountLineDetail",
				DiscountLineDetail: line.DiscountLineDetail,
			};
		}

		throw new Error(
			`Unsupported line item type: ${line.DetailType} or missing detail information`,
		);
	});
}
