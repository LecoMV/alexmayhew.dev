import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge component", () => {
	it("renders with children", () => {
		render(<Badge>New</Badge>);
		expect(screen.getByText("New")).toBeDefined();
	});

	it("renders as span element", () => {
		render(<Badge>Badge</Badge>);
		expect(screen.getByText("Badge").tagName).toBe("SPAN");
	});

	it("applies default variant styles", () => {
		render(<Badge data-testid="badge">Default</Badge>);
		const badge = screen.getByTestId("badge");
		expect(badge.className).toContain("bg-white/5");
	});

	it("renders outline variant", () => {
		render(
			<Badge variant="outline" data-testid="badge">
				Outline
			</Badge>
		);
		const badge = screen.getByTestId("badge");
		expect(badge.className).toContain("border");
		expect(badge.className).toContain("border-white/20");
	});

	it("renders cyber variant", () => {
		render(
			<Badge variant="cyber" data-testid="badge">
				Cyber
			</Badge>
		);
		const badge = screen.getByTestId("badge");
		expect(badge.className).toContain("cyber-lime");
	});

	it("renders featured variant", () => {
		render(
			<Badge variant="featured" data-testid="badge">
				Featured
			</Badge>
		);
		const badge = screen.getByTestId("badge");
		expect(badge.className).toContain("cyber-lime");
		expect(badge.className).toContain("uppercase");
		expect(badge.className).toContain("tracking-wider");
	});

	it("applies mono font", () => {
		render(<Badge data-testid="badge">Tech</Badge>);
		const badge = screen.getByTestId("badge");
		expect(badge.className).toContain("font-mono");
	});

	it("applies custom className", () => {
		render(
			<Badge className="custom-badge" data-testid="badge">
				Custom
			</Badge>
		);
		const badge = screen.getByTestId("badge");
		expect(badge.className).toContain("custom-badge");
	});

	it("forwards ref correctly", () => {
		const ref = vi.fn();
		render(<Badge ref={ref}>Ref Badge</Badge>);
		expect(ref).toHaveBeenCalled();
	});

	it("passes through HTML attributes", () => {
		render(
			<Badge data-testid="badge" id="my-badge" title="Badge title">
				With Attrs
			</Badge>
		);
		const badge = screen.getByTestId("badge");
		expect(badge.getAttribute("id")).toBe("my-badge");
		expect(badge.getAttribute("title")).toBe("Badge title");
	});

	it("renders inline with other text", () => {
		render(
			<p>
				Status: <Badge>Active</Badge>
			</p>
		);
		const badge = screen.getByText("Active");
		expect(badge.className).toContain("inline-flex");
	});
});
