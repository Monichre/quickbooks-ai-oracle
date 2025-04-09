"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UseIntuitAuthProps {
	redirectToLoginOnError?: boolean;
}

/**
 * Hook to manage Intuit authentication state in client components
 */
export function useIntuitAuth({
	redirectToLoginOnError = true,
}: UseIntuitAuthProps = {}) {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [lastRefresh, setLastRefresh] = useState<number>(0);
	const [lastStatusCheck, setLastStatusCheck] = useState<number>(0);
	const router = useRouter();

	// Check auth status - with caching to prevent too many calls
	const checkAuthStatus = useCallback(async () => {
		try {
			// Only check status if it's been more than 1 minute since last check
			const now = Date.now();
			if (now - lastStatusCheck < 60 * 1000 && isAuthenticated !== null) {
				return; // Skip if checked recently
			}

			setIsLoading(true);
			const response = await fetch("/api/intuit/auth/status");
			const data = await response.json();

			setIsAuthenticated(data.isAuthenticated);
			setLastStatusCheck(now);

			if (!data.isAuthenticated && data.error) {
				setError(data.error);
			} else {
				setError(null);
			}
		} catch (err) {
			console.error("Error checking authentication status", err);
			setError("Failed to check authentication status");
			setIsAuthenticated(false);
		} finally {
			setIsLoading(false);
		}
	}, [isAuthenticated, lastStatusCheck]);

	// Explicitly refresh tokens - this can be called before any API operation
	const refreshTokens = useCallback(async (): Promise<boolean> => {
		// Only refresh if the last refresh was more than 5 minutes ago
		const now = Date.now();
		if (now - lastRefresh < 5 * 60 * 1000 && isAuthenticated) {
			console.log("Skipping token refresh - refreshed recently");
			return true; // Skip if refreshed recently and already authenticated
		}

		// If we're clearly not authenticated, don't try to refresh
		if (isAuthenticated === false) {
			console.log("Skipping token refresh - not authenticated");
			return false;
		}

		try {
			setIsLoading(true);
			const response = await fetch("/api/intuit/auth/refresh", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const data = await response.json();
			setLastRefresh(now);
			setLastStatusCheck(now); // Update status check time too

			if (data.success) {
				setIsAuthenticated(true);
				setError(null);
				return true;
			}

			// If we get here, refresh was not successful
			setError(data.error || "Failed to refresh tokens");
			setIsAuthenticated(false);
			return false;
		} catch (err) {
			console.error("Error refreshing tokens", err);
			setError("Failed to refresh tokens");
			setIsAuthenticated(false);
			return false;
		} finally {
			setIsLoading(false);
		}
	}, [isAuthenticated, lastRefresh]);

	// Connect to QuickBooks
	const connect = useCallback(async () => {
		try {
			setIsLoading(true);
			// Use server-side redirect for a better experience
			window.location.href = "/api/intuit/auth";
		} catch (err) {
			console.error("Error connecting to QuickBooks", err);
			setError("Failed to connect to QuickBooks");
			setIsLoading(false);
		}
	}, []);

	// Disconnect from QuickBooks
	const disconnect = useCallback(async () => {
		try {
			await fetch("/api/intuit/auth/revoke", { method: "POST" });
			setIsAuthenticated(false);
			setError(null);
			router.push("/dashboard");
		} catch (err) {
			console.error("Error disconnecting from QuickBooks", err);
			setError("Failed to disconnect from QuickBooks");
		}
	}, [router]);

	// Check auth status on mount
	useEffect(() => {
		checkAuthStatus();
	}, [checkAuthStatus]);

	return {
		isAuthenticated,
		isLoading,
		error,
		checkAuthStatus,
		refreshTokens,
		connect,
		disconnect,
	};
}
