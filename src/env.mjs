// import { createEnv } from "@t3-oss/env-nextjs";
// import { z } from "zod";

// export const env = createEnv({
//   shared: {
//     VERCEL_URL: z
//       .string()
//       .optional()
//       .transform((v) => (v ? `https://${v}` : undefined)),
//     PORT: z.coerce.number().default(3000),
//   },
//   server: {
//     RESEND_API_KEY: z.string(),
//     SUPABASE_SERVICE_KEY: z.string(),
//     UPSTASH_REDIS_REST_TOKEN: z.string(),
//     UPSTASH_REDIS_REST_URL: z.string(),
//   },
//   client: {
//     NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
//     NEXT_PUBLIC_SUPABASE_URL: z.string(),
//   },
//   runtimeEnv: {
//     NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
//     NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
//     PORT: process.env.PORT,
//     RESEND_API_KEY: process.env.RESEND_API_KEY,
//     SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
//     UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
//     UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
//     VERCEL_URL: process.env.VERCEL_URL,
//   },
//   skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
// });
