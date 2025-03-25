import { type NextRequest, NextResponse } from "next/server";
import { revokeTokens } from "@/lib/intuit/auth";

export async function POST(request: NextRequest) {
	try {
		// Revoke tokens and clear cookies
		const success = await revokeTokens();

		if (!success) {
			return NextResponse.json(
				{ error: "Failed to revoke tokens" },
				{ status: 500 },
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error during QuickBooks logout:", error);

		return NextResponse.json({ error: "Logout failed" }, { status: 500 });
	}
}
