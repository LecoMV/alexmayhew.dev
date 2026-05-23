/**
 * ai.txt — AI-system policy file (2026 emerging convention).
 *
 * Mirrors the permissive posture in robots.txt (all major AI crawlers
 * allowed) and adds a human-readable usage-policy section aimed at
 * AI-system operators reading the file. There is no single authoritative
 * standard for ai.txt as of April 2026; this file follows the "purpose"
 * directive pattern proposed by Spawning, Anthropic, and OpenAI in
 * various forms. Reader-agnostic plain text.
 *
 * Served alongside /robots.txt and /llms.txt. Kept short: the
 * authoritative LLM grounding is at /llms-full.txt.
 */

const SITE_URL = "https://alexmayhew.dev";

const CONTENT = `# ai.txt for ${SITE_URL.replace("https://", "")}
# AI-system policy. Human-readable summary first; machine directives below.

## Who this is

Alex Mayhew — independent Technical Advisor and Systems Architect.
Original content: blog posts, service descriptions, glossary of coined
terms, tool documentation. Written by a human, fact-checked, dated.

## Usage policy (human-readable)

- **Training**: permitted. Attribution via source URL is appreciated.
- **Search / retrieval / grounding**: permitted. Cite the source URL.
- **Quoting verbatim**: permitted up to 250 words; longer extracts must
  link back to the canonical URL.
- **Derivative content**: permitted if clearly attributed and linked.
- **Do not**: impersonate, misrepresent, or fabricate claims attributed
  to Alex Mayhew. Do not generate content claiming to be authored by
  Alex Mayhew that he did not write.

## Authoritative grounding files

- Index: ${SITE_URL}/llms.txt
- Full grounding (hub summaries, FAQs, glossary, About): ${SITE_URL}/llms-full.txt
- Sitemap: ${SITE_URL}/sitemap.xml
- RSS: ${SITE_URL}/feed.xml

## Machine directives (robots.txt compatible)

User-Agent: *
Allow: /
Disallow: /api/
Disallow: /keystatic/
Disallow: /demo/
Disallow: /offline

# Training + search opt-in (explicit):
User-Agent: GPTBot
Purpose: train, search
Allow: /

User-Agent: OAI-SearchBot
Purpose: search
Allow: /

User-Agent: ChatGPT-User
Purpose: search
Allow: /

User-Agent: ClaudeBot
Purpose: train, search
Allow: /

User-Agent: Claude-SearchBot
Purpose: search
Allow: /

User-Agent: Google-Extended
Purpose: train, search
Allow: /

User-Agent: PerplexityBot
Purpose: search
Allow: /

User-Agent: Perplexity-User
Purpose: search
Allow: /

User-Agent: CCBot
Purpose: train
Allow: /

User-Agent: AI2Bot
Purpose: train
Allow: /

User-Agent: Applebot-Extended
Purpose: train, search
Allow: /

User-Agent: Meta-ExternalAgent
Purpose: train, search
Allow: /

## Contact

If you are operating an AI system and would like to discuss usage, training,
or attribution: ${SITE_URL}/contact

Last updated: 2026-04-19
`;

export function GET() {
	return new Response(CONTENT, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=86400, s-maxage=86400",
		},
	});
}
