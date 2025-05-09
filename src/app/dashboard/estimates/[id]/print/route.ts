import { NextRequest } from "next/server";
import {
	previewEstimatePdf,
	downloadEstimatePdf,
	emailEstimatePdf,
} from "@/app/actions/estimate-pdf-actions";

/**
 * Route handler for estimate print/download functionality
 * Serves as a bridge to the server actions
 * Supports:
 * - Preview: GET /dashboard/estimates/[id]/print
 * - Download: GET /dashboard/estimates/[id]/print?download=1
 * - Email: GET /dashboard/estimates/[id]/print?email=user@example.com
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
): Promise<Response> {
	const { id } = params;
	const { searchParams } = new URL(request.url);

	// Check for download or email mode
	const isDownloadMode = searchParams.has("download");
	const emailAddress = searchParams.get("email");

	// Handle email request
	if (emailAddress) {
		return emailEstimatePdf(id, emailAddress);
	}

	// Handle download request
	if (isDownloadMode) {
		return downloadEstimatePdf(id);
	}

	// Default: preview
	return previewEstimatePdf(id);
}
