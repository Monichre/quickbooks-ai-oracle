"use server";

import { getEstimate } from "@/services/intuit/estimate";
import { renderEstimatePdf } from "@/services/intuit/estimate/estimate-pdf";
import { ApiError } from "@/lib/errors";
import { NextResponse } from "next/server";

/**
 * Server action for generating an estimate PDF for preview
 */
export async function generateEstimatePdf(
	estimateId: string,
): Promise<{ buffer: Buffer; fileName: string }> {
	try {
		// Get the estimate from QuickBooks
		const estimate = await getEstimate(estimateId);

		if (!estimate) {
			throw new ApiError("Estimate not found", 404);
		}

		// Generate the PDF
		const pdfBuffer = await renderEstimatePdf(estimate);

		return {
			buffer: pdfBuffer,
			fileName: `Estimate-${estimate.DocNumber || estimateId}.pdf`,
		};
	} catch (error) {
		console.error("Error generating PDF:", error);
		throw error;
	}
}

/**
 * Server action to handle estimate PDF download
 * Returns a Response object that can be used to serve the PDF
 */
export async function downloadEstimatePdf(
	estimateId: string,
): Promise<Response> {
	try {
		const { buffer, fileName } = await generateEstimatePdf(estimateId);

		return new Response(buffer, {
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": `attachment; filename="${fileName}"`,
			},
		});
	} catch (error) {
		console.error("Error downloading PDF:", error);

		if (error instanceof ApiError) {
			return new Response(JSON.stringify({ error: error.message }), {
				status: error.statusCode,
				headers: { "Content-Type": "application/json" },
			});
		}

		return new Response(JSON.stringify({ error: "Failed to generate PDF" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}

/**
 * Server action to handle serving an estimate PDF inline for preview
 * Returns a Response object that can be used to serve the PDF
 */
export async function previewEstimatePdf(
	estimateId: string,
): Promise<Response> {
	try {
		const { buffer, fileName } = await generateEstimatePdf(estimateId);

		return new Response(buffer, {
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": `inline; filename="${fileName}"`,
			},
		});
	} catch (error) {
		console.error("Error previewing PDF:", error);

		if (error instanceof ApiError) {
			return new Response(JSON.stringify({ error: error.message }), {
				status: error.statusCode,
				headers: { "Content-Type": "application/json" },
			});
		}

		return new Response(JSON.stringify({ error: "Failed to generate PDF" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}

/**
 * Server action to handle sending an estimate PDF via email
 * In a real implementation, this would integrate with an email service
 */
export async function emailEstimatePdf(
	estimateId: string,
	emailAddress: string,
): Promise<Response> {
	try {
		// Generate the PDF (we would use this to attach to an email)
		const { buffer, fileName } = await generateEstimatePdf(estimateId);

		// In a real implementation, call an email service here
		// emailService.queuePdfEmail(emailAddress, buffer, fileName);

		// For now, return a success response
		return new Response(
			JSON.stringify({
				queued: true,
				message: `Email will be sent to ${emailAddress}`,
			}),
			{
				status: 202,
				headers: { "Content-Type": "application/json" },
			},
		);
	} catch (error) {
		console.error("Error emailing PDF:", error);

		if (error instanceof ApiError) {
			return new Response(JSON.stringify({ error: error.message }), {
				status: error.statusCode,
				headers: { "Content-Type": "application/json" },
			});
		}

		return new Response(JSON.stringify({ error: "Failed to email PDF" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
