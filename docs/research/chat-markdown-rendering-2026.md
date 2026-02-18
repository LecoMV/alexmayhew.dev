# Chat Markdown Rendering Research (2026-02-17)

**Status:** CURRENT
**Session:** Research for adding markdown rendering to the ChatWidget component (Qwen 2.5-Coder 32B via Cloudflare Workers AI)

## Context

Current chat (`src/components/chat/chat-widget.tsx`) uses non-streaming JSON responses, plain `<p>` tag
with `whitespace-pre-wrap`. The Qwen model outputs markdown-formatted text that renders as raw syntax.
`isomorphic-dompurify` is already installed in the project.

---

## 1. Library Comparison (Bundle Size Critical)

### react-markdown (v10.1.0)

- **Bundle:** ~42 kB minified + gzipped (grew from 23.5 kB in v5 — ~80% increase over versions)
- **Approach:** Converts markdown tokens to React elements via remark/rehype pipeline. No `dangerouslySetInnerHTML`.
- **Plugins:** `remark-gfm` adds GitHub Flavored Markdown (tables, strikethrough, task lists) — adds ~7-10 kB
- **Security:** Safe by default (JSX escaping). Add `rehype-sanitize` for strict allowlisting when using `rehype-raw`.
- **Verdict:** Best ecosystem, most maintained. Acceptable for a portfolio with code-splitting (lazy load the component).

### marked (v15+)

- **Bundle:** ~25 kB minified + gzipped (core only)
- **Approach:** Tokenizes to AST then HTML string. Requires `dangerouslySetInnerHTML` or DOMPurify pairing.
- **Used by:** Vercel AI SDK memoization cookbook (as a tokenizer, not renderer — pairs with react-markdown)
- **Verdict:** Good as a tokenizer for block-splitting in memoization pattern. Not ideal as primary renderer.

### sugar-high

- **Bundle:** ~1 kB minified + gzipped
- **Scope:** JSX/JS syntax highlighting ONLY — not a markdown renderer
- **Verdict:** Best choice for syntax highlighting inside code blocks. Use as custom `code` renderer inside react-markdown.

### Streamdown (v2.2.0) — Vercel OSS

- **Bundle:** v1 was 13 MB (unacceptable). v2 refactored to plugin-based architecture — core is smaller but exact gzip size not published.
- **Approach:** Drop-in for react-markdown, built for streaming. Handles partial/incomplete markdown natively via "Remend" healing library.
- **Features:** Streaming cursor indicator, configurable markdown healing, GFM, Mermaid, LaTeX (all optional plugins).
- **Caution:** v2 is relatively new (late 2025); plugin architecture may have rough edges. The 13 MB v1 issue was a dealbreaker that v2 addresses.
- **Verdict:** Purpose-built for streaming AI markdown. Evaluate v2 bundle carefully before adopting.

### Prism.js

- **Bundle:** ~2 kB core + ~0.5 kB per language
- **Approach:** In-browser highlighting. Modular — include only languages you need.
- **Caution:** Better run server-side when possible (performance).

### lowlight (highlight.js based)

- **Bundle:** ~6.5 kB gzipped (single language)
- **Approach:** Virtual DOM output — works in React without DOM manipulation.

---

## 2. The Non-Streaming Case (Current Architecture)

The current chat widget receives a **complete JSON response** (no streaming). This is the simpler case:

- No partial markdown problem — the full response arrives at once
- Can use `react-markdown` directly without streaming concerns
- The main challenges are: bundle size, syntax highlighting, security

**Recommended approach for current architecture:**

```
react-markdown + remark-gfm + sugar-high (for code blocks)
```

Estimated total: ~50-55 kB gzipped (lazy-loaded = 0 kB on initial page load)

---

## 3. Streaming Implementation (If/When Enabled)

### The Partial Markdown Problem

When streaming token-by-token, a code fence ` ```typescript ` may arrive in chunks:

- Chunk 1: `Here is the code:\n\`\`\``
- Chunk 2: `typescript\nconst x`
- Chunk 3: `= 5;\n\`\`\``

Between chunks 1 and 2, the renderer sees an unclosed code fence and may render garbage.

### Solution A: Vercel AI SDK Memoization Pattern (Recommended for non-Vercel AI SDK users)

Uses `marked` as a tokenizer to split content into complete blocks, then memoizes each block:

```tsx
// Parse to blocks using marked lexer
const blocks = useMemo(() => marked.lexer(content), [content]);

// Each block memoized independently — only re-renders blocks that changed
const MemoizedBlock = memo(
	({ content }: { content: string }) => <ReactMarkdown>{content}</ReactMarkdown>,
	(prev, next) => prev.content === next.content
);
```

Key insight: Incomplete blocks (mid-stream) are the last block only. Completed blocks never re-render.
Add `experimental_throttle: 50` to limit update frequency to 50ms intervals.

Source: https://ai-sdk.dev/cookbook/next/markdown-chatbot-with-memoization

### Solution B: Streamdown v2 (Drop-in, Handles Partial Markdown Natively)

```tsx
import { Streamdown } from "streamdown";
// Remend healing library auto-closes incomplete syntax
<Streamdown content={streamingContent} />;
```

Handles: unclosed bold/italic, partial code fences, unterminated links.
Built-in streaming cursor indicator.

### Solution C: Manual Buffering (DIY)

- Buffer until a complete markdown "block" is received (double newline or fence close)
- Only re-render on complete blocks
- Higher complexity, lower dependency footprint

---

## 4. Syntax Highlighting Options

### Recommendation for this project: sugar-high

**Rationale:** 1 kB gzipped. The chat widget responses typically show JS/TS snippets. VS Code-quality
theming isn't needed in a small chat widget. The weight difference vs Shiki (250+ kB with WASM) is massive.

```tsx
// Custom code component for react-markdown
import { highlight } from "sugar-high";

const CodeBlock = ({ className, children }: CodeProps) => {
	const language = /language-(\w+)/.exec(className ?? "")?.[1];
	if (!language) {
		return <code className="rounded bg-white/5 px-1 font-mono text-sm">{children}</code>;
	}
	const html = highlight(String(children));
	return (
		<pre className="bg-gunmetal-glass my-2 overflow-x-auto rounded border border-white/10 p-3">
			<code className="font-mono text-sm" dangerouslySetInnerHTML={{ __html: html }} />
		</pre>
	);
};
```

### Alternative: lowlight (highlight.js)

Better language coverage (~190 languages), still lightweight. 6.5 kB gzipped for core + languages.
Good middle ground if sugar-high's JS-only coverage is insufficient.

### Avoid for this use case:

- **react-syntax-highlighter:** 17-45 kB gzipped depending on which backend (Prism vs highlight.js)
- **Shiki:** ~250 kB + WASM. Excellent quality but wrong tool for a chat widget. Use on static blog instead.

---

## 5. Security (XSS Prevention)

### Current project: DOMPurify already installed

`isomorphic-dompurify` is in `package.json` — this covers the sanitization need.

### react-markdown security model

- **Default (no rehype-raw):** Safe. React JSX escaping handles output. No `dangerouslySetInnerHTML`.
- **With rehype-raw:** Allows arbitrary HTML in markdown. REQUIRES sanitization.
- **With rehype-sanitize:** Allowlist-based sanitization. Use default schema or custom.

### For AI-generated content specifically:

The AI model (Qwen) generates responses based on a controlled system prompt. The risk surface is:

1. Prompt injection attacks — user crafts input to make the model emit `<script>` tags
2. Model hallucination — model generates unexpected HTML structures

**Recommended config:**

```tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
// Do NOT use rehype-raw unless you need HTML in markdown
// react-markdown's default mode is already safe
<ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
```

**If using sugar-high's `dangerouslySetInnerHTML`:**
sugar-high only processes code blocks — the `children` content has already been extracted from the markdown
AST by react-markdown, so it's the raw code string, not user HTML. This is safe because:

- react-markdown extracts the code block contents as a plain string
- sugar-high converts that string to `<span>` elements with class names only
- No script execution possible from class names

**Content Security Policy:** Set `script-src 'self'` — already configured for Cloudflare deployment.

---

## 6. Performance for Re-rendering

### Current (non-streaming) — Low risk

Response arrives complete. One render. No perf concern.

### Streaming — Higher risk

Each token triggers a state update. Mitigations:

1. **Throttle updates:** Only re-render every 50ms (`experimental_throttle: 50` in Vercel AI SDK, or `setInterval` buffer)
2. **Block-level memoization:** Completed markdown blocks never re-render (see Solution A above)
3. **Isolate the input form:** Keep `ChatInput` as a separate component so form state doesn't trigger message re-renders
4. **React.memo on message bubbles:** Each `MessageBubble` should be memoized

### react-markdown re-render cost

The remark/rehype pipeline runs on every render. For a small chat widget with short messages,
this is negligible. For very long AI responses (500+ tokens), block memoization becomes important.

---

## 7. Real-World Chat UI Implementations

### ChatGPT / Claude approach

- Complete markdown after stream ends (or buffer until block complete)
- Block-level re-rendering (paragraphs, code blocks are independent DOM nodes)
- Shiki or custom highlighting for code blocks (quality over bundle size at that scale)
- Streaming cursor (blinking `|`) displayed after last token

### Vercel AI Chatbot (github.com/vercel/ai-chatbot)

- Uses react-markdown + remark-gfm
- Memoization with marked as tokenizer
- Source: https://github.com/vercel/ai-chatbot

### assistant-ui (github.com/assistant-ui/assistant-ui)

- Full composable primitive library built on Radix UI
- Handles streaming, markdown, syntax highlighting out of box
- Too heavy for a single chat widget (designed for full chat application shells)
- 50k+ monthly downloads

---

## Recommended Implementation for alexmayhew.dev

### Phase 1: Non-streaming markdown (current architecture)

**Stack:**

- `react-markdown@^10` + `remark-gfm` — ~50 kB gzipped but lazy-loaded
- `sugar-high` — 1 kB for code syntax highlighting
- No additional sanitization library needed (DOMPurify already installed; react-markdown default is safe)

**Lazy load the chat widget** (already a floating widget — good candidate for `dynamic()` import):

```tsx
// In the parent that renders the chat toggle
import dynamic from "next/dynamic";
const ChatWidget = dynamic(() => import("@/components/chat/chat-widget"), {
	ssr: false,
});
```

This means the markdown library is 0 kB on initial page load.

**Key markdown styles to add** (respecting neo-brutalist design system):

```tsx
const markdownComponents = {
	// Paragraphs
	p: ({ children }) => <p className="mb-2 text-sm leading-relaxed last:mb-0">{children}</p>,
	// Inline code
	code: CodeBlock, // custom component with sugar-high
	// Lists
	ul: ({ children }) => (
		<ul className="mb-2 list-inside list-disc space-y-1 text-sm">{children}</ul>
	),
	ol: ({ children }) => (
		<ol className="mb-2 list-inside list-decimal space-y-1 text-sm">{children}</ol>
	),
	// Bold/italic
	strong: ({ children }) => <strong className="text-mist-white font-semibold">{children}</strong>,
	em: ({ children }) => <em className="text-slate-text italic">{children}</em>,
};
```

### Phase 2: If streaming is added

Switch from `response.json()` to a streaming response from the route handler.
Use the Vercel AI SDK memoization pattern (marked lexer + block memoization).
Add 50ms throttle to cap re-renders.

---

## Sources

- [Vercel AI SDK — Markdown Chatbot with Memoization](https://ai-sdk.dev/cookbook/next/markdown-chatbot-with-memoization)
- [Streamdown v2 Changelog](https://vercel.com/changelog/streamdown-v2)
- [Streamdown GitHub (Vercel)](https://github.com/vercel/streamdown)
- [sugar-high GitHub](https://github.com/huozhi/sugar-high)
- [react-markdown GitHub](https://github.com/remarkjs/react-markdown)
- [react-markdown bundle size issue](https://github.com/remarkjs/react-markdown/issues/595)
- [HackerOne — Secure Markdown Rendering in React](https://www.hackerone.com/blog/secure-markdown-rendering-react-balancing-flexibility-and-safety)
- [Strapi — React Markdown Security Guide 2025](https://strapi.io/blog/react-markdown-complete-guide-security-styling)
- [npm-compare: Syntax highlighting libraries](https://npm-compare.com/highlight.js,prismjs,react-syntax-highlighter,shiki)
- [Comparing Shiki, Prism, highlight.js (chsm.dev)](https://chsm.dev/blog/2025/01/08/shiki-code-highlighting)
- [assistant-ui GitHub](https://github.com/assistant-ui/assistant-ui)
- [Preventing Flash of Incomplete Markdown — HN Discussion](https://news.ycombinator.com/item?id=44182941)
