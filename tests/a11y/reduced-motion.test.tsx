import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Spy on MotionConfig to capture the props it receives
const MotionConfigSpy = vi.fn(({ children }: { children: React.ReactNode }) => <>{children}</>);

vi.mock("framer-motion", async () => {
	const actual = await vi.importActual("framer-motion");
	return {
		...actual,
		LazyMotion: ({ children }: { children: React.ReactNode }) => <>{children}</>,
		MotionConfig: (props: Record<string, unknown>) => {
			MotionConfigSpy(props as { children: React.ReactNode });
			return <>{props.children}</>;
		},
	};
});

// Import after mock setup
import { MotionProvider } from "@/components/providers/motion";

describe("MotionProvider — reducedMotion", () => {
	it("passes reducedMotion='user' to MotionConfig", () => {
		render(
			<MotionProvider>
				<div>Hello</div>
			</MotionProvider>
		);

		expect(MotionConfigSpy).toHaveBeenCalled();
		const callProps = MotionConfigSpy.mock.calls[0][0];
		expect(callProps).toHaveProperty("reducedMotion", "user");
	});
});
