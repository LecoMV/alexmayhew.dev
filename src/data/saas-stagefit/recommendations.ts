import type { TechDimension } from "./types";

export interface Recommendation {
	title: string;
	description: string;
	hubLink: string;
}

const RECOMMENDATIONS: Record<TechDimension, Recommendation> = {
	architecture: {
		title: "Architecture Style",
		description:
			"Evaluate whether your service boundaries match your team size and deployment cadence.",
		hubLink: "/blog/saas-architecture-decision-framework",
	},
	database: {
		title: "Database & Tenant Isolation",
		description:
			"Assess your data model and tenant isolation strategy against your customer type and scale.",
		hubLink: "/blog/saas-architecture-decision-framework",
	},
	cicd: {
		title: "CI/CD Pipeline",
		description:
			"Review your deployment pipeline for automation gaps that slow down shipping velocity.",
		hubLink: "/blog/saas-architecture-decision-framework",
	},
	observability: {
		title: "Observability & Incident Response",
		description:
			"Ensure your monitoring and alerting match the reliability expectations of your stage.",
		hubLink: "/blog/performance-engineering-playbook",
	},
	security: {
		title: "Auth & Security Posture",
		description:
			"Align your auth, access control, and compliance posture with your customer requirements.",
		hubLink: "/blog/saas-architecture-decision-framework",
	},
	team: {
		title: "Team Structure & Ownership",
		description:
			"Match your engineering org structure and code ownership model to your current headcount.",
		hubLink: "/blog/saas-architecture-decision-framework",
	},
	performance: {
		title: "Performance & Scale",
		description:
			"Evaluate your caching, load testing, and scaling approach against current traffic patterns.",
		hubLink: "/blog/performance-engineering-playbook",
	},
	data: {
		title: "Data Management & Analytics",
		description:
			"Assess whether your analytics, ETL, and data governance match your reporting needs.",
		hubLink: "/blog/saas-architecture-decision-framework",
	},
};

export function getRecommendation(dim: TechDimension): Recommendation {
	return RECOMMENDATIONS[dim];
}
