# AI Code Quality Auditing — State of the Art (2026)

**Status:** CURRENT
**Session:** Research into automated codebase quality auditing systems for AI-generated code detection

---

## Key Findings

- The "Lies/Noise/Soul" detection framework is implemented by at least 4 deployable tools (sloppylint, KarpeSlop, AI-SLOP-Detector, eslint-plugin-deslop)
- Vibector exists and is confirmed active on GitHub for git commit velocity analysis
- SonarQube 2025.1+ has native AI Code Assurance with a dedicated quality gate
- No single tool covers all axes — a multi-tool stack is required for full coverage
- The TypeScript/React-specific tool is **KarpeSlop** (npx-runnable, CI-ready)

---

## 1. Existing Tools — Lies/Noise/Soul Framework

### 1.1 sloppylint (Python)

- **Repo:** https://github.com/rsionnach/sloppylint
- **PyPI:** https://pypi.org/project/sloppylint/
- **Target:** Python codebases only
- **What it detects:**
  - Hallucinated imports (20% of AI packages reference non-existent libraries)
  - Cross-language pattern leakage (LLMs trained on multiple languages leak patterns)
  - Mutable default arguments, bare except clauses
  - 100+ AI-specific anti-patterns not caught by Pylint/Flake8
- **Usage:** `pip install sloppylint && sloppylint .`
- **Verdict:** Python-only, not applicable to alexmayhew.dev TypeScript codebase

### 1.2 KarpeSlop (TypeScript/JavaScript/React) — MOST RELEVANT

- **Repo:** https://github.com/CodeDeficient/KarpeSlop
- **Inspired by:** Andrej Karpathy's "AI Slop Index" concept
- **Target:** TypeScript, JavaScript, React codebases
- **Detection axes:**
  - **Noise (Information Utility):** Redundant comments, boilerplate, debug logs
  - **Lies (Information Quality):** Hallucinated imports, incorrect assumptions, TODO placeholders
  - **Soul (Style/Taste):** Overconfident comments, hedging language, vibe coding patterns
- **Usage:**
  ```bash
  npx karpeslop@latest --quiet      # Full scan (~4 seconds)
  npx karpeslop@latest --strict     # CI mode: exits code 2 on critical issues
  ```
- **CI integration:** Direct — `--strict` flag blocks on hallucinated imports
- **Verdict:** Primary tool for this codebase. Run in CI as a non-blocking warning gate initially.

### 1.3 eslint-plugin-deslop (ESLint plugin)

- **Repo:** https://github.com/ahxar/eslint-plugin-deslop
- **Target:** Any JavaScript/TypeScript codebase
- **Rules:**
  - `no-excessive-comments`: Detects comment density >40% inside function bodies (configurable via `maxDensity`)
  - `no-obvious-comments`: Flags comments containing the variable name they describe; configurable with `customPatterns` and `checkVariableNames`
- **Auto-fixable:** Yes — `eslint --fix` removes slop comments automatically
- **Integration:** Drop into existing ESLint config
- **Verdict:** Directly integrable into this project's existing ESLint setup. Complements sonarjs rules already in place.

### 1.4 AI-SLOP-Detector (Python/VS Code)

- **Repo:** https://github.com/flamehaven01/AI-SLOP-Detector
- **DEV post:** https://dev.to/flamehaven01/--en3
- **Metrics used:**
  - Logic Density Ratio (LDR) — weight 0.40
  - Jargon/inflation detection — weight 0.35
  - Dependency checking — weight 0.25
  - Critical threshold: 0.30 | Warning threshold: 0.60
- **Detects:** 14 placeholder patterns, 4 structural anti-patterns, 6 cross-language patterns
- **CI modes:** Soft (PR comments only) and Hard (fail build)
- **VS Code extension:** Available on Marketplace
- **Verdict:** Python-focused but the LDR formula is the same used in this project's `npm run ldr` script.

---

## 2. Static Analysis Tools for AI Detection

### 2.1 SonarQube — AI Code Assurance (2025.1+)

- **Docs:** https://docs.sonarsource.com/sonarqube-server/2025.1/ai-capabilities/ai-standards/
- **Guide:** https://www.sonarsource.com/resources/library/how-to-guide-for-ai-code-assurance/
- **New in 2025.1 LTA:**
  - Automatic GitHub Copilot usage detection
  - Dedicated "Sonar way for AI Code" quality gate — separate from the standard quality gate
  - AI Code Assurance certification badge (publishable on PRs)
  - Cognitive complexity calculation updated for JS/TS: nested function complexity no longer added to parent
- **Key quality gate metrics for AI code:** Cognitive complexity, security injection vulnerabilities, bug density
- **CI/CD integration:** Quality gate status reportable to pipeline; fails build if gate fails
- **Verdict:** Enterprise-grade. Overkill for a solo portfolio project but the right answer for team contexts. The updated CC calculation for nested functions is directly relevant to Next.js Server Components.

### 2.2 eslint-plugin-sonarjs (already in this project)

- **Current config:** `"sonarjs/cognitive-complexity": ["warn", 15]`
- **What's new in 2025:** The standalone `eslint-plugin-sonarjs` has been kept in sync with SonarQube rules
- **Key rules for AI detection:**
  - `sonarjs/cognitive-complexity` — catches God functions (already configured at CC>15)
  - `sonarjs/no-duplicate-string` — catches boilerplate inflation (already configured)
  - `sonarjs/no-identical-functions` — catches copy-paste duplication (already configured)
  - `sonarjs/no-unused-expressions` — catches dead code
- **Verdict:** Already well-configured. The existing setup covers the Noise axis effectively.

### 2.3 KarpeSlop (repeated here for completeness)

- Covers TypeScript-specific Lies axis (hallucinated imports, `any` type abuse)
- Covers React-specific Soul axis (vibe coding patterns in JSX)

### 2.4 Logic Density Ratio (LDR) — Custom Script (already in this project)

- **Current baseline:** Avg LDR 0.252 across 189 files
- **Distribution:** 61 files at 0.30+ (logic-heavy), 49 files below 0.05 (data/configs, expected)
- **Formula:** `logic_lines / total_lines` where logic lines exclude comments, imports, blank lines, type declarations
- **Threshold:** 0.10 minimum for non-data files; <0.05 is a red flag for logic files
- **Tool:** `npm run ldr` (custom script already implemented)
- **Reference:** flamehaven01's AI-SLOP-Detector uses LDR at weight 0.40

---

## 3. Git Forensics Tools

### 3.1 Vibector

- **Repo:** https://github.com/anisimov-anthony/vibector
- **Config file:** `.vibector.yaml`
- **Method:** Analyzes consecutive commit pairs, calculates LOC/minute, flags commits exceeding configurable velocity thresholds
- **Detection steps:** Commit Retrieval → Pair Creation (skips merges) → Diff Analysis → Velocity Calculation → Statistical Analysis (percentiles) → Threshold Detection → Report
- **Thresholds:** Separate settings for additions vs deletions
- **Output:** JSON or text report of suspicious commits
- **Reddit thread:** https://www.reddit.com/r/commandline/comments/1q89bak/vibector_detect_aigenerated_code_in_git/
- **Verdict:** Directly applicable. This repo's own forensics (88.5 LOC/min peak, 22,065 LOC on Feb 6) would be flagged. Useful as a transparency tool, not a blocking gate.

### 3.2 IsVibeCode.com

- **URL:** https://isvibecoded.com/
- **Method:** Analyzes public GitHub repos — commit patterns, code structure, repo metadata
- **Output:** Confidence score (0-100) on whether repo was vibe-coded
- **Verdict:** Web-based only, not CI-integrable. Useful for third-party audits.

### 3.3 VibeDetect.io

- **URL:** https://www.vibedetect.io
- **Method:** Weighted analyzer across commit patterns, project structure, dependencies, optional LLM review
- **Output:** Score 0-100 mapped to human-readable verdict
- **Verdict:** Similar to IsVibeCode but with LLM review option for public repos.

### 3.4 Academic: LLM Code Stylometry (2025 Research)

- **Paper:** "I Know Which LLM Wrote Your Code Last Summer" (arXiv:2506.17323) — CCS 2025
- **Method:** Fine-tuned transformer models (CodeBERT, RoBERTa, ModernBERT, DeBERTa-V3)
- **Accuracy:** 97.56% binary (AI vs human), 95.40% multi-class (which LLM)
- **CodeBERT with comments:** 95.31% accuracy (comparable to general RoBERTa at 94.81%)
- **Finding:** Enhanced architecture matters more than domain-specific pre-training
- **Benchmark:** LLM-AuthorBench — 32,000 compilable C programs from 8 LLMs
- **Dataset:** 121,247 code snippets in 10 languages for multilingual stylometry
- **Verdict:** Not yet deployable as a production tool, but confirms forensic detection is highly feasible. The research shows Claude/Copilot/ChatGPT each have detectable stylometric signatures.

---

## 4. Operational Resilience Scoring

### 4.1 AWS Resilience Hub

- **Docs:** https://docs.aws.amazon.com/resilience-hub/latest/userguide/calculate-score.html
- **Method:** Automated chaos tests against AWS-deployed apps; generates numeric resilience score
- **Metrics:** RTO, RPO against defined SLOs
- **Verdict:** AWS-only, not applicable to Cloudflare Workers/Pages deployments.

### 4.2 LitmusChaos

- **URL:** https://litmuschaos.io/
- **How score works:** https://litmuschaos.io/blog/how-the-resilience-score-algorithm-works-in-litmus-1d22
- **Method:** Chaos experiment suite with weighted pass/fail per experiment; composite resilience score
- **Platform:** Kubernetes-native but has standalone experiments
- **Verdict:** Overkill for edge/serverless. Useful for API layer resilience testing.

### 4.3 k6 (Load Testing — most relevant for edge apps)

- **URL:** https://k6.io/
- **What it tests:** Throughput, error rates, latency under load
- **CI integration:** `k6 run --out json` → parse results in CI
- **For Cloudflare Workers:** Can target production URL; Cloudflare handles autoscaling so load testing tests the data layer and Server Actions, not the edge runtime itself
- **Verdict:** Most practical resilience test for this stack. Test contact form, newsletter signup, and vectorizer endpoints under load.

### 4.4 Unlighthouse (DORA-adjacent for frontend)

- **URL:** https://unlighthouse.dev/
- **What it does:** Runs Lighthouse on ALL routes (not just homepage); scores performance, accessibility, SEO, best practices
- **CI integration:** `unlighthouse-ci --site https://alexmayhew.dev`
- **Verdict:** Better than `@lhci/cli` for this project and eliminates the 25 high-severity vulnerabilities from the `@lhci/cli` transitive deps. Directly replaces current Lighthouse CI setup.

### 4.5 DORA Metrics Tracking (2025 Report Key Findings)

- **Source:** https://www.faros.ai/blog/key-takeaways-from-the-dora-report-2025
- **Key finding:** AI coding assistants increase individual PR output 21%, but organizational delivery metrics stay flat
- **PR size problem:** AI consistently increases PR size 154% — high-performing teams break AI-generated work into smaller units
- **Rework Rate:** New 2025 DORA metric — percentage of work that had to be redone. Directly measures AI quality drift.
- **Recommendation for solo projects:** Track git churn ratio (lines deleted / lines added) as a proxy for rework rate. High churn = AI thrashing = quality concern.

---

## 5. CI/CD Integration Approaches

### 5.1 KarpeSlop in GitHub Actions

```yaml
# .github/workflows/quality.yml
- name: AI Slop Check
  run: npx karpeslop@latest --quiet
  continue-on-error: true # Warning-only initially; switch to --strict when ready
```

### 5.2 eslint-plugin-deslop in ESLint config

```javascript
// eslint.config.mjs
import deslop from "eslint-plugin-deslop";

export default [
	{
		plugins: { deslop },
		rules: {
			"deslop/no-excessive-comments": ["warn", { maxDensity: 0.4 }],
			"deslop/no-obvious-comments": "warn",
		},
	},
];
```

### 5.3 Vibector as a CI check

```yaml
- name: Git Velocity Analysis
  run: |
    pip install vibector
    vibector --format json > vibector-report.json
    cat vibector-report.json
  continue-on-error: true # Informational only
```

### 5.4 Pre-commit hook stack (recommended for this project)

```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: karpeslop
        name: AI Slop Check (KarpeSlop)
        language: node
        entry: npx karpeslop@latest --quiet
        pass_filenames: false
      - id: eslint
        name: ESLint (includes sonarjs + deslop)
        language: node
        entry: npx eslint --max-warnings 0
        files: \.(ts|tsx)$
```

### 5.5 SonarQube Quality Gate in CI (team context)

```yaml
- name: SonarQube Scan
  uses: sonarqube-quality-gate@v1
  with:
    scannerMode: Other
    qualityGate: "Sonar way for AI Code" # New 2025 AI-specific gate
```

### 5.6 PR Review Automation (CodeRabbit / Qodo)

- **CodeRabbit:** Context-aware PR reviews; finds logic flaws and architectural drift; reports that AI PRs have 1.7x more issues than human PRs
  - URL: https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report
- **Qodo (formerly Codium):** Semantic understanding for missing authorization checks; "dependency approval" gates
  - URL: https://www.qodo.ai/blog/best-ai-code-review-tools-2026/
- **Verdict:** CodeRabbit is practical for a GitHub-hosted project. Free tier available.

---

## 6. Next.js / React 19 Specific Best Practices (2025)

### 6.1 React Compiler (React 19.2)

- Auto-memoization: Analyzes hooks, dependencies, and state automatically
- Plugin available for Next.js (experimental in 2025, stable in React 19.2)
- **Quality implication:** Eliminates the need for manual `useMemo`/`useCallback` — AI-generated manual memoization is now a code smell
- **Rule to add:** Flag manual `useMemo` / `useCallback` when React Compiler is active

### 6.2 Server Components Quality Patterns

- **Metric:** 86% Server Components (this project) — excellent; target is >70%
- **Anti-pattern detector:** Any `fetch()` call inside a Client Component that could be in a Server Component
- **Anti-pattern:** `useEffect` for data fetching (this project has zero — correct)
- **New in 2025:** SonarQube updated CC calculation for nested functions in JS/TS — nested function complexity no longer added to parent, which affects many React component scores

### 6.3 useActionState (React 19) — Complexity Reducer

- Replaces verbose `useState` + `try/catch` + `setFormStatus` patterns
- **AI slop signal:** Forms with 5+ state variables managing submission flow are a Noise axis red flag
- **Detection:** grep for `useState.*formStatus\|useState.*isLoading\|useState.*isSubmitting` alongside Server Actions

### 6.4 Edge Runtime Constraints as Quality Gates

- No `fs`, `path`, or Node.js built-ins in runtime code
- ESLint rule: `no-restricted-imports` with `fs`, `path`, `crypto` (Node), `stream`
- This project already enforces this via `CLAUDE.md` rules

### 6.5 Cloudflare Workers / OpenNext Quality Patterns

- `AbortSignal.timeout(N)` on all `fetch()` calls — verified gap in this project (0/6 server-side fetches have timeouts)
- Type-safe env bindings via `cf-typegen` — this project: done
- No dynamic `require()` or `eval()` — edge runtime incompatible
- R2 for ISR cache — this project: done

---

## 7. Tool Comparison Matrix

| Tool                     | Language    | Lies    | Noise   | Soul    | Git Forensics | CI-Ready     | Cost      |
| ------------------------ | ----------- | ------- | ------- | ------- | ------------- | ------------ | --------- |
| **KarpeSlop**            | TS/JS/React | Yes     | Yes     | Yes     | No            | Yes (npx)    | Free      |
| **eslint-plugin-deslop** | JS/TS       | No      | Yes     | No      | No            | Yes (ESLint) | Free      |
| **AI-SLOP-Detector**     | Python      | Yes     | Yes     | No      | No            | Yes (JSON)   | Free      |
| **sloppylint**           | Python      | Yes     | Yes     | No      | No            | Yes          | Free      |
| **Vibector**             | Any         | No      | No      | No      | Yes           | Yes (pip)    | Free      |
| **SonarQube 2025**       | All         | Partial | Yes     | No      | No            | Yes          | Free/Paid |
| **CodeRabbit**           | All         | No      | Partial | Partial | No            | Yes (GitHub) | Free/Paid |
| **Qodo**                 | All         | Partial | No      | Partial | No            | Yes          | Free/Paid |
| **IsVibeCode.com**       | Any         | No      | No      | No      | Yes           | No           | Free      |
| **VibeDetect.io**        | Any         | No      | No      | No      | Yes           | No           | Free      |

---

## 8. Recommended Stack for This Project (alexmayhew.dev)

### Immediate (add to existing CI):

1. **KarpeSlop** — `npx karpeslop@latest --quiet` in GitHub Actions (warning gate)
2. **eslint-plugin-deslop** — add to `eslint.config.mjs` (`no-excessive-comments`, `no-obvious-comments`)
3. **Unlighthouse** — replace `@lhci/cli` to eliminate 25 high-severity transitive vulnerabilities

### Short-term:

4. **AbortSignal.timeout(10000)** — add to all 6 server-side fetch calls (P0 gap from audit)
5. **k6 load test** — create `scripts/load-test.js` targeting contact form and newsletter endpoints
6. **Vibector** — run manually on demand for transparency reporting (not blocking CI)

### When upgrading to team context:

7. **SonarQube "Sonar way for AI Code" gate** — if/when adding team members
8. **CodeRabbit** — automated PR review with AI quality detection

---

## Sources

- [GitHub: rsionnach/sloppylint](https://github.com/rsionnach/sloppylint)
- [GitHub: CodeDeficient/KarpeSlop](https://github.com/CodeDeficient/KarpeSlop)
- [GitHub: ahxar/eslint-plugin-deslop](https://github.com/ahxar/eslint-plugin-deslop)
- [GitHub: flamehaven01/AI-SLOP-Detector](https://github.com/flamehaven01/AI-SLOP-Detector)
- [GitHub: anisimov-anthony/vibector](https://github.com/anisimov-anthony/vibector)
- [SonarQube AI Code Assurance Docs](https://docs.sonarsource.com/sonarqube-server/2025.1/ai-capabilities/ai-standards/)
- [SonarQube AI Code Assurance Guide](https://www.sonarsource.com/resources/library/how-to-guide-for-ai-code-assurance/)
- [SANER 2025: Is This You, LLM? Multilingual Code Stylometry](https://conf.researchr.org/details/saner-2025/saner-2025-papers/36/Is-This-You-LLM-Recognizing-AI-written-Programs-with-Multilingual-Code-Stylometry)
- [arXiv:2506.17323 — LLM Code Stylometry Authorship Attribution](https://arxiv.org/abs/2506.17323)
- [CodeRabbit: AI vs Human Code Report](https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report)
- [Qodo: Best AI Code Review Tools 2026](https://www.qodo.ai/blog/best-ai-code-review-tools-2026/)
- [DORA Report 2025 Key Takeaways](https://www.faros.ai/blog/key-takeaways-from-the-dora-report-2025)
- [LitmusChaos Resilience Score](https://litmuschaos.io/blog/how-the-resilience-score-algorithm-works-in-litmus-1d22)
- [Vercel React Best Practices](https://vercel.com/blog/introducing-react-best-practices)
- [Vibector Reddit Thread](https://www.reddit.com/r/commandline/comments/1q89bak/vibector_detect_aigenerated_code_in_git/)
- [IsVibeCode.com](https://isvibecoded.com/)
- [VibeDetect.io](https://www.vibedetect.io)
- [DEV Community: Why AI-Generated Code Looks Complete but Isn't](https://dev.to/flamehaven01/--en3)
