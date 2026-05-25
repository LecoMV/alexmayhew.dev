export type Persona = "founder" | "cto" | "other";
export type CustomerType = "b2b-enterprise" | "b2b-smb" | "b2c" | "marketplace";
export type RevenueStage = 0 | 1 | 2 | 3 | 4 | 5;
export type TriggerEvent =
	| "series-a"
	| "upmarket"
	| "10x-users"
	| "hire-10"
	| "due-diligence"
	| "none";
export type Compliance = "soc2" | "hipaa" | "pci" | "gdpr" | "other" | "none";
export type TeamSize = 0 | 1 | 2 | 3 | 4;
export type TechScore = 1 | 2 | 3 | 4;

export type TechDimension =
	| "architecture"
	| "database"
	| "cicd"
	| "observability"
	| "security"
	| "team"
	| "performance"
	| "data";

export type Zone = "over-built" | "stage-optimized" | "under-built";
export type OverBuiltSeverity = "mild" | "acute";
export type UnderBuiltSeverity = "today" | "tomorrow";
export type Severity = OverBuiltSeverity | UnderBuiltSeverity | null;

export type VelocityDragBand = "low" | "moderate" | "high" | "critical";

export type CtaBucket =
	| "architecture-review"
	| "advisory-retainer"
	| "strategic-implementation"
	| "technical-due-diligence"
	| "fractional-cto"
	| "newsletter-only";

export interface StageFitInput {
	persona: Persona;
	customerType: CustomerType;
	revenueStage: RevenueStage;
	triggerEvent: TriggerEvent;
	compliance: Compliance[];
	teamSize: TeamSize;
	techAnswers: Record<TechDimension, TechScore>;
}

export interface DimensionDelta {
	dim: TechDimension;
	delta: number;
	irreversible: boolean;
}

export interface StageFitResult {
	zone: Zone;
	severity: Severity;
	delta: number;
	velocityDragBand: VelocityDragBand;
	reversibilityRiskCount: number;
	topMisalignedDimensions: TechDimension[];
	ctaBucket: CtaBucket;
}

export interface ContextOption {
	label: string;
	value: string;
}

export interface TechOption {
	label: string;
	score: TechScore;
}

export interface ContextQuestion {
	id: string;
	kind: "context";
	category: string;
	questionCto: string;
	questionFounder: string;
	options: ContextOption[];
}

export interface TechQuestion {
	id: string;
	kind: "tech";
	dimension: TechDimension;
	category: string;
	questionCto: string;
	questionFounder: string;
	options: [TechOption, TechOption, TechOption, TechOption];
}

export type QuizQuestion = ContextQuestion | TechQuestion;
