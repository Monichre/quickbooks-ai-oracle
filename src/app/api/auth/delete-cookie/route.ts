import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const name = searchParams.get("name");

		if (!name) {
			return NextResponse.json(
				{ error: "Cookie name is required" },
				{ status: 400 },
			);
		}

		const response = NextResponse.json({ success: true });
		response.cookies.delete(name);

		return response;
	} catch (error) {
		console.error("Error deleting cookie:", error);
		return NextResponse.json(
			{ error: "Failed to delete cookie" },
			{ status: 500 },
		);
	}
}
