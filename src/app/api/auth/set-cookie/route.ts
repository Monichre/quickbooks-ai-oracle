import { NextResponse } from "next/server";
import { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";

export async function POST(request: Request) {
	try {
		const { name, value, maxAge } = await request.json();

		const response = NextResponse.json({ success: true });

		response.cookies.set({
			name,
			value,
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge,
			path: "/",
		});

		return response;
	} catch (error) {
		console.error("Error setting cookie:", error);
		return NextResponse.json(
			{ error: "Failed to set cookie" },
			{ status: 500 },
		);
	}
}
