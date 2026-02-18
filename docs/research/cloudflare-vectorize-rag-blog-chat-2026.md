# Cloudflare Vectorize RAG for Blog Chat Widget (2026-02-17)

**Status:** CURRENT
**Session:** Research for implementing RAG in the existing Workers AI chat widget using Cloudflare Vectorize to ground responses in blog content (62 MDX posts).

---

## 1. Cloudflare Vectorize — Current Status and Pricing

### Availability

Vectorize is GA (not beta). Available on both Workers Free and Workers Paid plans.

### Free Tier Limits

| Resource             | Free Tier        |
| -------------------- | ---------------- |
| Queried dimensions   | 30 million/month |
| Stored dimensions    | 5 million total  |
| Indexes per account  | 100              |
| Namespaces per index | 1,000            |

### Workers Paid Tier Limits

| Resource                    | Workers Paid                     |
| --------------------------- | -------------------------------- |
| Included queried dimensions | 50 million/month                 |
| Included stored dimensions  | 10 million total                 |
| Overage: queried            | $0.01 per million dimensions     |
| Overage: stored             | $0.05 per 100 million dimensions |
| Indexes per account         | 50,000                           |
| Namespaces per index        | 50,000                           |

### Hard Limits (all plans)

| Constraint                         | Limit                |
| ---------------------------------- | -------------------- |
| Max vectors per index              | 10,000,000           |
| Max dimensions per vector          | 1,536 (32-bit float) |
| Max vector ID length               | 64 bytes             |
| Metadata per vector                | 10 KiB               |
| topK with values/metadata          | 20                   |
| topK without values/metadata       | 100                  |
| Max upsert batch (Workers binding) | 1,000                |
| Max upsert batch (HTTP API)        | 5,000                |
| Max upload file size               | 100 MB               |
| Max index name length              | 64 bytes             |

### Cost Formula

```
((queried_vectors + stored_vectors) * dimensions * $0.01/1M) + (stored_vectors * dimensions * $0.05/100M)
```

You are NOT billed for: CPU, memory, active index hours, number of indexes created, empty indexes.

### Concrete Estimates for This Blog (62 posts)

Assumption: ~150 chunks per post average (generous), each 384-dim (bge-small) or 768-dim (bge-base).

| Scenario                        | Vectors | Dimensions | Monthly Queries | Monthly Cost |
| ------------------------------- | ------- | ---------- | --------------- | ------------ |
| 62 posts, bge-small, 500 q/mo   | ~9,300  | 384        | 500             | FREE TIER    |
| 62 posts, bge-base, 500 q/mo    | ~9,300  | 768        | 500             | FREE TIER    |
| 62 posts, bge-large, 2,000 q/mo | ~9,300  | 1,024      | 2,000           | ~$0.07       |

Stored dimensions with bge-base: 9,300 \* 768 = ~7.1M. Just above the 5M free tier stored limit. Would cost ~$0.003/month on paid plan.

**Verdict: Essentially free at this scale on Workers Paid plan (already required for R2 and AI binding).**

Sources:

- [Vectorize Pricing](https://developers.cloudflare.com/vectorize/platform/pricing/)
- [Vectorize Limits](https://developers.cloudflare.com/vectorize/platform/limits/)

---

## 2. Workers AI Embedding Models

All models support batch inference (up to 100 items per call). All return float32 vectors.

| Model                        | Dimensions | Max Input Tokens | Cost (per M tokens) | Notes                           |
| ---------------------------- | ---------- | ---------------- | ------------------- | ------------------------------- |
| `@cf/baai/bge-small-en-v1.5` | 384        | 512              | $0.020 (est.)       | Smallest, fastest, English-only |
| `@cf/baai/bge-base-en-v1.5`  | 768        | 512              | $0.067              | Best balance for this use case  |
| `@cf/baai/bge-large-en-v1.5` | 1,024      | 512              | $0.204              | High quality, 3x cost of base   |
| `@cf/baai/bge-m3`            | 1,024      | 8,192            | unknown             | Multi-lingual, long context     |
| `@google/embedding-gemma`    | unknown    | unknown          | unknown             | 300M params, multilingual       |

### Recommendation: bge-base-en-v1.5 (768 dims)

- English-only blog content, so multi-lingual adds no value
- 768 dims hits the sweet spot: Vectorize free tier stores 5M dims (can hold ~6,500 768-dim vectors), paid stores 10M (holds ~13,000)
- 62 posts \* ~100 chunks = ~6,200 chunks — fits in paid tier included allocation
- Cosine similarity works well with bge family for sentence-level semantic search
- Wrangler CLI default in Cloudflare's own RAG tutorial uses bge-base-en-v1.5

### Important: 512 Token Limit

The bge models (small/base/large) have a hard 512-token input limit. Chunks MUST be kept under ~380 tokens to leave headroom (tokenizers vary; ~4 chars/token is a safe estimate so ~1,500 chars per chunk max). Any text over 512 tokens is silently truncated — it does not error.

Sources:

- [bge-large-en-v1.5 model page](https://developers.cloudflare.com/workers-ai/models/bge-large-en-v1.5/)
- [Workers AI Models list](https://developers.cloudflare.com/workers-ai/models/)

---

## 3. Embedding MDX Blog Content at Build Time

### Architecture Decision: Build-Time vs Runtime

**Build-time embedding is the correct approach for static blog content.**

Rationale:

- Blog content changes only on deploy (new posts). No reason to re-embed on every query.
- Build-time keeps the chat API route latency to: embed question (1 call) + vector query (1 call) + LLM call. Not: embed chunks + upsert + query + LLM.
- GitHub Actions already runs the build pipeline — can add an indexing step.

### Build-Time Script Pattern

Create a standalone Node.js script (`scripts/index-blog.ts`) that runs after `next build`:

````typescript
// scripts/index-blog.ts
// Reads all MDX files, chunks them, embeds via CF REST API, upserts to Vectorize

import fs from "fs/promises";
import path from "path";
import matter from "gray-matter"; // already used by the blog

const ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const API_TOKEN = process.env.CF_API_TOKEN; // Workers AI + Vectorize permissions
const INDEX_NAME = "blog-rag";
const EMBED_MODEL = "@cf/baai/bge-base-en-v1.5";
const CHUNK_SIZE = 1200; // characters (~300 tokens with safety margin)
const CHUNK_OVERLAP = 150; // characters (~10%)

async function embedTexts(texts: string[]): Promise<number[][]> {
	const res = await fetch(
		`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${EMBED_MODEL}`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${API_TOKEN}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ text: texts }),
		}
	);
	const data = (await res.json()) as { result: { data: number[][] } };
	return data.result.data;
}

async function upsertVectors(
	vectors: Array<{ id: string; values: number[]; metadata: Record<string, string> }>
) {
	// HTTP API supports 5000 per batch; Workers binding supports 1000
	const BATCH = 500; // safe limit
	for (let i = 0; i < vectors.length; i += BATCH) {
		const batch = vectors.slice(i, i + BATCH);
		const ndjson = batch.map((v) => JSON.stringify(v)).join("\n");
		const res = await fetch(
			`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/vectorize/v2/indexes/${INDEX_NAME}/upsert`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${API_TOKEN}`,
					"Content-Type": "application/x-ndjson",
				},
				body: ndjson,
			}
		);
		if (!res.ok) throw new Error(`Vectorize upsert failed: ${await res.text()}`);
		console.log(`Upserted batch ${Math.floor(i / BATCH) + 1}`);
	}
}

// Overlap-aware chunker that respects paragraph boundaries
function chunkText(text: string, maxLen: number, overlap: number): string[] {
	const paragraphs = text.split(/\n\n+/);
	const chunks: string[] = [];
	let current = "";

	for (const para of paragraphs) {
		if (current.length + para.length > maxLen && current.length > 0) {
			chunks.push(current.trim());
			// Start next chunk with overlap from end of previous
			current = current.slice(-overlap) + "\n\n" + para;
		} else {
			current += (current ? "\n\n" : "") + para;
		}
	}
	if (current.trim()) chunks.push(current.trim());
	return chunks;
}

async function main() {
	const blogDir = path.join(process.cwd(), "content/blog");
	const files = await fs.readdir(blogDir);
	const mdxFiles = files.filter((f) => f.endsWith(".mdx"));

	const allVectors: Array<{ id: string; values: number[]; metadata: Record<string, string> }> = [];

	for (const file of mdxFiles) {
		const slug = file.replace(".mdx", "");
		const raw = await fs.readFile(path.join(blogDir, file), "utf-8");
		const { data: frontmatter, content } = matter(raw);

		// Strip MDX/markdown syntax for clean text
		const cleanText = content
			.replace(/^#+\s+/gm, "") // headings
			.replace(/\*\*([^*]+)\*\*/g, "$1") // bold
			.replace(/`[^`]+`/g, "") // inline code
			.replace(/```[\s\S]*?```/g, "") // code blocks
			.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links
			.replace(/>\s+/gm, "") // blockquotes
			.trim();

		const chunks = chunkText(cleanText, CHUNK_SIZE, CHUNK_OVERLAP);
		console.log(`${slug}: ${chunks.length} chunks`);

		// Embed in batches of 100 (API limit)
		const EMBED_BATCH = 50;
		for (let i = 0; i < chunks.length; i += EMBED_BATCH) {
			const batch = chunks.slice(i, i + EMBED_BATCH);
			const embeddings = await embedTexts(batch);

			for (let j = 0; j < batch.length; j++) {
				allVectors.push({
					id: `${slug}__${i + j}`,
					values: embeddings[j],
					metadata: {
						slug,
						title: String(frontmatter.title ?? ""),
						category: String(frontmatter.category ?? ""),
						series: String(frontmatter.series ?? ""),
						chunkIndex: String(i + j),
						text: batch[j].slice(0, 500), // store snippet for retrieval (10KiB limit per vector)
					},
				});
			}

			// Rate limit: ~10ms between embedding batches
			await new Promise((r) => setTimeout(r, 100));
		}
	}

	console.log(`Total vectors to upsert: ${allVectors.length}`);
	await upsertVectors(allVectors);
	console.log("Indexing complete.");
}

main().catch(console.error);
````

### Running the Index Script

Create the Vectorize index first (one-time):

```bash
npx wrangler vectorize create blog-rag --dimensions=768 --metric=cosine
```

Then add to `package.json`:

```json
{
	"scripts": {
		"index-blog": "npx tsx scripts/index-blog.ts"
	}
}
```

### GitHub Actions Integration

Add a step AFTER the build step in `.github/workflows/deploy.yml`:

```yaml
- name: Index blog content to Vectorize
  env:
    CF_ACCOUNT_ID: ${{ secrets.CF_ACCOUNT_ID }}
    CF_API_TOKEN: ${{ secrets.CF_API_TOKEN }}
  run: |
    # Only re-index if blog content changed
    if git diff --name-only HEAD~1 HEAD | grep -q "^content/blog/"; then
      echo "Blog content changed, re-indexing..."
      npm run index-blog
    else
      echo "No blog changes, skipping re-index"
    fi
```

This avoids unnecessary embedding costs when only code changes.

Sources:

- [Vectorize Insert Vectors best practices](https://developers.cloudflare.com/vectorize/best-practices/insert-vectors/)
- [Vectorize Embeddings tutorial](https://developers.cloudflare.com/vectorize/get-started/embeddings/)

---

## 4. Query Flow: End-to-End Architecture

```
User question
    |
    v
/api/chat (Cloudflare Worker via OpenNext)
    |
    +-- [1] Embed user question
    |       env.AI.run('@cf/baai/bge-base-en-v1.5', { text: question })
    |       Returns: float32[768]
    |
    +-- [2] Vector search Vectorize
    |       env.VECTORIZE.query(vector, { topK: 5, returnMetadata: 'all' })
    |       Returns: { matches: [{ id, score, metadata }] }
    |
    +-- [3] Extract text snippets from metadata
    |       matches.map(m => m.metadata.text) — stored at index time
    |       (No D1/R2 needed — metadata holds the snippet)
    |
    +-- [4] Build augmented system prompt
    |       SYSTEM_PROMPT + "\n\n## Relevant blog context:\n" + snippets.join('\n---\n')
    |
    +-- [5] LLM call
    |       env.AI.run('@cf/qwen/qwen2.5-coder-32b-instruct', { messages, max_tokens: 500 })
    |
    v
Response to user
```

### Latency Budget

| Step                             | Typical Latency |
| -------------------------------- | --------------- |
| Embed question (bge-base)        | 50-150ms        |
| Vectorize query (topK=5)         | 20-80ms         |
| Qwen 32B generation (500 tokens) | 1,000-3,000ms   |
| **Total**                        | **~1.1-3.3s**   |

The embedding + vector query adds ~100-200ms over the current chat-only latency. Acceptable for a chat widget.

### Modified Chat Route Pattern

```typescript
// In /api/chat/route.ts — add RAG context retrieval before LLM call

async function getRAGContext(query: string, env: CloudflareEnv): Promise<string> {
	if (!env.VECTORIZE || !env.AI) return "";

	// Embed the user's question
	const embedding = await env.AI.run("@cf/baai/bge-base-en-v1.5", {
		text: query,
	});
	const queryVector = embedding.data[0];
	if (!queryVector) return "";

	// Search blog vectors
	const results = await env.VECTORIZE.query(queryVector, {
		topK: 5,
		returnMetadata: "all",
	});

	if (!results.matches || results.matches.length === 0) return "";

	// Filter by similarity threshold to avoid injecting irrelevant context
	const relevantMatches = results.matches.filter((m) => m.score > 0.75);
	if (relevantMatches.length === 0) return "";

	const snippets = relevantMatches.map((m) => {
		const title = m.metadata?.title ?? "Blog post";
		const text = m.metadata?.text ?? "";
		const slug = m.metadata?.slug ?? "";
		return `### ${title}\n${text}\nSource: /blog/${slug}`;
	});

	return `## Relevant articles from Alex's blog:\n\n${snippets.join("\n\n---\n\n")}`;
}

// In the POST handler, before the LLM call:
const lastUserMessage = messages.findLast((m) => m.role === "user")?.content ?? "";
const ragContext = await getRAGContext(lastUserMessage, env);

const augmentedSystemPrompt = ragContext ? `${SYSTEM_PROMPT}\n\n${ragContext}` : SYSTEM_PROMPT;

const chatMessages = [{ role: "system", content: augmentedSystemPrompt }, ...messages];
```

---

## 5. Chunking Strategy for MDX Blog Content

### Recommended Approach: Paragraph-Aware with Overlap

For technical blog posts (this site's content type):

- **Chunk size:** 1,000-1,500 characters (~250-375 tokens) — well under bge's 512 token limit
- **Overlap:** 100-150 characters (~10%)
- **Split on:** `\n\n` (paragraph boundaries), then `\n` (line breaks), then `. ` (sentences)
- **Strip:** Heading markers (`##`), markdown syntax, code fences (code blocks rarely answer prose questions)
- **Preserve:** The heading text itself prepended to the chunk — gives semantic anchor

### Heading-Prepend Pattern

For each chunk, prepend the current H2/H3 heading to give context:

```typescript
function chunkWithHeadings(content: string): Array<{ heading: string; text: string }> {
	const sections = content.split(/^(?=#{1,3}\s)/m);
	const result: Array<{ heading: string; text: string }> = [];

	for (const section of sections) {
		const headingMatch = section.match(/^(#{1,3})\s+(.+)/);
		const heading = headingMatch ? headingMatch[2] : "";
		const body = section.replace(/^#{1,3}\s+.+\n/, "").trim();

		// Split large sections further
		if (body.length > 1500) {
			const subChunks = splitByParagraph(body, 1200, 150);
			for (const chunk of subChunks) {
				result.push({ heading, text: chunk });
			}
		} else if (body.length > 100) {
			result.push({ heading, text: body });
		}
	}
	return result;
}

// When building the vector metadata:
// text stored = `${heading}\n\n${chunkText}` (with heading providing context)
```

### Code Block Handling

Options:

1. **Exclude code blocks entirely** — simplest, fine for a general Q&A chat
2. **Include code with surrounding prose** — better if users ask "how do I implement X"
3. **Separate code chunks with language tag** — overkill for this use case

Recommendation: **exclude code blocks** from the chunk text but keep prose around them. Blog visitors asking the chat widget are more likely asking "what does Alex recommend" than "show me the exact code from post X."

### Estimated Chunk Count for 62 Posts

- Average post: ~2,000-4,000 words of prose (after stripping code)
- At 1,200 char chunks: ~8-15 chunks per post
- Total: ~500-900 vectors at 768 dimensions
- Stored dimensions: ~700 \* 768 = ~537,000 — comfortably within free tier (5M stored dims)

**This means you can stay on the FREE tier for Vectorize entirely.**

---

## 6. Integration with Existing Chat Endpoint

### wrangler.jsonc Changes Required

Add to the existing `wrangler.jsonc`:

```jsonc
// In the existing bindings section, after "ai":
"vectorize": [
  {
    "binding": "VECTORIZE",
    "index_name": "blog-rag"
  }
]
```

The `env.AI` binding already exists. Only `VECTORIZE` needs to be added.

### TypeScript Types

Update the `CloudflareEnv` type (likely in `src/env.d.ts` or similar):

```typescript
// If you have an env type declaration:
interface CloudflareEnv {
	AI: Ai;
	VECTORIZE: VectorizeIndex; // add this
	// ... existing bindings
}
```

The `VectorizeIndex` type comes from `@cloudflare/workers-types`. Already in the project if `@cloudflare/workers-types` is a dev dependency.

### Accessing in Route Handler

The existing pattern already works — just add `VECTORIZE` alongside `AI`:

```typescript
const { env } = await getCloudflareContext();
// env.AI — already used
// env.VECTORIZE — new, available after wrangler.jsonc update
```

### Local Development with Vectorize

Vectorize bindings can be used with `wrangler dev --remote` during development. Local simulation is NOT supported — you must use `--remote` to hit the real Vectorize index.

For local dev without `--remote`, stub the binding:

```typescript
const ragContext = env.VECTORIZE ? await getRAGContext(lastUserMessage, env) : ""; // graceful fallback for local dev
```

Sources:

- [Cloudflare Pages Bindings](https://developers.cloudflare.com/pages/functions/bindings/)
- [OpenNext Cloudflare context](https://github.com/opennextjs/opennextjs-cloudflare/issues/596)
- [RAG Tutorial (official)](https://developers.cloudflare.com/workers-ai/guides/tutorials/build-a-retrieval-augmented-generation-ai/)

---

## 7. Cost Implications

### One-Time Indexing Cost (62 posts)

Assumptions: 700 chunks, avg 300 tokens each = 210,000 tokens to embed.

| Model             | Embedding Cost                   | Vectorize Storage |
| ----------------- | -------------------------------- | ----------------- |
| bge-base-en-v1.5  | 210K tokens \* $0.067/M = $0.014 | Free              |
| bge-large-en-v1.5 | 210K tokens \* $0.204/M = $0.043 | Free              |

**One-time indexing is essentially free — under $0.05 total.**

### Per-Query Runtime Cost (per chat message)

Each user message triggers: 1 embedding call + 1 Vectorize query + 1 LLM generation.

| Component                                   | Cost per query | Notes                    |
| ------------------------------------------- | -------------- | ------------------------ |
| Embed question (bge-base)                   | ~$0.000007     | ~100 tokens per question |
| Vectorize query                             | ~$0.000001     | negligible               |
| Qwen 32B input (system + context + history) | ~$0.00066      | ~1,000 tokens @ $0.66/M  |
| Qwen 32B output (response)                  | ~$0.0005       | ~500 tokens @ $1.00/M    |
| **Total per message**                       | **~$0.0012**   |                          |

At 1,000 chat messages/month: ~$1.20/month. At 100/month: ~$0.12/month.

The RAG embedding step adds ~$0.000007/message — completely negligible. The LLM call dominates cost.

**Note:** The Workers Paid plan includes 10,000 Neurons/day free. At the Qwen 32B pricing, this covers roughly ~100 short exchanges per day at zero cost.

Sources:

- [Workers AI Pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)
- [qwen2.5-coder-32b-instruct pricing](https://developers.cloudflare.com/workers-ai/models/qwen2.5-coder-32b-instruct/)

---

## 8. OpenNext / Cloudflare Pages Limitations

### Vectorize Bindings — Fully Supported

Vectorize is a standard Cloudflare binding type and works with Cloudflare Pages (which is the deployment target for this project via OpenNext). The binding is declared in `wrangler.jsonc` the same way as AI, R2, and KV.

### Key Constraint: `getCloudflareContext()` is Required

You cannot access `env.VECTORIZE` directly in Next.js App Router routes. You MUST use:

```typescript
import { getCloudflareContext } from "@opennextjs/cloudflare";
const { env } = await getCloudflareContext();
// env.VECTORIZE is now available
```

This is the same pattern already used for `env.AI` in the existing chat route. No special handling needed.

### Runtime Constraint: Edge-Compatible Only

Vectorize binding calls are network requests within Cloudflare's infrastructure — they work fine in the Worker/Edge runtime. There is no `nodejs` runtime issue here.

### Local Development

**`wrangler dev` (no --remote flag):** Vectorize bindings return `undefined` — not simulated locally.

**`wrangler dev --remote`:** Works — uses real Cloudflare infrastructure.

**`SKIP_CF_DEV=1 PORT=3001 npm run dev`:** AI and Vectorize bindings unavailable. The chat API will 503 unless you add a graceful fallback.

**Recommendation:** Add null checks for `env.VECTORIZE` in the chat route. If unavailable, fall back to the existing system-prompt-only behavior.

### The `/api/vectorize` Routes Already Exist

Note: `src/app/api/vectorize/` already exists but is for the **TraceForge vectorizer feature** (a separate product for document processing). This is NOT blog RAG. Name your blog RAG Vectorize index differently to avoid confusion — use `blog-rag` as the index name and avoid the existing `/api/vectorize` path for blog RAG queries.

---

## 9. Alternative: Prompt Stuffing Without Vectors

### The Simple Approach

Instead of Vectorize, concatenate ALL blog excerpts (titles + first 200 chars of each post) into the system prompt at request time.

62 posts \* ~200 chars = ~12,400 chars = ~3,100 tokens prepended to every request.

```typescript
// Build this once at module level (cached between invocations in same isolate)
const BLOG_EXCERPT_CONTEXT = blogPosts.map((p) => `- **${p.title}**: ${p.excerpt}`).join("\n");

const SYSTEM_PROMPT = `${BASE_PROMPT}\n\n## Alex's Blog Topics:\n${BLOG_EXCERPT_CONTEXT}`;
```

### Tradeoffs

|                                 | Prompt Stuffing                              | Vectorize RAG                          |
| ------------------------------- | -------------------------------------------- | -------------------------------------- |
| Implementation complexity       | Very low (2 hours)                           | Medium (1-2 days)                      |
| Latency                         | No extra calls                               | +100-200ms for embed + query           |
| Cost per query (input tokens)   | +$0.002/msg (3,100 tokens @ Qwen input rate) | +negligible                            |
| Accuracy for specific questions | "Lost in the middle" risk with long context  | Retrieves the 3-5 most relevant chunks |
| Accuracy for general questions  | Good                                         | Same                                   |
| Maintenance                     | Rebuild system prompt on new posts           | Re-run index script on deploy          |
| Local dev                       | Works fully                                  | Requires --remote or mock              |

### The "Lost in the Middle" Problem

With 62 posts worth of context, Qwen 32B is unlikely to properly weight all of it. If a user asks "what did Alex write about microservices?" the model may focus on the first or last entries in the context and miss the most relevant post if it's in the middle. Vectorize retrieves the TOP 5 most semantically relevant chunks — much higher precision.

### Recommendation: Start with Prompt Stuffing, Add RAG Later

For immediate value (days, not weeks):

1. Strip all MDX to plain text summaries at build time (Next.js `generateStaticParams` or a build script)
2. Inject 62 post titles + 1-sentence descriptions into the system prompt (low token count)
3. Ship it — low cost, high value

When you want precision:

- Implement Vectorize RAG using the pattern above
- The Vectorize approach is architecturally correct and essentially free at this scale

---

## 10. Implementation Checklist (Full RAG Path)

### Prerequisites

- [ ] Workers Paid plan (already required for R2)
- [ ] `CF_API_TOKEN` with Workers AI and Vectorize permissions (create in CF dashboard)
- [ ] `CF_ACCOUNT_ID` in GitHub Actions secrets

### One-Time Setup

```bash
# Create the Vectorize index
npx wrangler vectorize create blog-rag --dimensions=768 --metric=cosine

# Add binding to wrangler.jsonc
# "vectorize": [{ "binding": "VECTORIZE", "index_name": "blog-rag" }]

# Install gray-matter if not already present (already in this project)
npm ls gray-matter
```

### Build Script

Create `scripts/index-blog.ts` (see Section 3 above).

Add to `package.json`:

```json
"index-blog": "npx tsx scripts/index-blog.ts"
```

Run once to seed:

```bash
CF_ACCOUNT_ID=xxx CF_API_TOKEN=xxx npm run index-blog
```

### Chat Route Changes

1. Add `VECTORIZE` binding check alongside existing `AI` check
2. Add `getRAGContext()` function (see Section 4)
3. Augment system prompt with retrieved context
4. Add similarity threshold filter (score > 0.75) to avoid irrelevant injection

### TypeScript Updates

Update env types to include `VectorizeIndex`.

### GitHub Actions

Add conditional re-index step on blog content changes (see Section 3).

### Monitoring

Log when RAG context is injected vs skipped. Track similarity scores to tune the 0.75 threshold.

---

## Related Research

- `docs/research/sentry-opennext-cloudflare-2026.md` — OpenNext binding patterns
- `docs/research/security-tooling-nextjs-cloudflare-2026.md` — Cloudflare Workers AI binding already active

## Sources

- [Cloudflare Vectorize Overview](https://developers.cloudflare.com/vectorize/)
- [Vectorize Pricing](https://developers.cloudflare.com/vectorize/platform/pricing/)
- [Vectorize Limits](https://developers.cloudflare.com/vectorize/platform/limits/)
- [bge-large-en-v1.5 model](https://developers.cloudflare.com/workers-ai/models/bge-large-en-v1.5/)
- [Workers AI Models](https://developers.cloudflare.com/workers-ai/models/)
- [Workers AI Pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)
- [qwen2.5-coder-32b-instruct](https://developers.cloudflare.com/workers-ai/models/qwen2.5-coder-32b-instruct/)
- [Vectorize + Workers AI tutorial](https://developers.cloudflare.com/vectorize/get-started/embeddings/)
- [RAG AI tutorial (official)](https://developers.cloudflare.com/workers-ai/guides/tutorials/build-a-retrieval-augmented-generation-ai/)
- [Vectorize Insert Vectors](https://developers.cloudflare.com/vectorize/best-practices/insert-vectors/)
- [Cloudflare Pages Bindings](https://developers.cloudflare.com/pages/functions/bindings/)
- [Chunking Strategies for RAG 2025](https://www.firecrawl.dev/blog/best-chunking-strategies-rag-2025)
- [Best Chunking Strategies (Weaviate)](https://weaviate.io/blog/chunking-strategies-for-rag)
