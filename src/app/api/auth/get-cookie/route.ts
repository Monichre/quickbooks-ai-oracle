import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const name = searchParams.get("name");

		if (!name) {
			return NextResponse.json(
				{ error: "Cookie name is required" },
				{ status: 400 },
			);
		}

		// Access cookies from headers
		const cookieHeader = request.headers.get("cookie") || "";
		const cookieValue = getCookieValue(cookieHeader, name);

		return NextResponse.json({ value: cookieValue });
	} catch (error) {
		console.error("Error getting cookie:", error);
		return NextResponse.json(
			{ error: "Failed to get cookie" },
			{ status: 500 },
		);
	}
}

// Helper function to parse cookies from header
function getCookieValue(
	cookieHeader: string,
	name: string,
): string | undefined {
	const cookies = cookieHeader.split(";").reduce(
		(acc, cookie) => {
			const [key, value] = cookie.trim().split("=");
			acc[key] = value;
			return acc;
		},
		{} as Record<string, string>,
	);

	return cookies[name];
}
