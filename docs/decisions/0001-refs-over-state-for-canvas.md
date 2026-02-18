# ADR-0001: Use useRef Over useState for Canvas Animation State

**Status:** Accepted
**Date:** 2026-02-18

## Context

The site has 7 animated canvas backgrounds (circuit-traces, code-rain, data-flow, ascii-field, blueprint-grid, crt-effect, hybrid-atmospheric). These run at 60fps via `requestAnimationFrame` loops inside `useEffect`. The `circuit-traces` component was calling `setTraces()` inside its rAF loop, triggering a React re-render every frame (60/sec). This caused cascading issues: the `useEffect` with `[traces]` in its dependency array re-ran every frame, creating new `animate` closures and risking multiple concurrent rAF loops. Similarly, `data-flow` had `mousePos` as state in its effect dependencies, creating a new closure on every mouse move.

## Decision

Store all mutable animation state (particle positions, trace progress, mouse coordinates, visibility flags) in `useRef` instead of `useState`. React state is reserved for values that should trigger re-renders. Canvas animation state updates 60 times per second and never needs to drive React's reconciliation -- it drives imperative canvas draw calls directly.

## Consequences

Canvas components no longer trigger React re-renders during animation. The rAF loop reads and writes refs directly, keeping all per-frame work outside React's rendering pipeline. The trade-off is that animation logic becomes imperative rather than declarative -- state mutations happen in-place on ref objects rather than through React's state management. This is the standard pattern for high-frequency canvas work in React and avoids the single largest performance pitfall in the codebase.
