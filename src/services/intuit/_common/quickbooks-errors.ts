// Error classes
export class QuickbooksConfigError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "QuickbooksConfigError";
	}
}

export class QuickbooksAuthError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "QuickbooksAuthError";
	}
}

export class QuickbooksApiError extends Error {
	public status: number;
	public statusText: string;
	public apiError: unknown;

	constructor(status: number, statusText: string, apiError: unknown) {
		const message = `QuickBooks API error: ${status} ${statusText}`;
		super(message);
		this.name = "QuickbooksApiError";
		this.status = status;
		this.statusText = statusText;
		this.apiError = apiError;
	}
}
