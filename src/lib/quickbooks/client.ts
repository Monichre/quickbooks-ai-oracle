const QuickBooks = require("node-quickbooks");

export const createQuickBooksClient = (
	oauthToken: string,
	realmId: string,
	refreshToken: string,
) =>
	new QuickBooks(
		process.env.INTUIT_CLIENT_ID,
		process.env.INTUIT_CLIENT_SECRET,
		oauthToken,
		false, // no token secret for oAuth 2.0
		realmId,
		true, // use the sandbox?
		true, // enable debugging?
		null, // set minorversion, or null for the latest version
		"2.0", //oAuth version
		refreshToken,
	);
