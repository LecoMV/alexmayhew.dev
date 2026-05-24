import type { Persona, Severity, Zone } from "./types";

export interface ZoneCopy {
	diagnosis: string;
	symptoms: string;
	prognosisVelocity: string;
	prognosisReversibility: string;
	prescriptionCta: string;
}

type CopyKey = `${Zone}:${Exclude<Severity, null> | "null"}`;

const COPY: Partial<Record<CopyKey, Record<"cto" | "founder", ZoneCopy>>> = {
	"over-built:acute": {
		cto: {
			diagnosis: "Over-Built: Acute",
			symptoms:
				"Your tech stack is built for a company 2-3 stages ahead of where your business is today.",
			prognosisVelocity:
				"High velocity drag ... engineering capacity is partially consumed by managing capability your users don't need yet.",
			prognosisReversibility:
				"Irreversible dimensions are misaligned ... reversal cost compounds with every sprint.",
			prescriptionCta: "Architecture review + advisory retainer to map a simplification path.",
		},
		founder: {
			diagnosis: "You're paying for tech you don't need yet",
			symptoms: "Your engineering setup is built for a company 10x your current size and scale.",
			prognosisVelocity:
				"Engineering is moving slower than it should because the team is maintaining infrastructure your customers don't notice.",
			prognosisReversibility:
				"Some of the things you're maintaining will get expensive to undo as you grow.",
			prescriptionCta: "A focused architecture session to identify what to simplify first.",
		},
	},
	"over-built:mild": {
		cto: {
			diagnosis: "Over-Built: Mild",
			symptoms: "A few dimensions of your tech stack exceed what your current stage requires.",
			prognosisVelocity:
				"Moderate velocity drag ... some engineering effort goes to maintaining premature capability.",
			prognosisReversibility:
				"Most over-built dimensions are reversible ... simplification is feasible.",
			prescriptionCta: "Architecture review to prioritize simplification opportunities.",
		},
		founder: {
			diagnosis: "Slightly ahead of where you need to be",
			symptoms: "Your tech is a bit more complex than your business currently needs.",
			prognosisVelocity: "Your team may be spending time on infrastructure that could wait.",
			prognosisReversibility:
				"The good news: most of this can be simplified without major disruption.",
			prescriptionCta: "A quick architecture review to find easy simplification wins.",
		},
	},
	"stage-optimized:null": {
		cto: {
			diagnosis: "Stage-Optimized",
			symptoms:
				"Your tech complexity matches your current business stage. No urgent misalignment detected.",
			prognosisVelocity:
				"Low velocity drag ... engineering capacity is well-allocated to stage-appropriate work.",
			prognosisReversibility: "No irreversible misalignments detected at this time.",
			prescriptionCta: "Subscribe to The Architect's Brief for stage-transition playbooks.",
		},
		founder: {
			diagnosis: "Your tech fits your stage",
			symptoms:
				"Your engineering setup matches where your business is right now. That's a strong position.",
			prognosisVelocity:
				"Your team is spending their time on the right things for your current scale.",
			prognosisReversibility: "No high-risk architectural mismatches detected.",
			prescriptionCta:
				"Stay ahead with The Architect's Brief ... one architecture decision every Tuesday.",
		},
	},
	"under-built:tomorrow": {
		cto: {
			diagnosis: "Under-Built: Tomorrow",
			symptoms: "Your tech complexity is below what your next stage milestone will require.",
			prognosisVelocity:
				"Current velocity may feel fine, but gaps will surface at the next inflection point.",
			prognosisReversibility:
				"Some under-built dimensions involve irreversible decisions ... delaying makes the eventual migration harder.",
			prescriptionCta:
				"Advisory retainer to build a staged upgrade roadmap before the pressure hits.",
		},
		founder: {
			diagnosis: "You'll outgrow this setup soon",
			symptoms:
				"Your tech works for now, but it won't keep up as your business hits the next milestone.",
			prognosisVelocity: "Things feel manageable today, but growing pains are coming.",
			prognosisReversibility: "Some of these gaps get harder to fix the longer you wait.",
			prescriptionCta: "An advisory engagement to plan upgrades before they become emergencies.",
		},
	},
	"under-built:today": {
		cto: {
			diagnosis: "Under-Built: Today",
			symptoms:
				"Your tech complexity is below what your current business stage and trigger event require. Users are likely already feeling the pain.",
			prognosisVelocity:
				"Critical velocity drag ... engineering is fighting fires that proper infrastructure would prevent.",
			prognosisReversibility:
				"Irreversible dimensions are under-invested ... the cost of delayed action is compounding.",
			prescriptionCta:
				"Strategic implementation engagement to close the most critical gaps immediately.",
		},
		founder: {
			diagnosis: "Your tech is holding you back right now",
			symptoms:
				"Your engineering setup can't support what your business needs today, and the gap is widening.",
			prognosisVelocity: "Your team is spending more time on workarounds than on building product.",
			prognosisReversibility:
				"The longer you wait on some of these, the more expensive the fix becomes.",
			prescriptionCta: "A hands-on implementation engagement to fix the most urgent gaps.",
		},
	},
};

const FALLBACK: ZoneCopy = {
	diagnosis: "",
	symptoms: "",
	prognosisVelocity: "",
	prognosisReversibility: "",
	prescriptionCta: "",
};

export function getZoneCopy(zone: Zone, severity: Severity, persona: Persona): ZoneCopy {
	const key: CopyKey = `${zone}:${severity ?? "null"}`;
	const personaKey = persona === "other" ? "cto" : persona;
	return COPY[key]?.[personaKey] ?? FALLBACK;
}
