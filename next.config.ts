/** @type {import('next').NextConfig} */
const nextConfig = {
	/* config options here */
	async redirects() {
		return [
			{
				source: "/quickbooks",
				destination: "/dashboard",
				permanent: true, // 308 status code (permanent redirect)
				// or permanent: false for 307 status code (temporary redirect)
			},
		];
	},

	env: {
		QB_COMPANY_ID: process.env.QB_COMPANY_ID,
		INTUIT_COMPANY_ID: process.env.INTUIT_COMPANY_ID,
	},
	images: {
		remotePatterns: [
			{
				hostname: "**.intuitcdn.net",
			},
			{
				hostname: "ferf1mheo22r9ira.public.blob.vercel-storage.com",
			},
			{
				hostname: "img.clerk.com",
			},
		],
	},
};

export default nextConfig;
