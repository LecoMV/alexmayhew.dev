import fs from "fs";
import path from "path";

import { describe, expect, it } from "vitest";

import { fadeInUp, springTransition, staggerContainer } from "@/lib/motion-constants";

describe("motion-constants", () => {
	it("exports a staggerContainer variant with hidden and visible states", () => {
		expect(staggerContainer).toBeDefined();
		expect(staggerContainer.hidden).toEqual({ opacity: 0 });
		expect(staggerContainer.visible).toBeDefined();
		expect(staggerContainer.visible.opacity).toBe(1);
		expect(staggerContainer.visible.transition.staggerChildren).toBe(0.08);
		expect(staggerContainer.visible.transition.delayChildren).toBe(0.1);
	});

	it("exports a fadeInUp variant that uses springTransition", () => {
		expect(fadeInUp).toBeDefined();
		expect(fadeInUp.hidden).toEqual({ opacity: 0, y: 20 });
		expect(fadeInUp.visible.opacity).toBe(1);
		expect(fadeInUp.visible.y).toBe(0);
		expect(fadeInUp.visible.transition).toEqual(springTransition);
	});

	it("consumer files import from motion-constants instead of defining locally", () => {
		const consumerFiles = [
			"src/app/home-page.tsx",
			"src/app/services/services-page-content.tsx",
			"src/app/services/[slug]/service-page-content.tsx",
			"src/app/services/migrations/[slug]/migration-page-content.tsx",
			"src/app/services/integrations/[slug]/integration-page-content.tsx",
			"src/app/services/comparisons/[slug]/comparison-page-content.tsx",
			"src/app/for/for-hub-page.tsx",
			"src/app/for/[role]/role-page-content.tsx",
		];

		const root = path.resolve(__dirname, "../..");

		for (const file of consumerFiles) {
			const content = fs.readFileSync(path.join(root, file), "utf-8");
			// Should NOT have a local "const staggerContainer" or "const fadeInUp"
			expect(content).not.toMatch(/const staggerContainer\s*=/);
			expect(content).not.toMatch(/const fadeInUp\s*=/);
			// Should import from motion-constants
			expect(content).toMatch(/from\s+["']@\/lib\/motion-constants["']/);
		}
	});
});
