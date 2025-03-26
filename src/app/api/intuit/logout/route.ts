import { NextResponse } from "next/server";
import { revokeTokens } from "@/lib/intuit/auth";

export async function POST() {
	try {
		// Revoke the QuickBooks tokens
		const success = await revokeTokens();

		if (!success) {
			return NextResponse.json(
				{ error: "Failed to revoke QuickBooks tokens" },
				{ status: 500 },
			);
		}

		// Redirect to home page or login page
		return NextResponse.redirect(
			new URL("/", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
		);
	} catch (error) {
		console.error("Error revoking QuickBooks tokens:", error);

		return NextResponse.json(
			{ error: "An error occurred while logging out" },
			{ status: 500 },
		);
	}
}
