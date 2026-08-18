# Tech Resume Best Practices Research (2026-08-17)

**Status:** CURRENT
**Session:** Multi-agent research sweep (6 angles + 3 gap-fills + adversarial critic, 11 agents, ~224 sources probed) to ground the build of Alex's resume. Companion intake note lives in the Obsidian vault (`Career/resume-intake.md`).

## Key Findings (the 12 decisions that matter)

1. **The ATS auto-rejection fear is a myth; attention scarcity is the real gate.** The "75% auto-rejected" stat is 2012 vendor marketing (Preptel, defunct 2013). 83-97% of polled recruiters say their ATS does not auto-reject on content. What changed is volume: ~240-300 applications per posting (up ~111% since 2022), recruiter teams halved, 56% of recruiters review fewer than 10 of every 100 applications. The failure mode is never being read, not being machine-rejected.
2. **Referral is the channel; the resume is the closing artifact.** At senior level: referrals convert ~10x better than cold applications; one senior director found 4 of 5 recent hires came via warm intro; hiring managers call inbound "a useless channel". ~15% of executive roles are ever posted. Effort allocation: one strong resume at hygiene-level ATS compliance, then spend the rest on referral paths and public work.
3. **Two pages is the default at 15+ years experience.** The one-page rule has inverted for senior candidates — a one-page executive resume now reads as under-qualified. Focus on the last 10-15 years; compress earlier roles. Page 1 must carry the decision (summary + current practice + 2 strongest engagements above the fold).
4. **LLM screening layers are real but criterion-bound and evidence-citing (Ashby: Meets/Does Not Meet with citations to resume text).** Consequence: keywords must live inside evidence-bearing quantified bullets, not in a standalone skills dump — an unsupported Skills-list term can now produce a negative verdict. This inverts a decade of keyword-density advice. (Counterpoint: HackerRank's open-sourced screener scored an unchanged resume 66-99 across 100 runs — the only stable category was binary skills matching. Net: keep an explicit skills section AND back every term with a bullet.)
5. **Only ship metrics you can rebuild live.** The 2026 test is stricter than "quantify everything": keep a number only if you can narrate its baseline, measurement method, and causal mechanism in 60 seconds under follow-up. Unreconstructable or suspiciously round numbers are now negative expected value — 65% of hiring managers say AI-polished resumes made skills harder to verify, and interview copilots (BrightHire, Metaview) prompt the follow-up a tired interviewer used to skip. Prefer verifiable scope/scale figures (team size, users, throughput, budget, latency, cost) over invented business-outcome percentages.
6. **Consulting years go under ONE umbrella entry** — "Founder & Principal <function>, <Firm> — 20XX-Present" with 3-5 curated client engagements as sub-bullets. Never one entry per client (job-hopper misread), never a functional/skills format (reads as concealment). Feature 1-2 marquee engagements; group the rest ("additionally advised N seed-Series B SaaS teams on ...").
7. **Anonymize with maximum specificity.** "Large fintech client" conveys nothing; "Series B fintech, ~40-person eng org" conveys everything. Most NDAs restrict the client name and financials, not your scope, team size, or architecture. Name clients where permitted (halo effect); pre-arrange references for the engagements you feature.
8. **Function-first titling, never naked C-titles over a small org.** "Founder & Principal Engineer" / "Fractional CTO / Technical Advisor" beats both hiding self-employment and headlining "CEO". Title inflation makes readers discount the whole document. Titles on your own LLC are pure self-attestation — so they must be scope-defensible, not impressive.
9. **Cross-document consistency is machine-checked.** Screening tools now diff resume vs LinkedIn vs your own website in seconds; date/title/entity mismatches read as fraud signals, not sloppiness. Resume, LinkedIn, and site must be byte-identical on entity name, title, start month. A one-person LLC is invisible to The Work Number/Truework, so LinkedIn + your site ARE the verification surface, and a pre-consented client-reference sheet is the substitute verification artifact (build it before applying; never write "references available upon request").
10. **Two artifacts, not one.** The full-time resume (chronological, ATS-clean, verification-proof) and the consulting-pipeline document (1-page capability statement: value pillars, signature results, engagement shapes, service menu) serve opposite buyers. ~93% of fractional executives land clients via referral/word-of-mouth; consulting buyers never run an ATS — sending a resume into a consulting conversation positions you as a candidate, not a solution provider. Build one canonical fact base, render it two (or three) ways.
11. **Founder bias is a retention objection, not a competence objection.** Ex-founders get fewer callbacks because recruiters fear they'll leave to found again (2023 Fortune-covered research; no recent replication). Don't rebut with achievement density — carry the commitment narrative in the summary and any human note, and make functional continuity obvious. Counterweight: in 2026, Staff+/EM roles go unfilled at 90th-percentile comp and senior leaders visibly choose fractional work — "ran my own thing" is now a demand-side asset when presented with client outcomes and deliberate intent.
12. **Hands-on is an asset again.** LeadDev 2026: 44% of CTOs report doing MORE hands-on work than the prior year (AI-assisted dev is the driver). Frame as player-coach: architecture decisions owned, systems shipped, production operated — never apologize for still shipping.

## Mechanics spec (format-level consensus)

- **Layout:** single column, real text, standard headings (Experience / Skills / Education). No tables, text boxes, icons, photos, skill bars, graphics. Contact info in the document body, never in a Word header/footer (parsers skip those regions).
- **Length:** 2 pages. 10-12pt body, 14-16pt headings, 0.5-1.0in margins, web-safe font (Calibri, Arial, Georgia, Garamond...). One restrained accent color max.
- **File:** text-selectable PDF, named `Alex-Mayhew-Resume.pdf` (keep variants: `-CTO`, `-Capabilities`). Keep a clean .docx for recruiters who reformat. On Workday flows, manually fix every autofilled field — the structured record is what gets searched. Self-test: copy PDF text into a plain editor; if reading order survives, it parses.
- **Sections:** header → 3-5 sentence executive summary (positioning + years + domains + scale + direction; no objective) → experience → selected engagements/products → skills (15-25, grouped by category, every term backed by a bullet somewhere) → education last. Kill: objective, street address, photo, references line, languages section (unless load-bearing).
- **Bullets:** XYZ/CAR shape, metric early, implied first person, present tense for current role, past for prior; ≤2 lines each; 2-4 bullets per role, most detail in the last 3-5 years. Senior-level formula: problem identified → scope breadth → leadership action → org-level outcome. No parts-list bullets ("used X, Y, Z"); integration and judgment over inventory.
- **Links:** LinkedIn + personal site (+GitHub) as visible URL text, not masked anchors. Deep-link to 2 specific labeled artifacts, not a profile root. Every link must land on something polished — a weak linked page actively costs you.
- **Cover letters:** data is genuinely split (some surveys say expected; hiring managers increasingly dismiss them as AI noise). Write one only where requested or where a warm, specific angle exists; a short human note to a person beats a formal letter.
- **Tailoring:** mirror the posting's exact phrasing on genuinely-held skills; rewrite summary + top 3-5 bullets per application; leave history stable. Spray-and-pray with AI-generated variants is the #1 named hiring-manager irritant.
- **Never:** hidden white text / prompt injection (industrialized detection: Indeed defenses, PhantomLint, USENIX 2026 paper; parsers strip color so recruiters see it). Check exported PDFs for leftover invisible template layers.

## AI-era screening realities

- **AI interviews are the median experience (63% of job seekers in six months; 75% of companies allow AI rejection without human review)** — but autonomous AI interviewers are explicitly NOT recommended for senior leadership searches. The senior-level exposure is the interview copilot inside human calls: transcripts, rubric scoring, prompted follow-ups. Interviewer memory decay is gone.
- **AI-written ≠ rejected; generic = rejected.** ~49-62% of hiring managers penalize what reads as unedited model output; well-edited AI-assisted writing with specific detail is indistinguishable. The defense is specificity and voice: named systems, odd-digit numbers, opinionated technical positions.
- **Fraud paranoia is background radiation** (Gartner: 1 in 4 profiles fake by 2028; 31% of hiring professionals have suspected a deepfake candidate). Hesitant narration of your own bullet now feeds a fraud hypothesis. Verifiable public identity (real site, real repos, real published work) is the pre-emptive answer — a genuine advantage for this profile.

## Owned-domain strategy (the asymmetric advantage)

- **Publish the resume as server-rendered HTML at a stable URL** (e.g. /resume), indexed by default. AI crawlers don't execute JS and treat PDFs as second-class; the PDF becomes a derived download. Google explicitly scopes ProfilePage schema to about/profile pages (not homepages): ProfilePage → mainEntity → Person with exhaustive sameAs + hasOccupation history. No rich result will appear — the value is entity resolution and claim verification by LLMs.
- **One canonical fact base (resume.json / JSON Resume standard) driving HTML + JSON-LD + PDF**, versioned in the repo, PDF built in CI — makes resume/LinkedIn/site drift structurally impossible, which matters because the site is now part of the verification surface (~85% of hiring managers report rejecting on something found online; publishing more makes every claim more falsifiable).
- **Cloudflare gotcha (load-bearing for this site):** since 2026-09-15 Cloudflare default-blocks Agent + Training crawler classes — the exact user-triggered fetchers (ChatGPT-User, Claude-User) that fire when someone asks an assistant to look at the site. Probe and set the bot policy explicitly before publishing; verify with live UA fetches in logs.
- **llms.txt is dead** (Google May 2026 guidance: not needed; no major lab reads it). Don't spend time there.
- **Discovery vs verification:** the resume page will rarely make an LLM name you for "who does fractional CTO work in X" — that's driven by off-domain presence (third-party mentions, directories, podcasts). The owned page's job is to survive cross-validation once the name is in play. Structure engagements as self-contained answer-first blocks (situation → intervention → outcome) that survive being quoted in isolation.

## Contradictions register (from adversarial critic — resolved positions)

| Tension | Resolution adopted |
|---|---|
| "ATS doesn't auto-reject" vs "tenure filters fire before humans" | Auto-rejection is rare and the Workday/iCIMS tenure-scoring claims trace to resume-tool blogs. Use the umbrella entry anyway — it's correct on human-perception grounds; the algorithmic urgency is unproven. |
| Multi-column "breaks parsing" vs "~7-point penalty" | Same prescription either way: single column. Treat "columns are fatal" as overstated, "columns buy nothing" as true. |
| Skills section: liability vs required | Both: keep a grouped 15-25 item section (stable binary matching) AND ensure every term has bullet evidence (citation-based review). Never orphan keywords. |
| Cover letter: load-bearing vs dead | Purpose-dependent; write only with a warm specific angle. The founder-commitment narrative goes in the summary, not a cold letter. |
| Quantify everything vs metrics read as fabricated | Resolved by the narratability test: fewer, defensible, mechanism-attached numbers; scope/scale figures over round outcome percentages. |
| Machine screen: noise vs coin-flip | Both observed (HackerRank variance is real). Response: literal, checkable statements; explicit skills; no implied seniority — then stop optimizing and work the channel. |
| LinkedIn on the doc: drop vs primary surface | For this profile (consultant, discoverability-dependent): include LinkedIn + site as one line. The wiki minimalism is a cold-apply IC optimization. |

## Known weak spots in the evidence base

Most precise-sounding 2026 percentages (68% prefer two pages, 92.8% referral acquisition, 53% prefer PDF, 71% gap-filtering, 49% AI-dismissal) come from resume-tool/recruiting-SaaS vendor blogs with uncited methodology, often citing each other circularly. Directions are corroborated; the digits are not citable. Strong primary sources in the set: Greenhouse recruiting benchmarks + 2026 Candidate AI Interview Report (n=2,950), Pragmatic Engineer hiring-manager surveys, Robert Half employer research, LeadDev Engineering Leadership Report 2026, Ashby product documentation, HackerRank's open-sourced hiring agent, Duke/UNC USENIX 2026 prompt-injection study, Google ProfilePage docs, Cloudflare crawler-policy announcements. The r/EngineeringResumes wiki was read from a GitHub mirror last synced 2024-06 (reddit blocks automated access) — durable baseline, not a 2026 snapshot.

## Open gap (not yet researched)

The critic flagged a fourth gap that was not run: **age/experience-depth signaling and comp anchoring for 15-20+ year candidates** — whether to show graduation years, how far back to carry history, how umbrella-entry titling maps to leveling (Staff/Principal vs Director/VP/CTO) and thus the implied comp band, and whether to state location/timezone. Standard (unverified-for-2026) practice: cut detail at ~15 years, "Earlier experience" one-liner block if needed, omit graduation year, state metro + "Remote" + timezone. Research properly if/when a specific full-time target emerges.

## Sources

Primary/high-value (full URL list embedded per-claim in the workflow output):

- https://www.greenhouse.com/recruiting-benchmarks and Greenhouse 2026 Candidate AI Interview Report
- https://newsletter.pragmaticengineer.com/p/tech-jobs-market-in-2026-part-3-hiring
- https://www.ashbyhq.com/product-updates/ai-assisted-application-review
- https://danunparsed.com/p/hackerrank-open-source-ats + https://news.ycombinator.com/item?id=48713832
- https://leaddev.com/management/engineering-managers-are-back-in-the-codebase
- https://www.roberthalf.com/us/en/insights/research/data-reveals-which-technology-roles-are-in-highest-demand
- https://pratt.duke.edu/news/thwarting-prompt-injection/ (USENIX 2026)
- https://developers.google.com/search/docs/appearance/structured-data/profile-page
- https://jsonresume.org/ (canonical fact-base tooling)
- https://www.ecp-careers.com/how-to-create-a-fractional-impact-document/
- https://www.forbes.com/sites/carolinecenizalevine/2025/07/28/how-to-add-consulting-work-to-your-resume-without-raising-red-flags/
- https://raw.githubusercontent.com/r-engineeringresumes/subreddit-wiki/HEAD/wiki/index.md (2024-06 mirror)
- https://theworknumber.com/how-it-works + https://www.cisive.com/blog/unverified-background-check (self-employment verification)
- Full agent-level findings with per-claim sources: workflow run `wf_fd2bc0f6-783` journal (session transcript dir)
