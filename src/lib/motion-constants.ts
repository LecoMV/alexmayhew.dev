export const springTransition = {
	type: "spring" as const,
	stiffness: 100,
	damping: 20,
	mass: 1,
} as const;

export const snappySpringTransition = {
	type: "spring" as const,
	stiffness: 300,
	damping: 25,
} as const;
