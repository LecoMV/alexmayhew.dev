import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("cmdk", () => ({
	Command: Object.assign(
		({ children, label }: { children: React.ReactNode; label?: string }) => (
			<div data-label={label}>{children}</div>
		),
		{
			Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
			List: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
			Empty: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
			Group: ({ children, heading }: { children: React.ReactNode; heading: string }) => (
				<div data-heading={heading}>
					<div>{heading}</div>
					{children}
				</div>
			),
			Item: ({
				children,
				onSelect,
				value,
			}: {
				children: React.ReactNode;
				onSelect: () => void;
				value: string;
			}) => (
				<div data-value={value} onClick={onSelect}>
					{children}
				</div>
			),
		}
	),
}));

import { CommandPalette } from "@/components/ui/command-palette";

import type { SearchItem } from "@/data/search-index";

const mockItems: SearchItem[] = [
	{ title: "Home", description: "Landing page", href: "/", category: "Page" },
	{ title: "Test Blog Post", description: "A blog post", href: "/blog/test", category: "Blog" },
	{
		title: "Voice Cloner",
		description: "AI tool",
		href: "/tools/voice-cloner",
		category: "Tool",
	},
];

describe("CommandPalette", () => {
	it("opens on Cmd+K and shows search input", async () => {
		render(<CommandPalette items={mockItems} />);

		fireEvent.keyDown(document, { key: "k", metaKey: true });

		await waitFor(() => {
			expect(screen.getByPlaceholderText(/Search pages/)).toBeTruthy();
		});
	});

	it("opens on custom toggle-command-palette event", async () => {
		render(<CommandPalette items={mockItems} />);

		window.dispatchEvent(new CustomEvent("toggle-command-palette"));

		await waitFor(() => {
			expect(screen.getByPlaceholderText(/Search pages/)).toBeTruthy();
		});
	});

	it("groups items by category and renders them", async () => {
		render(<CommandPalette items={mockItems} />);

		fireEvent.keyDown(document, { key: "k", metaKey: true });

		await waitFor(() => {
			expect(screen.getByText("Home")).toBeTruthy();
			expect(screen.getByText("Test Blog Post")).toBeTruthy();
			expect(screen.getByText("Voice Cloner")).toBeTruthy();
			expect(screen.getByText("Page")).toBeTruthy();
			expect(screen.getByText("Blog")).toBeTruthy();
			expect(screen.getByText("Tool")).toBeTruthy();
		});
	});

	it("shows item count in footer", async () => {
		render(<CommandPalette items={mockItems} />);
		fireEvent.keyDown(document, { key: "k", metaKey: true });

		await waitFor(() => {
			expect(screen.getByText("3 items")).toBeTruthy();
		});
	});
});
