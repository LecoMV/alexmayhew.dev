# ADR-0005: next-view-transitions Package Over React Experimental API

**Status:** Accepted
**Date:** 2026-02-18

## Context

Page transitions improve the navigation feel of the portfolio site. The View Transitions API has ~89% global browser support (Chrome 111+, Edge 111+, Safari 18+, Firefox 144+) and degrades gracefully -- unsupported browsers render DOM updates instantly with no errors. Two implementation paths exist for Next.js 15 App Router:

1. React's experimental `<ViewTransition>` component via `next.config.js` `experimental.viewTransition: true`. Next.js docs explicitly advise against production use as of February 2026.
2. The `next-view-transitions` package (shuding/next-view-transitions), which provides a stable `<ViewTransitions>` provider and custom `<Link>` component.

## Decision

Use the `next-view-transitions` package for page-level crossfade transitions. Apply `view-transition-name` only to hero elements (blog featured images, page headings) that conceptually morph between routes. Retain Framer Motion for all component-level spring animations. Do not apply both View Transitions and Framer Motion transforms to the same element.

## Consequences

Stable API backed by the View Transitions browser standard. No dependency on React Canary channel features that may change between versions. The package is self-described as "aimed at basic use cases" -- complex Suspense/streaming scenarios may not work cleanly. Standard `next/link` must be replaced with the package's `<Link>` on routes where transitions are desired. Revisit when React's `<ViewTransition>` exits experimental status (estimated Q3 2026).
