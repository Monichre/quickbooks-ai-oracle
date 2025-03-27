const OAuthClient = require("intuit-oauth");

export const oauthClient = new OAuthClient({
	clientId: process.env.INTUIT_CLIENT_ID,
	clientSecret: process.env.INTUIT_CLIENT_SECRET,
	environment: "sandbox", // process.env.INTUIT_SANDBOX_ID,
	redirectUri: process.env.INTUIT_REDIRECT_URI,
	logging: true,
});
