import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ChatMarkdown } from "@/components/chat/chat-markdown";

vi.mock("dompurify", async () => {
	const actual = await vi.importActual<typeof import("dompurify")>("dompurify");
	return {
		default: {
			...actual.default,
			sanitize: vi.fn((html: string) => actual.default.sanitize(html)),
		},
	};
});

describe("ChatMarkdown sanitization", () => {
	it("calls DOMPurify.sanitize on highlighted code HTML", async () => {
		const DOMPurify = (await import("dompurify")).default;
		const snippet = "```js\nconst x = 1;\n```";
		render(<ChatMarkdown content={snippet} />);
		expect(DOMPurify.sanitize).toHaveBeenCalled();
	});
});
