import { renderToStaticMarkup } from "react-dom/server";
import { Estimate } from "../types";
import { chromium, Browser } from "@playwright/test";
import { EstimatePrintTemplate } from "./estimate-print.template";

// Singleton browser instance to avoid cold starts
let browserInstance: Browser | null = null;

/**
 * Get or create a shared browser instance
 */
async function getBrowser(): Promise<Browser> {
	if (!browserInstance) {
		browserInstance = await chromium.launch({
			// Only use headless: false for debugging
			headless: true,
		});
	}
	return browserInstance;
}

/**
 * Validates that an estimate has all required fields for PDF generation
 */
function validateEstimate(est: Estimate): void {
	if (!est) throw new Error("No estimate provided");
	if (!est.DocNumber) throw new Error("Estimate missing DocNumber");
	if (!est.CustomerRef?.value) throw new Error("Estimate missing CustomerRef");
	if (!est.Line || !Array.isArray(est.Line) || est.Line.length === 0) {
		throw new Error("Estimate has no line items");
	}
}

/**
 * Renders an Estimate as HTML and converts to a PDF buffer
 *
 * @param est - The Estimate object to render
 * @returns A Buffer containing the PDF data
 * @throws Error if estimate is missing required fields or rendering fails
 */
export async function renderEstimatePdf(est: Estimate): Promise<Buffer> {
	try {
		// Validate estimate has all required fields
		validateEstimate(est);

		// Generate HTML from estimate data
		const html = renderToStaticMarkup(EstimatePrintTemplate({ estimate: est }));

		// Get browser and create a new page
		const browser = await getBrowser();
		const page = await browser.newPage();

		// Set the page content and wait for rendering
		await page.setContent(html, {
			waitUntil: "networkidle",
			timeout: 10000,
		});

		// Generate PDF with A4 dimensions and 0.5in margins
		const pdfBuffer = await page.pdf({
			format: "A4", // 8.27 × 11.69 in
			margin: {
				top: "0.5in",
				right: "0.5in",
				bottom: "0.5in",
				left: "0.5in",
			},
			printBackground: true,
			preferCSSPageSize: false,
		});

		// Close page but keep browser instance alive
		await page.close();

		return pdfBuffer;
	} catch (error) {
		// Add context to error for monitoring
		const errorMsg =
			error instanceof Error
				? error.message
				: "Unknown error in PDF generation";

		// Add estimate context for logging
		const context = {
			docNumber: est?.DocNumber || "unknown",
			customerId: est?.CustomerRef?.value || "unknown",
		};

		// Log to monitoring with context (assumes a logger is available)
		console.error(`Error generating PDF: ${errorMsg}`, context);

		throw error;
	}
}

/**
 * Handle process exit - close browser instance
 */
if (typeof process !== "undefined") {
	process.on("exit", async () => {
		if (browserInstance) {
			await browserInstance.close();
			browserInstance = null;
		}
	});
}
