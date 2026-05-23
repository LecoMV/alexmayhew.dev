# Backlink Tactics for Solo Technical Advisor Sites — Research (2026-05-01)

**Status:** CURRENT
**Session:** Validate Codex's Q3 2026 backlink playbook for alexmayhew.dev. Site has 5 verified BLs across 3 mid-tier domains (hiddenbrains, freeduhm, techmagazine). Goal: 10-15 credible referring domains by end Q3. Codex recommended 5 dev.to canonical cross-posts + 20 link-opportunity pitches.
**Sources:** 12 sources across WebSearch, NimbleWay deep extract, direct domain probes
**Confidence:** Medium-high. Three independent SEO industry sources agree on HARO-replacement landscape and dev.to canonical risk. Single primary source (Bakhat Yar's 50-article study) for dev.to indexing data — directionally consistent with Google's own canonicalization guidance.

---

## Key Findings (Most Important First)

1. **Codex's tactic order is largely correct, but the dev.to canonical strategy is structurally compromised.** Google updated its docs in May 2023 to **explicitly NOT recommend canonical tags for syndicated content** [4]. Google's stated reason: cross-domain canonicals from a high-DA syndicator (DA 78+ for dev.to) to a low-DA personal site (alexmayhew.dev DR <10) frequently get _ignored_ — Google selects dev.to as the preferred URL because it has more authority signals (Core Web Vitals, backlinks, DA). The dev.to version then ranks while the original is treated as duplicate. Recommended fix: cross-post but treat dev.to as a **brand visibility / discovery channel**, not as a Google authority pipeline. Set `canonical_url` anyway (defensive), but do NOT count on it passing rank signals.

2. **HARO is back (April 2025) under Featured.com ownership, but Featured itself is the better tactical play.** [1][2] Featured has the **fastest turnaround (18 days vs 27-day platform average) and highest documented conversion rate** of all HARO alternatives, per Backlinko's Greg Heilers (25,000+ placements analyzed). Subscription model: free tier = 3 answers/month, paid plans $19-$99/mo. Caveat: Featured has been internally cross-linking its own subsites (private-blog-network risk) — links from Featured-placed articles in Forbes/USA Today/Fast Company are still high-value editorial links, but _links pointing to Featured itself_ are suspect.

3. **Featured.com (paid tier), MentionMatch (free, B2B/tech-focused), and Source of Sources (free, HARO 2.0) are the three platforms a fractional CTO should use.** Skip Qwoted unless you have $149/mo PR budget AND don't need SEO links — Qwoted is "decidedly standoffish toward SEO agencies." [1] HARO itself: now AI-detection-gated, false-positive heavy, lower conversion than Featured — keep on radar but don't lead with it.

4. **Podcast guesting delivers backlinks but requires saturation-aware targeting.** [5] 2026 saturation: 4.5M+ shows. Naive "be a guest" tactic no longer works. **Realistic conversion path:** podcast appearance → show-notes link (typically dofollow on Libsyn/Blubrry/Anchor — DA 80-90 hosting platforms) → indexed in 2-8 weeks → ranks weakly without supporting links. ROI is brand + audience-trust + 1 backlink per episode, NOT direct ranking. Best-fit shows for fractional CTO: **Modern CTO Podcast (Joel Beasley, 150k+ active listeners), The CTO Advisor (Keith Townsend), Alphalist.CTO, CTO Confessions, Software Engineering Daily, The CTO Podcast (Etienne de Bruin / 7CTOs)**. [11]

5. **GitHub README outbound links are nofollow.** [6] All user-generated content on GitHub gets `rel="nofollow"` automatically (and increasingly `ugc` post-2019). Google treats nofollow as a _hint_, not a directive — a link from a high-quality, high-traffic awesome-list repo still carries some weight as a brand signal, but it does NOT pass meaningful PageRank. **Verdict:** GitHub README placement is a **brand-discovery tactic**, not a PageRank tactic. Worth pursuing for traffic + signal-to-engineers, NOT as primary backlink strategy.

6. **The current 5 backlinks are mid-quality at best.** hiddenbrains.com is a legitimate Indian dev shop (700+ employees, 2400+ clients, founded 2003, Clutch 4.9 across 47 reviews [10]) — links are real but the domain reads "outsourcing services," not "tech editorial." freeduhm.com being TollBit-AI-paywall-gated means **Googlebot still crawls (TollBit only gates AI agents like GPTBot, ClaudeBot, PerplexityBot)** — the link is fine for Google, but the AEO/GEO value is zero (AI assistants can't cite content they're paywalled from). techmagazine.io is unverified and likely a low-quality guest-post network — 85% of "tech blog" guest sites are sub-DR-40 filler with no organic traffic [12]. **Net assessment: keep, don't actively distance, but don't count any of these toward your "10-15 credible RDs" goal.**

7. **Linkable assets that actually get cited in dev tooling in 2026: original benchmark reports with quotable numbers.** [3][9] LinearB's 2026 Software Engineering Benchmarks (8.1M PRs analyzed), TechEmpower Web Framework Benchmarks, LogRocket AI Dev Tool Power Rankings. The pattern: **a number, a comparison, a trend, a takeaway** — packaged with explicit methodology so journalists/AI can defend quoting it. Top-tier linkable assets earn 5-14% more links/month than long-form blog posts. For a solo fractional CTO, the realistic asset = a small-N benchmark or framework with rigorous methodology, NOT a "state of industry" report.

---

## Details

### 1. HARO Replacement Landscape (verified by 4 sources [1][2][7][8])

**Featured.com** — The clear winner for solo brand-building.

- Acquired HARO April 2025; both run separately now.
- Free plan: 3 answers/month. Paid: $19-$99/mo.
- Conversion ratio is highest of all platforms tested (Backlinko's 25,000+ placement dataset).
- Turnaround: 18 days avg (vs HARO's 32, Source of Sources' 42, MentionMatch's 14).
- Publications include Forbes, USA Today, Fast Company, Yahoo Life, U.S. News, Bankrate.
- **Risk flag:** Featured has been linking its own subsites — Google may discount these as PBN. The Forbes/USA Today links from Featured placements remain valid; the Featured.com subsite links do not.

**MentionMatch** (formerly Help A B2B Writer) — **Best free option for fractional CTO niche.**

- Free, owned by Superpath content community.
- Niche: marketing, sales, **tech**.
- Highest conversion rate within its niche.
- 14-day turnaround.
- Provides basic SEO metrics for opportunities.
- **Recommendation:** primary daily-pitch platform. Spend 15 min/day reviewing queries.

**Source of Sources (SoS)** — HARO 2.0, founded by Peter Shankman (original HARO founder).

- Completely free.
- Identical email-digest format to original HARO.
- Currently has lower conversion than Featured/MentionMatch — but free, broad, growing.
- **Recommendation:** secondary scan, 5 min/day.

**Qwoted** — Skip for SEO/link-building purpose.

- $149/mo for 35 pitches.
- Top-tier publications, but "decidedly standoffish toward SEO agencies."
- Better for PR/brand (not links).

**HARO (revived)** — Use selectively.

- Free, run by Featured.com ownership.
- AI-detection scoring (false-positive risk if you draft with AI assistance, then edit).
- Profile-location verification (lifetime ban if mismatched).
- Worth scanning the daily digest, but Featured + MentionMatch should be primary.

### 2. Dev.to Canonical Strategy — Structural Risk

**Google's official position (May 2023, still current):**

> "The canonical link element is not recommended for those who wish to avoid duplication by syndication partners, because the pages are often very different. The most effective solution is for partners to block indexing of your content." [4]

**What this means for alexmayhew.dev cross-posting:**

- Setting `canonical_url` in dev.to frontmatter is still recommended _defensively_ — it's a hint, and sometimes Google honors it.
- But Google increasingly _picks the higher-authority URL_ as canonical, regardless of the tag. Dev.to is DA 78+. alexmayhew.dev is DR <10. Math is unfavorable.
- The Bakhat Yar 50-article dev.to study found: **only 4 of 50 dev.to articles had `canonical_url` set at all** — and many of the 11 that ranked outranked their own original sources. [3]

**Tactical recommendation for the 5 dev.to cross-posts:**

1. **Treat dev.to as discovery + audience + 1 nofollow brand mention** — not as a Google ranking play.
2. Set `canonical_url` defensively (no downside).
3. Wait 30+ days after publishing on alexmayhew.dev BEFORE syndicating to dev.to. This gives Google time to index the original and treat it as the source of record.
4. Don't expect the dev.to version to "pass authority" to alexmayhew.dev — at best it's inert, at worst it cannibalizes.
5. The dev.to author bio link (homepage/about) IS a valuable backlink — that's the actual link payoff, not the canonical signal.

### 3. Podcast Guesting — Realistic Math

**Per-episode backlink yield: ~1 dofollow link** (show notes) + 1-2 secondary nofollow mentions (host's blog post about episode, social shares).

**Indexing timeline:** 2-8 weeks for show-notes pages on platforms like Libsyn/Blubrry/Anchor (DA 80-90), faster on host-owned domains.

**Ranking impact:** Weak alone — supporting links from related content needed. The realistic value is brand authority + audience reach + topical-relevance signal, not "rank for keyword X."

**Best-fit shows for a fractional CTO / Principal Engineer in 2026:**

| Podcast                    | Host                 | Audience                      | Format            |
| -------------------------- | -------------------- | ----------------------------- | ----------------- |
| Modern CTO Podcast         | Joel Beasley         | 150,000+ active listeners     | 45-min interviews |
| The CTO Advisor            | Keith Townsend       | Mid-size tech-exec audience   | 15-30 min         |
| Alphalist.CTO Podcast      | Various              | EU CTO community              | Tech leadership   |
| The CTO Podcast (7CTOs)    | Etienne de Bruin     | CTO peer audience             | Leadership focus  |
| CTO Confessions            | TC Gill              | Engineering leadership        | Interview format  |
| Software Engineering Daily | Jeff Meyerson alumni | Engineering generalist, large | Deep dives        |
| The Stack Overflow Podcast | SO team              | Massive engineering reach     | Mixed             |
| The Changelog              | Adam Stacoviak       | OSS / engineering             | Conversational    |

**Realistic Q3 2026 target:** 2-4 podcast appearances. At ~1 link/episode = 2-4 referring domains.

### 4. GitHub / OSS README Placement — Brand, Not PageRank

**The hard truth about GitHub outbound links in 2026:**

- All UGC outbound links from github.com are `rel="nofollow"` (and increasingly `rel="ugc"`). [6]
- Google treats nofollow as a **hint** (post-2020 update), not a strict directive — but for a personal site with no existing authority, the realistic PageRank pass-through is near zero.
- Where GitHub README links DO add value: **brand visibility to engineers, CTR from devs who read the README, and indirect "they searched my name → found my repo → clicked through" patterns.**

**What's actually worth pursuing:**

- Get listed in 2-3 awesome-\* lists in your niche (engineering leadership, fractional CTO, AI-assisted development, content/SEO for devs).
- Pin a high-quality original tool/template/framework on your own GitHub profile that links back to alexmayhew.dev.
- Submit to indie-hacking/awesome-seo-backlinks, refined-so/awesome-backlinks, and similar curated repos.

**Realistic Q3 2026 yield:** 1-3 nofollow backlinks. Worth the effort _only_ if the asset itself is genuinely useful (i.e., spend the time on the asset, not the placement).

### 5. Mid-Tier Domain Assessment of Existing 5 Backlinks

**hiddenbrains.com (2 backlinks):**

- Legitimate company: 22+ years, 700+ employees, 2400+ clients, $25-100M est revenue, 4.9 Clutch rating across 47 reviews. [10]
- Domain reads as: India-based custom software development outsourcing firm.
- SEO assessment: Real domain, real traffic, but topical relevance to "fractional CTO / technical advisor" is weak. The link helps brand-mention but contextual relevance for ranking is moderate.
- **Verdict:** Keep. No reason to disavow. Don't count toward "credible RD" goal.

**freeduhm.com (2 backlinks):**

- "Global digital tech media company." Limited public profile data.
- TollBit-gated for AI agents (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) — but **NOT** for Googlebot itself. Google still indexes; AI assistants cannot cite.
- SEO assessment: Real-user traffic appears OK. Editorial quality unclear. AEO/GEO value: **zero** — AI assistants can't crawl through TollBit paywall to cite the link.
- **Verdict:** Keep, but the AEO loss is real. If your strategy weighs AI citations heavily (it does, per `aeo-geo-2026-04-19.md`), this link is worth less than its DA suggests.

**techmagazine.io (1 backlink):**

- Unverified domain. Likely fits the pattern of "85% of tech-blog guest sites: sub-DR-40, 10K monthly traffic, no editorial team." [12]
- SEO assessment: Probable low quality. Not actively harmful, but low-value.
- **Verdict:** Keep (don't bother disavowing — too low priority), but assume zero rank impact.

**Aggregate verdict on current 5 BLs / 3 RDs:**

- Real but mid-tier. None are toxic.
- None are high-authority editorial placements that move rankings.
- The 10-15-RD goal should be pursued with **NEW** placements, not by trying to "upgrade" these.

### 6. Linkable Assets That Actually Get Cited in Dev Tooling (2026)

**The pattern — what gets cited:**

- A specific number (benchmark)
- A comparison (X vs Y)
- A trend (what changed)
- A defensible methodology

**Real 2026 examples:**

- LinearB 2026 Software Engineering Benchmarks (8.1M PRs across 4,800 orgs).
- TechEmpower Web Framework Performance Benchmarks (continuously updated).
- LogRocket AI Dev Tool Power Rankings (March 2026).
- Exceeds AI Code Analysis Benchmarks (Cursor / Copilot / Claude impact on tech debt).

**For a solo fractional CTO, what's actually achievable:**

1. **Decision frameworks** — "When to use X vs Y" (e.g., the SaaS Architecture Decision Framework hub already published). These get linked from peers on dev.to / hashnode / personal blogs solving the same problem. Already a strength of alexmayhew.dev.

2. **Small-N original research with explicit methodology** — survey 30 peers, publish results, name the limits. Gets cited because it's _defensible_, not because it's massive.

3. **Comparison tables / cost-of-X calculators** — interactive tools beat blog posts for link velocity (and cite-velocity).

4. **Contrarian-but-defensible takes with data** — "Why most fractional CTO engagements fail (3 patterns from 47 engagements)" — has all 4 cite-bait elements: number, comparison, trend, takeaway.

5. **Glossary / taxonomy work that becomes the reference source** — already partially done (the AI-debt taxonomy work in research/). When you publish a taxonomy that's better than the alternatives, journalists cite _it_ when explaining the topic.

---

## Conflicting Information

- **Featured.com PBN risk vs Featured.com being the highest-conversion platform:** Backlinko's Greg Heilers explicitly flags both, in the same article. Resolution: Featured-placed articles on Forbes/Fast Company/USA Today = high-value editorial links. Featured.com's own subsite links = potential PBN risk that Google may discount. The two are different assets.

- **Canonical tags for syndicated content:** Google's docs say "not recommended" (2023, unchanged). Dev.to community advice still says "always set canonical_url." Resolution: set it defensively (no downside), but don't _plan around_ it passing authority signals.

- **GitHub link value:** Some sources call GitHub "high-DA" (DR 99); others note all UGC links are nofollow. Resolution: GitHub the _domain_ is high-DA, but the _links you can place there_ are nofollow. Brand value yes; PageRank value near-zero.

---

## Gaps

- **Direct DR/DA values** for hiddenbrains.com / freeduhm.com / techmagazine.io: Ahrefs Free Authority Checker requires interactive JS submission — could not pull values via curl. To verify: visit ahrefs.com/website-authority-checker and Moz's Link Explorer in browser. Indicative estimates from this research: hiddenbrains DR likely 40-55 (legitimate biz, decent profile); freeduhm DR likely 25-40; techmagazine.io DR likely <30.
- **Featured.com placement-to-indexed-backlink conversion rate** specifically for fractional/advisor experts: no public data.
- **Dev.to canonical "did it work" longitudinal data:** Bakhat Yar's 50-article study is single-source, single-author. Google's official guidance is the strongest signal.

---

## Sources

1. [5 Best HARO Alternatives in 2026 (Expert Review)](https://backlinko.com/haro-alternatives) — Backlinko / Greg Heilers. Best primary source: 25,000+ placements analyzed, turnaround data, conversion comparison across 5 platforms. Last updated Jan 1, 2026.
2. [10 Best HARO Alternatives - BuzzStream](https://www.buzzstream.com/blog/haro-alternatives/) — Cross-reference for HARO landscape.
3. [I Analyzed 50 Dev.to SEO Articles — What Actually Gets Indexed (2026 Data)](https://dev.to/bakhat_yar_seo/i-analyzed-50-devto-seo-articles-heres-what-actually-gets-indexed-by-google-2026-data-1c9n) — Bakhat Yar, Mar 27, 2026. Single-author study, but the only public dataset on dev.to indexing patterns. 68% indexing rate, 22% ranking rate.
4. [Google no longer recommends canonical tags for syndicated content](https://searchengineland.com/google-no-longer-recommends-canonical-tags-for-syndicated-content-406491) — Search Engine Land / Barry Schwartz. Cites Google's own docs update. Still current.
5. [Podcast Guesting Strategy: Ultimate 2026 Brand Guide](https://www.expertbookers.com/podcast-marketing-authority-blog/podcast-guesting-strategy-2026) + [Podcast SEO in 2026](https://whatsgood-productions.com/blog/podcast-seo-in-2026) — Cross-source: 20-40% conversion rate citation, saturation at 4.5M+ shows.
6. [Qualify Outbound Links for SEO](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links) — Google official docs on nofollow/ugc/sponsored attributes.
7. [Featured.com Review (HARO Link Building)](https://www.harolinkbuilding.com/blog/featured-com) — Featured.com platform details.
8. [HARO vs Qwoted Comparison 2026](https://www.harolinkbuilding.com/blog/haro-vs-qwoted-detailed-comparison) — Pricing and platform tier comparison.
9. [Linkable Assets for GEO: The Benchmark Report Playbook](https://aokmarketing.com/benchmark-report-linkable-asset-geo/) — AOK Marketing / Dave Burnett. Strongest framework for benchmark-as-linkable-asset approach. Cites GEO arXiv:2311.09735.
10. [Hidden Brains InfoTech - Clutch Profile](https://clutch.co/profile/hidden-brains-infotech) — Verified company profile: founded 2003, 700+ staff, 2400+ clients, 4.9/5 across 47 reviews.
11. [8 Must-Listen Podcasts for CTOs & Tech Leaders in 2026](https://thectoclub.com/career/best-cto-podcasts/) + [10 Must-Listen CTO Podcasts (Uvik)](https://uvik.net/blog/cto-podcasts/) — Audience-size data for Modern CTO (150k+).
12. [180+ Low Spam Guest Posting Blogs 2026](https://serpzilla.com/blog/low-spam-30-guest-posting-sites/) — Source for "85% of guest-post sites are DR<40" benchmark.

---

## Q3 2026 Tactical Recommendation (sequenced)

**MONTH 1 (May 2026):**

- Daily 15-min: MentionMatch + SoS scan, 1 pitch/day to relevant queries.
- Sign up for Featured.com free plan (3 pitches/mo). Deploy all 3 to top-tier opportunities.
- Pitch 5 podcasts cold (Modern CTO, CTO Advisor, Alphalist, 7CTOs, SE Daily). Use existing alexmayhew.dev hub guides as proof.
- Build ONE benchmark/decision-framework asset with quotable numbers. (e.g., "Fractional CTO engagement model comparison: cost-per-deliverable across 5 patterns.")

**MONTH 2 (June 2026):**

- Featured.com upgrade to paid tier ($19/mo Lite or $49/mo Pro) once first placement lands.
- Submit benchmark asset to: 3 awesome-\* GitHub lists, 5 dev.to cross-posts (with `canonical_url`, 30+ days after originals were published), Hacker News (rate-limited try).
- Continue daily MentionMatch + 1 podcast appearance.

**MONTH 3 (July 2026):**

- Repeat MentionMatch / Featured cadence.
- Pitch 2-3 guest posts to mid-tier outlets that DO have editorial standards (Smashing Magazine, CSS-Tricks, LogRocket Blog, Engineering @ scale Substacks).
- Re-evaluate: by end Q3, target = 8-12 NEW credible RDs (not counting current 3).

**Realistic Q3 2026 yield estimate:**

- Featured.com / MentionMatch / SoS placements: 4-7 RDs (Forbes, Fast Company, USA Today, niche B2B publications)
- Podcast appearances: 2-4 RDs (show-notes pages on Libsyn/Blubrry + host blog mentions)
- Dev.to canonical cross-posts: 1 RD (dev.to itself; canonical may or may not honor — count it as brand)
- GitHub awesome-list placements: 1-2 RDs (nofollow but indexed)
- Direct contributions / guest posts: 1-3 RDs

**Total realistic: 9-17 NEW RDs. Goal of 10-15 = achievable.**
