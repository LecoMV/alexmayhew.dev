import { z } from "zod";

const envSchema = z.object({
	// Server-side
	NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

	// Public
	NEXT_PUBLIC_SITE_VERSION: z.string().optional().default("0.1.0"),
	NEXT_PUBLIC_GIT_SHA: z.string().optional().default("unknown"),
});

export const env = envSchema.parse({
	NODE_ENV: process.env.NODE_ENV,
	NEXT_PUBLIC_SITE_VERSION: process.env.NEXT_PUBLIC_SITE_VERSION,
	NEXT_PUBLIC_GIT_SHA: process.env.NEXT_PUBLIC_GIT_SHA,
});
