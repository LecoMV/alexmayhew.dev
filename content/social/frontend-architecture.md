# Social Content: Frontend Architecture Cluster (2 Posts)

---

## Post 13: Testing React Server Components (Publish: Jul 1)

**Slug:** `testing-react-server-components`

### LinkedIn Post 1 (Mon Jun 29)

React Server Components break every testing pattern you've built over the past 5 years.

No jsdom. No render(). No user events. The component is async, accesses server-only APIs, and produces a serialized payload—not a DOM.

Calling render(<DashboardPage />) in a test fails because db.query doesn't exist in the test environment, getAuthenticatedUser() requires HTTP headers, and RTL can't await an async component.

The teams I've advised that adopted the right testing strategy reduced test suite runtime by 40% while catching more real bugs. The shift: stop testing "does this component render correctly?" and start testing "does this route return the correct data?"

The three-layer model that works:

Layer 1 (60-70% of tests): Unit test data fetching and business logic as plain functions. No React. Runs in milliseconds.

Layer 2 (15-20%): Test client components with RTL as before. They still work—client components haven't changed.

Layer 3 (10-15%): Integration test server components via HTTP requests. Hit the actual Next.js server, assert on HTML output.

Layer 4 (5-10%): E2E with Playwright for critical user flows.

The key insight: RSCs push data fetching into the component tree. Testing the component IS testing the data layer. Extract logic into pure functions, test those, and let integration tests verify the wiring.

How has your team adapted testing strategies for Server Components?

### LinkedIn Post 2 (Tue Jun 30)

The hardest RSC testing challenge: the client-server boundary.

A Server Component passes props to a Client Component. That's the serialization boundary. And it's where bugs hide.

The server component fetches user data and activities. The client component receives activities as props and adds filtering, sorting, and pagination. The bug: the server component sends activities without a timestamp field that the client component's sort function expects.

Testing strategy:

Server Component → Integration test via HTTP. Assert the HTML contains the expected data.
Client Component → Unit test with RTL. Pass mock props, test UI behavior.
Data fetching logic → Unit test as a plain function. No React required.
Full flow → E2E with Playwright. Covers the boundary automatically.

The client component test is unchanged from pre-RSC React. render(<ActivityFeed activities={mockData} />) still works. The server component test is new: make an HTTP request, check the response.

The 40% test suite speedup comes from replacing mocked data fetching tests with fast unit tests on pure functions + targeted integration tests. No more mocking fetch 15 different ways.

Are you testing the client-server boundary explicitly or hoping E2E tests catch the issues?

### LinkedIn Post 3 (Wed Jul 1)

React Testing Library is not dead. It just has a smaller job now.

With RSCs, RTL tests the client components that handle interactivity: forms, modals, filters, sorting, drag-and-drop. These components receive data as props (from the server component) and manage local state.

The components that RTL can't test (server components) are better tested at a higher level anyway. An HTTP integration test that hits the actual Next.js server tests the real rendering pipeline, including data fetching, auth, streaming, and Suspense boundaries.

The test distribution I recommend:

60-70% unit tests on pure logic functions (sub-millisecond each)
15-20% RTL tests on client components (10-50ms each)
10-15% HTTP integration tests on server routes (100-500ms each)
5-10% Playwright E2E tests on critical flows (2-10 seconds each)

Total test suite: under 30 seconds for unit + RTL, under 2 minutes for integration, under 10 minutes for E2E.

The anti-pattern: trying to make RTL work for server components by mocking every server-side dependency. You end up testing your mocks, not your components.

What percentage of your current test suite is actually testing mocks instead of real behavior?

### LinkedIn Post 4 (Thu Jul 2)

Testing RSC streaming and Suspense requires a different approach than synchronous rendering tests.

A Server Component with Suspense boundaries streams content progressively. The metrics table loads first, the activity feed loads second, the alerts panel loads last. The user sees content incrementally.

Testing this with a simple fetch() captures only the initial HTML. The streamed content arrives after the initial response.

The integration test needs to read the full streaming response:

Make the HTTP request. Read the response body as a stream. Accumulate chunks until the stream closes. Then assert that all Suspense boundaries resolved—the HTML should contain all three sections.

Assert that loading skeletons are NOT in the final HTML (they should have been replaced by real content). Assert that all expected data-testid attributes are present.

This catches a real class of bugs: Suspense boundaries that never resolve because a data fetch throws silently, leaving the user staring at a loading skeleton permanently.

Have you tested that your Suspense boundaries actually resolve in production conditions?

### X Tweet 1 (Tue Jun 30)

RSCs break RTL's render(). The fix: unit test logic as pure functions (60-70%), RTL for client components (15-20%), HTTP integration tests for server components (10-15%), Playwright for critical flows (5-10%). Test suite runs 40% faster.

### X Tweet 2 (Wed Jul 1)

Stop mocking fetch 15 ways to test server components. Extract logic into pure functions, unit test those in milliseconds, and let HTTP integration tests verify the wiring against the actual Next.js server.

### X Tweet 3 (Thu Jul 2)

The silent RSC bug: a Suspense boundary that never resolves because a data fetch throws silently. Users stare at loading skeletons forever. Test streaming responses end-to-end to catch it.

### Dev.to Article

**Title:** Testing Strategies for React Server Components
**Canonical URL:** https://alexmayhew.dev/blog/testing-react-server-components

React Server Components break React Testing Library's `render()`. They're async, access server-only APIs, and produce serialized payloads—not DOM. Here's what works instead.

**The Three-Layer Strategy**

**Layer 1: Unit Tests for Logic (60-70%)**

Extract business logic from components into pure functions. Test the functions.

```typescript
// Pure function — fast, no mocking
export function calculateGrowthRate(current: number, previous: number) {
	if (previous === 0) return { rate: 0, direction: "flat" };
	const rate = ((current - previous) / previous) * 100;
	return {
		rate: Math.round(rate * 10) / 10,
		direction: rate > 1 ? "up" : rate < -1 ? "down" : "flat",
	};
}
```

These tests run in milliseconds. No mocking. No browser simulation.

**Layer 2: Client Components with RTL (15-20%)**

Client components still work with React Testing Library. They receive data as props from server components and manage local state. Test them exactly as before.

**Layer 3: Server Components via HTTP (10-15%)**

Test server components by making HTTP requests to the Next.js server:

```typescript
test("renders metrics for authenticated user", async () => {
	const response = await fetch(`${baseUrl}/dashboard`, {
		headers: { Cookie: "session=test-token" },
	});
	expect(response.status).toBe(200);
	const html = await response.text();
	expect(html).toContain('data-testid="metrics-table"');
});
```

This tests the actual rendering pipeline: data fetching, auth, streaming, and Suspense resolution.

**Testing Streaming**

Read the full streaming response to verify all Suspense boundaries resolve. Assert that loading skeletons are NOT in the final HTML.

Read the full testing guide with Playwright E2E patterns and CI configuration: https://alexmayhew.dev/blog/testing-react-server-components

### Newsletter Section

**This Week's Decision: How Should You Test React Server Components?**

**Situation:** Your team migrated to Next.js App Router with Server Components. Half your tests broke because RTL's render() can't handle async server components. The team is debating whether to mock all server-side dependencies or rewrite the test suite.

**Insight:** Neither. Adopt a three-layer strategy: unit test business logic as pure functions (60-70% of tests, runs in milliseconds, no mocking), keep RTL for client components (15-20%), and add HTTP integration tests for server component routes (10-15%). The integration tests hit the actual Next.js server, testing real data fetching and streaming—not mocked approximations. Teams that adopted this approach reduced test suite runtime by 40% while catching more real bugs.

**When to Apply:** Any team using Next.js App Router with Server Components whose existing tests broke or require heavy mocking.

**When NOT to Apply:** Teams using Pages Router or client-side SPAs where RTL still works perfectly, or rapid prototyping stages where E2E tests provide sufficient coverage.

---

## Post 14: State Management in 2026 (Publish: Aug 11)

**Slug:** `state-management-2026`

### LinkedIn Post 1 (Mon Aug 10)

State management in 2026 is simpler than the discourse suggests. If you decompose the problem correctly.

The fundamental mistake: treating all state the same. Server state and client state have completely different characteristics and need different management strategies.

Server state: async, shared, cacheable, stale. User profiles, dashboard metrics, order lists. This belongs in React Query or SWR.

Client state: synchronous, local, transient. Form inputs, modal open/close, selected tab. This belongs in useState, useReducer, or Zustand.

URL state: synchronous, shareable, navigable. Filters, pagination, search queries. This belongs in useSearchParams or nuqs.

Global state: persistent, shared across routes. Auth session, theme, feature flags. This belongs in Zustand with persistence.

Redux tried to be the answer for all four categories. That's why Redux applications become unwieldy—using a complex tool for simple problems and a simple tool for complex problems.

For 90% of SaaS applications: React Query for server state + Zustand for client state. Two libraries, both under 10KB, covering every state management need.

What percentage of your state management complexity comes from mixing server state with client state?

### LinkedIn Post 2 (Tue Aug 11)

React Query replaced 200-400 lines of Redux code per API endpoint in one client's application.

The Redux pattern for fetching API data: define action types, write action creators, implement a reducer with loading/error/success states, write a thunk or saga for the async logic, manually handle caching, implement retry logic, add request deduplication.

React Query: 20 lines. Automatic caching with configurable staleness. Background refetching on window focus. Request deduplication (5 components using the same query = 1 network request). Optimistic updates with automatic rollback. Retry with exponential backoff.

The moment I recommend React Query: when your Redux store contains a single piece of API response data. That's a sign you're using Redux as a fetch cache—and React Query is a better fetch cache.

Keep Redux (or Zustand) for state that genuinely lives on the client: UI flags, form state, application preferences. Let React Query handle everything that comes from an API.

The bundle size comparison:
React Query + Zustand: ~14KB total
Redux Toolkit + RTK Query + Redux Persist: ~40KB total

Smaller bundle, less boilerplate, better developer experience.

Is your Redux store mostly API response data that React Query could manage?

### LinkedIn Post 3 (Wed Aug 12)

Signals solve a real performance problem that most React applications don't have.

When a signal value changes, only the specific DOM node that reads the signal updates. No component re-renders. No virtual DOM diffing.

In a dashboard with 500 data cells, updating one value:
React state (naive): 50-200ms (entire table re-renders)
React state with memo: 10-50ms (memoized cells skip)
Zustand with selector: 5-20ms (only subscribed components)
Signals: under 1ms (only the specific text node)

For trading dashboards, real-time monitoring, and collaborative editing with 100+ frequently updating values, signals provide a measurable advantage.

For standard CRUD SaaS applications? React Query + Zustand with selectors is fast enough. The performance difference between 5ms and 0.5ms is invisible to users.

The React signals story in 2026: available through @preact/signals-react (works but fragile), React Compiler (reduces but doesn't eliminate the need), and TC39 proposal (Stage 1, years away).

My recommendation: don't adopt signals for React applications unless you have a measured performance problem that Zustand selectors can't solve. The ecosystem (React Query, form libraries, component libraries) assumes React's rendering model.

Do you have a measured performance problem that justifies signals, or are you optimizing prematurely?

### LinkedIn Post 4 (Thu Aug 13)

The state management stack I recommend for every new SaaS project:

React Query for server state: ~13KB. Handles fetching, caching, mutations, optimistic updates, background refetching. Eliminates the most common state management complexity.

Zustand for client state: ~1.2KB. Selector-based subscriptions for minimal re-renders. Persist middleware for preferences that survive page refresh.

nuqs for URL state: ~2KB. Type-safe URL search parameters. Filters, pagination, and search queries shareable via URL.

React Hook Form + Zod for form state: ~12KB total. Schema-based validation. Minimal re-renders during input.

Total: ~28KB. Covers every state management need for a SaaS application.

Compare to the "kitchen sink" approach: Redux Toolkit + RTK Query + Redux Persist + React Hook Form + Zod: ~52KB with significantly more boilerplate and a steeper learning curve.

The decision framework is simple. If the data comes from an API: React Query. If the data lives in the URL: nuqs. If the data lives in a form: React Hook Form. If the data is shared client state: Zustand. If the data is component-local: useState.

No single library for all state. The right tool for each category.

What's the total bundle size of your current state management dependencies?

### X Tweet 1 (Tue Aug 11)

State management in 2026: React Query for server state + Zustand for client state. Two libraries, 14KB total, covers 90% of SaaS applications. Redux tried to be the answer for all four state categories. That's why it became unwieldy.

### X Tweet 2 (Wed Aug 12)

React Query replaced 200-400 lines of Redux per API endpoint in a client's app. Automatic caching, background refetch, request deduplication, optimistic updates. If your Redux store is mostly API data, React Query is the better tool.

### X Tweet 3 (Thu Aug 13)

Signals solve a real problem (sub-1ms DOM updates) that most React apps don't have. Zustand with selectors gives you 5-20ms updates. Unless you're building a trading dashboard with 500 updating cells, skip signals for now.

### Dev.to Article

**Title:** State Management in 2026: The Decision Framework
**Canonical URL:** https://alexmayhew.dev/blog/state-management-2026

The state management landscape has fragmented again. Here's the decision framework I give to advisory clients that cuts through the noise.

**The State Taxonomy**

The fundamental mistake: treating all state the same.

| Type         | Characteristics               | Solution               |
| ------------ | ----------------------------- | ---------------------- |
| Server state | Async, cacheable, stale       | React Query / SWR      |
| Client state | Synchronous, local, transient | useState / Zustand     |
| URL state    | Shareable, navigable          | useSearchParams / nuqs |
| Form state   | Validation, submission        | React Hook Form + Zod  |
| Global state | Persistent, cross-route       | Zustand + persist      |

**React Query for Server State**

Replaces 200-400 lines of Redux per API endpoint. Automatic caching, background refetching, request deduplication, optimistic updates with rollback, retry with backoff. 20 lines of code.

**Zustand for Client State**

External stores with selector-based subscriptions. Components only re-render when their specific slice changes. Persist middleware for preferences that survive refresh. 1.2KB.

**Signals Assessment**

Signals provide sub-1ms DOM updates by bypassing React's rendering model. Real benefit for 100+ frequently updating values (trading, real-time monitoring). For standard CRUD SaaS: Zustand selectors (5-20ms) are fast enough. The React ecosystem isn't built around signals yet.

**The Recommended Stack**

| Concern      | Solution    | Size      |
| ------------ | ----------- | --------- |
| Server state | React Query | ~13KB     |
| Client state | Zustand     | ~1.2KB    |
| URL state    | nuqs        | ~2KB      |
| Form state   | RHF + Zod   | ~12KB     |
| **Total**    |             | **~28KB** |

Read the full guide with code examples and migration strategies from Redux: https://alexmayhew.dev/blog/state-management-2026

### Newsletter Section

**This Week's Decision: What State Management Stack Should You Use?**

**Situation:** Your team is starting a new SaaS project. One engineer wants Redux (familiarity), another wants Zustand (simplicity), a third wants to try signals (performance). The state management debate is consuming sprint planning time.

**Insight:** Decompose the problem by state type, not by library preference. Server state (API data) belongs in React Query—it replaces 200-400 lines of Redux per endpoint with 20 lines. Client state (UI flags, preferences) belongs in Zustand with selectors (1.2KB, minimal re-renders). URL state (filters, pagination) belongs in nuqs. Form state in React Hook Form + Zod. Total: ~28KB covering all needs. Signals solve a real problem (sub-1ms updates) that standard CRUD SaaS applications don't have.

**When to Apply:** New React/Next.js projects, or existing Redux applications where the store is primarily API response data.

**When NOT to Apply:** Working Redux setups where the team is productive, or applications needing time-travel debugging (Redux DevTools is still best for this).
