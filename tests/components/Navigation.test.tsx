import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Navigation } from "@/components/ui/navigation";

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
		expect(screen.getByAltText("Alex Mayhew")).toBeTruthy();
	});

	it("renders desktop navigation items", () => {
		render(<Navigation />);
		expect(screen.getByText("Services")).toBeTruthy();
		expect(screen.getByText("Work")).toBeTruthy();
		expect(screen.getByText("Blog")).toBeTruthy();
	});

	it("includes /for advisory link in navigation", () => {
		render(<Navigation />);
		expect(screen.getByText("Advisory")).toBeTruthy();
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

		// Mobile menu should show pages not in desktop nav
		// Contact appears twice (nav CTA + menu item) after Wave E3 — use getAllByText
		expect(screen.getByText("Home")).toBeTruthy();
		expect(screen.getAllByText("Contact").length).toBeGreaterThanOrEqual(1);
		expect(screen.getByText("Newsletter")).toBeTruthy();
		expect(screen.getByText("Technologies")).toBeTruthy();
	});

	it("closes mobile menu when a link is clicked", () => {
		render(<Navigation />);
		const menuButton = screen.getByLabelText(/open menu/i);

		// Open menu
		fireEvent.click(menuButton);

		// "Home" is mobile-only, so there's exactly one instance
		const mobileLink = screen.getByText("Home");
		fireEvent.click(mobileLink);

		// Menu button should go back to "open menu" state (icon changes)
		expect(screen.getByLabelText(/open menu/i)).toBeTruthy();
		expect(screen.queryByLabelText(/close menu/i)).toBeNull();
	});

	it("renders skip to content link", () => {
		render(<Navigation />);
		expect(screen.getByText("Skip to content")).toBeTruthy();
	});

	it("nav container allows overflow for dropdown menus", () => {
		render(<Navigation />);
		const navBar = screen.getByRole("navigation", { name: /main navigation/i });
		const container = navBar.firstElementChild as HTMLElement;
		expect(container.className).not.toContain("overflow-hidden");
	});

	it("desktop nav items container has min-w-0 to allow flex shrinking", () => {
		render(<Navigation />);
		const servicesLink = screen.getAllByText("Services")[0];
		const desktopNavContainer = servicesLink.closest("div[class*='lg\\:flex']") as HTMLElement;
		expect(desktopNavContainer).toBeTruthy();
		expect(desktopNavContainer.className).toContain("min-w-0");
	});

	it("renders tools dropdown button with aria attributes", () => {
		render(<Navigation />);
		const toolsButton = screen.getByRole("button", { name: /tools/i });
		expect(toolsButton).toBeTruthy();
		expect(toolsButton.getAttribute("aria-haspopup")).toBe("true");
		expect(toolsButton.getAttribute("aria-expanded")).toBe("false");
	});

	it("closes mobile menu on Escape key", () => {
		render(<Navigation />);
		const menuButton = screen.getByLabelText(/open menu/i);
		fireEvent.click(menuButton);
		expect(screen.getByLabelText(/close menu/i)).toBeTruthy();

		fireEvent.keyDown(document, { key: "Escape" });
		expect(screen.getByLabelText(/open menu/i)).toBeTruthy();
	});

	it("renders search button with aria-label", () => {
		render(<Navigation />);
		const searchButton = screen.getByLabelText("Search (Cmd+K)");
		expect(searchButton).toBeTruthy();
	});

	it("renders Book a Call CTA link", () => {
		render(<Navigation />);
		const cta = screen.getByText("Book a Call");
		expect(cta).toBeTruthy();
		expect(cta.closest("a")?.getAttribute("href")).toBe("/contact");
	});

	it("shows tools sub-items in mobile menu", () => {
		render(<Navigation />);
		const menuButton = screen.getByLabelText(/open menu/i);
		fireEvent.click(menuButton);

		expect(screen.getByText("VoiceKeep")).toBeTruthy();
		expect(screen.getByText("TraceForge")).toBeTruthy();
		expect(screen.getByText("Claude Pilot")).toBeTruthy();
	});

	it("renders tools dropdown items when tools button is clicked", () => {
		render(<Navigation />);
		const toolsButton = screen.getByRole("button", { name: /tools/i });
		fireEvent.click(toolsButton);

		expect(screen.getByText("VoiceKeep")).toBeTruthy();
		expect(screen.getByText("TraceForge")).toBeTruthy();
		expect(screen.getByText("Claude Pilot")).toBeTruthy();
		expect(screen.getByText("View all tools")).toBeTruthy();
	});

	it("closes tools dropdown when clicking outside", () => {
		render(<Navigation />);
		const toolsButton = screen.getByRole("button", { name: /tools/i });
		fireEvent.click(toolsButton);
		expect(screen.getByText("VoiceKeep")).toBeTruthy();

		fireEvent.mouseDown(document.body);
		// After click outside the dropdown should close
		// The AnimatePresence may need a tick
		expect(screen.queryByRole("menu")).toBeNull();
	});
});
