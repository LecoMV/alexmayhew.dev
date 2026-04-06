// SaaS Scaling Readiness Assessment - question definitions, scoring, and result tiers.

export interface QuizOption {
	label: string;
	score: 1 | 2 | 3 | 4;
}

export interface QuizQuestion {
	id: string;
	category: string;
	question: string;
	options: [QuizOption, QuizOption, QuizOption, QuizOption];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
	{
		id: "architecture",
		category: "Architecture",
		question: "How would you describe your current architecture?",
		options: [
			{ label: "Monolith, no clear boundaries", score: 1 },
			{ label: "Monolith with some service separation", score: 2 },
			{ label: "Microservices with defined boundaries", score: 3 },
			{ label: "Event-driven microservices with clear domain boundaries", score: 4 },
		],
	},
	{
		id: "database",
		category: "Database",
		question: "How do you handle database scaling?",
		options: [
			{ label: "Single database, no optimization", score: 1 },
			{ label: "Read replicas or basic caching", score: 2 },
			{ label: "Sharding or partitioning strategy", score: 3 },
			{ label: "Multi-region with automated failover", score: 4 },
		],
	},
	{
		id: "cicd",
		category: "CI/CD",
		question: "What does your deployment pipeline look like?",
		options: [
			{ label: "Manual deployments", score: 1 },
			{ label: "Basic CI/CD, manual QA", score: 2 },
			{ label: "Automated testing + staging environment", score: 3 },
			{ label: "Full CI/CD with canary/blue-green deploys", score: 4 },
		],
	},
	{
		id: "observability",
		category: "Observability",
		question: "How do you monitor production?",
		options: [
			{ label: "Basic uptime checks", score: 1 },
			{ label: "Application logging + error tracking", score: 2 },
			{ label: "APM + distributed tracing", score: 3 },
			{ label: "Full observability stack with SLOs and alerting", score: 4 },
		],
	},
	{
		id: "security",
		category: "Security",
		question: "How do you handle authentication and authorization?",
		options: [
			{ label: "Basic auth, minimal access control", score: 1 },
			{ label: "OAuth/OIDC with role-based access", score: 2 },
			{ label: "SSO + fine-grained permissions + audit logs", score: 3 },
			{ label: "Zero-trust architecture with compliance frameworks", score: 4 },
		],
	},
	{
		id: "team",
		category: "Team",
		question: "How is your engineering team structured?",
		options: [
			{ label: "Solo developer or very small team", score: 1 },
			{ label: "Small team, generalists", score: 2 },
			{ label: "Specialized roles with tech lead", score: 3 },
			{ label: "Cross-functional squads with clear ownership", score: 4 },
		],
	},
	{
		id: "performance",
		category: "Performance",
		question: "What is your approach to performance?",
		options: [
			{ label: "Fix issues when users complain", score: 1 },
			{ label: "Basic performance monitoring", score: 2 },
			{ label: "Performance budgets + regular optimization", score: 3 },
			{ label: "Automated performance regression testing + CDN/edge", score: 4 },
		],
	},
	{
		id: "data",
		category: "Data",
		question: "How do you handle data management?",
		options: [
			{ label: "Ad-hoc queries, no data strategy", score: 1 },
			{ label: "Basic analytics + backups", score: 2 },
			{ label: "Data warehouse + ETL pipelines", score: 3 },
			{ label: "Real-time analytics + data governance + compliance", score: 4 },
		],
	},
];

export function calculateScore(answers: Record<string, number>) {
	const questionIds = QUIZ_QUESTIONS.map((q) => q.id);
	const totalScore = questionIds.reduce((sum, id) => sum + (answers[id] ?? 0), 0);
	const maxScore = QUIZ_QUESTIONS.length * 4;
	const percent = Math.round((totalScore / maxScore) * 100);
	return { totalScore, maxScore, percent };
}

export interface ResultTier {
	id: string;
	label: string;
	minPercent: number;
	maxPercent: number;
	summary: string;
	recommendations: string[];
}

export const RESULT_TIERS: ResultTier[] = [
	{
		id: "foundation",
		label: "Foundation Building",
		minPercent: 0,
		maxPercent: 40,
		summary:
			"Your infrastructure needs foundational work before scaling. The good news: addressing these gaps now prevents expensive rewrites later.",
		recommendations: [
			"Establish service boundaries in your monolith before extracting microservices.",
			"Implement CI/CD with automated testing ... manual deploys do not scale past 5 engineers.",
			"Set up centralized logging and error tracking as a minimum observability baseline.",
			"Define your data model and backup strategy before you have data you cannot afford to lose.",
		],
	},
	{
		id: "growth",
		label: "Growth Ready",
		minPercent: 40,
		maxPercent: 70,
		summary:
			"You have the basics covered, but gaps will surface under load. Focus on the weakest categories before your next growth milestone.",
		recommendations: [
			"Audit your weakest scoring category ... that is where your next incident will originate.",
			"Add performance budgets and automated regression testing to catch degradation early.",
			"Invest in observability before you need it. Debugging production without tracing wastes weeks.",
			"Document your architecture decisions. Tribal knowledge does not survive team growth.",
		],
	},
	{
		id: "scale",
		label: "Scale Ready",
		minPercent: 70,
		maxPercent: 90,
		summary:
			"Strong foundation with room to harden. You are well-positioned for aggressive growth if you address the remaining gaps.",
		recommendations: [
			"Focus on the one or two categories below 75% ... diminishing returns elsewhere.",
			"Consider chaos engineering to validate your assumptions about fault tolerance.",
			"Evaluate whether your team structure matches your architecture boundaries.",
			"Ensure your security posture includes compliance frameworks relevant to your market.",
		],
	},
	{
		id: "enterprise",
		label: "Enterprise Grade",
		minPercent: 90,
		maxPercent: 100,
		summary:
			"Your engineering organization is operating at a high level. The challenge shifts from building to maintaining this standard as you scale the team.",
		recommendations: [
			"Codify your practices into runbooks and automated checks so they survive team turnover.",
			"Invest in developer experience ... onboarding velocity is your next bottleneck.",
			"Consider platform engineering to abstract infrastructure complexity from product teams.",
			"Evaluate edge cases: multi-region, compliance certification, and disaster recovery drills.",
		],
	},
];

/** Determine result tier from a percentage score */
export function getResultTier(percent: number): ResultTier {
	for (let i = RESULT_TIERS.length - 1; i >= 0; i--) {
		const tier = RESULT_TIERS[i];
		if (percent >= tier.minPercent) {
			return tier;
		}
	}
	return RESULT_TIERS[0];
}

export interface CategoryResult {
	category: string;
	score: number;
	maxScore: number;
	percent: number;
}

export function getCategoryResults(answers: Record<string, number>): CategoryResult[] {
	return QUIZ_QUESTIONS.map((q) => {
		const score = answers[q.id] ?? 0;
		return {
			category: q.category,
			score,
			maxScore: 4,
			percent: Math.round((score / 4) * 100),
		};
	});
}

export function getWeakestCategories(
	categoryResults: CategoryResult[],
	count: number = 3
): CategoryResult[] {
	return [...categoryResults].sort((a, b) => a.percent - b.percent).slice(0, count);
}
