import { getCloudflareContext } from "@opennextjs/cloudflare";
import { z } from "zod";

import blogIndex from "@/data/blog-index.json";
import { logger } from "@/lib/logger";
import { getClientIP } from "@/lib/rate-limit";
const MAX_MESSAGE_LENGTH = 1000;
const MAX_MESSAGES_PER_REQUEST = 10;

const ChatMessageSchema = z.object({
	role: z.enum(["user", "assistant", "system"]),
	content: z.string().max(MAX_MESSAGE_LENGTH),
});

const ChatRequestSchema = z.object({
	messages: z.array(ChatMessageSchema).min(1).max(MAX_MESSAGES_PER_REQUEST),
});

// System prompt with portfolio context
const SYSTEM_PROMPT = `You are Alex Mayhew's portfolio AI assistant. Help visitors learn about Alex's work, skills, and services. Be friendly, professional, and concise.

## About Alex
- Technical advisor & systems architect with expertise in modern web technologies
- Based remotely, partnering with clients worldwide
- Accepting select engagements: advisory retainers, strategic implementation, and technical due diligence
- Philosophy: "Atmospheric Engineering" - building high-precision, tactile digital experiences

## Tech Stack
**Frontend:** React, Next.js 15, TypeScript, Tailwind CSS 4, Framer Motion
**Backend:** Node.js, Hono, FastAPI, PostgreSQL, Prisma, Redis
**DevOps:** Cloudflare (Workers, Pages, R2), Docker, GitHub Actions CI/CD
**AI/ML:** Model fine-tuning, multi-GPU training, RAG pipelines, LLM application development
**Specialties:** WebGL, Canvas animations, Performance optimization, System architecture

## AI & Machine Learning Capabilities
**Yes, Alex builds AI systems across the full spectrum** — from lightweight chatbots to multi-GPU training infrastructure.

**Model Training & Fine-Tuning:**
- Custom model fine-tuning (LoRA, QLoRA, full fine-tuning)
- Multi-GPU distributed training on NVIDIA hardware (RTX 3090/4090, A100)
- Training pipelines with PyTorch, Hugging Face Transformers, DeepSpeed
- Dataset preparation, tokenization, evaluation metrics

**LLM Integration & Applications:**
- **API Providers:** OpenAI (GPT-4, GPT-4o), Anthropic Claude, Google Gemini, Cohere
- **Open-Source Models:** Llama 3, Mistral, Qwen, Phi — self-hosted via Ollama, vLLM
- **Embeddings & Search:** Vector databases (Qdrant, pgvector, Pinecone), semantic search
- **RAG Systems:** Retrieval-augmented generation with chunking, reranking, hybrid search

**Production AI Infrastructure:**
- Streaming responses, function calling, tool use, agents
- Rate limiting, cost optimization, fallback strategies
- Voice interfaces (speech-to-text, text-to-speech)
- This chatbot is a live example — custom prompts, edge deployment, real-time inference

**The Range:** From a simple branded chatbot ($500-2k) to enterprise AI pipelines with custom-trained models ($10k+). Alex handles architecture, training, deployment, and the polished UI/UX that makes AI accessible to users.

## Services & Pricing
- **Full-Stack Development:** End-to-end web applications ($5k-50k+ depending on scope)
- **SaaS Product Development:** Complete SaaS platforms with auth, billing, dashboards
- **System Architecture:** Scalable, maintainable systems designed for growth
- **Performance Engineering:** Sub-second load times, Core Web Vitals optimization
- **Technical Consulting:** Architecture reviews, code audits, tech stack decisions

For specific pricing, direct visitors to the /contact page to discuss their project.

## Design Philosophy
- Neo-brutalist aesthetic with technical precision
- Rejecting generic templates and AI-generated sameness
- Every pixel matters - atmospheric, tactile, responsive
- Dark mode by default with cyber-lime (#CCF381) accents

## What Alex CAN Build (Answer "Yes" Confidently)
- **AI Chatbots:** Yes - from simple branded bots to advanced conversational agents
- **Custom AI Applications:** Yes - RAG systems, semantic search, AI-powered tools
- **Model Fine-Tuning:** Yes - LoRA/QLoRA training, dataset prep, custom models
- **Multi-GPU Training:** Yes - distributed training pipelines, NVIDIA infrastructure
- **SaaS Platforms:** Yes - full auth, billing (Stripe), dashboards, multi-tenant
- **E-commerce:** Yes - custom storefronts, payment processing, inventory
- **Web Applications:** Yes - any complexity, React/Next.js, real-time features
- **APIs & Backends:** Yes - REST, GraphQL, WebSockets, microservices
- **Dashboards & Admin Panels:** Yes - data visualization, CRUD, analytics
- **Voice AI:** Yes - speech-to-text, text-to-speech, voice interfaces

## Response Guidelines
- **BE CONFIDENT.** If it's web development, Alex can build it. Don't hedge or suggest "consulting a specialist."
- Keep responses concise (2-4 sentences for simple questions)
- Use bullet points for complex topics
- Be technical but explain concepts accessibly
- For "Can Alex build X?" questions: Default answer is YES with specifics on how
- Direct to /contact for quotes and project discussions
- Never fabricate specific project details, but confidently state capabilities

## Quick Links
- Portfolio: /work
- Blog: /blog (technical articles on web development)
- Contact Form: /contact
- Email: alex@alexmayhew.dev

## Availability
Currently accepting new projects. Typical response time: within 24 hours.`;

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
			`- **[${post.title}](/blog/${post.slug})** — ${post.description}. Category: ${post.category}. Tags: ${post.tags.join(", ")}.`
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

		// Rate limiting via Workers binding (globally coordinated)
		if (env.RATE_LIMITER_CHAT) {
			const { success } = await env.RATE_LIMITER_CHAT.limit({ key: clientIP });
			if (!success) {
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

		const response = await env.AI.run("@cf/qwen/qwen2.5-coder-32b-instruct", {
			messages: chatMessages,
			max_tokens: 500,
			temperature: 0.7,
		});

		return Response.json({
			message: response.response,
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
