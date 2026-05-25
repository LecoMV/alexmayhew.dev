import type {
	Compliance,
	CustomerType,
	RevenueStage,
	TeamSize,
	TechDimension,
	TechScore,
	TriggerEvent,
} from "./types";

export type TechBaseline = Record<TechDimension, TechScore>;

const ALL_ONES: TechBaseline = {
	architecture: 1,
	database: 1,
	cicd: 1,
	observability: 1,
	security: 1,
	team: 1,
	performance: 1,
	data: 1,
};

const STAGE_BASELINES: Partial<Record<RevenueStage, TechBaseline>> = {
	2: {
		architecture: 1,
		database: 2,
		cicd: 2,
		observability: 2,
		security: 2,
		team: 1,
		performance: 1,
		data: 1,
	},
	3: {
		architecture: 2,
		database: 2,
		cicd: 2,
		observability: 2,
		security: 2,
		team: 2,
		performance: 2,
		data: 2,
	},
	4: {
		architecture: 3,
		database: 3,
		cicd: 3,
		observability: 3,
		security: 3,
		team: 3,
		performance: 2,
		data: 2,
	},
	5: {
		architecture: 4,
		database: 4,
		cicd: 3,
		observability: 3,
		security: 4,
		team: 3,
		performance: 3,
		data: 3,
	},
};

export function getStageBaseline(stage: RevenueStage): TechBaseline {
	return { ...(STAGE_BASELINES[stage] ?? ALL_ONES) };
}

function clamp(v: number): TechScore {
	return Math.max(1, Math.min(4, v)) as TechScore;
}

export function applyModifiers(
	baseline: TechBaseline,
	customerType: CustomerType,
	compliance: Compliance[],
	teamSize: TeamSize,
	triggerEvent: TriggerEvent
): TechBaseline {
	const result = { ...baseline };

	if (teamSize >= 3) {
		result.team = clamp(result.team + 1);
		result.cicd = clamp(result.cicd + 1);
	}

	if (customerType === "b2b-enterprise") {
		result.security = clamp(result.security + 1);
		result.database = clamp(result.database + 1);
	}
	if (customerType === "marketplace") {
		result.database = clamp(result.database + 1);
		result.data = clamp(result.data + 1);
	}

	for (const c of compliance) {
		if (c === "soc2") {
			result.security = clamp(result.security + 1);
			result.observability = clamp(result.observability + 1);
		}
		if (c === "hipaa") {
			result.security = clamp(result.security + 1);
			result.database = clamp(result.database + 1);
		}
		if (c === "pci") {
			result.security = clamp(result.security + 1);
		}
	}

	if (triggerEvent === "series-a" || triggerEvent === "due-diligence") {
		result.observability = clamp(result.observability + 1);
		result.security = clamp(result.security + 1);
		result.cicd = clamp(result.cicd + 1);
	}
	if (triggerEvent === "upmarket") {
		result.security = clamp(result.security + 1);
		result.database = clamp(result.database + 1);
	}
	if (triggerEvent === "10x-users") {
		result.performance = clamp(result.performance + 1);
		result.architecture = clamp(result.architecture + 1);
		result.observability = clamp(result.observability + 1);
	}
	if (triggerEvent === "hire-10") {
		result.team = clamp(result.team + 1);
		result.cicd = clamp(result.cicd + 1);
	}

	return result;
}
