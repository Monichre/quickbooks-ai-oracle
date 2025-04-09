import { NextResponse } from "next/server";
import { isAuthenticated } from "@/services/intuit/auth";

export async function GET() {
	try {
		const isAuthed = await isAuthenticated();

		return NextResponse.json({
			isAuthenticated: isAuthed,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Error checking authentication status:", error);
		return NextResponse.json(
			{
				isAuthenticated: false,
				error:
					error instanceof Error
						? error.message
						: "Authentication check failed",
				timestamp: new Date().toISOString(),
			},
			{ status: 500 },
		);
	}
}
