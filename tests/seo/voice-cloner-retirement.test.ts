import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * `/tools/voice-cloner` is retired. The real product lives at
 * voicekeep.io; the duplicate marketing page on alexmayhew.dev was
 * deleted and 301s to the canonical product page.
 *
 * Regression-guard: if any of these revert, we'd re-ship the duplicate
 * SoftwareApplication entity and sitemap URL Google Search Console
 * already warned about.
 */
describe("voice-cloner retirement", () => {
	it("deletes the /tools/voice-cloner page", () => {
		const path = join(process.cwd(), "src/app/tools/voice-cloner/page.tsx");
		expect(() => readFileSync(path, "utf-8")).toThrow();
	});

	it("declares a permanent redirect to voicekeep.io with UTM tags in next.config.mjs", () => {
		const src = readFileSync(join(process.cwd(), "next.config.mjs"), "utf-8");
		expect(src).toContain("/tools/voice-cloner");
		expect(src).toContain("voicekeep.io");
		expect(src).toContain("utm_campaign=voicekeep_crosspromo");
		expect(src).toContain("utm_content=tools-redirect");
	});

	it("removes /tools/voice-cloner from the sitemap (301 URLs trigger GSC warnings)", () => {
		const src = readFileSync(join(process.cwd(), "src/app/sitemap.ts"), "utf-8");
		expect(src).not.toContain("/tools/voice-cloner");
	});

	it("navigation dropdown points VoiceKeep at the case study, not the retired tools page", () => {
		const src = readFileSync(join(process.cwd(), "src/components/ui/navigation.tsx"), "utf-8");
		expect(src).toContain('href: "/work/voice-cloner"');
		expect(src).not.toMatch(/href:\s*"\/tools\/voice-cloner"/);
	});

	it("/tools hub card routes VoiceKeep at the case study, not the retired tools page", () => {
		const src = readFileSync(join(process.cwd(), "src/components/pages/tools-page.tsx"), "utf-8");
		expect(src).toContain('href: "/work/voice-cloner"');
		expect(src).not.toMatch(/href:\s*"\/tools\/voice-cloner"/);
	});
});
