# Plan E: Contact Form Resilience

**Goal:** Retry Resend API on transient failures so contact messages aren't lost.

**Tech Stack:** Server Actions, Resend API, Cloudflare Workers

---

## Task 1: Add retry wrapper

**File:** `src/app/actions/contact.ts`

- [ ] **Step 1:** Write test for retry behavior (mock fetch to fail twice then succeed)
- [ ] **Step 2:** Create retry utility:
  ```ts
  async function withRetry<T>(
  	fn: () => Promise<T>,
  	maxRetries: number = 2,
  	delays: number[] = [1000, 3000]
  ): Promise<T> {
  	let lastError: unknown;
  	for (let attempt = 0; attempt <= maxRetries; attempt++) {
  		try {
  			return await fn();
  		} catch (err) {
  			lastError = err;
  			if (attempt < maxRetries) {
  				await new Promise((r) => setTimeout(r, delays[attempt]));
  			}
  		}
  	}
  	throw lastError;
  }
  ```
- [ ] **Step 3:** Wrap `sendEmailViaResend` call in `withRetry`
- [ ] **Step 4:** Add structured logging on retry attempts
- [ ] **Step 5:** Test: success on first try (no retry), success on retry, failure after all retries
- [ ] **Step 6:** Run build, commit

**Design decisions:**

- 2 retries max (3 total attempts) — don't spam the API
- Delays: 1s, 3s — exponential-ish backoff
- Only retry on network/5xx errors, NOT on 4xx (validation/auth errors)
- Log each retry attempt with context for debugging
