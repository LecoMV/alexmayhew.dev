import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card";

describe("Card component", () => {
	describe("Card", () => {
		it("renders children correctly", () => {
			render(<Card>Card Content</Card>);
			expect(screen.getByText("Card Content")).toBeDefined();
		});

		it("renders with default variant", () => {
			render(<Card data-testid="card">Content</Card>);
			const card = screen.getByTestId("card");
			expect(card.className).toContain("border");
		});

		it("renders with glass variant", () => {
			render(
				<Card variant="glass" data-testid="card">
					Glass Card
				</Card>
			);
			const card = screen.getByTestId("card");
			expect(card.className).toContain("backdrop-blur-md");
		});

		it("renders with solid variant", () => {
			render(
				<Card variant="solid" data-testid="card">
					Solid Card
				</Card>
			);
			const card = screen.getByTestId("card");
			expect(card.className).toContain("gunmetal-glass");
		});

		it("renders corner accents by default", () => {
			render(<Card data-testid="card">With Corners</Card>);
			const card = screen.getByTestId("card");
			// Corner accents are rendered as children divs
			const cornerDivs = card.querySelectorAll("div.border-cyber-lime");
			expect(cornerDivs.length).toBe(2);
		});

		it("can hide corner accents", () => {
			render(
				<Card withCorners={false} data-testid="card">
					No Corners
				</Card>
			);
			const card = screen.getByTestId("card");
			const cornerDivs = card.querySelectorAll("div.border-cyber-lime");
			expect(cornerDivs.length).toBe(0);
		});

		it("applies featured class when featured", () => {
			render(
				<Card featured data-testid="card">
					Featured Card
				</Card>
			);
			const card = screen.getByTestId("card");
			expect(card.className).toContain("lg:col-span-2");
		});

		it("accepts custom className", () => {
			render(
				<Card className="custom-card" data-testid="card">
					Custom
				</Card>
			);
			const card = screen.getByTestId("card");
			expect(card.className).toContain("custom-card");
		});

		it("forwards ref correctly", () => {
			const ref = vi.fn();
			render(<Card ref={ref}>Ref Card</Card>);
			expect(ref).toHaveBeenCalled();
		});
	});

	describe("CardHeader", () => {
		it("renders children", () => {
			render(<CardHeader>Header Content</CardHeader>);
			expect(screen.getByText("Header Content")).toBeDefined();
		});

		it("applies flex layout", () => {
			render(<CardHeader data-testid="header">Header</CardHeader>);
			const header = screen.getByTestId("header");
			expect(header.className).toContain("flex-col");
		});
	});

	describe("CardTitle", () => {
		it("renders as h3 element", () => {
			render(<CardTitle>Title</CardTitle>);
			const title = screen.getByRole("heading", { level: 3 });
			expect(title.textContent).toBe("Title");
		});

		it("applies mono font", () => {
			render(<CardTitle data-testid="title">Title</CardTitle>);
			const title = screen.getByTestId("title");
			expect(title.className).toContain("font-mono");
		});
	});

	describe("CardDescription", () => {
		it("renders as paragraph", () => {
			render(<CardDescription>Description text</CardDescription>);
			expect(screen.getByText("Description text").tagName).toBe("P");
		});

		it("applies slate text color", () => {
			render(<CardDescription data-testid="desc">Description</CardDescription>);
			const desc = screen.getByTestId("desc");
			expect(desc.className).toContain("text-slate-text");
		});
	});

	describe("CardContent", () => {
		it("renders children", () => {
			render(<CardContent>Content here</CardContent>);
			expect(screen.getByText("Content here")).toBeDefined();
		});

		it("applies flex column layout", () => {
			render(<CardContent data-testid="content">Content</CardContent>);
			const content = screen.getByTestId("content");
			expect(content.className).toContain("flex-col");
		});
	});

	describe("CardFooter", () => {
		it("renders children", () => {
			render(<CardFooter>Footer content</CardFooter>);
			expect(screen.getByText("Footer content")).toBeDefined();
		});

		it("applies flex layout with gap", () => {
			render(<CardFooter data-testid="footer">Footer</CardFooter>);
			const footer = screen.getByTestId("footer");
			expect(footer.className).toContain("gap-4");
		});
	});

	describe("Composed Card", () => {
		it("renders full card structure", () => {
			render(
				<Card data-testid="full-card">
					<CardHeader>
						<CardTitle>Project Name</CardTitle>
						<CardDescription>Project description here</CardDescription>
					</CardHeader>
					<CardContent>Main content area</CardContent>
					<CardFooter>Footer buttons</CardFooter>
				</Card>
			);

			expect(screen.getByRole("heading", { level: 3 })).toBeDefined();
			expect(screen.getByText("Project description here")).toBeDefined();
			expect(screen.getByText("Main content area")).toBeDefined();
			expect(screen.getByText("Footer buttons")).toBeDefined();
		});
	});
});
