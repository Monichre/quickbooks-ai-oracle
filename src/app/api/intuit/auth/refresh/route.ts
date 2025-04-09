import { NextResponse } from "next/server";
import { refreshTokensIfNeeded } from "@/services/intuit/auth";

export async function POST() {
	try {
		// Explicitly refresh tokens regardless of expiry time
		const tokens = await refreshTokensIfNeeded(true);

		if (!tokens) {
			return NextResponse.json(
				{
					success: false,
					error: "Failed to refresh tokens",
					timestamp: new Date().toISOString(),
				},
				{ status: 401 },
			);
		}

		return NextResponse.json({
			success: true,
			message: "Tokens refreshed successfully",
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Error refreshing tokens:", error);

		return NextResponse.json(
			{
				success: false,
				error:
					error instanceof Error
						? error.message
						: "Unknown error refreshing tokens",
				timestamp: new Date().toISOString(),
			},
			{ status: 500 },
		);
	}
}
