import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/ui/footer";
import { vi } from "vitest";

// Mock LocalTime
vi.mock("@/components/ui/local-time", () => ({
	LocalTime: () => <span>12:00 PM UTC</span>,
}));

describe("Footer", () => {
	it("renders branding and description", () => {
		render(<Footer />);
		expect(screen.getByText("alex")).toBeTruthy();
		expect(screen.getByText("mayhew")).toBeTruthy();
		expect(screen.getByText(/Atmospheric Engineering/i)).toBeTruthy();
	});

	it("renders navigation links", () => {
		render(<Footer />);
		expect(screen.getByText("Work")).toBeTruthy();
		expect(screen.getByText("Blog")).toBeTruthy();
		expect(screen.getByText("Contact")).toBeTruthy();
	});

	it("renders social links", () => {
		render(<Footer />);
		expect(screen.getByLabelText("GitHub")).toBeTruthy();
		expect(screen.getByLabelText("LinkedIn")).toBeTruthy();
		expect(screen.getByLabelText("X")).toBeTruthy();
	});

	it("renders copyright", () => {
		render(<Footer />);
		const year = new Date().getFullYear();
		expect(screen.getByText(new RegExp(`${year} Alex Mayhew`))).toBeTruthy();
	});

	it("renders system status", () => {
		render(<Footer />);
		expect(screen.getByText("Systems operational")).toBeTruthy();
	});
});
