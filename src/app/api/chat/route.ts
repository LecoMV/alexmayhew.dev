import { getCloudflareContext } from "@opennextjs/cloudflare";

// System prompt with portfolio context
const SYSTEM_PROMPT = `You are Alex Mayhew's portfolio AI assistant. Help visitors learn about Alex's work, skills, and services. Be friendly, professional, and concise.

## About Alex
- Full-stack developer & software architect with expertise in modern web technologies
- Based remotely, working with clients worldwide
- Available for freelance projects, consulting, and long-term engagements
- Philosophy: "Atmospheric Engineering" - building high-precision, tactile digital experiences

## Tech Stack
**Frontend:** React, Next.js 15, TypeScript, Tailwind CSS 4, Framer Motion
**Backend:** Node.js, Hono, FastAPI, PostgreSQL, Prisma, Redis
**DevOps:** Cloudflare (Workers, Pages, R2), Docker, GitHub Actions CI/CD
**Specialties:** WebGL, Canvas animations, Performance optimization, System architecture

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

## Response Guidelines
- Keep responses concise (2-4 sentences for simple questions)
- Use bullet points for complex topics
- Be technical but explain concepts accessibly
- If unsure about specific details, suggest checking /work or /contact
- Never fabricate project details or experience

## Quick Links
- Portfolio: /work
- Blog: /blog (technical articles on web development)
- Contact Form: /contact
- Email: alex@alexmayhew.dev

## Availability
Currently accepting new projects. Typical response time: within 24 hours.`;

interface ChatMessage {
	role: "user" | "assistant" | "system";
	content: string;
}

interface ChatRequest {
	messages: ChatMessage[];
}

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as ChatRequest;
		const { messages } = body;

		if (!messages || !Array.isArray(messages)) {
			return Response.json({ error: "Messages array required" }, { status: 400 });
		}

		// Get Cloudflare context for Workers AI
		const { env } = await getCloudflareContext();

		// Check if AI binding exists
		if (!env.AI) {
			console.error("AI binding not configured");
			return Response.json(
				{ error: "AI service not configured. Please check Cloudflare bindings." },
				{ status: 503 }
			);
		}

		// Prepare messages with system prompt
		const chatMessages = [{ role: "system", content: SYSTEM_PROMPT }, ...messages];

		// Call Qwen 2.5-Coder 32B
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
		console.error("Chat API error:", error);
		return Response.json({ error: "Failed to process chat request" }, { status: 500 });
	}
}
