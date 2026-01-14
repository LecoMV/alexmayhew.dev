import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
	it("merges class names correctly", () => {
		const result = cn("text-white", "bg-black");
		expect(result).toBe("text-white bg-black");
	});

	it("handles conditional classes", () => {
		const isActive = true;
		const result = cn("base", isActive && "active");
		expect(result).toBe("base active");
	});

	it("handles falsy values", () => {
		const result = cn("base", false && "hidden", null, undefined);
		expect(result).toBe("base");
	});

	it("merges Tailwind classes with conflicts correctly", () => {
		const result = cn("text-red-500", "text-blue-500");
		expect(result).toBe("text-blue-500");
	});
});
