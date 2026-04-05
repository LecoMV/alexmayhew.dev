import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("cmdk", () => ({
	Command: Object.assign(
		({
			children,
			...props
		}: {
			children: React.ReactNode;
			label?: string;
			shouldFilter?: boolean;
		}) => (
			<div data-testid="cmdk-root" {...props}>
				{children}
			</div>
		),
		{
			Input: (props: Record<string, unknown>) => <input {...props} />,
			List: ({ children, ...props }: { children: React.ReactNode; className?: string }) => (
				<div {...props}>{children}</div>
			),
			Empty: ({ children, ...props }: { children: React.ReactNode; className?: string }) => (
				<div {...props}>{children}</div>
			),
			Group: ({
				children,
			}: {
				children: React.ReactNode;
				heading?: string;
				className?: string;
			}) => <div>{children}</div>,
			Item: ({
				children,
			}: {
				children: React.ReactNode;
				value?: string;
				onSelect?: () => void;
				className?: string;
			}) => <div>{children}</div>,
		}
	),
}));

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: vi.fn() }),
}));

import { CommandPalette } from "@/components/ui/command-palette";

describe("CommandPalette — dialog role", () => {
	it("has role='dialog' and aria-modal='true' on the palette container when open", () => {
		render(<CommandPalette items={[]} />);

		// Open the palette via keyboard shortcut
		fireEvent.keyDown(document, { key: "k", metaKey: true });

		const dialog = screen.getByRole("dialog");
		expect(dialog).toBeDefined();
		expect(dialog.getAttribute("aria-modal")).toBe("true");
	});
});
