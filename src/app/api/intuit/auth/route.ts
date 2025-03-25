import type { NextApiRequest, NextApiResponse } from "next";
import OAuthClient from "intuit-oauth";
import { oauthClient } from "@/lib";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const authUri = oauthClient.authorizeUri({
		scope: [OAuthClient.scopes.Accounting],
		state: "testState",
	});

	res.redirect(authUri);
}
