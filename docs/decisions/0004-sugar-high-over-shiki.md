# ADR-0004: sugar-high Over Shiki for Chat Widget Code Highlighting

**Status:** Accepted
**Date:** 2026-02-18

## Context

The chat widget renders AI-generated markdown responses that frequently contain code blocks. A syntax highlighter is needed for the custom `code` component inside `react-markdown`. The primary candidates were sugar-high (~1 kB gzipped, JS/JSX-focused) and Shiki (~250 kB+ with WASM, full language support with VS Code-quality theming). Secondary options included lowlight (6.5 kB, highlight.js-based) and react-syntax-highlighter (17-45 kB).

The chat widget is lazy-loaded via `dynamic()` import, so its bundle cost does not affect initial page load -- but keeping the widget itself lightweight matters for time-to-interactive after the user opens it.

## Decision

Use sugar-high for code syntax highlighting in the chat widget. It converts code strings to `<span>` elements with class names, used via `dangerouslySetInnerHTML` inside the custom `CodeBlock` component. The input to sugar-high is already extracted as a plain string by react-markdown's AST, so no XSS vector exists from the innerHTML usage.

## Consequences

Minimal bundle impact (~1 kB vs ~250 kB for Shiki). No async loading or WASM initialization required. Language support is limited to JS/JSX/TS -- other languages get unhighlighted monospace rendering. This is acceptable for a chat widget where responses are predominantly TypeScript/JavaScript. If full IDE-level highlighting becomes necessary (unlikely for chat), Shiki or lowlight can replace sugar-high in the `CodeBlock` component without changing the react-markdown integration.
