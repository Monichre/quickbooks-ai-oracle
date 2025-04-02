import { type NextRequest, NextResponse } from "next/server";
import { createQuickBooksClient } from "@/services/quickbooks/client";
import { refreshTokensIfNeeded } from "@/services/intuit/auth";

/**
 * Handles QuickBooks webhook notifications
 *
 * QuickBooks sends webhook notifications for various events like:
 * - Data changes (CRUD operations)
 * - Authorization events
 * - System notifications
 *
 * @see https://developer.intuit.com/app/developer/qbo/docs/develop/webhooks
 */
export async function POST(req: NextRequest) {
	try {
		// Verify the webhook signature (in production, you should validate the signature)
		// const signature = req.headers.get("intuit-signature");
		// if (!validateSignature(signature, await req.text())) {
		//   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
		// }

		const payload = await req.json();
		console.log(
			"QuickBooks webhook received:",
			JSON.stringify(payload, null, 2),
		);

		// Extract event information
		const { eventNotifications } = payload;

		if (!eventNotifications || !Array.isArray(eventNotifications)) {
			return NextResponse.json(
				{ error: "Invalid webhook format" },
				{ status: 400 },
			);
		}

		// Process each notification
		for (const notification of eventNotifications) {
			const { realmId, dataChangeEvent } = notification;

			if (!realmId) {
				console.error("Missing realmId in notification");
				continue;
			}

			// Get fresh tokens for API requests
			const tokens = await refreshTokensIfNeeded();

			if (!tokens) {
				console.error("Failed to get valid tokens for realmId:", realmId);
				continue;
			}

			// Create QuickBooks client
			const qbClient = createQuickBooksClient(
				tokens.access_token,
				realmId,
				tokens.refresh_token,
			);

			// Handle different event types
			if (dataChangeEvent) {
				await handleDataChangeEvent(dataChangeEvent, qbClient);
			}

			// Handle other event types as needed
			// if (notification.someOtherEventType) { ... }
		}

		// Acknowledge receipt of webhook
		return NextResponse.json({ status: "success" }, { status: 200 });
	} catch (error) {
		console.error("Error processing QuickBooks webhook:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

/**
 * Handles data change events from QuickBooks
 */
async function handleDataChangeEvent(dataChangeEvent: any, qbClient: any) {
	const { entities } = dataChangeEvent;

	if (!entities || !Array.isArray(entities)) {
		console.log("No entities in data change event");
		return;
	}

	for (const entity of entities) {
		const { name, id, operation } = entity;
		console.log(`Entity ${name} (ID: ${id}) had operation: ${operation}`);

		// Handle specific entity types and operations
		// Example: Fetch updated customer data
		if (
			name === "Customer" &&
			(operation === "Create" || operation === "Update")
		) {
			try {
				qbClient.getCustomer(id, (err: any, customer: any) => {
					if (err) {
						console.error(`Error fetching customer ${id}:`, err);
						return;
					}
					console.log(`Customer data:`, customer);
					// Process customer data (e.g., sync to your database)
				});
			} catch (error) {
				console.error(`Error processing ${name} entity:`, error);
			}
		}

		// Add handlers for other entity types as needed
	}
}
