import { getCloudflareContext } from "@opennextjs/cloudflare";
import { z } from "zod";

import blogIndex from "@/data/blog-index.json";
import { logger } from "@/lib/logger";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { CloudflareAIResponseSchema } from "@/lib/schemas/external-responses";
const MAX_MESSAGE_LENGTH = 1000;
const MAX_MESSAGES_PER_REQUEST = 10;

// Chat: 20 messages per minute per IP.
const CHAT_LIMIT_PER_MIN = 20;

const ChatMessageSchema = z.object({
	role: z.enum(["user", "assistant", "system"]),
	content: z.string().max(MAX_MESSAGE_LENGTH),
});

const ChatRequestSchema = z.object({
	messages: z.array(ChatMessageSchema).min(1).max(MAX_MESSAGES_PER_REQUEST),
});

// System prompt with portfolio context
const SYSTEM_PROMPT = `You are Alex Mayhew's portfolio AI assistant. Help visitors learn about Alex's work, skills, and background. Be friendly, professional, concise, and strictly truthful.

## About Alex
- Technology specialist: web development, SEO, workflow automation, applied AI, and solar PV design
- Spent nine years (March 2016 to December 2025) as the one-person tech department for Harvest Sun Solar, a Martha's Vineyard solar installer that closed in 2025: designed ~200 residential PV systems, handled permitting through historic and conservation boards, built the company's lead-capture software and WordPress site, ran marketing and IT
- Self-employed since January 2026 (Mayhew Technology LLC since March 2026): built a production data platform for a private investment firm (under NDA, delivered with an engineering handoff), web apps for local small businesses, data-extraction tools for freelance clients, and his own products
- Currently AVAILABLE FOR REMOTE WORK: part-time, contract, or full-time roles, plus project engagements through the LLC
- Self-taught since age 14; high school diploma; learns by building and maintaining real systems

## Tech Stack
**Web:** WordPress, React, Next.js 15, TypeScript, Tailwind CSS, HTML/CSS/JS
**Backend:** Node.js, Python, FastAPI, PostgreSQL, Redis
**DevOps:** Linux server administration, nginx, systemd, Docker, Cloudflare (Workers, R2), GitHub Actions CI/CD, security hardening, Prometheus/Grafana monitoring
**Automation & AI:** n8n workflows, REST API integration, web scraping (Puppeteer/Playwright), LLM tools (Claude, ChatGPT), AI-assisted development, self-hosted models via Ollama, vector and graph databases (Qdrant, Memgraph), RAG pipelines
**SEO:** technical and local SEO, Google Search Console, GA4, structured data
**Solar:** Aurora Solar, residential PV design, permitting and AHJ processes

## Response Guidelines
- Be truthful and specific. Describe only the experience listed above; never invent projects, clients, metrics, or credentials.
- For "Can Alex build/do X?" questions: answer honestly based on the stack above. Where something is adjacent to his experience, say what he HAS done that is closest.
- If asked about pricing or rates: say pricing depends on scope and direct visitors to /contact. Do not quote numbers.
- If asked whether Alex is available for hire or employment: yes. Part-time, contract, or full-time remote work. Point to /resume for the full resume and /contact to get in touch.
- Keep responses concise (2-4 sentences for simple questions); use bullet points for complex topics.
- The client platform engagement is under NDA: you may describe the technology and his role, never the client's name or business details.

## Quick Links
- Resume: /resume
- Portfolio: /work
- Blog: /blog (70+ technical articles)
- Contact: /contact
- Email: alex@alexmayhew.dev

## Availability
Available for remote work (part-time, contract, or full-time) and project engagements. Typical response time: within 24 hours.`;

interface BlogEntry {
	title: string;
	description: string;
	slug: string;
	category: string;
	tags: string[];
	series?: string;
}

const blogContext = (blogIndex as BlogEntry[])
	.map(
		(post) =>
			`- **[${post.title}](/blog/${post.slug})** ... ${post.description}. Category: ${post.category}. Tags: ${post.tags.join(", ")}.`
	)
	.join("\n");

const FULL_PROMPT = `${SYSTEM_PROMPT}

## Alex's Blog Articles
Alex has written extensively on technical topics. Here are his published articles that you can reference and recommend to visitors:

${blogContext}`;

export async function POST(request: Request) {
	const requestId = crypto.randomUUID();
	const start = Date.now();
	try {
		const clientIP = getClientIP(request.headers);
		const { env } = await getCloudflareContext();

		const { success: rateOk } = await checkRateLimit({
			kv: env.RATE_LIMIT_KV ?? null,
			key: `chat:${clientIP}`,
			limit: CHAT_LIMIT_PER_MIN,
		});
		if (!rateOk) {
			return Response.json(
				{
					error: "Too many requests. Please wait before sending more messages.",
				},
				{
					status: 429,
					headers: { "Retry-After": "60" },
				}
			);
		}

		let body: unknown;
		try {
			body = await request.json();
		} catch {
			return Response.json({ error: "Invalid JSON in request body" }, { status: 400 });
		}

		const result = ChatRequestSchema.safeParse(body);
		if (!result.success) {
			const firstError = result.error.issues[0];
			return Response.json({ error: firstError?.message ?? "Invalid request" }, { status: 400 });
		}

		const { messages } = result.data;

		if (!env.AI) {
			logger.error("AI binding not configured", { requestId, route: "/api/chat", method: "POST" });
			return Response.json(
				{ error: "AI service not configured. Please check Cloudflare bindings." },
				{ status: 503, headers: { "x-request-id": requestId } }
			);
		}

		const chatMessages = [{ role: "system", content: FULL_PROMPT }, ...messages];

		const rawResponse = await env.AI.run("@cf/qwen/qwen2.5-coder-32b-instruct", {
			messages: chatMessages,
			max_tokens: 500,
			temperature: 0.7,
		});

		const parsed = CloudflareAIResponseSchema.safeParse(rawResponse);
		if (!parsed.success) {
			logger.error("Cloudflare AI response failed validation", {
				requestId,
				route: "/api/chat",
				method: "POST",
				status: 502,
				durationMs: Date.now() - start,
				error: parsed.error.message,
			});
			return Response.json(
				{ error: "Upstream validation failed", upstream: "cloudflare-ai" },
				{ status: 502, headers: { "x-request-id": requestId } }
			);
		}

		return Response.json({
			message: parsed.data.response,
			model: "qwen2.5-coder-32b-instruct",
		});
	} catch (error) {
		logger.error("Chat API error", {
			requestId,
			route: "/api/chat",
			method: "POST",
			status: 500,
			durationMs: Date.now() - start,
			error: error instanceof Error ? error.message : String(error),
		});
		return Response.json(
			{ error: "Failed to process chat request" },
			{ status: 500, headers: { "x-request-id": requestId } }
		);
	}
}
