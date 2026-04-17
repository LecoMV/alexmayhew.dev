# UI/UX + CRO Audit — alexmayhew.dev (2026-04-16)

**Status:** CURRENT
**Scope:** Full site, desktop + mobile, all primary user journeys
**Methodology:** Static analysis of React/Next.js source (no live browser). Evidence tied to specific files and components.
**Mandate:** REPORT ONLY — no edits.

## Executive Summary

alexmayhew.dev is a visually distinctive, technically well-built neo-brutalist portfolio positioning Alex as a Technical Advisor (not freelancer). The information architecture is clean, forms are well-engineered, and design tokens are consistent. However, the site has severe conversion-rate bottlenecks that are almost entirely about **absent social proof and trust signals** — not design flaws. The biggest CRO gap: a stranger landing on the site has no third-party evidence Alex is credible, and no low-commitment way to evaluate him beyond reading blog posts.

**Headline issues (in order of estimated conversion impact):**

1. Zero testimonials, zero client logos, zero case-study-branded attribution — metrics are floating numbers without attribution (CRITICAL)
2. No author photo anywhere — Person schema references a photo but it's invisible to users (CRITICAL)
3. CTA copy is code-syntax (`START_CONVERSATION()`, `INITIATE_PARTNERSHIP()`, `TRANSMIT_MESSAGE()`) — aesthetically on-brand but cognitively taxing and outcome-obscuring (HIGH)
4. Contact form has 6 required fields; no progressive disclosure, no friction-reducing defaults (HIGH)
5. Blog articles do NOT render the `RelatedBlogPostsSection` component — it exists and is only wired into service pages (HIGH, SEO+UX)
6. No sticky CTA, no exit-intent, no scroll-triggered lead capture (MEDIUM)
7. No pricing transparency (intentional, but it blocks qualified self-selection — MEDIUM)
8. Chat widget tech brag (`Powered by Qwen 32B`/`Workers AI`) is developer-flex that adds zero user value (LOW)

---

## CRITICAL

### C1. Zero social proof across the entire site

**Evidence:**

- Grep for `testimonial`/`Testimonial` across `src/**/*.tsx` returned **no results**.
- `src/components/pages/work-page.tsx` lists projects with NO client attribution — projects described by category, year, tech, no client name, no quote, no logo.
- `src/components/pages/about-page.tsx` lines 46–67: outcomes read "400% revenue increase for e-commerce platform" with no company name.
- `src/app/services/services-page-content.tsx` lines 65–70: `trustMetrics` = `400%`, `337x`, `$2M+`, `0` — **floating numbers with no client attribution**.
- `src/app/home-page.tsx` lines 270–287: stat tiles "15+ Years", "50+ Architecture Reviews", "337x Best Performance Gain", "99.95% Uptime" — self-reported, unverifiable.

**Why it kills conversion:** A stranger with a 5-figure budget decision sees impressive numbers and no source. Nielsen Norman: self-reported metrics without attribution register as hype. For a Technical Advisor positioning where engagement costs $10k-$50k+, buyers need **at least one** named client, quote, or identifiable logo before they'll fill the contact form.

**Conversion impact estimate:** Adding 2-3 named testimonials typically lifts B2B service-site conversion 30-100% (common B2B benchmark — e.g., Nielsen Norman, Basecamp case studies). Given the site currently has **zero**, the lift ceiling here is the largest on the entire site.

**Recommendation:** Priority #1. Reach out to 3-5 past clients (even unpaid / peer engagements) for named quotes with role + company. Place one hero-adjacent on `/`, one on `/services`, one on `/about`. Even a single quote with a photo beats four floating metrics.

---

### C2. No author photo anywhere visible to users

**Evidence:**

- `src/components/pages/about-page.tsx` has no `<Image>` of Alex — only timeline dots, skill cards, and icons.
- `src/app/home-page.tsx` hero uses a code-snippet visual element (lines 127–170) — no face.
- Blog posts (`src/components/blog/blog-article.tsx`) have no author byline with photo — only metadata row with date/reading-time/category (lines 90–131).
- Footer (`src/components/ui/footer.tsx`) shows only social icons.
- Person schema (per MEMORY.md) references a photo, but the site itself never renders one.

**Why it kills conversion:** E-E-A-T research (per `docs/research/person-schema-eeat-2026.md` already in repo) is unambiguous: for a Person-as-brand business, the face is the trust signal. Even Googlebot uses it for entity consolidation. For humans, it collapses the "is this a real person or a marketing page?" uncertainty.

**Conversion impact estimate:** MEDIUM-HIGH. For personal-brand advisory sites, an author photo in About + hero typically lifts consultation bookings 15-30%. Combined with C1 fix, compounds further.

**Recommendation:** Add a professional headshot to (1) About hero right column (replacing/augmenting outcomes card), (2) blog author byline at top and bottom, (3) small circular photo in footer next to social links.

---

### C3. Blog articles do NOT render RelatedBlogPostsSection

**Evidence:**

- `src/components/seo/related-blog-posts.tsx` exists, takes `slugs: string[]`, renders a clean grid.
- Grep result: imported and used ONLY in `/app/services/[slug]/`, `/app/services/comparisons/[slug]/`, `/app/services/integrations/[slug]/`, `/app/services/migrations/[slug]/`.
- `src/components/blog/blog-article.tsx` end of component (lines 263–290): article ends with newsletter CTA + secondary consultation CTA + ShareButtons. **No "Related articles" / "More in this series" / "Next in series" block.**
- Hub-and-spoke content architecture documented in `CLAUDE.md` (5 hubs, 39 spokes) — but spokes don't link back/sideways from the reading UI.

**Why it kills UX + SEO:** Bounce after article end instead of continued session. Lost internal linking opportunity (Google downgrades thin hubs). Lost conversion path (a reader who just consumed 10 minutes is 3-5× more likely to consume a second article than a cold visitor).

**Conversion impact estimate:** HIGH. Typical related-posts add-on: +25-40% pages/session on content sites. Combined with a proper series-aware "Next in series: X" component, this is the single highest-ROI UX change available.

**Recommendation:** Wire `RelatedBlogPostsSection` into `blog-article.tsx` BEFORE the newsletter CTA. For hub posts, list the 5 most relevant spokes. For spoke posts, show (a) the hub, (b) the previous + next in series, (c) 2-3 adjacent spokes.

---

## HIGH

### H1. CTA copy uses code-syntax metaphors that obscure outcome

**Evidence:**

- `src/app/home-page.tsx`: `START_CONVERSATION()` (line 104), `INITIATE_PARTNERSHIP()` (line 411).
- `src/app/services/services-page-content.tsx`: `SCHEDULE_CONSULTATION()` (line 341).
- `src/components/pages/contact-page.tsx`: `TRANSMIT_MESSAGE()` (line 51), `TRANSMISSION_COMPLETE` (line 68).
- `src/components/pages/case-study-page.tsx`: `VIEW_LIVE()`, `SOURCE_CODE()`, `DISCUSS_PROJECT()`.
- `src/components/pages/about-page.tsx`: `INITIATE_CONTACT()`.

**CRO principle:** CTAs should be outcome-first, verb-forward, low-cognitive-load. Research is unanimous (Unbounce, ConversionXL benchmarks): "Get X" > "Learn More" > "Submit". Parenthesized code-call syntax adds cognitive parse time AND implies formality/commitment the user may not be ready for.

**Why the aesthetic argument is weaker than it seems:** The `cyber-lime BOOK A CALL` primary button in the nav bar (line 281) is already effective because it's plain. Adding code-syntax on the body CTAs **reduces click rate without meaningfully strengthening brand** — the brand is already communicated by typography, colors, and layout.

**Conversion impact estimate:** MEDIUM. Changing `START_CONVERSATION()` → `Book a 30-min call` on the hero likely lifts hero CTA click-through 15-25%. Most impactful to change the ones gating contact form submission.

**Recommendation:** Keep the code-flavor ONLY where it's decorative and low-stakes (`sys.architect()` service tiles are fine — they're labels, not CTAs). Convert all **action** CTAs to plain-English outcomes:

- `START_CONVERSATION()` → `Book a call`
- `INITIATE_PARTNERSHIP()` → `Start the conversation`
- `TRANSMIT_MESSAGE()` → `Send message`
- `SCHEDULE_CONSULTATION()` → `Schedule a consultation`
- `DISCUSS_PROJECT()` → `Discuss a similar project`

### H2. Contact form has 6 required fields, no progressive disclosure

**Evidence:** `src/components/pages/contact-page.tsx` lines 155–320:

- Required: Name, Email, Project Type, Budget, Message, Turnstile (6 friction points)
- Optional: Referral Source (single field)
- No multi-step flow, no "just email me" quick-ship path.

**CRO principle:** Baymard / ConversionXL benchmarks: each required field above 3 reduces form completion ~5-15%. For high-intent leads the complete form is fine, but **mid-funnel prospects** who want to ask a question have no lightweight option.

**Good things already present:** "Not sure yet" budget option (line 256), specific referral options, Turnstile not reCAPTCHA, inline validation via Server Action, clear success state, a11y labels.

**Conversion impact estimate:** MEDIUM. Adding a "quick question? email me" direct mailto link near the form, or a 2-step reveal (show message-first, reveal qualifiers after `message.length > 50`), likely lifts total contact volume 20-30% without diluting qualified-lead quality.

**Recommendation:** Either:

- (a) Add a prominent "For quick questions: email alex@alexmayhew.dev" callout above the form, OR
- (b) Make Budget and Project Type optional with an asterisk-less label and a gentle "Optional but helps me prep" hint, OR
- (c) Two-step: show only Name/Email/Message first; reveal Project Type/Budget after Message field has content.

### H3. Hero headline pattern lacks outcome specificity

**Evidence:**

- `src/app/home-page.tsx` line 80-85: "Strategic / Architecture." (period intentional).
- `src/app/services/services-page-content.tsx` line 118: "Architecture decisions that / compound into advantage."
- `src/components/pages/about-page.tsx` line 133: "The difference between / architecture and accidents."

**Critique:** Aesthetic / evocative but **ambiguous about the reader's outcome**. A founder scanning in 5 seconds cannot answer "what will Alex do for me?" — they can only answer "Alex is a technical person with opinions."

**Compare to high-converting B2B hero patterns:**

- "I help Series A/B SaaS teams scale past their first architecture — without rewrites." (outcome + audience + differentiator)
- "Architecture advisory for founders scaling $1M→$10M ARR. Weekly reviews, async access, zero rewrites."

**Conversion impact estimate:** MEDIUM-HIGH. Hero-headline changes are among the highest-leverage CRO moves. Testing a outcome-specific variant against the current evocative variant typically yields 10-30% variance in scroll-depth past fold.

**Recommendation:** Keep the current headline as a visual H1 if you love it — but move the supporting paragraph (currently line 93-95, "I architect production systems...") UP and make it more specific: who, what outcome, in what timeframe, distinguished how.

### H4. No nav bar CTA on mobile — lg:block-only

**Evidence:** `src/components/ui/navigation.tsx` line 281: `className="...hidden shrink-0 px-4 py-2...lg:block"` — the "Book a Call" primary CTA appears only at `lg:` (≥1024px).

**Why it matters:** Mobile users (typically 40-60% of B2B tech traffic) get no persistent CTA in the viewport. Only the Contact item inside the mobile hamburger, buried at the end of the menu (line 406).

**Conversion impact estimate:** MEDIUM. Sticky or fixed mobile CTAs lift mobile conversion 10-30% on B2B sites.

**Recommendation:** Either (a) show the Book a Call button on mobile in the header (compact version — "Book" with a small icon), OR (b) show a discrete fixed bottom-left/right CTA button on scroll past the hero. The floating chat widget already occupies bottom-right, so bottom-left is the natural slot.

### H5. Homepage "15+ years" contradicts About "Six years" — credibility hit

**Evidence:**

- `src/app/home-page.tsx` line 252: "15+ years building production systems..."
- `src/app/home-page.tsx` line 272: Stat "15+ Years in Production Systems"
- `src/components/pages/about-page.tsx` line 155: "Six years of building systems that scale has taught me..."

**This is a trust-killer.** A skeptical prospect who cross-references the two pages will spot this immediately. Either number may be correct (15+ counts all work including pre-professional; 6 years counts senior/advisory) but the user can't reconcile them.

**Conversion impact estimate:** LOW in frequency, HIGH in severity when caught. The kind of prospect who catches this is exactly the high-intent CTO who walks away.

**Recommendation:** Reconcile to one consistent number, OR explicitly disambiguate (e.g., "6 years leading architecture after 9 years building systems hands-on — 15+ total in production"). This is a quick fix with outsized risk reduction.

### H6. No pricing transparency anywhere — zero qualifying signal

**Evidence:**

- `src/app/services/services-page-content.tsx` defines three tiers (Advisory Retainer, Strategic Implementation, Technical Due Diligence) with **commitment** ("10-20 hours/month", "Project-based", "1-2 weeks") but no price anchors.
- Contact form has budget ranges starting at "$5,000 - $10,000" — which **reveals the floor implicitly** (below $5k = not a fit).

**Critique:** This is a legitimate strategic choice (many top advisors hide pricing). But for a site that is simultaneously trying to rank organically and convert cold inbound leads, it creates a major unqualified-lead filter gap. "Starting at" or "From $X/month" on Tier 1 would filter out $500-budget prospects without committing to a number.

**Conversion impact estimate:** MEDIUM. If you hide pricing, your contact volume is inflated with unqualified leads. A typical "starting from" tier anchor reduces contact volume but improves qualified-lead ratio ~2-3×. Net revenue impact is usually positive.

**Recommendation:** Add a "Starting at $5k/month" or "From $X" line to the Advisory Retainer tier. Keep the other two tiers pricing-hidden ("Custom pricing" or "Contact for quote"). This gives a clear floor without negotiating ceiling.

### H7. Chat widget tech-brag, low discoverability, narrow use case

**Evidence:** `src/components/chat/chat-widget.tsx`:

- Line 186: "Online • Powered by Qwen 32B"
- Line 277: "Press Enter to send • Powered by Workers AI"
- Welcome message (line 31): "Hey! I'm Alex's AI assistant. Ask me about his work, tech stack, or how to get in touch."

**Critique:**

1. "Powered by Qwen 32B" / "Workers AI" is **developer flex**, not user value. Prospects don't care what model runs — they want to know what they can ask. Change to "Ask about architecture engagements, blog topics, or how to reach Alex."
2. No pre-seeded prompt chips ("What's an advisory engagement?", "Show me recent case studies", "Pricing?"). Cold chat inputs have 2-5% engagement; chip-prompted inputs have 15-25%.
3. The widget is in the expected bottom-right position but offers no visual hook to pull attention. "Notification dot" on line 160 only shows while messages.length === 1 (always, at load), so it's always-on — which means users ignore it.

**Conversion impact estimate:** LOW-MEDIUM. Chat widgets on B2B sites typically convert 3-8% of visitors into chats; of those, 10-20% become leads. Improvements here are incremental.

**Recommendation:** (a) Replace "Powered by..." footer with suggested prompts. (b) Remove the persistent notification dot — it's crying-wolf. (c) Consider triggering a proactive "Question about scaling architecture? Ask away." bubble on first scroll past hero on homepage only.

### H8. Services hero is page-layout (pt-32) not flex-1 justify-center — feels cramped vs homepage

**Evidence:**

- `src/app/home-page.tsx` hero uses `flex flex-1 flex-col justify-center px-6 pt-36 pb-12` (line 66).
- `src/app/services/services-page-content.tsx` uses `className="page-layout"` which per `globals.css` line 41 is a shared padding utility — no vertical centering, no flex-1.
- About, Work, Contact, Tools all use `page-layout` — consistent but flat.

**Critique:** Homepage hero feels premium (vertically centered, breathing room). Internal pages feel like stacked content. This inconsistency weakens the "oh this is a serious advisor" impression as a user clicks from home → services.

**Conversion impact estimate:** LOW-MEDIUM. Aesthetics/perceived-premium moves are hard to quantify but compound with other trust signals.

**Recommendation:** Give Services + Tools + About a taller hero zone (larger `pt-*`, maybe a min-height), or add a hero visual element (similar to the homepage code-philosophy box) to balance the left-aligned text.

---

## MEDIUM

### M1. No sticky or scroll-triggered CTA on long pages

**Evidence:** Grep for `sticky top|sticky bottom|fixed bottom` in `src/components/` returns only the chat-widget fixed button (`right-6 bottom-6`) and nav header. Blog posts, service pages, case studies: CTA appears once at end. Scroll depth past 60% has no re-engagement hook.

**Conversion impact estimate:** LOW-MEDIUM. Sticky CTAs can lift page-level conversion 5-15% but often annoy users. Safer alternative: scroll-triggered callout that appears at 60% scroll depth, then doesn't re-appear in session.

**Recommendation:** LOW priority. Only consider after C1-C3 and H1-H3 are fixed.

### M2. Dark-only site; no `prefers-color-scheme: light` honor

**Evidence:** `src/app/globals.css` line 436: `color-scheme: dark; /* Force dark for now */` inside the light media query. Intentional.

**Critique:** For this aesthetic, dark-only is correct — a light-mode neo-brutalist would be jarring. BUT: in dev-heavy audiences (Dev.to cross-posts, HN referrals) ~30-40% of visitors use light mode. They're served dark anyway.

**Conversion impact estimate:** LOW. Most dev audiences tolerate dark sites. Only impacts if a visitor is reading at night and the dark mode ambushes them. Not worth redesigning the design system.

**Recommendation:** No change. Document the decision explicitly somewhere user-facing ("Dark only — my eyes, my rules") if desired for personality, or leave silent.

### M3. Blog author byline is date + reading-time only — no author identity

**Evidence:** `src/components/blog/blog-article.tsx` lines 90-131: metadata row has Calendar, Clock, category tag, and optional Updated badge. NO author name, no "by Alex Mayhew", no photo, no link to /about.

**Conversion impact estimate:** MEDIUM. E-E-A-T: Google uses author bylines to match articles to Person entities. Humans use them to evaluate source credibility. Missing this on every post is both an SEO gap and a trust gap.

**Recommendation:** Add "By [headshot] Alex Mayhew" with link to /about at the top of the article header. Consider an "About the author" box at the article end (between article and newsletter CTA).

### M4. Work page has no case-study-ready entry for 90%+ of projects

**Evidence:** `src/components/pages/work-page.tsx` lines 162-174: Case Study link only rendered if `project.caseStudy?.published`. Most projects list only `View Project` / `Source Code` external links — a cold visitor clicks out to GitHub or a live site with no context for what problem was solved.

**Critique:** Portfolio projects without case studies leak traffic. Even a 300-word "what I did" paragraph below each project (inline expansion) retains users.

**Conversion impact estimate:** MEDIUM. Missed internal dwell time + lost SEO (case study pages are high-intent landing pages for industry-specific prospects).

**Recommendation:** Aim for all featured projects to have a short case-study page. Unpublished projects can be "Case study in progress" placeholder rather than invisible.

### M5. Form submit button does not confirm delivery-to-inbox in success state

**Evidence:** `src/components/pages/contact-page.tsx` line 358: success message reads "Message received. I'll respond within 24 hours."

**Critique:** Good, but doesn't set up email check expectation or offer next action (newsletter signup, view more work). Missed secondary conversion.

**Recommendation:** On success, expand to: "Message received. I'll respond within 24 hours. [optional: newsletter signup inline / "While you wait: browse recent case studies"]".

### M6. Quiz (SaaS Scaling Readiness) has no email capture

**Evidence:** `src/components/tools/saas-readiness-quiz.tsx` end (lines 290-313): results screen shows recommendations + Book Strategy Call CTA + Retake. No "Email me this report" option.

**Critique:** This is a LEAD MAGNET opportunity. Quiz completion is a high-signal intent event. Asking for email _after_ delivering value (not before) is the right pattern. Currently you get zero emails from quiz completers.

**Good:** "No email required" on intro is a deliberate design choice — and it's correct that the quiz delivers value WITHOUT gating. But an optional post-results capture is pure upside.

**Conversion impact estimate:** MEDIUM-HIGH for lead generation specifically. Even 10% of quiz completers opting in = meaningful newsletter growth.

**Recommendation:** After the Book a Call CTA, add a third optional CTA: "Email me this results PDF + a 5-part series on fixing the weakest area." Inline newsletter signup with smart default list-segment based on weakest category.

### M7. No visible credentials / "as seen in" / publication list on About

**Evidence:** `src/components/pages/about-page.tsx` has timeline, skills, differentiators, outcomes — but no "Featured in [X]", "Speaker at [Y]", "Contributor to [Z]". No university, certifications, or public talks.

**Critique:** Even 2-3 genuine mentions (Dev.to cross-posts, podcast appearances, HN front-page) in a discreet row significantly boosts E-E-A-T and human trust.

**Conversion impact estimate:** LOW-MEDIUM. Compounds with C1/C2. Don't fabricate — only add when real.

**Recommendation:** After the first trip through content distribution this year (Dev.to, LinkedIn articles, guest posts per the marketing plan), add a "Writing & speaking" section to About with logos/links.

### M8. Hamburger menu orders items badly for priority

**Evidence:** `src/components/ui/navigation.tsx` mobileOnlyItems (lines 38-43) appears AFTER navItems, putting Contact as last item in mobile menu — position 10.

**Critique:** Mobile users thumbing the hamburger scan top-to-bottom. Contact is the primary conversion page; it should be near the top OR pinned as a button at the top of the expanded menu.

**Conversion impact estimate:** LOW-MEDIUM on mobile conversions.

**Recommendation:** In the mobile menu, pin the Book a Call / Contact CTA button at the top (before the nav list), matching the desktop pattern.

### M9. Featured Insights on homepage caps at 5, no series context

**Evidence:** `src/app/home-page.tsx` lines 34-60: `featuredInsights` hardcodes 5 hub slugs. They're shown as equal cards with category labels only.

**Critique:** These are HUB posts (the hub-and-spoke architecture). Good choice to feature them. But the UI doesn't signal "this is a comprehensive guide" vs "this is a 1200-word article". A reader clicking a hub expects a 10-min read minimum.

**Recommendation:** Add a small "Comprehensive guide" or "8-part series" badge on each hub card. Signals depth, sets expectation, increases click-through intent.

### M10. 404 page is bare — missed retention opportunity

**Evidence:** `src/app/not-found.tsx` — single H1, one paragraph, one "Return Home" button. No search, no popular links, no recent posts.

**Conversion impact estimate:** LOW but easy win.

**Recommendation:** Add: (a) command-palette-style search, (b) "Or explore: /work, /services, /blog, /tools", (c) newsletter signup at the bottom. Keep visual brutalism consistent.

---

## LOW

### L1. No explicit loading/skeleton states

**Evidence:** Glob for `**/loading.tsx` in `/src/app/` returns no files. Next.js `loading.tsx` convention unused.

**Critique:** Because this is a static site with most content server-rendered and route-transitions instant, the absence is mostly fine. Tools pages (`/tools/voice-cloner`, `/tools/traceforge`) that load client apps could benefit.

**Conversion impact estimate:** NEGLIGIBLE for marketing pages. Marginal for tools.

**Recommendation:** Low priority. Only add if Web Vitals data shows LCP regressions.

### L2. Command palette (`cmdk`) has low discoverability

**Evidence:** Navigation.tsx line 287-293: Search icon button opens the palette. `aria-label="Search (Cmd+K)"` tells screen readers. Visual users see only a magnifying glass icon — they don't know `Cmd+K` works.

**Conversion impact estimate:** LOW. Power users find it. Mainstream users don't miss it.

**Recommendation:** Optional polish — show a small "⌘K" keycap hint next to the search icon on desktop (width permitting).

### L3. Micro-animation scroll-triggers not using `reducedMotion`

**Evidence:** Many `whileInView` animations with `viewport={{ once: true, margin: "-100px" }}` throughout home-page, services, about, case-study. Design system rule says spring physics — ✓ confirmed (`motion-constants.ts` pattern used).

**Critique (per Plan 4 in MEMORY.md already tracked):** LazyMotion provider doesn't pass `reducedMotion="user"` — users with OS-level reduced-motion still see springs.

**Recommendation:** Already in Plan 4 implementation queue.

### L4. Touch targets marginal on some icon-only buttons

**Evidence:**

- Chat widget close button (`h-6 w-6` content inside `h-14 w-14` — ✓ 56×56 touch target, safe).
- Nav search button (`p-2` around `h-4 w-4` icon = 32×32 touch target — **below WCAG 2.2 target size of 44×44**).

**Recommendation:** Increase `p-2` → `p-3` on the search button (gives 40×40, close to recommended). Same check on other `p-2` icon-only buttons.

### L5. Color psychology — neo-brutalist dark cyber-lime skews dev-tribal

**Evidence:** Aesthetic is well-executed; the design system rules file confirms intentional choice.

**Critique:** For target audience (founders + CTOs scaling $1-10M ARR), this aesthetic reads as **tribally-correct for technical hires, potentially alienating for business-side founders**. A CEO with a non-technical background landing on this page may feel "this isn't for me."

**Mitigation already in place:** The `/for` advisory pages segment by role. As long as those convert non-CTO audiences cleanly, the main site can stay dev-tribal.

**Conversion impact estimate:** NEGLIGIBLE if role-specific pages exist and rank. Don't dilute the brand to appeal to everyone.

**Recommendation:** No change to design system. Confirm that business-founder-targeted traffic lands on `/for/*` pages specifically, not homepage.

### L6. `/for` nav label "Advisory" is ambiguous vs. existing Services

**Evidence:** `src/components/ui/navigation.tsx` line 31: `{ href: "/for", label: "Advisory" }`. Services (line 30) and Advisory (line 31) sound overlapping. Mental model: "isn't Services the advisory thing?"

**Conversion impact estimate:** LOW. Users figure it out quickly.

**Recommendation:** Rename `/for` nav label from "Advisory" to "For" or "By Role" to signal the segmentation. Or merge into a Services dropdown with two tabs: "By Service" and "By Role".

### L7. Footer newsletter signup duplicates homepage and contact page

**Evidence:** `src/components/ui/footer.tsx` renders `<NewsletterSignup>`. Homepage bottom renders card variant. Contact page bottom renders minimal variant. Blog posts embed inline variant.

**Critique:** Four newsletter CTAs per user session isn't excessive for a content-led site, but the footer one is on every page, bringing total CTA touches on a blog-article view to **5**: article inline + article end + secondary CTA + newsletter card + footer newsletter.

**Conversion impact estimate:** LOW — unlikely harming conversion, marginal annoyance risk.

**Recommendation:** Consider removing the footer newsletter on article pages (render a simple "Made by Alex" footer variant). Keep footer newsletter on non-article pages.

### L8. No "Updated" badge in blog list view (only on article page)

**Evidence:** `src/components/blog/blog-list.tsx` shows posts via layout components. Article-level `updatedAt` rendered on blog-article.tsx line 112 but not surfaced in the list card.

**Conversion impact estimate:** LOW. Recency signals help SEO and trust on technical content.

**Recommendation:** Show a small "Updated [date]" badge on blog list cards when `updatedAt !== publishedAt`.

### L9. `robots: allow /` with no crawl budget hints

Out of scope for UI/UX audit. Flagged for SEO audit sibling doc if not already covered.

### L10. No demo video / Loom on services page

**Evidence:** Services page is 100% text + metric tiles + cards. No embedded video introduction.

**Conversion impact estimate:** LOW-MEDIUM. 60-90s Loom "what to expect from an advisory engagement" would reduce friction for fence-sitters.

**Recommendation:** Optional. Record a single 90s Loom addressing: "What does a first-week engagement look like?" Embed above the tier cards on /services.

---

## Positive Findings (what's genuinely working)

- **Information architecture is clean.** Top nav is 6 items + CTA, well-organized. Tools dropdown is well-scoped.
- **Mobile nav logic is correct.** Hamburger opens sensibly, sub-menu for tools works, animations are spring-based.
- **Forms are well-engineered.** Server Actions, Turnstile not reCAPTCHA, useFormStatus for pending, clear success/error states, a11y labels, proper `aria-invalid`/`aria-describedby`.
- **Design system is disciplined.** No forbidden patterns in modern code, tokens consistent, spring physics throughout.
- **Blog article UX is strong.** Reading progress bar, TOC (mobile + desktop sticky), share buttons, view transitions, category/tag visibility.
- **Quiz tool is well-designed.** 3-phase state machine, progress bar, category breakdowns in results, tier-based recommendations.
- **Focus states are present on form inputs.** `focus-visible:ring-2 focus-visible:ring-cyber-lime` on inputs, selects, textareas. (Plan 4 calls out focus-ring on buttons specifically — inputs are OK.)
- **Skip-to-content link exists** (navigation.tsx line 120-125).
- **Cookie Consent component is present** with region-specific defaults (per MEMORY.md).
- **Progressive enhancement on chat widget:** timeout via AbortSignal, graceful error fallback, a11y role="dialog".
- **Breadcrumbs** on services, case studies, contact, for-hub, voice-cloner, etc. Consistent JSON-LD pattern.

---

## Priority Matrix (what to fix first for max CRO)

| Rank | Item                                                   | Effort               | Impact         | Owner              |
| ---- | ------------------------------------------------------ | -------------------- | -------------- | ------------------ |
| 1    | C1 — 2-3 testimonials with attribution                 | High (outreach)      | CRITICAL       | Alex personally    |
| 2    | C3 — Wire RelatedBlogPostsSection into blog articles   | Low                  | HIGH           | Engineering        |
| 3    | C2 — Add author photo to hero/about/blog               | Medium (photo shoot) | CRITICAL       | Alex + Engineering |
| 4    | H1 — Replace code-syntax CTAs with verb+outcome        | Low                  | MEDIUM         | Engineering        |
| 5    | H2 — Add "quick question" email option to contact form | Low                  | MEDIUM         | Engineering        |
| 6    | H5 — Reconcile 15+ vs 6 years inconsistency            | Trivial              | MEDIUM (trust) | Content            |
| 7    | M3 — Author byline with photo on blog articles         | Low                  | MEDIUM         | Engineering        |
| 8    | M6 — Optional email capture on quiz results            | Medium               | MEDIUM         | Engineering        |
| 9    | H4 — Mobile nav CTA visibility                         | Low                  | MEDIUM         | Engineering        |
| 10   | H6 — "Starting from $X" price anchor on Tier 1         | Trivial              | MEDIUM         | Content            |

Anything ranked lower should wait until after these 10 ship and conversion baseline is re-measured.

---

## Conversion Funnel Hypothesis (for post-fix measurement)

Current likely funnel (estimated from site design, not live data):

- Visitor → Blog article read: ~10-15% (good content, decent search ranking on long tail)
- Blog reader → Second page: ~15-25% (no related posts, newsletter CTA only)
- Any page → Contact form view: ~2-5% (CTAs exist but code-syntax weakens)
- Contact form view → Submission: ~20-40% (6 required fields — OK but not great)
- Overall cold-visitor → contact: likely **0.1-0.3%** (typical B2B service site floor)

After C1+C3+H1+H2 fixes, expected:

- Blog reader → Second page: 30-50% (related posts + proper series navigation)
- Any page → Contact form view: 4-8% (verb-outcome CTAs, social proof reduces friction)
- Contact form view → Submission: 30-50% (quick-question path + outcome-clear CTAs)
- Overall cold-visitor → contact: **0.5-1.0%** — a 3-5× lift is realistic

Add the quiz-to-newsletter capture (M6) and the site starts generating a marketing asset (email list) not just a contact pipeline.

---

## Sources / Evidence Files (absolute paths)

Primary files inspected:

- `/home/deploy/projects/amdev/alexmayhew-dev/src/components/ui/navigation.tsx`
- `/home/deploy/projects/amdev/alexmayhew-dev/src/app/home-page.tsx`
- `/home/deploy/projects/amdev/alexmayhew-dev/src/app/services/services-page-content.tsx`
- `/home/deploy/projects/amdev/alexmayhew-dev/src/components/pages/about-page.tsx`
- `/home/deploy/projects/amdev/alexmayhew-dev/src/components/pages/contact-page.tsx`
- `/home/deploy/projects/amdev/alexmayhew-dev/src/components/pages/work-page.tsx`
- `/home/deploy/projects/amdev/alexmayhew-dev/src/components/pages/case-study-page.tsx`
- `/home/deploy/projects/amdev/alexmayhew-dev/src/components/pages/tools-page.tsx`
- `/home/deploy/projects/amdev/alexmayhew-dev/src/components/blog/blog-article.tsx`
- `/home/deploy/projects/amdev/alexmayhew-dev/src/components/blog/blog-list.tsx`
- `/home/deploy/projects/amdev/alexmayhew-dev/src/components/blog/table-of-contents.tsx`
- `/home/deploy/projects/amdev/alexmayhew-dev/src/components/blog/share-buttons.tsx`
- `/home/deploy/projects/amdev/alexmayhew-dev/src/components/blog/reading-progress.tsx`
- `/home/deploy/projects/amdev/alexmayhew-dev/src/components/chat/chat-widget.tsx`
- `/home/deploy/projects/amdev/alexmayhew-dev/src/components/newsletter/newsletter-signup.tsx`
- `/home/deploy/projects/amdev/alexmayhew-dev/src/components/tools/saas-readiness-quiz.tsx`
- `/home/deploy/projects/amdev/alexmayhew-dev/src/components/ui/footer.tsx`
- `/home/deploy/projects/amdev/alexmayhew-dev/src/app/for/for-hub-page.tsx`
- `/home/deploy/projects/amdev/alexmayhew-dev/src/app/not-found.tsx`
- `/home/deploy/projects/amdev/alexmayhew-dev/src/app/layout.tsx`
- `/home/deploy/projects/amdev/alexmayhew-dev/src/components/seo/related-blog-posts.tsx`
- `/home/deploy/projects/amdev/alexmayhew-dev/src/components/ui/command-palette.tsx`

Cross-reference prior research:

- `docs/research/person-schema-eeat-2026.md` — E-E-A-T Person schema requirements (confirms C2)
- `docs/research/homepage-internal-linking-seo-2026.md` — Internal linking optimums (supports C3)
- `docs/research/blog-pagination-seo-nextjs15-2026.md` — Blog crawlability (adjacent to C3)
- MEMORY.md "15-Agent Site Audit (2026-04-05)" — Plan 3 CRO & Content already flagged "ZERO social proof" (this audit extends that)
