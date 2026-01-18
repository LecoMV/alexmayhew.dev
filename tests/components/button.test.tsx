import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button component", () => {
	it("renders with default variant", () => {
		render(<Button>Click me</Button>);
		const button = screen.getByRole("button", { name: /click me/i });
		expect(button).toBeDefined();
	});

	it("renders with custom className", () => {
		render(<Button className="custom-class">Button</Button>);
		const button = screen.getByRole("button");
		expect(button.className).toContain("custom-class");
	});

	it("handles click events", () => {
		const handleClick = vi.fn();
		render(<Button onClick={handleClick}>Click</Button>);
		const button = screen.getByRole("button");
		fireEvent.click(button);
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("can be disabled", () => {
		const handleClick = vi.fn();
		render(
			<Button disabled onClick={handleClick}>
				Disabled
			</Button>
		);
		const button = screen.getByRole("button");
		expect(button).toHaveProperty("disabled", true);
		fireEvent.click(button);
		expect(handleClick).not.toHaveBeenCalled();
	});

	it("renders different sizes", () => {
		const { rerender } = render(<Button size="sm">Small</Button>);
		let button = screen.getByRole("button");
		expect(button.className).toContain("py-1.5");
		expect(button.className).toContain("text-xs");

		rerender(<Button size="lg">Large</Button>);
		button = screen.getByRole("button");
		expect(button.className).toContain("py-3");
		expect(button.className).toContain("px-6");
	});

	it("renders ghost variant with hover effect", () => {
		render(<Button variant="ghost">Ghost</Button>);
		const button = screen.getByRole("button");
		expect(button.className).toContain("hover:bg-white/5");
	});

	it("renders cyber variant", () => {
		render(<Button variant="cyber">Cyber</Button>);
		const button = screen.getByRole("button");
		expect(button.className).toContain("cyber-lime");
		expect(button.className).toContain("void-navy");
	});

	it("renders outline variant", () => {
		render(<Button variant="outline">Outline</Button>);
		const button = screen.getByRole("button");
		expect(button.className).toContain("border");
		expect(button.className).toContain("border-white/10");
	});

	it("renders default variant with border", () => {
		render(<Button variant="default">Default</Button>);
		const button = screen.getByRole("button");
		expect(button.className).toContain("border-white/20");
		expect(button.className).toContain("hover:border-cyber-lime");
	});

	it("forwards ref correctly", () => {
		const ref = vi.fn();
		render(<Button ref={ref}>Ref Button</Button>);
		expect(ref).toHaveBeenCalled();
	});

	it("supports type attribute", () => {
		render(<Button type="submit">Submit</Button>);
		const button = screen.getByRole("button");
		expect(button.getAttribute("type")).toBe("submit");
	});

	it("applies base styles to all variants", () => {
		render(<Button>Base</Button>);
		const button = screen.getByRole("button");
		expect(button.className).toContain("font-mono");
		expect(button.className).toContain("tracking-tight");
		expect(button.className).toContain("transition-colors");
	});

	it("includes focus ring styles", () => {
		render(<Button>Focus</Button>);
		const button = screen.getByRole("button");
		expect(button.className).toContain("focus-visible:ring-2");
		expect(button.className).toContain("focus-visible:ring-cyber-lime");
	});
});
