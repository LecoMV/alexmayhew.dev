/**
 * Glossary of original terms Alex Mayhew has coined or championed
 * across the alexmayhew.dev blog. Surfaced at /glossary and via
 * DefinedTermSet JSON-LD for AI search grounding (Perplexity, ClaudeBot,
 * Google SGE).
 *
 * Each entry is authored in Alex's voice: direct, business context first,
 * contrarian where warranted. No hedging.
 */

export interface GlossaryEntry {
	term: string;
	slug: string;
	oneLineDefinition: string;
	fullDefinition: string;
	citedInPosts: string[];
	firstUsed: string;
	relatedTerms: string[];
}

export const glossary: GlossaryEntry[] = [
	{
		term: "Cognitive Debt",
		slug: "cognitive-debt",
		oneLineDefinition:
			"The compounding mental tax on an engineering team when AI-generated code ships faster than anyone on the team actually understands it.",
		fullDefinition:
			"Cognitive Debt is the gap between what your codebase contains and what your engineers can reason about without re-reading it from scratch. AI-assisted development widens this gap by orders of magnitude. A senior engineer used to accumulate working models of a system by writing into it. When the writing is delegated to an LLM, the working models stop forming. The code ships, the tests pass, and then... six months later, an incident hits a module nobody on the team has ever mentally loaded. Cognitive Debt is not measured in lines of code. It is measured in the delta between team familiarity and system complexity. Pay it down deliberately: pair-review AI output, require human-written architectural explanations, and treat 'I let Claude write it' as a code smell, not a productivity metric.",
		citedInPosts: [
			"cognitive-debt-ai-teams",
			"ai-technical-debt-bomb",
			"vibe-coding-hangover-recovery",
		],
		firstUsed: "2026-02-10",
		relatedTerms: ["generative-debt", "vibe-coding-hangover", "metr-paradox"],
	},
	{
		term: "Generative Debt",
		slug: "generative-debt",
		oneLineDefinition:
			"Technical debt specifically produced by generative tooling: plausible-looking code with no architectural intent, accumulating faster than review capacity.",
		fullDefinition:
			"Generative Debt is a subset of technical debt with a unique failure mode. Traditional debt is usually a conscious trade: we ship it now, we refactor later, and the team knows the shortcut. Generative Debt is unconscious. The LLM produces three hundred lines that look like what an engineer would have written, complete with plausible variable names, plausible comments, and plausible tests. But nobody decided anything. There is no architectural intent behind it... only pattern completion. Generative Debt compounds quietly because it triggers none of the signals that normally flag bad code. The fix is not more AI review. The fix is forcing every AI-generated change through the same human-authored architectural justification you would demand from a junior engineer.",
		citedInPosts: [
			"ai-assisted-development-generative-debt",
			"ai-technical-debt-bomb",
			"ai-assisted-development-guide",
		],
		firstUsed: "2026-02-18",
		relatedTerms: ["cognitive-debt", "vibe-coding-hangover"],
	},
	{
		term: "Vibe Coding Hangover",
		slug: "vibe-coding-hangover",
		oneLineDefinition:
			"The predictable state a team enters three to six months after adopting AI-assisted coding with no discipline: velocity crashes, incidents spike, morale tanks.",
		fullDefinition:
			"Vibe Coding Hangover describes the second-order failure of teams that treated AI coding tools as productivity multipliers rather than architectural instruments. The pattern is consistent. Month one: shipping velocity triples. Month two: test coverage degrades, review cycles shorten. Month three: the first production incident traces to code nobody on the team can explain. Month four: the second incident. By month six, the team's actual throughput is lower than pre-adoption, because every change requires archaeology. The hangover is not caused by AI. It is caused by removing the discipline that previously gated shipping without replacing it with anything. Recovery requires re-establishing design review, deleting AI-generated code that nobody owns, and treating velocity as a lagging indicator, not the target.",
		citedInPosts: [
			"vibe-coding-hangover-recovery",
			"ai-assisted-development-reality",
			"when-not-to-use-ai-coding",
		],
		firstUsed: "2026-03-05",
		relatedTerms: ["cognitive-debt", "generative-debt", "metr-paradox"],
	},
	{
		term: "METR Paradox",
		slug: "metr-paradox",
		oneLineDefinition:
			"Developers using AI coding tools perceive themselves as 20 percent faster while being measurably 19 percent slower on the same tasks.",
		fullDefinition:
			"Named after the METR study on experienced open-source developers, the METR Paradox captures the disconnect between perceived and measured productivity under AI assistance. The study found that developers completed tasks 19 percent slower with AI help, yet rated the experience as a significant speedup. This is not a minor measurement error. It is a systematic cognitive bias with real consequences for engineering leadership. Teams advocating hardest for more AI tooling are frequently the teams whose objective throughput has declined. The paradox resolves when you examine what AI actually accelerates: the typing phase, which was never the bottleneck. It decelerates the reading, reviewing, and debugging phases, which always were. Leadership response: measure cycle time on completed work items, not subjective developer sentiment.",
		citedInPosts: [
			"metr-paradox-ai-productivity",
			"ai-assisted-development-reality",
			"claude-code-vs-cursor-cost-analysis",
		],
		firstUsed: "2026-03-12",
		relatedTerms: ["cognitive-debt", "vibe-coding-hangover"],
	},
	{
		term: "The 50% Rule",
		slug: "the-50-percent-rule",
		oneLineDefinition:
			"When an individual contributor is promoted to tech lead, at least 50 percent of their hours must move out of implementation in the first quarter or the transition fails.",
		fullDefinition:
			"The 50% Rule is the single most reliable predictor of whether an IC-to-tech-lead transition succeeds. If the new lead is still writing more than half of their pre-promotion code volume three months in, the team will quietly stall. Reviews queue up, architectural decisions get deferred, and the new lead's former peers start routing around them. The 50% Rule forces the reallocation explicitly: hours reclaimed from coding must move into review, mentorship, and technical planning, not into meetings for their own sake. Founders botch this by rewarding the IC who 'still ships' after promotion. That IC is not leading. They are avoiding the harder work of multiplying through others. The rule is calibrated to 50 percent because lower thresholds get ignored and higher thresholds cause panic.",
		citedInPosts: [
			"ic-to-tech-lead",
			"engineering-leadership-founder-to-cto",
			"first-engineering-team-playbook",
		],
		firstUsed: "2026-01-22",
		relatedTerms: [],
	},
	{
		term: "Lambda Tax",
		slug: "lambda-tax",
		oneLineDefinition:
			"The hidden cost of serverless cold starts, billed not in cents per invocation but in p99 latency, user churn, and engineer debugging time.",
		fullDefinition:
			"The Lambda Tax is what your accounting software never captures about serverless. The platform bill is trivially cheap: fractions of a cent per invocation. The real cost is elsewhere. Cold starts add 200 to 3000 milliseconds to the first request of every idle path, which torches p99 latency and silently degrades conversion on authenticated flows. Debugging distributed traces across 40 cold-starting functions consumes senior engineer hours you cannot bill back to a cost center. Connection pooling workarounds (RDS Proxy, Hyperdrive) add their own latency and their own bills. The Lambda Tax is not an argument against serverless. It is an argument for measuring the full cost honestly. For a workload with steady traffic above 10 requests per second, a single long-running container is frequently 5 to 10 times cheaper end-to-end than the equivalent serverless deployment.",
		citedInPosts: ["lambda-tax-cold-starts", "edge-computing-saas", "rsc-edge-death-of-waterfall"],
		firstUsed: "2026-02-01",
		relatedTerms: [],
	},
	{
		term: "The $500K Architecture Mistake",
		slug: "the-500k-architecture-mistake",
		oneLineDefinition:
			"The canonical early-stage architectural error... premature microservices, wrong database, schema-per-tenant... that costs roughly $500,000 in engineering time to undo at $1M ARR.",
		fullDefinition:
			"The $500K Architecture Mistake is the compounding bill from any irreversible architecture decision made badly on day one. Three show up repeatedly. First: schema-per-tenant multi-tenancy that seemed clean at five customers and becomes a six-month migration at five hundred. Second: premature microservices that solved an organizational problem the team did not yet have, now requiring platform engineering to maintain. Third: document databases selected for relational data, now needing a parallel Postgres deployment and dual-writes. Each of these costs roughly two senior engineers for six months... $500,000 fully loaded, before opportunity cost. The mistake is not the technology choice. The mistake is making an irreversible choice with the information available at pre-PMF. Reversible decisions should be made fast. Irreversible ones should be made slowly, or deferred until they can be made with data.",
		citedInPosts: [
			"500k-architecture-mistake",
			"saas-architecture-decision-framework",
			"boring-technology-wins",
		],
		firstUsed: "2026-03-20",
		relatedTerms: ["lambda-tax"],
	},
	{
		term: "The Hidden Tax of Supporting Both",
		slug: "the-hidden-tax-of-supporting-both",
		oneLineDefinition:
			"The compounding engineering cost of maintaining two runtimes, two frameworks, or two architectural paradigms in parallel during a migration that was supposed to take one quarter.",
		fullDefinition:
			"The Hidden Tax of Supporting Both is what migrations actually cost versus what the original proposal estimated. The proposal said eight weeks to move from the old framework to the new. Twelve months later, half the team is still on the old stack, half on the new, and every shared component exists in two versions. Shared tooling must target both runtimes. Every new feature ships twice or ships behind a feature flag that now has its own maintenance cost. Observability fractures. Hiring splits. The tax compounds because the project was scoped as a migration but is funded as a coexistence. The fix is structural: migrations need a hard cutover date with executive air cover, or they become permanent. A migration that has outlived its original timeline by more than 50 percent is no longer a migration. It is your architecture.",
		citedInPosts: ["hidden-tax-supporting-both", "technical-debt-strategy", "legacy-modernization"],
		firstUsed: "2026-02-25",
		relatedTerms: ["the-500k-architecture-mistake"],
	},
];

export function getGlossaryEntry(slug: string): GlossaryEntry | undefined {
	return glossary.find((entry) => entry.slug === slug);
}

export function getAllGlossarySlugs(): string[] {
	return glossary.map((entry) => entry.slug);
}
