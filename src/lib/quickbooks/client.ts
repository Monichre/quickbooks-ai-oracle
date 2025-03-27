const QuickBooks = require("node-quickbooks");

// Export all the intuit API modules
export * from "../intuit";

/**
 * Type definition for QuickBooks client constructor arguments
 */
export type QuickBooksClientArgs = {
	/** The application's consumer key */
	consumerKey: string;
	/** The application's consumer secret */
	consumerSecret: string;
	/** The user's generated token */
	oauth_token: string;
	/** The user's generated secret. Set this to false for oAuth 2. */
	oauth_token_secret: boolean | string;
	/** The company ID */
	realmId: string;
	/** Boolean flag to indicate whether to use Sandbox (i.e. for testing) */
	useSandbox: boolean;
	/** Boolean flag to log http requests, headers, and response bodies to the console */
	debug: boolean;
	/** Minor version for Intuit's API. Use null if you do not want to specify a version, to use the latest */
	minorVer: number | null;
	/** Use string '2.0' for oAuth 2 */
	oAuthVer: string;
	/** The user's generated refresh token. This is the code query parameter in the oAuth 2.0 callback */
	refresh_token: string;
};

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
