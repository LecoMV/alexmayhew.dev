# alexmayhew.dev - Feature Implementation Plan

> **Philosophy:** Every feature must reinforce "Atmospheric Engineering" — high-precision instruments, tactile, heavy, and responsive. No generic implementations.

---

## 1. Email Integration (Contact Form)

### Recommendation: **Resend**

| Service        | Free Tier          | Why/Why Not                                                    |
| -------------- | ------------------ | -------------------------------------------------------------- |
| **Resend**     | 3,000/mo (100/day) | Best Next.js integration, React Email templates, 1 domain free |
| Zoho Mail SMTP | 50/day free        | Not designed for transactional email, reputation issues        |
| Zoho ZeptoMail | 10,000 free        | Good alternative, but Resend has better DX                     |
| Mailtrap       | 4,000/mo           | Higher quota but weaker Next.js integration                    |

### Implementation Approach

```
src/
├── app/
│   └── api/
│       └── contact/
│           └── route.ts          # API route with Resend
├── components/
│   └── emails/
│       └── contact-notification.tsx  # React Email template
```

**Unique Brand Touch:**

- Email template styled as "TRANSMISSION_RECEIVED" with monospace font
- Include terminal-style header: `[INCOMING_MESSAGE] // ${timestamp}`
- Cyber-lime accent color in email
- Footer: "This transmission was routed through alexmayhew.dev"

### Environment Variables

```env
RESEND_API_KEY=re_xxxxx
CONTACT_EMAIL=alex@alexmayhew.dev
```

### Sources

- [Resend + Next.js Docs](https://resend.com/nextjs)
- [Server Actions Guide](https://nextjs.org/docs/app/guides/forms)
- [GitHub Template](https://github.com/JPerez00/resend-email-template)

---

## 2. Blog Sharing Buttons

### Approach: Custom Implementation (No Library)

**Why custom?** Libraries like `react-share` use generic rounded buttons that clash with the neo-brutalist aesthetic.

### Supported Platforms

1. **Web Share API** (primary - mobile/supported browsers)
2. **Copy Link** (fallback with clipboard feedback)
3. **X/Twitter** - Developer audience
4. **LinkedIn** - Professional reach
5. **Bluesky** - Tech-forward audience
6. **Hacker News** - Developer community

### Design Pattern (On-Brand)

```tsx
// Terminal-style share widget
<aside className="border border-white/10 p-4 font-mono">
	<span className="text-cyber-lime text-xs">$ share --article</span>
	<div className="mt-3 flex gap-2">
		{/* Boxy buttons with hover glow, no rounded corners */}
		<button className="hover:border-cyber-lime border border-white/20 px-3 py-2">
			<span className="text-xs">COPY_LINK()</span>
		</button>
		{/* ... */}
	</div>
</aside>
```

### Share URL Patterns

```typescript
const shareUrls = {
	twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${url}`,
	linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
	bluesky: `https://bsky.app/intent/compose?text=${encodeURIComponent(`${title} ${url}`)}`,
	hackernews: `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(url)}&t=${encodeURIComponent(title)}`,
};
```

### Placement Options

1. **Floating sidebar** (desktop) - sticky on scroll
2. **Bottom of article** (mobile) - after content
3. **After reading** - appear after 70% scroll depth

### Sources

- [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)
- [Custom Implementation Guide](https://dev.to/sarwarasik/create-a-share-button-for-social-media-links-in-react-without-any-package-26i1)

---

## 3. Interactive Terminal

### Concept: "ALEX_OS Terminal"

A draggable, resizable terminal window that visitors can use to explore the site. Not a gimmick — a functional navigation tool.

### Commands to Implement

```
$ help                    # List available commands
$ whoami                  # About Alex
$ ls projects/            # List portfolio projects
$ cat projects/photokeep  # View project details
$ cd /blog                # Navigate to blog
$ cat blog/latest         # Read latest blog post summary
$ skills --list           # Technical skills
$ contact                 # Show contact info
$ clear                   # Clear terminal
$ theme [name]            # Easter egg: switch terminal themes
$ sudo hire alex          # Easter egg: redirect to contact
```

### Design Specifications

```
┌─────────────────────────────────────────────────┐
│ ● ALEX_OS v1.0.0 — bash                    ─ □ ✕│
├─────────────────────────────────────────────────┤
│ Last login: Thu Jan 16 2026                      │
│ Type 'help' to see available commands            │
│                                                  │
│ visitor@alexmayhew.dev:~$ _                      │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Visual Requirements:**

- Void Navy background with subtle scanlines
- Cyber-lime prompt and command output
- Mist White for user input
- Burnt Ember for errors
- CRT-style slight glow effect on text
- Draggable header (react-rnd or custom)

### Implementation References

- [satnaing/terminal-portfolio](https://github.com/satnaing/terminal-portfolio) - TypeScript + React
- [FreeCodeCamp Tutorial](https://www.freecodecamp.org/news/how-to-create-an-interactive-terminal-portfolio-website/)
- [Drag & Drop Terminal](https://dev.to/iamkiya/level-up-your-portfolio-building-a-drag-and-drop-terminal-in-react-81j)

### File Structure

```
src/
├── components/
│   └── terminal/
│       ├── terminal.tsx           # Main component
│       ├── terminal-input.tsx     # Input handling
│       ├── terminal-output.tsx    # Output rendering
│       ├── commands/
│       │   ├── index.ts           # Command registry
│       │   ├── help.ts
│       │   ├── whoami.ts
│       │   ├── ls.ts
│       │   └── ...
│       └── styles.ts              # Terminal theme
```

---

## 4. WebGL Background

### Concept: "Neural Field"

A reactive particle/noise field that responds to cursor movement — like looking at data flowing through a network.

### Option A: GPU Particles with R3F (Recommended)

**Tech Stack:**

- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Helpers and abstractions
- Custom GLSL shaders for noise

**Visual Effect:**

- Thousands of small particles forming a subtle grid/field
- Particles drift slowly with Perlin noise
- Cursor proximity causes particles to scatter/attract
- Subtle color shift from Void Navy to hints of Cyber Lime near cursor

### Option B: Shader-Only Approach (Lighter)

**Tech Stack:**

- Single fullscreen `<canvas>` with GLSL fragment shader
- No Three.js dependency (smaller bundle)

**Visual Effect:**

- Animated noise field (similar to current NoiseOverlay but reactive)
- Cursor creates "ripples" in the noise
- Can be layered behind content

### Implementation References

- [wawa-vfx](https://wawasensei.dev/blog/wawa-vfx-open-source-particle-system-for-react-three-fiber-projects) - GPU particles for R3F
- [Maxime Heckel's Particles Guide](https://blog.maximeheckel.com/posts/the-magical-world-of-particles-with-react-three-fiber-and-shaders/)
- [GPU Particles Tutorial](<https://www.thefrontdev.co.uk/how-to-create-gpu-particles-in-react-three-fiber-(r3f)/>)
- [dataseyo/portfolio](https://github.com/dataseyo/portfolio) - R3F + GLSL portfolio

### Performance Considerations

- Use `OffscreenCanvas` where supported
- Implement frame rate limiting (cap at 30fps for background)
- Disable on reduced-motion preference
- Lazy load (don't block initial paint)

### File Structure

```
src/
├── components/
│   └── background/
│       ├── neural-field.tsx       # Main R3F canvas
│       ├── particles.tsx          # Particle system
│       └── shaders/
│           ├── particle.vert
│           └── particle.frag
```

---

## 5. AI Chat Assistant

### Option Comparison

| Option                    | Cost                 | Pros                                   | Cons                                                         |
| ------------------------- | -------------------- | -------------------------------------- | ------------------------------------------------------------ |
| **Cloudflare Workers AI** | Free 10k neurons/day | Edge deployment, fast, multiple models | Requires Cloudflare account, neurons can be hard to estimate |
| **WebLLM (Browser)**      | Free                 | No server, private, offline-capable    | Requires WebGPU, initial download ~2GB, device-dependent     |
| **Self-Hosted (Ollama)**  | Server cost          | Full control, any model                | Need to run/maintain server                                  |

### Recommendation: Hybrid Approach

1. **Primary:** Cloudflare Workers AI (free tier)
2. **Fallback:** WebLLM for privacy-conscious users (opt-in)

### Cloudflare Workers AI Details

**Free Tier:** 10,000 neurons/day (resets at 00:00 UTC)

**Model Recommendation:** `@cf/meta/llama-3.2-1b-instruct`

- Input: 2,457 neurons per 1M tokens (~$0.027)
- Output: 18,252 neurons per 1M tokens (~$0.201)
- Fast, capable for Q&A about portfolio/blog

**Estimated Usage:**

- Average conversation: ~500 input tokens + ~200 output tokens
- Per conversation: ~1.2 + ~3.6 = ~5 neurons
- Free tier allows: ~2,000 conversations/day

**Implementation:**

```typescript
// Cloudflare Worker
export default {
	async fetch(request, env) {
		const { messages } = await request.json();

		const response = await env.AI.run("@cf/meta/llama-3.2-1b-instruct", {
			messages: [{ role: "system", content: ALEX_SYSTEM_PROMPT }, ...messages],
		});

		return Response.json(response);
	},
};
```

**System Prompt Concept:**

```
You are ALEX_AI, the digital assistant for alexmayhew.dev.
You are a technical consultant who speaks concisely and directly.
You know about:
- Alex's services: full-stack development, SaaS architecture, technical consulting
- Tech stack preferences: Next.js, TypeScript, PostgreSQL, Cloudflare
- Blog topics: SaaS development, TypeScript, architecture patterns
- Availability: Currently accepting new projects

Respond in a professional but slightly technical tone.
Keep responses under 150 words unless asked for details.
If asked about pricing, direct to the contact form.
```

### Sources

- [Cloudflare Workers AI Pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)
- [Cloudflare AI Tutorial](https://eastondev.com/blog/en/posts/ai/20251121-workers-ai-tutorial/)
- [Free Chatbot Guide](https://medium.com/@manololigot2/how-i-built-a-free-ai-chatbot-using-cloudflare-workers-and-free-ai-models-no-openai-key-needed-1b6cd7789897)

### WebLLM (Browser-Based) Option

**Best Models for Portfolio Chatbot:**

| Model           | Size  | VRAM | Quality                       |
| --------------- | ----- | ---- | ----------------------------- |
| SmolLM2-360M    | 360MB | ~1GB | Basic, fast                   |
| Phi-3-mini (q4) | ~2GB  | ~2GB | Good quality, reasonable size |
| Llama-3.2-1B    | ~1GB  | ~2GB | Good balance                  |

**Implementation:**

```typescript
import * as webllm from "@mlc-ai/web-llm";

const engine = await webllm.CreateMLCEngine("SmolLM2-360M-Instruct-q4f16_1-MLC");
const response = await engine.chat.completions.create({
	messages: [{ role: "user", content: userMessage }],
});
```

**UX Considerations:**

- Show download progress (first-time ~360MB-2GB)
- Cache model in IndexedDB for repeat visits
- Offer "privacy mode" toggle for users who prefer local processing
- Graceful fallback if WebGPU not supported

### Sources

- [WebLLM GitHub](https://github.com/mlc-ai/web-llm)
- [WebLLM Docs](https://webllm.mlc.ai/docs/)
- [Appwrite WebLLM Tutorial](https://appwrite.io/blog/post/chatbot-with-webllm-and-webgpu)

### Chat UI Design (On-Brand)

```
┌─────────────────────────────────────────────────┐
│ ● ALEX_AI // Technical Assistant           ─ □ ✕│
├─────────────────────────────────────────────────┤
│                                                  │
│ [AI] How can I help with your project?          │
│                                                  │
│ [YOU] What's your experience with SaaS?         │
│                                                  │
│ [AI] I've built multiple SaaS platforms...      │
│                                                  │
├─────────────────────────────────────────────────┤
│ > Type message...                          [↵]  │
└─────────────────────────────────────────────────┘
```

**Visual Requirements:**

- Same window chrome as terminal (consistency)
- Cyber-lime for AI responses
- Mist White for user messages
- Typing indicator: blinking cursor animation
- Subtle "thinking" state: pulsing border

---

## 6. Implementation Priority

| Phase | Feature              | Effort      | Impact                             |
| ----- | -------------------- | ----------- | ---------------------------------- |
| 1     | Email (Resend)       | Low         | High - Core functionality          |
| 1     | Share Buttons        | Low         | Medium - Blog engagement           |
| 2     | Interactive Terminal | Medium      | High - Unique brand differentiator |
| 3     | WebGL Background     | Medium-High | Medium - Polish & wow factor       |
| 3     | AI Assistant         | Medium      | High - Innovative, lead generation |

---

## 7. Unique Brand Differentiators

To avoid looking generic, every feature follows these principles:

1. **Terminal Aesthetic:** All UI chrome mimics terminal windows
2. **Monospace Typography:** Commands, labels, status messages
3. **Cyber-Lime Accents:** Consistent highlighting
4. **No Rounded Corners:** Boxy, technical feel
5. **Functional Animation:** Spring physics, no linear easing
6. **Tech-Forward Copy:** "TRANSMIT_MESSAGE()" not "Send"

---

## 8. File Structure Overview

```
src/
├── app/
│   ├── api/
│   │   └── contact/
│   │       └── route.ts
│   └── ...
├── components/
│   ├── terminal/
│   │   ├── terminal.tsx
│   │   ├── commands/
│   │   └── ...
│   ├── chat/
│   │   ├── chat-widget.tsx
│   │   ├── chat-message.tsx
│   │   └── ...
│   ├── background/
│   │   ├── neural-field.tsx
│   │   └── shaders/
│   ├── blog/
│   │   └── share-buttons.tsx
│   └── emails/
│       └── contact-notification.tsx
├── lib/
│   ├── resend.ts
│   └── ai/
│       ├── cloudflare.ts
│       └── webllm.ts
└── ...
```

---

## 9. Cutting-Edge Tech Showcase

These features demonstrate mastery of the **latest web technologies** (2025):

| Feature           | Technology                        | Why It's Cutting-Edge                               |
| ----------------- | --------------------------------- | --------------------------------------------------- |
| **Email**         | React 19 Server Actions + Resend  | No API routes needed, form handling is native React |
| **Terminal**      | React 19 + TypeScript 5.5         | Modern hooks, strict typing                         |
| **WebGL**         | WebGPU (via Three.js r170+)       | Next-gen GPU API, 2-3x faster than WebGL            |
| **AI Chat**       | Cloudflare Workers AI (Edge LLMs) | Serverless AI at the edge, <50ms latency            |
| **AI Chat (Alt)** | WebLLM + WebGPU                   | LLMs running IN THE BROWSER — zero server           |
| **Sharing**       | Web Share API Level 2             | Native OS share sheets, no third-party scripts      |

### Latest Tech Highlights

**React 19 Features to Use:**

- `useActionState` for form handling (replaces useFormState)
- Server Functions without "use server" file directive
- Native `<form action={serverAction}>` binding
- Improved Suspense boundaries

**WebGPU Over WebGL:**

- Three.js r170+ supports WebGPU renderer
- 2-3x performance improvement over WebGL
- Better compute shader support for particles
- Progressive enhancement: fallback to WebGL2

**Edge AI (Cloudflare Workers AI):**

- Models run on Cloudflare's 300+ edge locations
- Sub-50ms inference latency
- Llama 3.2, DeepSeek-R1, Mistral available
- No cold starts (unlike Lambda)

**Browser-Native AI (WebLLM):**

- Full LLM inference in browser via WebGPU
- Models cached in IndexedDB (offline capable)
- Privacy-first: data never leaves device
- SmolLM2-360M to Llama-3.1-8B supported

---

## 10. Precision & Excellence Checklist

Before shipping each feature:

- [ ] **Performance:** Lighthouse score >90
- [ ] **Accessibility:** WCAG 2.1 AA compliant
- [ ] **Type Safety:** No `any` types, strict mode enabled
- [ ] **Error Handling:** Graceful degradation for all features
- [ ] **Loading States:** Skeleton/shimmer for async content
- [ ] **Mobile:** Touch-friendly, responsive breakpoints
- [ ] **Keyboard:** Full navigation without mouse
- [ ] **Animation:** Respects `prefers-reduced-motion`
- [ ] **Edge Cases:** Empty states, error states, loading states
- [ ] **Documentation:** JSDoc comments on public APIs

---

## 11. Dependencies to Add

```bash
# Email
npm install resend @react-email/components

# WebGL (if Option A)
npm install @react-three/fiber @react-three/drei three

# Terminal (optional helper)
npm install react-rnd  # For draggable/resizable

# AI (WebLLM option)
npm install @mlc-ai/web-llm
```

---

## 12. Next Steps

1. **Approve plan** or request modifications
2. **Phase 1:** Implement Resend email + share buttons
3. **Phase 2:** Build interactive terminal
4. **Phase 3:** Add WebGL background + AI assistant

Ready to proceed?
