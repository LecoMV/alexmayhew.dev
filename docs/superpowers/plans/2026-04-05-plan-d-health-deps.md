# Plan D: Health Check Dependencies

**Goal:** Health endpoint reports dependency reachability (Resend API).

**Tech Stack:** Next.js API route, Cloudflare Workers runtime

---

## Task 1: Add dependency checks to health route

**File:** `src/app/api/health/route.ts` (currently 27 lines)

- [ ] **Step 1:** Write test for health route returning `dependencies` field
- [ ] **Step 2:** Add Resend API reachability check:
  ```ts
  async function checkResend(): Promise<"reachable" | "unreachable"> {
  	try {
  		const res = await fetch("https://api.resend.com", {
  			method: "HEAD",
  			signal: AbortSignal.timeout(3000),
  		});
  		return res.ok || res.status === 401 ? "reachable" : "unreachable";
  	} catch {
  		return "unreachable";
  	}
  }
  ```
  Note: 401 is expected without auth header — proves the API is up.
- [ ] **Step 3:** Return status `"degraded"` if any dep unreachable, `"ok"` if all good
- [ ] **Step 4:** Response shape:
  ```json
  {
  	"status": "ok",
  	"timestamp": "...",
  	"deployment": { "sha": "...", "buildTime": "...", "version": "..." },
  	"dependencies": { "resend": "reachable" }
  }
  ```
- [ ] **Step 5:** Run build, commit

**Constraint:** Cloudflare Workers can't do TCP — HTTP checks only. Keep timeout at 3s max to not slow down the health endpoint.
