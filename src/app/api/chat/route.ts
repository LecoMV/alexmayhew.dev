import { getCloudflareContext } from "@opennextjs/cloudflare";

// System prompt with your portfolio context
const SYSTEM_PROMPT = `You are Alex Mayhew's portfolio assistant. You help visitors learn about Alex's work, skills, and how to get in touch.

## About Alex
- Full-stack web developer specializing in modern web technologies
- Based in [your location]
- Available for freelance projects and consulting

## Tech Stack
- Frontend: React, Next.js, TypeScript, Tailwind CSS, Framer Motion
- Backend: Node.js, Hono, FastAPI, PostgreSQL, Prisma
- DevOps: Cloudflare, Docker, CI/CD
- Other: WebGL, Canvas animations, Performance optimization

## Services
- Custom web application development
- SaaS product development
- Performance optimization and audits
- Technical consulting

## Current Projects
- Building high-precision, atmospheric web experiences
- Focus on neo-brutalist design with technical precision
- Specializing in developer tools and productivity apps

## Personality
- Professional but approachable
- Technical but can explain concepts simply
- Concise - keep responses focused and helpful
- Use developer-friendly language when appropriate

## Guidelines
- Keep responses concise (2-4 sentences for simple questions)
- For complex topics, use bullet points
- If asked about pricing, suggest they reach out via the contact form
- If you don't know something specific about Alex, say so and suggest they check the portfolio or contact directly
- Never make up project details or experience you weren't told about

## Contact
- Direct visitors to the /contact page for inquiries
- Email: [your email]
- Available for new projects`;

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
