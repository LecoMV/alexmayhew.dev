# Homepage Internal Linking for Technical Consultant/Advisor Portfolio Sites (2026-03-30)

**Status:** CURRENT
**Session:** Research to fix alexmayhew.dev homepage internal linking dead zone (only 3 links to 2 pages on a 180-page site)

## Key Findings

### 1. How Many Internal Links Should a Homepage Have?

**There is no fixed optimal number, but data points converge on 40-80 for content-rich sites.**

- **Zyppy study (23M internal links, 1,800 sites, 520K URLs):** Pages with 40-50 internal links saw peak organic traffic. After 50+, traffic declined due to link equity dilution. Pages with 0-4 links averaged only 2 clicks; pages with 40-44 links saw 4x that. [Source: Zyppy SEO Case Study]
- **Google's John Mueller:** "There's no limit to the number of links on your pages." No hard cap exists. However, Mueller recommends a "pyramid structure" where links are purposeful, not a flat dump. [Source: Search Engine Roundtable]
- **Historical Google guideline (Matt Cutts, 2009):** "Keep links to a sensible amount (fewer than 100)." This is no longer in Google's Search Essentials but remains a reasonable pragmatic ceiling. [Source: Matt Cutts blog]
- **Industry consensus (2025-2026):** 3-10 contextual links per 1,000 words of body content. Homepages are special -- they are navigational pages, not content pages -- so navigational links (nav, footer, featured sections) are expected and do not dilute the same way body text links do.

**Recommendation for alexmayhew.dev:** Target 40-70 total links on the homepage (navigation + footer + body sections combined). The current 3 links is an extreme undercount that signals to Google that the site's content is unimportant.

### 2. Recommended Link Structure for a Consultant/Advisor Homepage

**Pyramid structure with the homepage as the apex, linking to category-level pages.**

- Mueller explicitly recommends a "pyramid structure" over "super flat" -- the homepage links to category pages, which link to individual content pages. [Source: Search Engine Journal, "John Mueller Recommends Pyramid Site Structure"]
- Google's documentation states: "The number of internal links pointing to a page is a signal to search engines about the relative importance of that page." The homepage, having the most backlinks, distributes the most authority. [Source: Google Search Central]
- For B2B/consultant sites specifically, Andy Crestodina (Orbit Media) recommends treating the homepage as a strategic distribution point that links to high-converting service pages with keyword-rich anchor text, and to a blog hub that demonstrates expertise. [Source: Orbit Media]

**Recommended homepage link hierarchy for alexmayhew.dev:**

| Priority     | Section             | Target Pages                          | Count |
| ------------ | ------------------- | ------------------------------------- | ----- |
| 1 (Critical) | Primary nav         | Services, Blog, About, Contact, Work  | 5-6   |
| 2 (High)     | Featured Services   | Top service/capability pages          | 3-6   |
| 3 (High)     | Featured Content    | Hub/pillar blog posts                 | 3-5   |
| 4 (Medium)   | Technology showcase | Top technology pages                  | 4-8   |
| 5 (Medium)   | Recent articles     | Latest blog posts                     | 3-4   |
| 6 (Lower)    | Footer nav          | All major sections, pSEO entry points | 10-20 |

### 3. Should the Homepage Link to Blog Posts? How Many?

**Yes, absolutely. Link to 3-5 strategic blog posts (hub/pillar posts), plus 3-4 recent posts.**

- Blog posts serve a dual purpose: they attract external backlinks (building domain authority) and demonstrate topical expertise. Linking from the homepage passes the homepage's authority to these posts, boosting their rankings. [Source: Orbit Media content strategy framework]
- The hub-and-spoke model specifically calls for hub pages to be "placed at the heart of your navigation" -- linking from the homepage signals to Google that these are authoritative pages. [Source: Semrush, HubSpot, Search Engine Land]
- A "Latest from the Blog" or "Featured Insights" section with 3-5 posts is standard practice on B2B consultant sites and serves both SEO (crawl freshness signal) and conversion (demonstrates expertise to visitors). [Source: multiple consultant website best practice guides]

**Recommendation:** Create two blog sections:

1. **"Featured Guides"** -- 3-5 hub/pillar posts (static, manually curated). These are the 5 hub guides.
2. **"Latest Insights"** -- 3-4 most recent posts (dynamic). This also creates a crawl freshness signal since the homepage changes when new posts are published.

### 4. Should the Homepage Have a "Featured Services" Section?

**Yes. This is one of the highest-priority additions.**

- Crestodina's research shows commercial-intent visitors are "far more likely to convert into leads" than informational visitors. Service pages are the conversion engine, but they don't attract backlinks naturally. The homepage must link to them to pass authority. [Source: Orbit Media]
- Google's documentation confirms that link equity flows from the homepage to linked pages. Service pages that are only reachable via navigation menus receive less equity than those with contextual body links on the homepage. [Source: Google Search Central]
- Orbit Media specifically recommends: "Link to high-converting pages from the body text of high-traffic pages" and "add a mini-navigation bar linking to your top 5-6 product or service pages using target keyphrases as anchor text." [Source: Orbit Media internal linking strategies]

**Recommendation:** The current homepage services section (Full-Stack Development, System Architecture, Performance Engineering) has NO links -- each card is a dead end. These must link to corresponding service or capability pages with descriptive anchor text.

### 5. Google's Documentation on Homepage Link Equity Distribution

**Google confirms the homepage is the primary authority distributor.**

Key statements from Google's official documentation and Googlers:

- **Google Search Central:** "Every page you care about should have a link from at least one other page on your site." [Source: developers.google.com/search/docs/crawling-indexing/links-crawlable]
- **Google Search Central:** "The number of internal links pointing to a page is a signal to search engines about the relative importance of that page."
- **John Mueller:** "Internal linking gives Google a sense of page-level importance." [Source: Search Engine Roundtable]
- **John Mueller:** Recommends "pyramid structure" where the homepage is the apex. [Source: Search Engine Journal]
- **John Mueller on over-linking:** "There's no internal linking over-optimization penalty." But he cautions that link equity is divided among all links on a page -- so 150 links each pass less equity than 50 well-chosen links. [Source: Search Engine Roundtable]
- **Google on anchor text:** "Paying more attention to the anchor text used for internal links can help both people and Google make sense of your site more easily." [Source: Google Search Central]

**The homepage holds the strongest link value because it naturally gets the most external backlinks.** Every page linked from the homepage receives a portion of this authority. Pages NOT linked from the homepage (or within 3 clicks of it) are at a significant disadvantage.

### 6. What Top Consultant/Advisor Sites Do

**Common homepage patterns from successful B2B consultant sites:**

1. **Hero + CTA** -- Clear value proposition with primary CTA (book consultation/contact)
2. **Services/capabilities grid** -- 3-6 featured services, each linking to its own page
3. **Case studies/work** -- 2-4 featured projects with links to full case studies
4. **Social proof** -- Testimonials, logos, certifications (often no outbound links)
5. **Blog/insights section** -- 3-6 featured articles demonstrating expertise
6. **About/credentials snippet** -- Brief bio linking to full about page
7. **Footer navigation** -- Comprehensive links to all major sections

**Common link counts on B2B consultant homepages:** Typically 40-80 total links including nav and footer. The body content area usually has 15-30 contextual links.

Key design principles observed:

- "Lean, lightning-fast websites built for decisions, not distractions" [Source: Freelance Cake consultant website examples]
- Clear specialty/niche articulation (easier to rank for specific terms)
- "Book a Consultation" CTA in header + repeated in body
- Published articles, speaking engagements, certifications prominently featured

### 7. Risk of Too Many Links / Upper Limit

**Yes, there is a risk -- but the threshold is much higher than 2-3 links.**

- **Zyppy data:** Traffic peaks at 40-50 links, declines after 50+. This is for CONTENT pages. Homepage (a navigational page) can typically handle more.
- **Authority dilution:** Each link on a page divides the page's authority. 100 links each pass 1/100th of the equity. This is why STRATEGIC selection matters -- link to what matters, not everything. [Source: Zyppy, Semrush]
- **Crawl budget waste:** Too many links to low-priority pages can waste Google's crawl budget on unimportant content. [Source: multiple SEO sources]
- **User experience:** Research shows users "ignore or mistrust links when overwhelmed with choices." Body text with 3-5 links per paragraph looks cluttered. [Source: AirOps]
- **No penalty exists:** Mueller confirmed "there's no internal linking over-optimization penalty." The risk is dilution, not penalty. [Source: Search Engine Roundtable]
- **Footer link warning:** In 2013, footer links with excessive counts triggered algorithmic penalties. In 2026, Google devalues (but doesn't penalize) large footer link blocks -- they pass less equity than body links.

**Practical upper limit:** Keep the homepage under 100-150 total links. The sweet spot for the body content area (excluding nav/footer) is 15-40 contextual links.

### 8. Hub-and-Spoke Architecture: Should the Homepage Link to Hub Posts?

**Yes. This is explicitly recommended by multiple authoritative sources.**

- "Link to your hub from your navigation, other related pages, and **possibly your homepage too**." [Source: Growth Minded Marketing]
- "A pillar page should sit on the top level of your website in a location that gets a lot of organic traffic." The homepage IS the top level. [Source: Rozenberg Partners]
- "Pillar pages should be placed at the heart of your navigation, which tells visitors -- and Google -- exactly where your expertise lives." [Source: Siteimprove]
- The hub-and-spoke model creates a "bicycle wheel" where the homepage is the axle, hubs are the center ring, and spokes radiate outward. Not linking from homepage to hubs breaks the chain.

**Recommendation for alexmayhew.dev:** Link to all 5 hub guides from the homepage in a "Featured Guides" or "Deep Dives" section. These are the highest-authority content pieces and should receive the most link equity. The hub posts are:

1. SaaS Architecture Decision Framework
2. Engineering Leadership: Founder to CTO
3. Modern Frontend Architecture
4. Performance Engineering Playbook
5. AI-Assisted Development Guide

## Current State Analysis: alexmayhew.dev Homepage

**Total internal links on homepage:** 3 (to 2 unique pages)

- `/contact` -- linked twice (hero CTA + bottom CTA)
- `/work` -- linked once (hero secondary link)

**What's missing:**

- Zero links to any of the 74 blog posts
- Zero links to any of the 19 service pages
- Zero links to any of the 8 technology pages
- Zero links to any of the 10 role/industry pages
- Zero links to the about page
- The 3 service cards in the body have no links at all (dead ends)
- No "Featured Content" or "Latest Posts" section
- No footer navigation beyond what the global layout provides

**Impact:** The homepage is hoarding link equity instead of distributing it. Google has no signals from the homepage about which content is important. 176+ pages receive zero homepage authority. The 3-click depth rule is likely violated for many pages since the homepage doesn't link to any content hubs.

## Recommended Implementation Plan

### Phase 1: Link the existing sections (quick wins)

1. **Service cards** -- Add links to corresponding service/capability pages (e.g., `/services/full-stack-development`)
2. **Add "View All Services" link** after the services grid

### Phase 2: Add new homepage sections

3. **Featured Guides section** -- 5 hub posts with title, brief description, link
4. **Latest Insights section** -- 3-4 recent blog posts (dynamically populated)
5. **Technology/expertise showcase** -- Top 4-6 technology pages (e.g., Next.js, React, Node.js)
6. **Social proof section** -- Client logos or testimonials (no links needed, but adds content)

### Phase 3: Footer enhancement

7. **Comprehensive footer** -- Links to all major sections: Services (top 6), Blog hubs, Technologies, About, Contact

### Target link count after implementation

- Navigation: ~6 links
- Hero section: 2 links (contact + work) -- already exists
- Featured Services: 3-6 links
- Featured Guides: 5 links
- Latest Insights: 3-4 links
- Technology showcase: 4-8 links
- Footer: 15-20 links
- **Total: ~40-50 links** (within the optimal range from Zyppy data)

## Sources

- [Zyppy SEO: 23 Million Internal Links Case Study](https://zyppy.com/seo/seo-study/)
- [Search Engine Roundtable: Internal Linking Gives Google Page Level Importance](https://www.seroundtable.com/google-internal-linking-page-level-importance-31004.html)
- [Search Engine Roundtable: No Limit to Links Per Page](https://www.seroundtable.com/google-link-unlimited-18468.html)
- [Search Engine Roundtable: No Internal Linking Over-Optimization Penalty](https://www.seroundtable.com/google-no-internal-linking-overoptimization-penalty-27092.html)
- [Search Engine Journal: John Mueller Recommends Pyramid Site Structure](https://www.searchenginejournal.com/pyramid-site-structure/394528/)
- [Search Engine Journal: Google Cautions Against Too Many Internal Links](https://www.searchenginejournal.com/google-cautions-against-using-too-many-internal-links/412553/)
- [Google Search Central: Link Best Practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Semrush: Internal Links Ultimate Guide](https://www.semrush.com/blog/internal-links/)
- [Ahrefs: Internal Links for SEO](https://ahrefs.com/blog/internal-links-for-seo/)
- [Orbit Media: 3 Internal Linking Strategies](https://www.orbitmedia.com/blog/internal-linking/)
- [Orbit Media: Content Strategy Framework of Top 1% B2B Companies](https://www.orbitmedia.com/blog/content-strategy-framework/)
- [Orbit Media: B2B Service Page Checklist](https://www.orbitmedia.com/blog/b2b-service-page-checklist/)
- [Search Engine Land: Internal Linking Guide](https://searchengineland.com/guide/internal-linking)
- [Search Engine Land: Topic Clusters Complete Guide](https://searchengineland.com/guide/topic-clusters)
- [Yoast: Internal Linking for SEO](https://yoast.com/internal-linking-for-seo-why-and-how/)
- [Growth Minded Marketing: Hub and Spoke Content Strategy](https://growthmindedmarketing.com/blog/hub-and-spoke-content-strategy/)
- [Siteimprove: Pillar Page Design for SEO](https://www.siteimprove.com/blog/pillar-page-design/)
- [HubSpot: Topics, Pillar Pages, and Subtopics](https://knowledge.hubspot.com/content-strategy/pillar-pages-topics-and-subtopics)
- [inblog: How Many Internal Links Per Page](https://inblog.ai/blog/how-many-internal-links-per-page-seo)
- [AirOps: How to Spot and Fix Internal Linking Overload](https://www.airops.com/blog/how-many-internal-links-is-too-many)
- [Clearscope: Cyrus Shepard on Internal Link Optimization](https://www.clearscope.io/webinars/why-your-internal-links-arent-actually-optimized-cyrus-shepard)
- [Matt Cutts: How Many Links Per Page](https://www.mattcutts.com/blog/how-many-links-per-page/)
