import { render, screen, fireEvent } from "@testing-library/react";
import { Navigation } from "@/components/ui/navigation";
import { vi } from "vitest";

// Mock next/navigation
vi.mock("next/navigation", () => ({
	usePathname: () => "/",
}));

// Mock next/image
vi.mock("next/image", () => ({
	// eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
	default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

describe("Navigation", () => {
	it("renders the logo", () => {
		render(<Navigation />);
		expect(screen.getByAltText("AM")).toBeTruthy();
	});

	it("renders desktop navigation items", () => {
		render(<Navigation />);
		expect(screen.getByText("Home")).toBeTruthy();
		expect(screen.getByText("Work")).toBeTruthy();
		expect(screen.getByText("Blog")).toBeTruthy();
	});

	it("renders mobile menu button on small screens", () => {
		render(<Navigation />);
		const menuButton = screen.getByLabelText(/open menu/i);
		expect(menuButton).toBeTruthy();
	});

	it("toggles mobile menu when button is clicked", () => {
		render(<Navigation />);
		const menuButton = screen.getByLabelText(/open menu/i);

		// Open menu
		fireEvent.click(menuButton);
		expect(screen.getByLabelText(/close menu/i)).toBeTruthy();

		// Mobile menu items
		const mobileLinks = screen.getAllByText("Home");
		expect(mobileLinks.length).toBeGreaterThan(1);
	});

	it("renders skip to content link", () => {
		render(<Navigation />);
		expect(screen.getByText("Skip to content")).toBeTruthy();
	});
});
