import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends("next/core-web-vitals", "next/typescript"),
	{
		ignores: ["**/node_modules/**", ".next/**", "out/**"],
	},
	{
		files: ["**/*.ts", "**/*.tsx"],
		rules: {
			// Help prevent deployment errors
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unused-vars": "warn",
			"no-unused-vars": "warn",
			"no-console": "warn",
			"@next/next/no-img-element": "warn",
			"@next/next/no-html-link-for-pages": "warn",
			"@typescript-eslint/no-empty-object-type": "off",
		},
	},
];

export default eslintConfig;
