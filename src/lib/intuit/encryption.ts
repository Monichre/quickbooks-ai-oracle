import crypto from "node:crypto";

// Make sure to set a secure encryption key in your environment variables
const ENCRYPTION_KEY =
	process.env.ENCRYPTION_KEY || "a-secure-key-that-is-at-least-32-chars";
const ALGORITHM = "aes-256-cbc";

// Function to encrypt data
export function encrypt(text: string): string {
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv(
		ALGORITHM,
		Buffer.from(ENCRYPTION_KEY.slice(0, 32)),
		iv,
	);

	let encrypted = cipher.update(text, "utf8", "hex");
	encrypted += cipher.final("hex");

	// Return IV and encrypted data
	return `${iv.toString("hex")}:${encrypted}`;
}

// Function to decrypt data
export function decrypt(encryptedText: string): string {
	const [ivHex, encryptedData] = encryptedText.split(":");

	if (!ivHex || !encryptedData) {
		throw new Error("Invalid encrypted data format");
	}

	const iv = Buffer.from(ivHex, "hex");
	const decipher = crypto.createDecipheriv(
		ALGORITHM,
		Buffer.from(ENCRYPTION_KEY.slice(0, 32)),
		iv,
	);

	let decrypted = decipher.update(encryptedData, "hex", "utf8");
	decrypted += decipher.final("utf8");

	return decrypted;
}
