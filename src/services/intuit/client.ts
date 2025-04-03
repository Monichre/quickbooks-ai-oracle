import OAuthClient from "intuit-oauth";

export const oauthClient = new OAuthClient({
	clientId: process.env.INTUIT_CLIENT_ID,
	clientSecret: process.env.INTUIT_CLIENT_SECRET,
	environment: process.env.INTUIT_ENVIRONMENT_ID,
	redirectUri: process.env.INTUIT_REDIRECT_URI,
});
