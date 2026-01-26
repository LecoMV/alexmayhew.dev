// Unified services data - single source of truth
// Used by: /services page, terminal commands, contact forms, future features
// Philosophy: Outcome-focused positioning, value-based not hourly

export interface ServiceTier {
	id: string;
	name: string;
	tagline: string;
	description: string;
	idealFor: string[];
	deliverables: string[];
	outcomes: string[];
	engagement: string;
	startingAt?: string;
}

export const serviceTiers: ServiceTier[] = [
	{
		id: "advisory",
		name: "Advisory Retainer",
		tagline: "Strategic technical guidance for founders",
		description:
			"Monthly advisory partnership providing strategic technical guidance without the overhead of a full-time CTO. I become your trusted technical voice in the room—helping you navigate architecture decisions, evaluate vendors, interview engineers, and avoid the expensive mistakes that sink early-stage startups.",
		idealFor: [
			"Post-seed startups without a technical co-founder",
			"Non-technical founders building their first engineering team",
			"CTOs who need an experienced sounding board",
			"Companies preparing for Series A technical due diligence",
		],
		deliverables: [
			"Weekly 1:1 strategy calls (60 min)",
			"Async Slack/email support with 24h response",
			"Architecture reviews and technical roadmaps",
			"Tech stack decisions with written rationale",
			"Engineering hiring guidance and interview support",
			"Vendor evaluation and contract review",
		],
		outcomes: [
			"Avoid costly technical debt that compounds over time",
			"Make confident technology decisions backed by experience",
			"Build a team that scales with your business",
			"Enter fundraising with a defensible technical story",
		],
		engagement: "3-month minimum, rolling monthly thereafter",
		startingAt: "$4,000/month",
	},
	{
		id: "implementation",
		name: "Strategic Implementation",
		tagline: "Full-stack development with strategic oversight",
		description:
			"End-to-end product development from validated concept to production launch. Not just code—strategic technical execution with the foresight to build systems that scale. I architect, build, and ship complete products while ensuring every technical decision supports your business trajectory.",
		idealFor: [
			"Startups ready to build their MVP or v1 product",
			"Companies rebuilding legacy systems from scratch",
			"Founders who need a technical partner, not just a contractor",
			"Teams launching new product lines or pivoting direction",
		],
		deliverables: [
			"Full product architecture and technical specification",
			"Complete frontend and backend development",
			"Database design and API implementation",
			"Authentication, payments, and third-party integrations",
			"CI/CD pipelines and deployment infrastructure",
			"Comprehensive documentation and team handoff",
		],
		outcomes: [
			"Launch a production-ready product in weeks, not months",
			"Ship with infrastructure that handles 10x your initial load",
			"Onboard your team with clean, documented codebase",
			"Iterate confidently with a foundation built for change",
		],
		engagement: "Project-based, typically 6-12 weeks",
		startingAt: "$25,000",
	},
	{
		id: "due-diligence",
		name: "Technical Due Diligence",
		tagline: "Code audits and technical assessments",
		description:
			"Deep technical analysis for high-stakes decisions. Whether you're acquiring a company, investing in a startup, or inheriting a codebase, I provide the forensic technical assessment you need to understand what you're actually getting—and what it will cost to fix.",
		idealFor: [
			"VCs evaluating technical risk in portfolio companies",
			"PE firms conducting acquisition due diligence",
			"Acquirers assessing target company technology",
			"Boards requiring independent technical assessment",
			"CTOs inheriting codebases and needing honest evaluation",
		],
		deliverables: [
			"Comprehensive codebase architecture analysis",
			"Security vulnerability assessment",
			"Technical debt quantification with remediation costs",
			"Team capability and capacity evaluation",
			"Infrastructure scalability audit",
			"Executive summary with risk/opportunity matrix",
		],
		outcomes: [
			"Negotiate from a position of technical clarity",
			"Identify hidden liabilities before they become surprises",
			"Understand true cost of post-acquisition integration",
			"Make investment decisions with engineering confidence",
		],
		engagement: "Fixed scope, typically 1-3 weeks",
		startingAt: "$8,000",
	},
];

// Helper: get service by ID
export function getServiceById(id: string): ServiceTier | undefined {
	return serviceTiers.find((service) => service.id === id);
}

// Helper: get all services
export function getAllServices(): ServiceTier[] {
	return serviceTiers;
}

// Helper: get service IDs for routing/validation
export function getServiceIds(): string[] {
	return serviceTiers.map((service) => service.id);
}

// Helper: check if service ID is valid
export function isValidServiceId(id: string): boolean {
	return serviceTiers.some((service) => service.id === id);
}
