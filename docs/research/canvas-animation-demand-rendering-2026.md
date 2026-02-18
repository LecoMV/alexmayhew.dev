# Canvas Animation Demand-Based Rendering Research (2026-02-17)

**Status:** CURRENT
**Session:** Researching demand-based rendering patterns for 7 canvas background animations on alexmayhew.dev

## Context

The site has 7 canvas 2D background animations:

- `blueprint-grid`, `circuit-traces`, `code-rain`, `crt-effect`, `data-flow`, `ascii-field`, `hybrid-atmospheric`
- All located at `src/components/backgrounds/`
- All use `requestAnimationFrame` loops inside `useEffect`
- `code-rain` and `data-flow` already handle `prefers-reduced-motion` with static renders
- `circuit-traces` has an anti-pattern: calling `setTraces` inside the rAF loop triggers React re-renders every frame

---

## Key Findings

### 1. IntersectionObserver — Pause/Resume on Viewport Exit

**Pattern:** Use an `isVisible` ref (not state) inside the rAF loop to skip frames when off-screen.

```typescript
// src/hooks/use-canvas-visibility.ts
import { useEffect, useRef } from "react";

export function useCanvasVisibility(canvasRef: React.RefObject<HTMLCanvasElement>) {
	const isVisibleRef = useRef(false);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				isVisibleRef.current = entry.isIntersecting;
			},
			{
				threshold: 0, // Fire immediately on any overlap
				rootMargin: "50px", // 50px buffer — start rendering before scrolling into view
			}
		);

		observer.observe(canvas);
		return () => observer.disconnect();
	}, [canvasRef]);

	return isVisibleRef;
}
```

**Usage inside animate loop:**

```typescript
const animate = () => {
	if (!isVisibleRef.current) {
		animationRef.current = requestAnimationFrame(animate); // keep loop alive but skip work
		return;
	}
	// ... actual drawing work ...
	animationRef.current = requestAnimationFrame(animate);
};
```

**Critical nuance:** Use a `ref` not `useState` for the visible flag. Updating state inside rAF causes React re-renders every frame. A ref is a mutable value that doesn't trigger re-renders.

**Alternative (stop/restart loop entirely):**

```typescript
const observer = new IntersectionObserver(([entry]) => {
	if (entry.isIntersecting) {
		// restart loop only if not already running
		if (!animationRef.current) {
			animationRef.current = requestAnimationFrame(animate);
		}
	} else {
		// completely stop — saves CPU even more than skipping
		if (animationRef.current) {
			cancelAnimationFrame(animationRef.current);
			animationRef.current = undefined;
		}
	}
});
```

**Trade-off:** Stop/restart means a brief visual reset when scrolling back into view (e.g., code-rain trails vanish). Skip-frame approach preserves state but wastes one rAF callback per frame. For purely visual backgrounds, stop/restart is preferable.

**Browser support:** IntersectionObserver is universally supported (all modern browsers including Safari 12.1+).

---

### 2. requestAnimationFrame vs requestIdleCallback

**Rule: rAF for visual work, rIC for non-visual work. Never use rIC for canvas drawing.**

|                              | `requestAnimationFrame`                     | `requestIdleCallback`                          |
| ---------------------------- | ------------------------------------------- | ---------------------------------------------- |
| **When called**              | Before next browser paint (16.6ms at 60fps) | During browser idle periods (can be >50ms gap) |
| **Guaranteed timing**        | Yes — synced to display refresh             | No — up to 50ms or more between calls          |
| **For canvas drawing**       | YES — only correct choice                   | NO — will produce visible jank                 |
| **For background data init** | Unnecessary overhead                        | YES — generating trace paths, node positions   |

**Practical pattern for canvas backgrounds:**

```typescript
// BAD: generating particle data during animation loop (wastes frame budget)
const animate = () => {
	generateNewParticles(); // heavy computation
	drawParticles();
	requestAnimationFrame(animate);
};

// GOOD: pre-compute during idle, draw during rAF
requestIdleCallback(
	() => {
		generateNewParticles(); // done when browser has nothing else to do
	},
	{ timeout: 1000 }
);

const animate = () => {
	drawParticles(); // fast read-only pass
	requestAnimationFrame(animate);
};
```

**rIC for background canvas components:** Consider using rIC to initialize particle arrays, trace paths, and node connection graphs (the setup work done once in `useEffect`). This frees the main thread during page load.

**rIC polyfill:** Safari support was added in Safari 16.4 (2023). For older Safari, use `setTimeout(fn, 0)` as fallback:

```typescript
const scheduleIdleWork = (fn: () => void) =>
	"requestIdleCallback" in window ? requestIdleCallback(fn, { timeout: 2000 }) : setTimeout(fn, 0);
```

---

### 3. Page Visibility API — Stop on Tab Switch

**The browser already throttles rAF in hidden tabs**, but does not stop it completely in all cases. Explicitly handling `visibilitychange` guarantees zero CPU usage when the tab is not active.

```typescript
// Inside useEffect, alongside IntersectionObserver setup
const handleVisibilityChange = () => {
	if (document.hidden) {
		if (animationRef.current) {
			cancelAnimationFrame(animationRef.current);
			animationRef.current = undefined;
		}
	} else {
		// Only restart if also visible in viewport
		if (isVisibleRef.current && !animationRef.current) {
			animationRef.current = requestAnimationFrame(animate);
		}
	}
};

document.addEventListener("visibilitychange", handleVisibilityChange);
return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
```

**Key properties:**

- `document.hidden` — boolean, `true` when tab is not active
- `document.visibilityState` — `'visible'` | `'hidden'` | `'prerender'`
- Event: `document.addEventListener('visibilitychange', handler)`

**Guarantee:** When `document.hidden === true`, the tab is completely backgrounded. No rendering output reaches the user, so stopping the loop is always safe.

---

### 4. Battery-Aware Rendering

**Status: `Navigator.getBattery()` is deprecated and not cross-browser reliable.**

- **Firefox:** Removed Battery API entirely (Firefox 52+) over fingerprinting/privacy concerns
- **Chrome:** Still available but scoped to HTTPS only
- **Safari:** Never implemented it

**Verdict:** Do not build primary battery-saving logic around `getBattery()`. It will silently fail on Firefox (majority of privacy-conscious users).

**Practical alternative — use CSS media query instead:**

```css
@media (prefers-reduced-motion: reduce) {
	/* Already handled */
}
```

**If you still want battery awareness on Chrome:**

```typescript
async function initBatteryAwareness() {
	if (!("getBattery" in navigator)) return null;

	try {
		const battery = await (
			navigator as Navigator & {
				getBattery(): Promise<{ level: number; charging: boolean; addEventListener: Function }>;
			}
		).getBattery();

		const checkBattery = () => {
			// Reduce fidelity below 20% and not charging
			return !battery.charging && battery.level < 0.2;
		};

		battery.addEventListener("chargingchange", checkBattery);
		battery.addEventListener("levelchange", checkBattery);

		return checkBattery;
	} catch {
		return null; // Fail gracefully
	}
}
```

**Better pragmatic signal:** Use `navigator.connection.saveData` (Data Saver mode) and `navigator.connection.effectiveType` as complementary signals:

```typescript
const shouldReduceFidelity = () => {
	const conn = (
		navigator as Navigator & {
			connection?: { saveData?: boolean; effectiveType?: string };
		}
	).connection;

	return (
		conn?.saveData === true || conn?.effectiveType === "slow-2g" || conn?.effectiveType === "2g"
	);
};
```

**Recommendation for this project:** Skip `getBattery()`. Use `prefers-reduced-motion` (already implemented) as the primary fidelity gate, and the combined IntersectionObserver + visibilitychange approach as the demand-rendering mechanism.

---

### 5. prefers-reduced-motion Integration

**Current state:** `code-rain` and `data-flow` already implement this correctly (static snapshot render). The pattern to replicate across all 7 components:

```typescript
// Read once on setup — don't poll every frame
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion) {
	drawStaticSnapshot(ctx); // one-time render, no rAF loop
	return; // exit useEffect without starting loop
}

// Start animation loop only when motion is acceptable
animate();
```

**Listening for runtime changes** (user toggles OS setting while page is open — rare but correct):

```typescript
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const handleMotionChange = (e: MediaQueryListEvent) => {
	if (e.matches) {
		cancelAnimationFrame(animationRef.current!);
		drawStaticSnapshot(ctx);
	} else {
		animate();
	}
};

motionQuery.addEventListener("change", handleMotionChange);
return () => motionQuery.removeEventListener("change", handleMotionChange);
```

---

### 6. React + Canvas Cleanup — Avoiding Memory Leaks

**Top sources of canvas/rAF memory leaks in React:**

**A. Not cancelling rAF on unmount**

```typescript
// WRONG: animationRef.current may have stale closure
return () => {
	cancelAnimationFrame(animationRef.current); // undefined if reassigned
};

// CORRECT: capture the ref value at cleanup time
const frameId = animationRef.current;
return () => {
	if (frameId) cancelAnimationFrame(frameId);
};

// OR — the canonical pattern used across this codebase:
return () => {
	if (animationRef.current) {
		cancelAnimationFrame(animationRef.current);
	}
};
```

**B. circuit-traces anti-pattern — setState inside rAF**
`circuit-traces.tsx` calls `setTraces()` inside the animation loop. This:

- Triggers a React re-render every frame (60/sec)
- Causes the `useEffect` with `[traces]` dependency to re-run every frame
- Creates a new `animate` function every frame → new closure → stale refs
- Can lead to multiple concurrent rAF loops

**Fix:** Move all mutable animation state to refs, never to React state:

```typescript
// BAD (current circuit-traces.tsx)
const [traces, setTraces] = useState<Trace[]>([]);
// ... inside animate:
setTraces((prev) => prev.map((t) => ({ ...t, progress: t.progress + t.speed })));

// GOOD: mutable state in ref, no re-renders
const tracesRef = useRef<Trace[]>([]);
// ... inside animate:
tracesRef.current.forEach((t) => {
	t.progress += t.speed;
}); // mutate in place
```

**C. Window event listeners not cleaned up**

```typescript
// Pattern: always pair addEventListener with cleanup
useEffect(() => {
	window.addEventListener("resize", handleResize);
	window.addEventListener("mousemove", handleMouseMove);
	document.addEventListener("visibilitychange", handleVisibility);

	return () => {
		window.removeEventListener("resize", handleResize);
		window.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("visibilitychange", handleVisibility);
	};
}, []);
```

**D. Canvas context not released on unmount**

```typescript
// For WebGL contexts — call loseContext() to release GPU memory
// For 2D contexts — not strictly required but clear the canvas
return () => {
	cancelAnimationFrame(animationRef.current!);
	const ctx = canvasRef.current?.getContext("2d");
	if (ctx) {
		ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
	}
};
```

---

### 7. Performance Measurement — Quantifying Improvement

**Method 1: FPS counter using rAF timestamps**

```typescript
// Add to any canvas component for measurement
const fpsRef = useRef({ frames: 0, lastTime: performance.now(), current: 0 });

const animate = (timestamp: number) => {
	const fps = fpsRef.current;
	fps.frames++;
	if (timestamp - fps.lastTime >= 1000) {
		fps.current = fps.frames;
		fps.frames = 0;
		fps.lastTime = timestamp;
		console.log(`FPS: ${fps.current}`);
	}
	// ... drawing ...
	animationRef.current = requestAnimationFrame(animate);
};
```

**Method 2: PerformanceObserver for Long Animation Frames (LoAF)**
The LoAF API (Chrome 123+) reports frames that took >50ms to render:

```typescript
const observer = new PerformanceObserver((list) => {
	for (const entry of list.getEntries()) {
		if (entry.duration > 50) {
			console.warn(`Long animation frame: ${entry.duration.toFixed(1)}ms`);
		}
	}
});
observer.observe({ type: "long-animation-frame", buffered: true });
```

**Method 3: CPU usage measurement with Chrome DevTools**

1. Open DevTools → Performance tab
2. Record 5 seconds with all 7 animations running (baseline)
3. Enable demand-based rendering
4. Record same 5 seconds scrolled to same position
5. Compare: `Main thread scripting time` and `Rendering time`

**Method 4: Battery/power impact via Chrome DevTools**

- DevTools → Performance → "Enable advanced paint instrumentation"
- Or use Lighthouse with throttling for CPU comparison

**Expected improvements from demand-based rendering:**

- Tab backgrounded (visibilitychange): ~100% CPU reduction for animation threads
- Off-screen components (IntersectionObserver): proportional to % of page not visible
- For a page where only 1 of 7 backgrounds is visible: ~85% reduction in canvas work

**What to measure before/after:**

- `requestAnimationFrame` callback duration (Chrome DevTools Timeline)
- Main thread scripting time per second
- Chrome Task Manager: CPU% for renderer process
- Battery drain rate (OS-level power monitor)

---

### 8. Reduced Fidelity Mode vs Full Stop

**Two distinct strategies:**

**Strategy A: Full stop** (recommended for off-screen/backgrounded canvases)

- Cancel rAF entirely
- Canvas remains visible with last rendered frame frozen
- Zero CPU when not in focus
- Resume by calling `animate()` again — visual discontinuity is acceptable for backgrounds

**Strategy B: Reduced fidelity** (recommended for low-power devices or data saver)

```typescript
// Frame-skip pattern: render every Nth frame
const REDUCED_FRAME_INTERVAL = 3; // render at ~20fps instead of 60fps
let frameCount = 0;

const animate = () => {
	frameCount++;
	if (isReducedMode && frameCount % REDUCED_FRAME_INTERVAL !== 0) {
		animationRef.current = requestAnimationFrame(animate);
		return; // skip drawing, just keep the loop alive
	}
	// ... full draw pass ...
	animationRef.current = requestAnimationFrame(animate);
};
```

**Strategy C: Simpler effects in reduced mode**

```typescript
type FidelityLevel = "full" | "reduced" | "static";

const drawFrame = (ctx: CanvasRenderingContext2D, fidelity: FidelityLevel) => {
	if (fidelity === "static") {
		// Already rendered — do nothing
		return;
	}

	if (fidelity === "reduced") {
		// Skip: shadow blur, glow effects, mouse interaction
		ctx.shadowBlur = 0; // Skip GPU shadow compositing
		// Draw only the most important elements
		drawNodes(ctx); // skip connections if too many
		return;
	}

	// Full fidelity
	drawConnections(ctx);
	drawPulses(ctx);
	drawNodes(ctx);
	drawGlowEffects(ctx);
};
```

**Shadow blur is the most expensive canvas operation.** Removing `ctx.shadowBlur` and `ctx.shadowColor` from reduced mode provides the biggest single perf win with minimal visual impact.

**Decision matrix:**

| Condition                         | Strategy                          |
| --------------------------------- | --------------------------------- |
| Off-screen (IntersectionObserver) | Full stop                         |
| Tab hidden (visibilitychange)     | Full stop                         |
| `prefers-reduced-motion`          | Static snapshot                   |
| `saveData` / slow connection      | Reduced fidelity (20fps, no glow) |
| Low battery (Chrome only)         | Reduced fidelity (20fps, no glow) |
| Normal, visible                   | Full 60fps                        |

---

## Proposed Shared Hook Architecture

All 7 backgrounds should share a single hook that consolidates these signals:

```typescript
// src/hooks/use-canvas-controller.ts
import { useEffect, useRef } from "react";

interface CanvasControllerOptions {
	canvasRef: React.RefObject<HTMLCanvasElement>;
	onStart: () => void; // called when rendering should begin/resume
	onStop: () => void; // called when rendering should pause/stop
}

type FidelityLevel = "full" | "reduced" | "static";

interface CanvasController {
	isActiveRef: React.MutableRefObject<boolean>;
	fidelityRef: React.MutableRefObject<FidelityLevel>;
}

export function useCanvasController({
	canvasRef,
	onStart,
	onStop,
}: CanvasControllerOptions): CanvasController {
	const isActiveRef = useRef(false);
	const fidelityRef = useRef<FidelityLevel>("full");

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		// 1. prefers-reduced-motion — check once at mount
		const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		if (motionQuery.matches) {
			fidelityRef.current = "static";
			return; // let individual component render static snapshot
		}

		// 2. Data saver / slow connection
		const conn = (
			navigator as Navigator & {
				connection?: { saveData?: boolean; effectiveType?: string };
			}
		).connection;
		if (conn?.saveData || conn?.effectiveType === "2g") {
			fidelityRef.current = "reduced";
		}

		// 3. IntersectionObserver — visibility in viewport
		const intersectionObserver = new IntersectionObserver(
			([entry]) => {
				const wasActive = isActiveRef.current;
				isActiveRef.current = entry.isIntersecting && !document.hidden;

				if (isActiveRef.current && !wasActive) {
					onStart();
				} else if (!isActiveRef.current && wasActive) {
					onStop();
				}
			},
			{ threshold: 0, rootMargin: "50px" }
		);
		intersectionObserver.observe(canvas);

		// 4. Page Visibility API — tab backgrounded
		const handleVisibilityChange = () => {
			const wasActive = isActiveRef.current;
			isActiveRef.current = !document.hidden;

			if (isActiveRef.current && !wasActive) {
				onStart();
			} else if (!isActiveRef.current && wasActive) {
				onStop();
			}
		};
		document.addEventListener("visibilitychange", handleVisibilityChange);

		// 5. Motion preference change at runtime
		const handleMotionChange = (e: MediaQueryListEvent) => {
			if (e.matches) {
				fidelityRef.current = "static";
				onStop();
			}
		};
		motionQuery.addEventListener("change", handleMotionChange);

		// Start if initially visible
		isActiveRef.current = !document.hidden;
		if (isActiveRef.current) {
			onStart();
		}

		return () => {
			intersectionObserver.disconnect();
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			motionQuery.removeEventListener("change", handleMotionChange);
			onStop();
		};
	}, [canvasRef, onStart, onStop]);

	return { isActiveRef, fidelityRef };
}
```

---

## Issues Found in Current Implementation

1. **`circuit-traces.tsx`** — `setTraces()` called inside rAF loop causes 60 React re-renders/sec. Must be refactored to use refs for mutable animation state.

2. **No IntersectionObserver** — All 7 backgrounds run at 60fps regardless of whether they're visible in the viewport.

3. **No Page Visibility handling** — Animations continue running when tab is switched away. (Browsers throttle but don't stop rAF in background tabs in all cases.)

4. **`data-flow.tsx`** — `mousePos` in `useEffect` dependencies means a new `animate` closure is created every time the mouse moves. Mouse position should be a ref.

5. **`circuit-traces.tsx`** — Reads `traces` inside rAF but `traces` is in the dependency array, creating a new `animate` function every time traces change.

---

## Implementation Priority

1. **Fix `circuit-traces.tsx`** — Convert state to refs (stops 60 re-renders/sec)
2. **Fix `data-flow.tsx`** — Move mousePos to ref (stops new closures on every mouse move)
3. **Add `useCanvasController` hook** — Shared IntersectionObserver + visibilitychange
4. **Integrate hook into all 7 components**
5. **Add reduced-fidelity mode** — Shadow removal, frame-skip for data saver

---

## Sources

- [MDN: requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)
- [MDN: requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)
- [MDN: Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
- [MDN: Navigator.getBattery()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getBattery)
- [MDN: Battery Status API](https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API)
- [Chrome Developers: Using requestIdleCallback](https://developer.chrome.com/blog/using-requestidlecallback)
- [CSS-Tricks: requestAnimationFrame with React Hooks](https://css-tricks.com/using-requestanimationframe-with-react-hooks/)
- [Builder.io: React Intersection Observer Practical Guide](https://www.builder.io/blog/react-intersection-observer)
- [SpeedCurve: Long Animation Frames (LoAF)](https://www.speedcurve.com/blog/guide-long-animation-frames-loaf/)
- [StackInsight: Frontend Memory Leaks Empirical Study](https://stackinsight.dev/blog/memory-leak-empirical-study)
- [Harnessing the Page Visibility API with React](https://blog.sethcorker.com/harnessing-the-page-visibility-api-with-react/)
- [Jason ZK: requestIdleCallback vs requestAnimationFrame](https://en.blog.jasonzk.com/js/requestidlecallback-and-requestanimationframe/)
- [Motion Library: Pause useAnimationFrame Feature Request](https://github.com/motiondivision/motion/issues/2046)
- [Firefox Bug: Battery API Removal](https://bugzilla.mozilla.org/show_bug.cgi?id=1313580)
