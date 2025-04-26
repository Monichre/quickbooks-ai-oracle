import { NextResponse } from "next/server";
import { revokeTokens } from "@/services/intuit/auth";

export async function POST() {
	try {
		const success = await revokeTokens();

		if (success) {
			return NextResponse.json({
				success: true,
				message: "Tokens successfully revoked",
				timestamp: new Date().toISOString(),
			});
		} else {
			return NextResponse.json(
				{
					success: false,
					message: "Failed to revoke tokens",
					timestamp: new Date().toISOString(),
				},
				{ status: 400 },
			);
		}
	} catch (error) {
		console.error("Error revoking tokens:", error);
		return NextResponse.json(
			{
				success: false,
				error:
					error instanceof Error ? error.message : "Failed to revoke tokens",
				timestamp: new Date().toISOString(),
			},
			{ status: 500 },
		);
	}
}
