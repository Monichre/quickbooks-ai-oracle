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
	}
}
