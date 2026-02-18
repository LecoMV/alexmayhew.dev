import { fc, test } from "@fast-check/vitest";
import { describe } from "vitest";
import { z } from "zod";

const MAX_MESSAGE_LENGTH = 1000;
const MAX_MESSAGES_PER_REQUEST = 10;

const ChatMessageSchema = z.object({
	role: z.enum(["user", "assistant", "system"]),
	content: z.string().max(MAX_MESSAGE_LENGTH),
});

const ChatRequestSchema = z.object({
	messages: z.array(ChatMessageSchema).min(1).max(MAX_MESSAGES_PER_REQUEST),
});

describe("ChatMessageSchema properties", () => {
	const validRoleArb = fc.constantFrom("user" as const, "assistant" as const, "system" as const);

	test.prop([validRoleArb, fc.string({ maxLength: MAX_MESSAGE_LENGTH })])(
		"valid role + content within limit always passes",
		(role, content) => {
			return ChatMessageSchema.safeParse({ role, content }).success === true;
		}
	);

	test.prop([
		validRoleArb,
		fc.string({ minLength: MAX_MESSAGE_LENGTH + 1, maxLength: MAX_MESSAGE_LENGTH + 100 }),
	])("content exceeding limit always fails", (role, content) => {
		return ChatMessageSchema.safeParse({ role, content }).success === false;
	});

	test.prop([
		fc.string().filter((s) => !["user", "assistant", "system"].includes(s)),
		fc.string({ maxLength: MAX_MESSAGE_LENGTH }),
	])("invalid role always fails", (role, content) => {
		return ChatMessageSchema.safeParse({ role, content }).success === false;
	});
});

describe("ChatRequestSchema properties", () => {
	const validMessageArb = fc.record({
		role: fc.constantFrom("user" as const, "assistant" as const, "system" as const),
		content: fc.string({ maxLength: MAX_MESSAGE_LENGTH }),
	});

	test.prop([fc.array(validMessageArb, { minLength: 1, maxLength: MAX_MESSAGES_PER_REQUEST })])(
		"valid arrays of 1-10 messages always pass",
		(messages) => {
			return ChatRequestSchema.safeParse({ messages }).success === true;
		}
	);

	test.prop([fc.constant([])])("empty messages array always fails", (messages) => {
		return ChatRequestSchema.safeParse({ messages }).success === false;
	});

	test.prop([
		fc.array(validMessageArb, {
			minLength: MAX_MESSAGES_PER_REQUEST + 1,
			maxLength: MAX_MESSAGES_PER_REQUEST + 5,
		}),
	])("arrays exceeding 10 messages always fail", (messages) => {
		return ChatRequestSchema.safeParse({ messages }).success === false;
	});
});
