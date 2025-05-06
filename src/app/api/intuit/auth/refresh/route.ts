import { NextResponse } from "next/server";
import { refreshTokensIfNeeded, TokenStatus } from "@/services/intuit/auth";

export async function POST() {
	try {
		// Explicitly refresh tokens regardless of expiry time
		const tokenResult = await refreshTokensIfNeeded(true);

		if (tokenResult.status === TokenStatus.REFRESH_EXPIRED) {
			return NextResponse.json(
				{
					success: false,
					status: tokenResult.status,
					error: "Refresh token expired, user must re-authenticate",
					timestamp: new Date().toISOString(),
				},
				{ status: 401 },
			);
		}

		if (
			tokenResult.status !== TokenStatus.VALID &&
			tokenResult.status !== TokenStatus.ROTATED
		) {
			return NextResponse.json(
				{
					success: false,
					status: tokenResult.status,
					error: "Failed to refresh tokens",
					timestamp: new Date().toISOString(),
				},
				{ status: 401 },
			);
		}

		return NextResponse.json({
			success: true,
			status: tokenResult.status,
			message: "Tokens refreshed successfully",
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Error refreshing tokens:", error);

		return NextResponse.json(
			{
				success: false,
				status: TokenStatus.NONE,
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
