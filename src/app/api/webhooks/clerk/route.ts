import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { createServerSideClient } from "@/services/supabase/server";
export async function POST(req: Request) {
	try {
		const evt = await verifyWebhook(req);

		console.log("🚀 ~ POST ~ evt:", evt);

		const supabase = await createServerSideClient();

		// Do something with payload
		// For this guide, log payload to console
		const { id } = evt.data;
		const eventType = evt.type;
		console.log(
			`Received webhook with ID ${id} and event type of ${eventType}`,
		);
		console.log("Webhook payload:", evt.data);

		if (eventType === "user.created") {
			console.log("userId:", evt.data.id);
			const eventData = evt.data;
			const { id, first_name, last_name, email_addresses } = eventData;
			const { data, error } = await supabase
				.from("users")
				.insert([
					{
						clerk_id: id,
						first_name,
						last_name,
						email: email_addresses[0].email_address,
					},
				])
				.select();

			console.log("data:", data);
			console.log("error:", error);
		}

		return new Response("Webhook received", { status: 200 });
	} catch (err) {
		console.error("Error verifying webhook:", err);
		return new Response("Error verifying webhook", { status: 400 });
	}
}
