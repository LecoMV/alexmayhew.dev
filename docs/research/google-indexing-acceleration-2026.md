# Google Indexing Acceleration for New Sites with Zero Domain Authority (2026-04-09)

**Status:** CURRENT
**Session:** Research request -- strategies to accelerate Google indexing for alexmayhew.dev (technical advisory portfolio, 152 URLs, zero backlinks, zero indexed from sitemap after 3+ weeks)
**Cross-references:**

- `docs/research/google-indexing-gsc-nextjs-cloudflare-2026.md` -- technical SEO fundamentals, robots.txt, meta robots, sitemaps
- `docs/research/homepage-internal-linking-seo-2026.md` -- internal linking strategy
- `docs/research/person-schema-eeat-2026.md` -- E-E-A-T schema markup
- `docs/research/blog-pagination-seo-nextjs15-2026.md` -- Googlebot and client-side pagination

---

## Executive Summary

alexmayhew.dev has 152 URLs in its sitemap, 594 impressions but only 1 click in 28 days, and zero pages indexed from the sitemap after 3+ weeks. The fundamental bottleneck is **zero external backlinks** combined with a domain under 6 months old. Without backlinks, Google assigns near-zero crawl budget, treats the site as unverified, and indexes at a glacial pace regardless of technical SEO quality.

**The fix is not technical. The fix is authority building.**

Technical SEO (sitemaps, schema, canonicals, internal linking) is table stakes. The site already has strong technical foundations. What it lacks is external validation -- backlinks, social mentions, and cross-platform content distribution.

---

## 1. Why Google Refuses to Index New Sites in 2026

### The Core Problem

For brand-new domains with zero backlinks, Google's behavior is predictable and well-documented:

- **Initial indexing takes 2-4 weeks** for the first few pages (homepage, about, etc.)
- **Full site indexing takes 2-6 months** without proactive backlink building
- **96.55% of content with no backlinks gets zero organic search traffic** (Ahrefs data, still valid in 2026)
- Average time to first page indexed: **18 days** with zero backlinks; **4 days** with 3+ quality backlinks from launch

### Common Reasons for Non-Indexing

| Reason                              | Applies to alexmayhew.dev?          | Notes                                                           |
| ----------------------------------- | ----------------------------------- | --------------------------------------------------------------- |
| Domain too new (<3 months)          | Partially (domain is ~3 months old) | Conservative crawl frequency, thin authority signals            |
| Zero external backlinks             | **YES -- PRIMARY ISSUE**            | Without backlinks, Google has no external trust signal          |
| Thin content on some pages          | Possible (pSEO pages)               | Some pages may fall below the 500-word quality threshold        |
| Too many pages for domain authority | **YES**                             | 152 URLs with zero authority is suspicious to Google            |
| Duplicate/near-duplicate content    | Possible (pSEO variations)          | Template-based pages risk "scaled content abuse" classification |
| JavaScript rendering issues         | No                                  | Next.js SSR/SSG is well-supported by Googlebot                  |
| robots.txt blocking                 | No                                  | Already verified correctly configured                           |
| Missing sitemap                     | No                                  | Sitemap submitted, 152 URLs                                     |
| No internal linking                 | No                                  | 108+ internal links added, homepage has 13+ links               |

### The "Discovered -- Currently Not Indexed" Problem

For domains under 3 months old, Google's crawl frequency is conservative and authority signals are forming. This manifests as:

- **"Discovered -- currently not indexed"**: Google knows the URL exists (from sitemap or internal links) but has not allocated crawl budget to fetch it. This is a **priority problem**, not a technical problem.
- **"Crawled -- currently not indexed"**: Google fetched the page but deemed it not valuable enough to index. This is a **content quality or authority problem**.

The fix is structural -- not repeated indexing requests. Requesting indexing via GSC is limited to 10-20 URLs/day and only accelerates discovery, not the quality evaluation.

---

## 2. IndexNow vs GSC URL Inspection API

### Google Does NOT Support IndexNow

As of April 2026, **Google does not support IndexNow** and has not adopted it despite testing since October 2021. Google continues to rely on its Caffeine crawler infrastructure. IndexNow is supported by Bing, Yandex, Naver, Seznam, and Yep, with 5+ billion daily URL submissions.

### Google Search Console URL Inspection API

- **Limit:** ~10-20 URL inspection requests per day per property
- **What it does:** Requests Google to re-crawl a specific URL. Provides real-time feedback on indexing status, mobile usability, and structured data validity.
- **What it does NOT do:** Force indexing. Google may crawl and still decide not to index.

### Google Indexing API (Limited)

- **Officially supports ONLY:** Pages with `JobPosting` structured data and `BroadcastEvent` embedded in `VideoObject` structured data
- **2025 restrictions:** Only "authorized partners" get direct API access for job postings
- **Workaround viability:** Google has explicitly warned against using the Indexing API for unsupported content types. Using it for non-job-posting pages risks account penalties.

### Strategic Recommendation

| Tool                | Use For                              | Effective for Google?                            |
| ------------------- | ------------------------------------ | ------------------------------------------------ |
| IndexNow            | Bing, Yandex, Naver, Seznam          | **NO** -- Google ignores it                      |
| GSC URL Inspection  | Requesting re-crawl of specific URLs | Partially -- accelerates discovery, not indexing |
| XML Sitemap         | Comprehensive URL discovery          | **YES** -- primary mechanism                     |
| Google Indexing API | Job postings only                    | N/A for portfolio sites                          |

**Bottom line:** Neither IndexNow nor the Indexing API will solve this. The site already has IndexNow in its CI/CD pipeline (good for Bing), and GSC sitemap submission is done. The bottleneck is authority, not discovery.

---

## 3. Dev.to Cross-Posting Strategy

### Why Dev.to Matters

Dev.to has **high domain authority** and gets indexed rapidly. Cross-posting creates:

1. A backlink from a high-DA domain (via canonical URL)
2. Broader content distribution to dev.to's built-in audience
3. Faster Google discovery of the canonical (original) URL

### Setup: RSS Import Method (Recommended)

1. Login to dev.to, navigate to **Settings > Extensions**
2. Under "Publishing to DEV Community from RSS," enter: `https://alexmayhew.dev/blog/rss.xml`
3. **CRITICAL:** Check "Mark the RSS source as canonical URL by default"
4. This adds `<link rel="canonical" href="https://alexmayhew.dev/blog/[slug]">` to every imported post

**Required RSS feed elements** for accurate import:

- `<title>` -- used for post title
- `<link>` -- used as canonical URL
- `<description>` -- brief description
- `<content>` -- actual post content

### Setup: Manual Method

For each post, click the gear icon next to "Save draft" and enter the original post's URL in the "Canonical URL" field. Alternatively, add `canonical_url: https://alexmayhew.dev/blog/[slug]` to the post's front matter.

### Critical SEO Considerations

1. **Publish on alexmayhew.dev FIRST.** Wait 5-7 days for Google to discover and index the original before cross-posting to Dev.to. This establishes the original as the canonical source.

2. **Dev.to may outrank the original.** Dev.to has much higher DA and better Core Web Vitals than most personal sites. Google may show the Dev.to version in search results despite the canonical tag. However:
   - The canonical tag passes link equity back to the original
   - Over time, as alexmayhew.dev builds authority, Google should prefer the canonical
   - Even if Dev.to ranks, the canonical URL gets the "credit" for link juice

3. **Don't cross-post everything.** Select 10-15 of the highest-quality, most search-relevant posts. Hub guides and technically dense articles work best.

### Recommended Cross-Post Priority

| Post Type               | Priority              | Reason                                |
| ----------------------- | --------------------- | ------------------------------------- |
| Hub guides (5 posts)    | **HIGH**              | Comprehensive, link-worthy content    |
| Technical deep-dives    | **HIGH**              | Dev.to audience loves these           |
| Career/leadership posts | MEDIUM                | Less technical but unique perspective |
| pSEO pages              | **DO NOT cross-post** | Template content, no Dev.to value     |

---

## 4. Backlink Building for Technical Blogs in 2026

### Tier 1: High-Impact, Immediate Actions

#### Dev.to (DA ~90+)

- Cross-post top 10-15 articles with canonical URLs
- Engage with Dev.to community (comments, reactions)
- Expected backlinks: 10-15 canonical links within 2 weeks

#### GitHub (DA ~95+)

- Profile README: Link to alexmayhew.dev in bio and pinned repo READMEs
- Open source projects: Create useful utilities related to blog content (e.g., a Next.js + Cloudflare starter template)
- README links from GitHub have high DA and are indexed by Google
- GitHub's high DA means links within README files are treated as quality backlinks

#### Hashnode (DA ~80+)

- Similar to Dev.to -- import via RSS with canonical URL
- Different audience segment from Dev.to

### Tier 2: Community Engagement (1-4 Weeks)

#### Hacker News

- "Show HN" posts for original tools/projects, not blog posts
- A front-page HN post (722 points example) consumed 85 GB bandwidth over 7 days
- HN audience is skeptical of SEO-focused content -- lead with genuine technical insight
- Best content types: original research, contrarian takes, deep technical analysis
- Do NOT submit every blog post -- pick 1-2 genuinely novel pieces

#### Reddit (DA ~94)

- **90/10 rule:** 90% of activity must be genuine community participation, 10% can include your own links
- **Preparation:** Spend 2-4 weeks actively participating before posting any self-promotional content
- **Target subreddits for technical advisory content:**
  - r/ExperiencedDevs (~200K) -- career and architecture discussions
  - r/SideProject (~200K) -- show off tools built
  - r/webdev (~1.5M) -- frontend/architecture posts
  - r/programming (~5M) -- deep technical content only
  - r/startups (~1.5M) -- business/advisory content
  - r/entrepreneur (~3M) -- SaaS advisory content
- **Strategy:** Answer questions with genuine expertise, link to blog post as "I wrote more about this here"
- **Risk:** Bans for overt self-promotion. Read 30-60 days of top posts before participating.

#### LinkedIn

- Articles (not posts) with canonical URL back to original blog
- Regular posting drives profile visits which may lead to site visits
- Google indexes LinkedIn posts and articles

### Tier 3: Relationship-Based (1-3 Months)

#### Guest Posting

- In 2026, low-effort guest posting is dead. Google ignores most guest post links.
- Target: Technical blogs in your niche (SaaS architecture, engineering leadership, AI-assisted dev)
- Contribute genuine, original content -- not repurposed blog posts
- Aim for 2-3 quality guest posts, not 20 low-quality ones

#### Digital PR / HARO / Quoted Sources

- Sign up for HARO (Help A Reporter Out) or Connectively
- Respond to journalist queries related to SaaS, engineering leadership, AI development
- Each published quote = editorial backlink from a news site

#### Conference / Podcast Appearances

- Speaker bios always include a link to your site
- Podcast show notes include guest links
- Both create natural, editorial backlinks

### What NOT to Do

- Do not buy backlinks. Google's March 2026 spam update decimated sites with purchased link profiles.
- Do not use PBNs (Private Blog Networks). Detected and penalized aggressively.
- Do not mass-submit to directories. Low-quality directory links are ignored.
- Do not use automated outreach for link exchanges. These are classified as link schemes.

---

## 5. Programmatic SEO Thin Content Penalties

### Google's March 2026 Spam Update

Google's March 2026 update explicitly targeted **scaled content abuse**, with enforcement beginning March 24, 2026. Sites generating thousands of near-identical pages through AI or template automation saw **ranking losses of 60-90% almost overnight**. Sites publishing hundreds of AI-generated pages without editorial oversight saw **50-80% traffic drops**.

### Three Patterns Google Targets

1. **Mass AI page generation without editorial review** -- auto-generated articles at scale
2. **Pure template-with-variable substitution** -- same template, different city/keyword
3. **Aggregator sites adding no context** -- scraping + reformatting

### Quality Thresholds for pSEO Pages

| Metric                                | Safe Zone                              | Danger Zone                          |
| ------------------------------------- | -------------------------------------- | ------------------------------------ |
| Unique word count per page            | 500+ unique words                      | <300 words                           |
| Content differentiation between pages | 30-40%+ unique content                 | <20% unique                          |
| Distinct user query answered          | Each page answers a unique query       | Multiple pages answer the same query |
| Data differentiation                  | Real, structured, unique data per page | Same template, different keyword     |

### Specific Risk Assessment for alexmayhew.dev

The site has pSEO service pages (e.g., `/for/[industry]/[service]` patterns). Current risk factors:

- **152 total URLs** is not inherently dangerous -- the threshold for scaled content abuse is typically hundreds to thousands of near-identical pages
- **But for a zero-authority domain**, 152 URLs (many of which are template-based) may trigger suspicion. Google sees an unknown domain publishing many pages with similar structure as a quality signal problem.
- **The key test:** Does each pSEO page answer a distinct user query with substantive unique content that no other page on the site answers?

### Recommendation: Selective Noindexing

For new domains with zero authority, **noindex low-value pages until the domain builds trust:**

1. **Audit pSEO pages** -- identify those with <500 unique words or <30% content differentiation
2. **Noindex the weakest pages** -- keep only the strongest, most differentiated pSEO pages indexed
3. **Reduce sitemap to high-quality pages only** -- 40-60 strong pages > 152 mixed-quality pages
4. **Conditionally index later** -- once the domain has backlinks and some indexed pages ranking, gradually add more pages

---

## 6. Sitemap Pruning for New Sites

### The Case for Fewer Pages

For a new site with zero authority, submitting 152 URLs tells Google "index all of these" when Google has no reason to trust any of them. A pruned sitemap focusing on the best content:

- Concentrates limited crawl budget on pages most likely to rank
- Sends a quality signal (you're curating, not dumping)
- Reduces the ratio of "Discovered -- currently not indexed" pages
- Makes the "indexed vs submitted" ratio look healthier in GSC

### What Google Actually Uses in Sitemaps

| Attribute      | Used by Google?      | Notes                                                                                      |
| -------------- | -------------------- | ------------------------------------------------------------------------------------------ |
| `<loc>`        | **YES**              | The URL -- the only required field                                                         |
| `<lastmod>`    | **YES, if accurate** | Must reflect actual content changes. Full timestamp preferred: `2026-04-09T10:30:00+00:00` |
| `<changefreq>` | **NO**               | Google ignores this completely                                                             |
| `<priority>`   | **NO**               | Google ignores this completely                                                             |

### Recommended Sitemap Tiers

**Tier 1 -- Submit immediately (30-40 URLs):**

- Homepage
- About page
- Services/advisory page
- Contact page
- 5 hub guide posts
- Top 20-25 spoke posts (highest quality, most search volume potential)
- /for landing page (if substantive)

**Tier 2 -- Submit after first 10 pages are indexed (20-30 URLs):**

- Remaining spoke posts
- Best pSEO pages (those with >500 unique words)

**Tier 3 -- Submit after 30+ pages indexed (remaining):**

- Lower-priority pSEO pages
- Utility pages

### Implementation Options

1. **Two sitemaps:** Create `sitemap-priority.xml` with Tier 1 only, submit that to GSC first. Keep `sitemap.xml` with all URLs for eventual submission.
2. **Single sitemap, phased submission:** Start with Tier 1, expand as indexing progresses.
3. **Noindex + sitemap exclusion:** For pages you don't want indexed yet, add `noindex` AND exclude from sitemap. Sitemapped pages with `noindex` is a contradictory signal.

---

## 7. Google's Crawl Budget for New Domains

### How Crawl Budget Works in 2026

Google's crawl budget system is **dynamic**, adjusting daily based on:

- Site authority (backlinks, age, trust)
- Server performance (response times, uptime)
- Content quality and freshness signals
- Historical crawl success rate

### New Domain Crawl Budget Reality

| Site Type                              | Estimated Crawl Rate    | Notes                                                |
| -------------------------------------- | ----------------------- | ---------------------------------------------------- |
| New domain, zero backlinks             | **5-20 pages/week**     | Based on alexmayhew.dev's observed behavior          |
| New domain, 3-5 backlinks              | 20-50 pages/week        | Even minimal backlinks significantly increase budget |
| Established domain, moderate authority | 100-500 pages/day       | After 6-12 months with consistent backlinks          |
| High-authority domain                  | 1,000-10,000+ pages/day | Major sites (Wikipedia, news outlets)                |

### When Crawl Budget Is NOT the Problem

Google has stated that crawl budget mainly becomes critical at **5,000+ URLs**. For sites under 1,000 pages, technical crawl budget optimization (reducing redirects, fixing 404s) has minimal impact. The real issue for small, new sites is **crawl demand** -- Google simply doesn't see enough reason to crawl frequently.

### How to Increase Crawl Budget

1. **Build backlinks** -- single most effective lever for new domains
2. **Maintain fast server response** -- sub-200ms TTFB signals a healthy server
3. **Publish fresh content regularly** -- new content signals worth recrawling
4. **Eliminate crawl waste** -- don't submit URLs that return 404, redirect, or noindex
5. **Internal linking** -- strong internal link structure helps Googlebot discover and prioritize pages

---

## 8. Social Signals and Indexing Speed

### Direct Ranking Factor?

**No.** Social signals (likes, shares, followers) are NOT a direct Google ranking factor and are unlikely to become one due to data reliability and manipulation concerns. Google has been consistent on this point for years.

### Indirect Benefits (Real and Measurable)

| Mechanism                           | Impact on Indexing                                                            | Evidence                                                                |
| ----------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Content discovery**               | Google's crawlers discover new content faster when shared on social platforms | Google crawls Twitter/X and LinkedIn; shared URLs get discovered sooner |
| **Traffic signals**                 | Social traffic creates engagement signals Google can observe                  | High dwell time, low bounce rate from social visitors                   |
| **Backlink generation**             | Viral social content gets linked to from blogs and articles                   | The cascade: social share -> blog mention -> backlink                   |
| **Brand searches**                  | Social presence drives branded searches                                       | Google interprets brand search volume as an authority signal            |
| **Direct indexing of social posts** | Google indexes LinkedIn posts, tweets, Reddit threads                         | Your social mentions of alexmayhew.dev become discoverable              |

### Google's 2026 Social Indexing Shift

Google has started indexing social media content more deeply in 2026:

- Public LinkedIn posts appear in Google Search results
- Reddit discussions are surfaced prominently (Google's Reddit deal)
- TikTok, Instagram content is being indexed
- A public LinkedIn post mentioning alexmayhew.dev could appear in Google results directly

### Actionable Strategy

1. **LinkedIn:** Post 3-4x/week (already in plan). Include alexmayhew.dev in posts where relevant. LinkedIn articles with canonical URL back to blog.
2. **X/Twitter:** Even though credits are depleted, any posts that do go out create crawl signals.
3. **Reddit:** Genuine participation in relevant subreddits (see Section 4).
4. **The real value is cascading:** Social activity -> traffic -> engagement signals -> brand searches -> indirect authority growth.

---

## Consolidated Action Plan

### Immediate (This Week)

1. **Prune sitemap** to 30-40 highest-quality URLs. Noindex weakest pSEO pages.
2. **Cross-post to Dev.to** top 5 hub guides with canonical URLs (publish on alexmayhew.dev first, wait 5-7 days, then cross-post).
3. **GitHub profile** -- add alexmayhew.dev link to profile bio and pinned repo READMEs.
4. **Request indexing** in GSC for the 10 most important pages (homepage, about, services, top 5 hub guides, contact).

### Short-Term (Next 2-4 Weeks)

5. **Cross-post remaining top articles** to Dev.to (10-15 total, canonical URLs).
6. **Begin Reddit engagement** in r/ExperiencedDevs, r/webdev, r/startups. Participate genuinely for 2-4 weeks before any self-promotion.
7. **Cross-post to Hashnode** with canonical URLs (different audience from Dev.to).
8. **Submit 1-2 "Show HN" posts** -- pick the most genuinely novel technical content.
9. **LinkedIn articles** -- republish top 3 blog posts as LinkedIn articles with canonical URLs.

### Medium-Term (1-3 Months)

10. **Guest post outreach** -- identify 3-5 technical blogs accepting guest contributions.
11. **HARO/Connectively** -- respond to relevant journalist queries weekly.
12. **Open source project** -- create a useful utility (e.g., Next.js + Cloudflare starter) that links to alexmayhew.dev in the README.
13. **Gradually expand sitemap** as pages get indexed -- add Tier 2 and Tier 3 pages.
14. **Monitor GSC** weekly -- track indexed pages, crawl rate, impressions.

### Expected Timeline

| Milestone                  | Expected Timeframe                                 |
| -------------------------- | -------------------------------------------------- |
| First 5-10 pages indexed   | 2-4 weeks (some may already be there)              |
| 20-30 pages indexed        | 4-8 weeks (requires backlinks)                     |
| 50+ pages indexed          | 2-3 months (requires consistent backlink building) |
| Full site indexed (100+)   | 4-6 months (requires 10+ quality backlinks)        |
| Meaningful organic traffic | 6-12 months (requires ranking, not just indexing)  |

---

## Sources

### Why Google Refuses to Index New Sites

- [Page Indexing Report - Google Search Console Help](https://support.google.com/webmasters/answer/7440203?hl=en)
- [Why Pages Aren't Indexed - Break The Web](https://breaktheweb.agency/seo/why-pages-arent-indexed/)
- [10 Top Reasons Google Isn't Indexing Your Site - Search Engine Journal](https://www.searchenginejournal.com/definitive-list-reasons-google-isnt-indexing-site/118245/)
- [How to Fix Discovered Currently Not Indexed - Onely](https://www.onely.com/blog/how-to-fix-discovered-currently-not-indexed-in-google-search-console/)
- [Understanding Discovered Currently Not Indexed - Search Engine Land](https://searchengineland.com/understanding-resolving-discovered-currently-not-indexed-392659)
- [How to Fix Discovered Currently Not Indexed - Ahrefs](https://ahrefs.com/blog/discovered-currently-not-indexed/)

### IndexNow vs GSC

- [IndexNow vs Google Search Console: 7 Strategies - Sight AI](https://www.trysight.ai/blog/indexnow-vs-google-search-console)
- [Does Google Support IndexNow? 2026 Status - Pressonify](https://pressonify.ai/blog/indexnow-instant-indexing-press-releases-2026)
- [Google's Absence from IndexNow - PPC Land](https://ppc.land/googles-absence-from-indexnow-raises-questions-about-web-indexing-standards/)
- [Google Says Stop Using Indexing API for Unsupported Content - SE Roundtable](https://www.seroundtable.com/google-indexing-api-unsupported-content-39470.html)

### Dev.to Cross-Posting

- [How to Cross Post to DEV and Retain SEO - Dev.to](https://dev.to/leewynne/how-to-cross-post-and-import-your-existing-blog-into-dev-and-retain-seo-original-source-and-ranking-mm8)
- [How to Add a Canonical URL to Dev.to Post - Dev.to](https://dev.to/_hariti/how-to-add-a-canonical-url-to-your-devto-post-69g)
- [Publishing from RSS Guide - Dev.to](https://dev.to/p/publishing_from_rss_guide)
- [Dev.to RSS Canonical Feature - SEOSiri](https://www.seosiri.com/2025/04/rss-canonical-dev-community.html)
- [Canonicalization and SEO Guide 2026 - Search Engine Land](https://searchengineland.com/canonicalization-seo-448161)

### Backlink Building

- [7 Strategies for High Quality Backlinks in 2026 - Backlinko](https://backlinko.com/high-quality-backlinks)
- [How to Get Backlinks in 2026 - Analytify](https://analytify.io/how-to-get-backlinks/)
- [Reddit Link Building Complete Strategy 2025 - Crowdo](https://crowdo.net/blog/reddit-link-building-guide-2025)
- [How to Use Reddit for SEO Link Building - Prestige Links](https://www.prestigelinks.com/post/reddit-for-seo-link-building)
- [Do-Follow Backlink Strategies 2026 - Boston Institute of Analytics](https://bostoninstituteofanalytics.org/blog/do-follow-backlink-building-strategies-that-work-in-2026/)

### Programmatic SEO & Thin Content

- [Programmatic SEO After March 2026 - Digital Applied](https://www.digitalapplied.com/blog/programmatic-seo-after-march-2026-surviving-scaled-content-ban)
- [Programmatic SEO Guide 2026 - IndexCraft](https://indexcraft.in/blog/technical/programmatic-seo-guide)
- [Programmatic SEO 2026: What Still Works - RankTracker](https://www.ranktracker.com/blog/programmatic-seo-2026/)
- [Google March 2026 Spam Update - DigiCobWeb](https://digicobweb.com/google-march-2026-spam-update-guide/)

### Sitemap Best Practices

- [Build and Submit a Sitemap - Google Developers](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Sitemap Best Practices for Crawling and Indexing - Search Engine Land](https://searchengineland.com/guide/sitemap)
- [Google Ignores Priority and Changefreq - SEO Component](https://www.seocomponent.com/blog/ignore-priority-changefreq-fields-sitemap/)
- [7 Faster Website Indexing Methods 2026 - Sight AI](https://www.trysight.ai/blog/faster-website-indexing-methods)

### Crawl Budget

- [Crawl Budget Management - Google Developers](https://developers.google.com/crawling/docs/crawl-budget)
- [Crawl Budget Optimization 2026 - LinkGraph](https://www.linkgraph.com/blog/crawl-budget-optimization-2/)
- [Low Crawl Budget Guide 2026 - ClickRank](https://www.clickrank.ai/crawl-budget/)
- [How Long Does Google Take to Index New Website 2026 - EasyGuidesHub](https://www.easyguideshub.com/2026/01/how-long-does-google-take-to-index-new.html)

### Social Signals

- [Google's Social Indexing Shift 2026 - Diamond Group](https://www.diamond-group.co/blog/googles-social-indexing-shift-what-it-means-for-brands-in-2026)
- [Social Signals Impact SEO 2025 - Prisham](https://www.prisham.com/how-social-signals-are-changing-the-seo-game-in-2025/)
- [Social SEO 2026: LinkedIn Posts Getting Indexed - Manish Bhagat](https://manishbhagat.com/social-media/social-seo-2026-instagram-linkedin-google-indexing/)
- [Social Signals in SEO 2025 - Primary Position](https://primaryposition.com/blog/soical-signals-seo/)
