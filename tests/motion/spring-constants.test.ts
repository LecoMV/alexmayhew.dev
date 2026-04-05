import { describe, expect, it } from "vitest";

import { gentleSpring, microSpring } from "@/lib/motion-constants";

describe("spring constants", () => {
	it("exports microSpring with high stiffness for snappy micro-interactions", () => {
		expect(microSpring).toEqual({
			type: "spring",
			stiffness: 500,
			damping: 30,
		});
	});

	it("exports gentleSpring with moderate stiffness for hover/fade transitions", () => {
		expect(gentleSpring).toEqual({
			type: "spring",
			stiffness: 200,
			damping: 25,
		});
	});
});
