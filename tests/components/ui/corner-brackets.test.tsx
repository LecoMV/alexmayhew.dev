import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CornerBrackets } from "@/components/ui/corner-brackets";

describe("CornerBrackets", () => {
	it("renders two bracket divs with border-cyber-lime", () => {
		const { container } = render(<CornerBrackets />);
		const divs = container.querySelectorAll("div");
		expect(divs).toHaveLength(2);
		expect(divs[0].className).toContain("border-t");
		expect(divs[0].className).toContain("border-r");
		expect(divs[0].className).toContain("border-cyber-lime");
		expect(divs[0].className).toContain("absolute");
		expect(divs[0].className).toContain("top-0");
		expect(divs[0].className).toContain("right-0");
		expect(divs[1].className).toContain("border-b");
		expect(divs[1].className).toContain("border-l");
		expect(divs[1].className).toContain("border-cyber-lime");
		expect(divs[1].className).toContain("absolute");
		expect(divs[1].className).toContain("bottom-0");
		expect(divs[1].className).toContain("left-0");
	});

	it("does not include hover opacity classes by default", () => {
		const { container } = render(<CornerBrackets />);
		const divs = container.querySelectorAll("div");
		expect(divs[0].className).not.toContain("opacity-0");
		expect(divs[0].className).not.toContain("group-hover:opacity-100");
		expect(divs[1].className).not.toContain("opacity-0");
		expect(divs[1].className).not.toContain("group-hover:opacity-100");
	});

	it("adds hover opacity classes when hover prop is true", () => {
		const { container } = render(<CornerBrackets hover />);
		const divs = container.querySelectorAll("div");
		expect(divs[0].className).toContain("opacity-0");
		expect(divs[0].className).toContain("group-hover:opacity-100");
		expect(divs[0].className).toContain("transition-opacity");
		expect(divs[0].className).toContain("duration-300");
		expect(divs[1].className).toContain("opacity-0");
		expect(divs[1].className).toContain("group-hover:opacity-100");
		expect(divs[1].className).toContain("transition-opacity");
		expect(divs[1].className).toContain("duration-300");
	});
});
