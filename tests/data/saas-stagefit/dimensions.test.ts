import { describe, expect, it } from "vitest";

import { DIMENSIONS, REVERSIBILITY } from "@/data/saas-stagefit/dimensions";

describe("DIMENSIONS", () => {
	it("has exactly 8 dimensions", () => {
		expect(DIMENSIONS).toHaveLength(8);
	});
});

describe("REVERSIBILITY", () => {
	it("marks architecture and database as irreversible, rest as reversible", () => {
		expect(REVERSIBILITY.architecture).toBe("irreversible");
		expect(REVERSIBILITY.database).toBe("irreversible");
		expect(REVERSIBILITY.cicd).toBe("reversible");
		expect(REVERSIBILITY.observability).toBe("reversible");
		expect(REVERSIBILITY.security).toBe("reversible");
		expect(REVERSIBILITY.team).toBe("reversible");
		expect(REVERSIBILITY.performance).toBe("reversible");
		expect(REVERSIBILITY.data).toBe("reversible");
	});
});
