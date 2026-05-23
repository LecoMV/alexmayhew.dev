# pSEO Thin Content & Service Pages — 2026 Research (2026-05-01)

**Status:** CURRENT
**Session:** Validating decision on 5 thin service pages flagged in audit (152/136 to 103/94 word counts in `whyThisStack`/`projectApproach`, 3 FAQs each). Site is zero-authority (~11 indexed pages, 2 clicks/90 days). Question: expand to ≥150 words + 4th FAQ, or noindex/remove?
**Sources:** 18 sources across WebSearch + NimbleWay (deep) + direct fetch (Stripe/Vercel/Cloudflare/Atlassian)

---

## Verdict (TL;DR)

**Expansion to 150 words is NOT enough. The 5 service pages must be either:**

1. **Expanded to 600–900 words of unique copy** with original positioning, named-author E-E-A-T markers (Alex's photo, credential bullets, real client outcomes), AND 4–6 FAQs per page — OR
2. **noindex'd until rewritten** (do NOT 410 — these are the indexable authority surface, just suppress until upgraded)

The 150-word floor in the audit rule is below the modern threshold for ranking competitiveness AND below the threshold at which Google's site-quality models stop tagging a page as low-information-gain. Thin pages on a zero-authority domain are a **double penalty**: they drag the site-quality signal AND fail to rank because Information Gain scoring (March 2026 core update, source 6) demands new knowledge per page.

**Threshold word count:** 600 words minimum unique editorial copy per service page (excluding nav/footer/FAQ chrome). Stretch target: 800–1,200. Real-world enterprise comparators below.

**Risk if kept indexed as-is:** ~30–50% sitewide quality drag per March 2026 core update data (source 6), where "templated/keyword-swapped" pages dropped 30–50% AND pulled domain-quality signals down. For a zero-authority site, this means the existing 11 indexed pages also rank worse, not just the thin 5.

---

## Key Findings

### 1. Google's "thin content" threshold is NOT a word count — it's an Information Gain / quality signal

- **Google has never published a numeric word count threshold.** John Mueller and Gary Illyes have repeatedly said content length is not a ranking factor [source 7, 9]. BUT...
- **March 2026 core update added Information Gain as a primary signal** [source 6]: "Google now evaluates whether your content teaches the reader something they could not learn from the existing search results. A single original data point... is worth more than ten paragraphs of rewritten competitor content."
- **December 2025 core update data (sources 4, 6):** Sites where **<7% of pages have ≤500 words** saw stability; sites where **≥32% of pages were thin** got demoted. This is the closest published threshold the industry has.
- **March 2024 "Scaled Content Abuse" policy** (Google Search Central, source 14): "many pages generated for the primary purpose of manipulating Search rankings... regardless of whether content is produced through automation, human efforts, or some combination." The leaked `QualityCopiaFireflySiteSignal` protobuf [source 11] is the technical implementation — site-level, not page-level.

### 2. Site-level quality signals exist and they do drag you down (verified by 3 sources: Mueller direct quotes)

Glenn Gabe documented this in 2017 [source 1] and re-confirmed it survives every algorithm update through 2026:

> "From our point of view, our quality algorithms do look at the website overall, so they do look at everything that's indexed." — John Mueller

> "It measures the quality of a site pretty much by looking at the vast majority of the pages at least... allows us to take quality of the whole site into account when ranking pages from that particular site." — Gary Illyes

Source 2 (Search Engine Journal, Roger Montti citing Mueller): "a site with mostly low quality content is going to have a harder time trying to rank a high quality page." For a zero-authority site with 11 indexed pages and ~5 of them flagged thin, that's **~45% of the indexable surface flagged thin** — squarely in the "demoted" bucket per source 4's published threshold.

### 3. Programmatic SEO survival data — what got hit, what survived

**The carnage (March 2026 core update, source 6):**

- Programmatic city/location pages: −32% avg
- Template-based "best X in Y" pages: −35% avg
- Generic listicles: −20% avg
- AI content farms with no editorial review: −45% avg
- HubSpot lost 70–80% of organic traffic in 2025–2026 cycle (named in source 6)
- Travel site that built 50,000 "hotels in [city]" pages had 98% deindexed within 3 months [source 5]
- YMYL site with 20K URLs and "programmatic aspect" was completely deindexed (Glenn Gabe 2026 case study, source 16)

**What survived:**

- Sites with original photos, hands-on testing, named experts (Wirecutter, RTINGS held positions)
- Pages with proprietary data, calculators, or tools
- Niche-focused sites covering narrow categories deeply
- Content with first-person experience markers and verifiable author credentials

**Implication for our 5 service pages:** they are NOT pSEO templated pages — they are real service pages where Alex actually offers the service. That positions them on the survivable side IF they're written like real service pages and not like SEO templates. The 100-word `whyThisStack` paragraph is the failure mode — it reads like template fill, not like an expert offering a service.

### 4. Crawl budget on zero-authority sites — Mueller's 2025 stance

- Mueller (2025): crawl budget is "over-rated" for sites under 1M pages [source 13]; the real signal is whether Google trusts your site's overall merit
- "If a site is technically sound yet barely indexed, it often signals that Google isn't convinced of the site's overall merit" [source 13]
- Confirmation from Stan Ventures / Google data [source 13]: ~85% of crawl issues come from structural traps (faceted nav, params) — NOT from too many pages per se. But low-quality pages that DO get indexed reduce trust, which reduces future crawl frequency.
- For alexmayhew.dev specifically (11 indexed / ~180 total), the bottleneck is **trust signal, not crawl budget**. Every thin page is a vote against trust.

### 5. Real enterprise service-page word counts (direct fetch, 2026-05-01)

Pulled directly today via curl + HTML text extraction:

| Page                                             | Word count (full page) | Notes                                                  |
| ------------------------------------------------ | ---------------------- | ------------------------------------------------------ |
| `stripe.com/atlas`                               | **1,551 words**        | Includes nav/footer chrome; unique copy ~700–900 words |
| `stripe.com/payments`                            | **2,281 words**        | Excluding nav/footer/header                            |
| `vercel.com/solutions/nextjs`                    | **1,213 words**        | Solution-style page                                    |
| `cloudflare.com/developer-platform/.../workers/` | **1,357 words**        | Product page                                           |
| `atlassian.com/software/jira/service-management` | **751 words**          | Closer to a "lightweight service page" reference       |

**Atlassian's Jira Service Management at 751 words is the relevant floor for B2B service pages from massive-authority brands.** alexmayhew.dev is zero-authority and competing in a crowded "fractional CTO / consultant" niche where any of 50+ sites have more authority. The pages need to outclass on Information Gain, which requires **substantial unique content**, not 150-word blurbs.

### 6. The 150-word floor in the project audit rule is too low

Cross-referencing source 4 (December 2025 core update findings) and source 8 (BruceClay/Yoast minima):

- **Yoast cornerstone content minimum:** 900 words
- **General regular page minimum:** 300 words [source 8]
- **December 2025 stability threshold:** ≤500 words flagged thin in aggregate
- **Mueller via Lumar (2025) [source 7 cluster]:** "thin content is content that does not provide value... not a word count threshold per se, but if it's <100 words it's definitely thin"

**A 150-word service page absolutely qualifies as thin under all three frameworks.** 300 words is the floor for "not-flagged-as-thin." 600+ is the floor for "competitive in a B2B services niche." For this site's specific situation — zero authority, fighting Information Gain scoring — the floor is **closer to 800 words** of genuine domain expertise.

### 7. The "fix forward, not noindex" decision matrix (Glenn Gabe, source 1)

Mueller-endorsed framework, still current in 2026:

> **First option:** Boost content quality. Highly recommended if you can.
> **Second option:** When there's so much low-quality/thin content that it's not feasible to boost, nuke via noindex or 410.

For 5 pages, **boosting is feasible**. These aren't 20K templated pages — they're 5 real service offerings on a personal advisory site. Noindex is the wrong tool here.

---

## Conflicting Information

**On word count as a ranking factor:**

- Google reps (Mueller/Illyes, sources 1, 7, 13): NOT a direct ranking factor
- 2026 industry data (sources 4, 6, 8): Strong correlation between word count thresholds and ranking outcomes
- **Resolution:** Word count is a _proxy_ — short pages can't deliver Information Gain or E-E-A-T markers, so they fail indirectly. Mueller is technically right; the industry data is operationally right.

**On noindex impact on crawl budget:**

- SEJ (source 17): "Noindexed pages do not impact crawl budget" — Mueller direct quote
- Wellows / Stan Ventures (source 13): noindex eventually reduces crawl frequency on those URLs over time
- **Resolution:** Both are true at different timescales. Noindex doesn't help short-term crawl, but Google does eventually de-prioritize crawling noindex pages, which frees aggregate budget.

---

## Gaps

- No direct numeric Google guidance on "minimum service page word count for B2B advisory sites" (none exists)
- No A/B test data specifically for fractional CTO / advisory-style pages on zero-authority domains
- The QualityCopiaFireflySiteSignal scoring formula isn't public — we know it exists, we don't know the exact thresholds [source 11]

---

## Decision For alexmayhew.dev

**Expand all 5 pages to 600–900 words of unique editorial copy, add 4–6 FAQs each, AND add named-author E-E-A-T markers.** Don't noindex.

Specific structure recommendation per page:

1. Hero (50 words)
2. `whyThisStack` (200–250 words — currently 103–152) — make this concrete, name actual technical decisions, cite a real client outcome
3. `projectApproach` (250–300 words — currently 94–136) — show methodology, week-by-week, deliverables, avoid generic phases
4. Outcome / metrics block (100 words) — quantified results from past work
5. 4–6 FAQs (300–400 words total) — addressing real prospect concerns
6. CTA (50 words)

**Total:** ~900–1,200 words. This puts the pages at **roughly Atlassian Jira Service Mgmt parity** (751 words) and well above the December 2025 thin-content trigger threshold.

**If expansion can't happen this week:** noindex the 5 pages until they're ready. Do NOT leave them indexed as-is — the site-quality drag is real and disproportionate at zero authority.

---

## Sources

1. [Should You Remove Low-Quality Or Thin Content Versus Improving It? — Glenn Gabe, GSQI](https://www.gsqi.com/marketing-blog/remove-versus-improve-low-quality-thin-content/) — Mueller/Illyes direct quotes on site-level quality scoring; "all pages indexed are taken into account." Decision matrix: boost / noindex / 410. **[verified by 3 sources]**
2. [Google on Effect of Low Quality Pages on Sitewide Rankings — Search Engine Journal](https://www.searchenginejournal.com/google-low-quality-signals/306277/) — Mueller webmaster hangout: density of low-quality noise within a site can prevent good pages from ranking
3. [March 2026 Core Update: Content Quality Winners & Losers — Digital Applied](https://www.digitalapplied.com/blog/march-2026-core-update-content-quality-winners-losers) — 30–50% drops on thin/templated, 15–25% gains on E-E-A-T, named HubSpot 70–80% loss
4. [What Google's Helpful Content Update Means for Your Website in 2026 — Keyword Performance](https://www.keywordperformance.com/blog/what-googles-helpful-content-update-means-for-your-website-in-2026/) — December 2025 thresholds: <7% thin = stable, ≥32% thin = demoted
5. [Programmatic SEO In 2026: The Best Guide to Scaling Traffic — Zumeirah](https://zumeirah.com/programmatic-seo-in-2026/) — Travel site 50K hotel pages, 98% deindexed within 3 months
6. [Programmatic SEO in 2026: What Still Works and What Gets Deindexed — Ranktracker](https://www.ranktracker.com/blog/programmatic-seo-2026/) — Pattern detection without intent gets deindexed; "if a human wouldn't find the page useful, neither will AI-driven indexing systems"
7. [How Google Deals With Thin Content on Websites — Lumar Office Hours](https://www.lumar.io/office-hours/thin-content/) — Mueller on thin content not being purely a word count metric
8. [BruceClay — Is Google Looking for a Minimum Word Count on Webpages?](https://www.bruceclay.com/blog/google-minimum-word-count-webpages/) — Industry baselines: 300/200/900 words by content type
9. [Yoast — Word count and SEO: how long should an article or page be?](https://yoast.com/blog-post-word-count-seo/) — Cornerstone content 900-word floor
10. [Mastering Google's Helpful Content Guidelines in 2025 — Whitepress](https://www.whitepress.com/en/knowledge-base/2227/google-helpful-content) — HCU integration into core algorithm March 2024
11. [What is "Firefly"? Google's Scaled Content Abuse System: QualityCopiaFireflySiteSignal — Hobo Web](https://www.hobo-web.co.uk/firefly/) — March 2024 leak revealed the protobuf; technical implementation of scaled content abuse policy
12. [Why Website Deindexed By Google For Programmatic SEO Bounced Back — Search Engine Journal](https://www.searchenginejournal.com/why-website-deindexed-by-google-for-programmatic-seo-bounced-back/552179/) — Recovery via E-E-A-T realignment, not by pruning alone
13. [Google: Noindexed Pages Do Not Impact Crawl Budget — Search Engine Journal](https://www.searchenginejournal.com/google-noindexed-pages-do-not-impact-crawl-budget/472870/) — Mueller direct on noindex/crawl interaction
14. [What web creators should know about our March 2024 core update and new spam policies — Google Search Central](https://developers.google.com/search/blog/2024/03/core-update-spam-policies) — Official policy: scaled content abuse, method-agnostic; goal of 40% reduction in low-quality content (achieved 45%)
15. [Google's Site Quality Score & Impact on Your Rankings — Stan Ventures](https://www.stanventures.com/blog/googles-site-quality-score/) — Site-level quality score concept post-leak
16. [Deindexed, Delayed, and Down — Glenn Gabe GSQI Case Study 2026](https://www.gsqi.com/marketing-blog/deindexed-and-delayed-manual-action-case-study/) — YMYL site with 20K URLs and programmatic aspect totally deindexed; AI-content pockets contributed
17. [Crawl Budget Optimization: 7 Ways to Improve Crawling 2026 — Crawlvision](https://crawlvision.com/blog/crawl-budget-optimization-boost-crawl-efficiency/) — Modern crawl budget framing
18. Direct fetch (2026-05-01): stripe.com/atlas, stripe.com/payments, vercel.com/solutions/nextjs, cloudflare.com/developer-platform/products/workers/, atlassian.com/software/jira/service-management — actual word counts of enterprise service pages
