# ADR-0006: react-markdown Without rehype-raw to Prevent XSS

**Status:** Accepted
**Date:** 2026-02-18

## Context

The chat widget renders AI-generated markdown using `react-markdown` with `remark-gfm`. The AI model (Qwen 2.5-Coder 32B) generates responses based on a controlled system prompt, but the attack surface includes prompt injection -- a user could craft input to make the model emit `<script>` tags or other malicious HTML. `react-markdown` has two modes: default (safe, JSX escaping, no raw HTML) and with `rehype-raw` (passes raw HTML through, requires separate sanitization).

`isomorphic-dompurify` is already installed in the project, but adding `rehype-raw` + sanitization introduces unnecessary complexity and attack surface for a chat widget that only needs standard markdown formatting.

## Decision

Use `react-markdown` without `rehype-raw`. All HTML tags in markdown are escaped by default through React's JSX escaping. No `dangerouslySetInnerHTML` is used in the markdown rendering pipeline (sugar-high's usage in `CodeBlock` receives pre-extracted code strings from the AST, not user HTML).

## Consequences

All raw HTML in AI responses is rendered as visible text, not executed. This prevents XSS from prompt injection attacks without requiring a sanitization library in the rendering path. The trade-off is that the chat cannot render HTML within markdown -- only standard markdown syntax (bold, italic, code, lists, links, headings). This is acceptable because the chat widget needs basic formatting only, and rendering arbitrary HTML from an AI model is a security anti-pattern regardless.
