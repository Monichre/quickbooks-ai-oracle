declare module "intuit-oauth" {
	export default class OAuthClient {
		constructor(options: {
			clientId: string;
			clientSecret: string;
			environment: string;
			redirectUri: string;
		});

		authorizeUri(options: { scope: string[]; state: string }): string;
		createToken(url: string): Promise<{
			getJson(): {
				access_token: string;
				refresh_token: string;
				expires_in: number;
				x_refresh_token_expires_in: number;
				token_type: string;
			};
		}>;
		refreshUsingToken(token: string): Promise<any>;
		revoke(options: { token: string }): Promise<any>;
		getToken(): any;
		setToken(token: any): void;
		scopes: {
			Accounting: "com.intuit.quickbooks.accounting";
			Payment: "com.intuit.quickbooks.payment";
			Payroll: "com.intuit.quickbooks.payroll";
			TimeTracking: "com.intuit.quickbooks.payroll.timetracking";
			Benefits: "com.intuit.quickbooks.payroll.benefits";
			Profile: "profile";
			Email: "email";
			Phone: "phone";
			Address: "address";
			OpenId: "openid";
			Intuit_name: "intuit_name";
		};
	}
}
