### **1\. The Strategy: "Refactoring to Provenance"**

The goal is to increase the **Logic Density Ratio (LDR)** of your code. AI tends to write "low density" code—lots of boilerplate, defensive try/catch blocks that swallow errors, and verbose comments explaining simple syntax. Human engineers write "high density" code—abstractions, guard clauses, and meaningful error handling.

To fix this, you must shift your interaction with Claude from "Generation Mode" to "Refactoring Mode" using **Adversarial Prompting**.

### **2\. The Protocol: A 4-Step Remediation Plan**

#### **Phase 1: Lock Behavior & Document Intent (Repaying Cognitive Debt)**

Cognitive debt occurs when the code works, but you don't fully understand _why_ or _how_ it handles edge cases. Before changing code, you must lock its behavior.

- **Generate "Characterization Tests":** AI often skips negative test cases. Ask Claude to generate a test suite that specifically targets _failure modes_ for your current features.
  - _Prompt:_ "Write a Jest/Pytest suite for auth-service.ts. Focus purely on edge cases, invalid inputs, and network failures. Do not test the happy path; assume that works. The goal is to lock in current behavior before refactoring."
- **Retroactive ADRs (Architectural Decision Records):** "Vibe coding" skips design documents. Force the AI to analyze its own code and document the _implicit_ architectural decisions it made. This re-establishes your mental model of the system.
  - _Prompt:_ "Analyze the backend/api directory. Generate an Architectural Decision Record (ADR) explaining why we are using. List the trade-offs and alternative options we implicitly rejected."

#### **Phase 2: The "Slop Detox" (Static Analysis & Linting)**

AI code often passes linting but fails on "style." It leaves fingerprints like unnecessary comments (// Initialize variable) or "hallucinated" imports.

- **Enforce "Senior" Standards via CLAUDE.md:** Create a root file named CLAUDE.md (or .cursorrules). This acts as a "style contract" that Claude reads every time.
  - _Add these rules:_
    - "NO explanatory comments for code that is self-documenting."
    - "Use Guard Clauses (early returns) instead of nested if/else blocks."
    - "Prefer strict typing. No any types. No 'placeholder' implementations."
    - "Follow YAGNI (You Aren't Gonna Need It). Delete any code not currently wired to a frontend trigger."
- **Run "Slop" Linters:** Use tools specifically designed to catch AI patterns.
  - **Logic Density Check:** Identify files with high lines-of-code (LOC) but low complexity. These are prime candidates for refactoring into abstractions.
  - **Unused Dependency Scan:** AI often installs packages it _thought_ it would use but didn't. Run depcheck or similar to prune package.json.

#### **Phase 3: Adversarial Refactoring (The "Rule of Five")**

Don't ask Claude to "improve" the code (it will just add more decorators). Ask it to **attack** the code. This uses the "Rule of Five"—iterating until the code is robust.

- **The "Roast" Prompt:**
  - _Prompt:_ "Act as a Principal Engineer doing a harsh code review of this file. You hate over-engineering and love simplicity. Identify 3 areas where this code violates SOLID principles or introduces unnecessary coupling. Then, refactor it to address only those 3 points. Do not add new features."
- **The "Flattening" Prompt (Crucial for AI Code):** AI loves nesting. Humans love flatness.
  - _Prompt:_ "Refactor this function to reduce indentation. Invert control flow using guard clauses. Remove else blocks where possible. Merge duplicate conditional logic."

#### **Phase 4: Database & State Normalization**

This is where "vibe coding" usually creates a "house of cards." AI loves dumping JSON blobs into SQL columns to avoid managing schema relationships.

- **Schema Audit:** Look for "God Tables" or generic data JSON columns.
- **Normalization Prompt:** "Analyze our User and Order tables. We are currently storing addresses as a JSON blob. Refactor this schema to 3NF (Third Normal Form). Generate the SQL migration script to extract this data into a dedicated Addresses table and create the necessary foreign keys."

### **3\. Summary: How to "Humanize" Your Repository**

| Artifact           | AI/Amateur "Vibe" Marker                   | Professional/Human Standard                                                 | How to Refactor                                                                                                            |
| :----------------- | :----------------------------------------- | :-------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| **Comments**       | "Here we iterate through the list" (Noise) | _Why_ the logic exists, or no comments at all.                              | Prompt: "Remove all comments that explain 'what' the code is doing. Keep only comments explaining 'why'."                  |
| **Git History**    | "Update", "Fix", "WIP", "Try again"        | "Refactor auth middleware to use JWT", "Fix race condition in payment hook" | Use an AI tool to squash commits and rewrite messages before merging to main.                                              |
| **Error Handling** | try {... } catch (e) { console.log(e) }    | Structured logging, error types, and alerting integration.                  | Prompt: "Replace generic try/catch blocks with typed error handling. Ensure errors bubble up to the global error handler." |
| **Structure**      | 500-line "God Functions"                   | Small, single-responsibility functions (\<50 lines).                        | Prompt: "Extract the validation logic in processOrder into a separate pure function named validateOrder."                  |

### **4\. Tools to Automate This**

- **Bi-Directional Sync:** Use tools like **Qodo** (formerly Codium) or **CodeRabbit** that integrate into your PR workflow. They act as the "bad cop," automatically flagging AI patterns (like huge PRs or lack of tests) before you even merge.
- **Sloppylint:** A Python tool (adaptable concepts for JS/TS) that specifically flags "AI slop" patterns like hallucinated imports or mutable default arguments.
