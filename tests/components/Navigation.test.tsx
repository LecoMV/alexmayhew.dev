import { render, screen, fireEvent } from "@testing-library/react";
import { Navigation } from "@/components/ui/navigation";
import { vi, describe, it, expect } from "vitest";

// Mock next/navigation
vi.mock("next/navigation", () => ({
	usePathname: () => "/",
}));

// Mock next/image - destructure priority to prevent passing it to native img element
vi.mock("next/image", () => ({
	default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { priority, ...rest } = props;
		// eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
		return <img {...rest} />;
	},
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

	it("closes mobile menu when a link is clicked", () => {
		render(<Navigation />);
		const menuButton = screen.getByLabelText(/open menu/i);

		// Open menu
		fireEvent.click(menuButton);

		// Find mobile link (last one is usually mobile duplications in this setup, or we can filter by visibility if we monitored styles,
		// but checking for the one in the mobile container is safer.
		// However, in the current DOM structure logic provided in the test file earlier,
		// 'getAllByText("Home")' returns duplicates.
		// The mobile menu renders: <Link ... onClick={() => setMobileMenuOpen(false)}>

		const mobileLinks = screen.getAllByText("Home");
		// The second one should be the mobile one based on the component structure (desktop first, then mobile)
		const mobileLink = mobileLinks[1];

		fireEvent.click(mobileLink);

		// Menu button should go back to "open menu" state (icon changes)
		expect(screen.getByLabelText(/open menu/i)).toBeTruthy();
		expect(screen.queryByLabelText(/close menu/i)).toBeNull();
	});

	it("renders skip to content link", () => {
		render(<Navigation />);
		expect(screen.getByText("Skip to content")).toBeTruthy();
	});
});
