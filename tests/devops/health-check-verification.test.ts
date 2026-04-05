import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

describe("Deploy health check verification", () => {
	it("deploy.yml should verify deployed SHA matches commit SHA", () => {
		const content = readFileSync(join(process.cwd(), ".github/workflows/deploy.yml"), "utf-8");
		expect(content).toContain("github.sha");
		expect(content).toContain("deployment_sha");
	});
});

describe("CI supply chain pinning", () => {
	it("karpeslop should be pinned to a specific version, not @latest", () => {
		const content = readFileSync(join(process.cwd(), ".github/workflows/ci.yml"), "utf-8");
		expect(content).not.toContain("karpeslop@latest");
		expect(content).toMatch(/karpeslop@\d+\.\d+\.\d+/);
	});

	it("deploy.yml should not install googleapis at deploy time", () => {
		const content = readFileSync(join(process.cwd(), ".github/workflows/deploy.yml"), "utf-8");
		expect(content).not.toContain("npm install googleapis");
	});
});
