import type { TechDimension } from "./types";

export const DIMENSIONS: TechDimension[] = [
	"architecture",
	"database",
	"cicd",
	"observability",
	"security",
	"team",
	"performance",
	"data",
];

export const REVERSIBILITY: Record<TechDimension, "irreversible" | "reversible"> = {
	architecture: "irreversible",
	database: "irreversible",
	cicd: "reversible",
	observability: "reversible",
	security: "reversible",
	team: "reversible",
	performance: "reversible",
	data: "reversible",
};
