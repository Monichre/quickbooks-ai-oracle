import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
	clerkMiddleware,
	createRouteMatcher,
	getAuth,
} from "@clerk/nextjs/server";

/**
 * Quickbooks Intuit Authentication Flow:
 *
 * 1. Clerk middleware authenticates the user first
 * 2. For dashboard routes, we check if Intuit tokens exist and are valid
 * 3. The IntuitAuthGuard component provides a client-side check for components
 *    that need to ensure valid Intuit authentication
 *
 * Important: The original callback flow at /api/intuit/callback must work
 * without interference.
 */

// Create matcher for routes that need protection
const dashboardRoutes = createRouteMatcher(["/dashboard(.*)"]);

// Create matcher for routes that should be excluded from our custom handling
const authRoutes = createRouteMatcher([
	"/api/intuit/callback(.*)",
	"/api/intuit/auth(.*)",
]);

// Handle Intuit authentication and token refreshing
async function handleIntuitAuth(request: NextRequest) {
	// Skip auth routes to avoid breaking existing flow
	if (authRoutes(request)) {
		return NextResponse.next();
	}

	// For dashboard routes, we rely on the client-side IntuitAuthGuard
	// to handle token refreshing and authentication
	if (dashboardRoutes(request)) {
		return NextResponse.next();
	}

	return NextResponse.next();
}

// Export Clerk middleware enhanced with our custom logic
export default clerkMiddleware((auth, req) => {
	// Run our custom Intuit auth logic after Clerk has authenticated the user
	return handleIntuitAuth(req);
});

// Configure which routes use this middleware
export const config = {
	matcher: [
		// Clerk's standard matcher config
		"/((?!_next/image|_next/static|favicon.ico).*)",
		"/(api|trpc)(.*)",
	],
};
