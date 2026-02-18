# **The Architecture of Agency: Engineering Enterprise Resilience in the Era of Stochastic Coding Agents**

## **Executive Summary**

The software engineering discipline stands at a precipice in 2026\. The widespread adoption of Command Line Interface (CLI) based AI coding assistants, typified by tools such as Claude Code Opus 4.6 and Cursor, has catalyzed a profound transformation in development velocity. However, this acceleration has introduced a pervasive and insidious crisis: the accumulation of "AI Slop"—technically functional but architecturally hollow code that mimics the aesthetics of software without possessing its structural integrity. As organizations rush to integrate these stochastic agents into their workflows, they face a burgeoning "technical debt crisis" characterized by fragile supply chains, inscrutable logic flows, and a critical degradation of human cognitive agency.1

This report presents a comprehensive framework for reclaiming engineering rigor in the age of generative AI. It argues that the solution lies not in rejecting these tools, but in enclosing them within a "Human-Grade AI Development System"—a rigorous methodology that enforces enterprise standards through architectural containment, adversarial testing, and strict governance protocols. By synthesizing Domain-Driven Design (DDD), Hexagonal Architecture, and Test-Driven Development (TDD) with the advanced reasoning capabilities of Claude Code Opus 4.6, development teams can transition from "vibe coding" to constructing resilient, industry-standard systems. The analysis that follows provides an exhaustive blueprint for establishing new projects with "Day 0" hygiene, remediating legacy "slop," and ensuring that the final output is indistinguishable from the work of elite human engineers.

## ---

**1\. The Paradox of Vibe Coding: Analyzing the Crisis of Quality**

The contemporary software landscape is defined by a dangerous paradox: code is being produced faster than ever, yet the reliability and maintainability of that code are plummeting. This phenomenon, colloquially termed "vibe coding," represents a fundamental shift in the developer's feedback loop. In traditional engineering, the loop was "Write \-\> Reason \-\> Test." In the era of AI assistance, it has morphed into "Prompt \-\> Accept \-\> Vibe Check." If the code runs and passes a superficial "happy path" test, it is accepted. This stochastic generation process, while efficient in the short term, bypasses the deep cognitive work required to construct robust mental models of system behavior.1

### **1.1 The Anatomy of "AI Slop" and Hollow Architecture**

"AI Slop" is distinct from the clumsy code traditionally produced by junior developers. Junior code often contains syntax errors or obvious logical fallacies that are caught during compilation or review. AI Slop, conversely, is syntactically perfect and often ostensibly elegant. It compiles without complaint and passes basic unit tests. However, it is fundamentally "hollow." It lacks the intentionality and narrative structure that characterize human-written software.

Research indicates that AI-generated code frequently suffers from "semantic hollowness," where variable names are generic (e.g., data, result, temp) rather than domain-specific, obscuring the business intent.2 More critically, AI models, trained on vast repositories of open-source code, tend to "average out" architectural patterns. They favor immediate, local solutions over long-term structural coherence. This leads to a proliferation of "glue code"—ad-hoc adapters and configuration sprawls designed to force incompatible components to interact—creating a "Big Ball of Mud" architecture that resists evolution.3

The "High-Interest Credit Card" metaphor, originally applied to machine learning systems by Google researchers, is now apt for AI-generated source code. The immediate velocity gained by using AI is the principal; the compounding interest is the maintenance burden of a codebase that no human fully understands. When an AI writes a complex React component or a Python data pipeline, it creates a "cognitive load shift." The developer, having not wrestled with the implementation details, loses the "cognitive weight" necessary to debug the system when it inevitably fails in production.3

### **1.2 Cognitive Debt and Agency Decay**

The most severe casualty of the AI coding revolution is not code quality, but developer capability. "Cognitive debt" refers to the deficit in understanding that accumulates when engineers act as passive reviewers rather than active creators. As developers rely more heavily on tools like Claude Code and Cursor for even trivial logic, they experience "agency decay"—a gradual erosion of their ability to reason from first principles.6

This deskilling phenomenon creates a dependency loop. As the codebase becomes more complex due to the accumulation of AI slop, the developer feels less capable of modifying it without AI assistance. This forces them to rely further on the very tools that created the complexity, deepening the debt. The traditional apprenticeship model, where senior engineers mentor juniors through code review, is fracturing. Juniors are submitting massive, AI-generated pull requests (PRs) that they cannot explain, and seniors are overwhelmed by the volume of technically correct but architecturally incoherent code.7

### **1.3 The Security and Resilience Gap**

The focus on "happy path" development—coding for the scenario where everything goes right—is a hallmark of current AI models. Unless explicitly prompted otherwise, AI agents assume network reliability, infinite resources, and benevolent users. This leads to a "10x security vulnerability spike" in AI-heavy codebases, characterized by missing input sanitization, hardcoded secrets, and a lack of proper error handling.2 The "unhappy paths"—network timeouts, concurrent race conditions, malicious payloads—are often ignored, leaving systems fragile and unsuited for enterprise deployment.8

## ---

**2\. Strategic Framework: The Human-Grade AI Development System**

To counteract these trends, we must adopt a new engineering paradigm: the "Human-Grade AI Development System." This approach does not treat AI as an autonomous engineer but as a powerful, stochastic kinetic engine that must be constrained within rigid architectural bounds. The core philosophy is **Architecture as Containment**. We use established patterns like Hexagonal Architecture and Domain-Driven Design (DDD) to create a "cage" in which the AI can operate safely.

### **2.1 Hexagonal Architecture: The Immune System against Slop**

Hexagonal Architecture, or the Ports and Adapters pattern, is uniquely improved for the AI era. Its primary mandate—separating the pure "Domain" logic from the "Infrastructure" (databases, APIs, UIs)—serves as a firewall against AI hallucinations.10

In a traditional layered architecture, business logic often depends on database frameworks (e.g., an Order entity extending a Sequelize model). If an AI agent hallucinates a database method, the business logic breaks. In Hexagonal Architecture, the dependency rule is inverted: **Source code dependencies can only point inward.**

- **The Domain (Core):** This is the sanctuary of "Human-Grade" logic. It contains Entities, Value Objects, and Domain Services. It has _zero_ dependencies on external frameworks. When we ask Claude Code to implement a business rule here, it cannot import axios or sqlalchemy because the architectural constraints forbid it. This forces the AI to write pure, testable, logic-driven code.12
- **The Ports:** These are interfaces defined by the Domain that specify _what_ needs to happen (e.g., IOrderRepository, IPaymentGateway), but not _how_.
- **The Adapters:** This is where the AI can be unleashed. The AI writes the implementation of the PostgresOrderRepository or StripePaymentGateway. If the AI writes "slop" here, it is contained within the adapter and does not pollute the core business logic.

### **2.2 Domain-Driven Design (DDD) as Semantic Anchor**

To combat the "semantic hollowness" of AI code, we enforce Domain-Driven Design. AI models are statistical engines; they predict the next token based on probability, not meaning. DDD provides the meaning.13

- **Ubiquitous Language:** We must maintain a living dictionary of domain terms (e.g., domain_vocabulary.yaml). We explicitly instruct the AI: "You are forbidden from using the word 'User'. In this context, they are 'AccountHolders'." This prevents the generic naming drift common in AI code.15
- **Bounded Contexts:** AI tends to create "God Objects" that know too much. By defining strict Bounded Contexts (e.g., "Shipping" vs. "Billing"), we force the AI to respect module boundaries, preventing the "Big Ball of Mud" outcome.16

## ---

**3\. Operationalizing Claude Code Opus 4.6 for Enterprise Rigor**

Claude Code Opus 4.6 represents a significant leap in capability, particularly with its "Thinking Mode" and "Plan Mode." These features, if correctly harnessed, allow for a depth of reasoning that approaches senior engineering levels. However, they require a shift from "Prompt Engineering" to "Context Engineering".17

### **3.1 Unleashing "Thinking Mode" for Deep Reasoning**

Standard LLMs jump straight to code generation. Claude Code's "Thinking Mode" allows the model to engage in an internal monologue before outputting artifacts. This is critical for complex enterprise logic where the "happy path" is insufficient.19

**Operational Workflow:**

1. **Constraint Injection:** We inject the architectural rules (Hexagonal, DDD) into the system prompt.
2. **Reasoning Mandate:** We instruct the model: "Before writing any code, use your thinking block to analyze the 'unhappy paths.' Consider race conditions, state inconsistencies, and failure modes."
3. **Self-Correction:** The thinking process allows the model to spot its own potential hallucinations. For example, it might think, "I should use requests here... wait, the architectural constraints forbid I/O in the Domain layer. I must define a Port interface instead."

### **3.2 "Plan Mode" for Site-Wide Path Exploration**

"Plan Mode" is the antidote to the "keyhole problem," where AI only sees the file it is currently editing. In Plan Mode, Claude Code creates a comprehensive implementation strategy that spans the entire repository.20

**Strategy for Site-Wide Logic:**

To ensure "all possible paths" are covered, we employ a **Finite State Machine (FSM)** approach in the planning phase.

- **Step 1:** We ask Claude to generate a Mermaid state diagram representing the lifecycle of the entity (e.g., Order: Created \-\> Validated \-\> Paid \-\> Shipped).
- **Step 2:** We require the Plan to explicitly address every transition _and_ every illegal transition attempt (e.g., trying to ship an unpaid order).22
- **Step 3:** The Plan must identify all files affected by these transitions, ensuring that a change in the Payment module propagates correctly to the Notification module.

### **3.3 The Model Context Protocol (MCP) as the Nervous System**

To function as a true engineer, the AI needs access to the environment. The Model Context Protocol (MCP) acts as the "USB-C" for AI, connecting Claude Code to local tools and data sources safely.23

- **Filesystem MCP:** Grants controlled read/write access to the codebase.
- **Postgres MCP:** Allows the AI to inspect the _actual_ database schema rather than hallucinating one. This ensures that generated SQL queries match the physical reality of the data.
- **Git MCP:** Provides access to version control history, allowing the AI to understand _why_ code was written a certain way by reading commit messages and blame data.

## ---

**4\. Day 0: The "Human-Grade" Project Setup & Scaffolding**

The foundation of an enterprise-grade project is laid before a single line of business logic is written. To prevent technical debt from compiling, we must establish a rigid directory structure and configuration set that enforces the "Human-Grade" methodology by default.

### **4.1 The Enterprise Directory Structure**

We reject the flat, framework-centric structures often generated by default initializers. Instead, we enforce a structure that screams "Architecture."

/project-root

├──.claude/ \# Claude Code configuration and memory

│ ├── config.json \# Model settings (Temp 0, Thinking Mode enabled)

│ ├── hooks/ \# Governance scripts (Security, Linting)

│ ├── memory/ \# Long-term context (Project "Hippocampus")

│ └── prompts/ \# Role-specific system prompts (Architect, QA, Red Team)

├──.cursor/ \# IDE-specific rules (Hybrid workflow support)

│ └── rules/ \# Context-aware rules (e.g., strict typing mandates)

├── docs/ \# Documentation as Code (The Control Plane)

│ ├── architecture/

│ │ ├── system-context.mermaid \# Visual system boundaries

│ │ ├── decisions/ \# Architecture Decision Records (ADRs)

│ │ └── domain/ \# DDD definitions (Ubiquitous Language)

│ ├── ops/ \# Runbooks, deployment manifests, and SLAs

│ ├── api/ \# OpenAPI/Swagger contracts

│ └── status.md \# The Project "State File" for AI Context

├── src/

│ ├── domain/ \# PURE BUSINESS LOGIC (No Frameworks)

│ │ ├── model/ \# Entities, Value Objects, Aggregates

│ │ ├── ports/ \# Interfaces (Repository, Service Ports)

│ │ └── services/ \# Pure Domain Services

│ ├── application/ \# Use Cases / Orchestration

│ │ ├── commands/ \# Write operations (CQRS)

│ │ └── queries/ \# Read operations (CQRS)

│ ├── infrastructure/ \# Adapters (The "Dirty" Layer)

│ │ ├── persistence/ \# SQL/NoSQL implementations

│ │ ├── messaging/ \# Kafka/RabbitMQ adapters

│ │ └── external/ \# 3rd Party API clients

│ └── interface/ \# Entry Points

│ ├── api/ \# REST/GraphQL Controllers

│ └── cli/ \# Command Line Interface

├── tests/

│ ├── unit/ \# Domain tests (Fast, in-memory, no I/O)

│ ├── integration/ \# Infrastructure tests (Dockerized containers)

│ ├── e2e/ \# Full system validation

│ └── architecture/ \# ArchUnit tests (Enforcing Hexagonal dependency rules)

├── tools/ \# Local maintenance scripts

├──.env.example \# Template for environment variables (No secrets\!)

├── Makefile \# Standardized command runner for consistent DX

└── REFACTORING_LOG.md \# Audit trail of major architectural changes

### **4.2 Documentation as the AI Control Plane**

In an agentic workflow, documentation serves a dual purpose: it informs humans and steers agents. We treat documentation as code, maintained in the repository and referenced by the AI.25

- **docs/status.md:** This file acts as the "working memory" for the project. It tracks the current phase, active tasks, and known blockers. Before every session, Claude Code reads this file to re-orient itself, preventing the "amnesia" that leads to disjointed code updates.
- **CLAUDE.md / .cursorrules:** These files constitute the project's "Constitution." They define the non-negotiable rules.
  - **Rule 1:** "No logic in Controllers. Delegate immediately to Application Services."
  - **Rule 2:** "Value Objects over Primitives. Never use string for an Email or float for Money. Use EmailAddress and Money objects."
  - **Rule 3:** "Test-First Mandate. No code is written without a failing test (Red-Green-Refactor)."

### **4.3 Configuration Management**

We configure Claude Code to act as a senior engineer, not a chatty assistant.

- **config.json:** We set temperature to 0.0 for deterministic outputs and enable thinking with a high token budget (e.g., 4096 tokens) to maximize reasoning depth.19
- **.claude/hooks:** We implement CLI hooks to enforce governance. A PreToolUse hook blocks dangerous commands (e.g., rm \-rf, access to .env), while a PostToolUse hook automatically runs linters (e.g., Ruff, Prettier) to ensure that all AI-generated code meets formatting standards immediately.26

## ---

**5\. The Development Lifecycle: From Prompt to Production**

To ensure "Human-Grade" quality, we must impose a disciplined lifecycle on the AI's operation. We do not simply "ask and receive." We guide the AI through a **Phase-Gate Workflow** that mirrors rigorous engineering processes.

### **5.1 Phase 1: Planning & Architecture (The Blueprints)**

Before a single line of code is generated, the AI must prove it understands the problem.

- **Input:** The user query and the system-context.mermaid file.
- **Task:** "Analyze the requirements and the current architecture. Create a detailed implementation plan in docs/plans/feature-X.md. Identify all necessary Domain changes, new Ports, and required Adapters. Do _not_ write code yet."
- **Validation:** A human architect reviews the plan. If the AI suggests putting business logic in a database adapter, the plan is rejected. This "measure twice, cut once" approach prevents architectural drift.21

### **5.2 Phase 2: TDD & The "Red" State (The Contract)**

We strictly enforce Test-Driven Development (TDD). The AI must define the "contract" of the code before implementing it.

- **Task:** "Based on the approved plan, write the _characterization tests_ and _unit tests_ for the feature. Run them to confirm they fail."
- **Mechanism:** A specialized bash script (tdd-loop.sh) automates this. It runs the tests and confirms failure. If the tests pass (a "false positive"), the workflow halts. This ensures that the tests are actually testing something.28

### **5.3 Phase 3: Implementation (The Build)**

With a failing test in place, the AI is authorized to write code.

- **Task:** "Implement the Domain logic first. Then implement the Application layer. Finally, implement the Infrastructure adapters. Use 'Thinking Mode' to handle edge cases."
- **Constraint:** The PreToolUse hooks prevent the AI from importing infrastructure packages into the Domain layer, enforcing Hexagonal purity programmatically.

### **5.4 Phase 4: Refactoring & Cleanup (The Polish)**

This is the step most AI workflows miss.

- **Task:** "Review the code you just wrote. Analyze it for 'AI Slop' patterns: generic naming, magic numbers, or redundant comments. Refactor the code for readability and maintainability without breaking the tests."
- **Goal:** To eliminate the "machine accent" from the codebase and ensure it reads as if written by a domain expert.

## ---

**6\. Resilience Engineering: Going Beyond the Happy Path**

Enterprise-grade software is defined by how it handles failure. AI agents, by default, optimize for success. To build resilient systems, we must explicitly engineer for the "Unhappy Path."

### **6.1 State Space Exploration and Boundary Analysis**

Business logic often fails at the edges. We prompt Claude Code to perform **Boundary Value Analysis**.

- **Prompt Strategy:** "Identify all variables in the calculate_interest function. For each variable, generate test cases for: minimum value, maximum value, zero, null, and 'off-by-one' values. Ensure the system handles these gracefully."
- **FSM Analysis:** For stateful processes, we require the AI to analyze the State Machine Matrix. "What happens if a Cancel event is received while the Order is in the Shipping state? Implement the InvalidTransition error handling logic."

### **6.2 The Circuit Breaker & Rate Limiting Pattern**

AI-generated code often lacks sophistication in distributed systems patterns. It might write a loop that retries a failed API call infinitely, effectively DDOS-ing the downstream service.

- **Mandate:** We require the implementation of **Circuit Breakers** (e.g., using Resilience4j or Polly) for all external adapters.30
- **Implementation:** "Wrap the PaymentGatewayAdapter.charge() call in a Circuit Breaker. If the failure rate exceeds 50%, open the circuit and return a PaymentServiceUnavailable domain error immediately. Do not simply catch the exception and log it."

### **6.3 Red Teaming the AI’s Logic**

We employ an adversarial "Red Team" persona to stress-test the AI's output.

- **The Red Team Prompt:** "Act as a hostile QA engineer. Review the code you just generated. Identify 5 scenarios where this code will fail, corrupt data, or crash. Consider: network partitions, database deadlocks, clock skew, and malicious input. For each scenario, write a reproduction test case.".32
- **Outcome:** This adversarial process forces the AI to consider the "unknown unknowns" and fortify the code against real-world chaos.

## ---

**7\. Governance, Security, & Observability**

An enterprise system must be secure and observable. "Slop" code is opaque; "Human-Grade" code is transparent.

### **7.1 Structured Logging and Tracing**

AI agents frequently use print statements or generic logs (console.log("Error", err)). This is unacceptable for enterprise operations.

- **Standard:** We enforce **Structured Logging** (JSON). Every log must include a correlation_id, timestamp, log_level, and context.
- **Observability:** We require **OpenTelemetry** integration. Every request must initiate a Trace. The AI is instructed: "Instrument the OrderService. Start a span named 'process_order'. Add attributes for order_id and customer_segment." This ensures that when things go wrong, operators can trace the request through the system.34

### **7.2 Security Auditing**

AI-generated code is a vector for vulnerabilities.

- **Automated Scanning:** We integrate tools like TruffleHog (for secrets) and Semgrep (for code patterns) into the PostToolUse hook. If the AI attempts to commit a hardcoded API key, the hook rejects the action.36
- **Dependency Hygiene:** AI agents love to import obscure or abandoned libraries to solve immediate problems. We mandate a "Dependency Approval" step where the AI must check the "last updated" date and download count of any new package before adding it.

## ---

**8\. Remediation: Humanizing the "Slop"**

For organizations already burdened with AI-generated technical debt, we apply a surgical **Remediation Protocol**. We do not rewrite from scratch; we refactor incrementally.

### **8.1 The "Strangler Fig" Pattern for AI Codebases**

We treat the AI "slop" as a legacy system to be strangled.

1. **Isolation:** We identify a cohesive module (e.g., "User Auth") that is currently a mess of glue code.
2. **Interface Definition:** We define a clean, "Human-Grade" Port interface that represents what this module _should_ do.
3. **Parallel Implementation:** We ask Claude Code (using our strict rules) to build a new, clean implementation of this interface.
4. **Traffic Shifting:** We use Feature Flags to route a percentage of traffic to the new implementation.
5. **Decommission:** Once validated, the old "slop" code is deleted.

### **8.2 Characterization Tests (The Safety Net)**

Before touching the "slop," we must lock down its behavior.

- **Task:** "Analyze the legacy pricing_engine.py. It is messy and undocumented. Write a suite of 'Characterization Tests' that capture its current behavior, bugs and all. Do not fix anything yet. Just assert the current output.".37
- **Value:** These tests act as a safety net. As we refactor the code into a clean architecture, these tests ensure we don't accidentally break existing business rules (even the weird ones).

### **8.3 Complexity Reduction via Static Analysis**

We use static analysis metrics as a target for the AI.

- **Prompt:** "Analyze this function. Its Cyclomatic Complexity is 25 (too high). Refactor it to reduce complexity to under 10\. Extract sub-logic into private methods with descriptive names."
- **Result:** This mechanically forces the code into a more readable, modular state, breaking down the "wall of text" often produced by LLMs.

## ---

**9\. The Human Element: Maintaining Agency**

The ultimate defense against AI slop is the preservation of human agency. We must ensure that developers remain the architects, not just the janitors.

### **9.1 Review for Understanding**

We shift the code review culture. The goal is no longer just "does it work?" but "do you understand it?"

- **Policy:** A developer cannot merge an AI-generated PR unless they can explain the architectural trade-offs.
- **Mechanism:** The "Explain It To Me" session. The developer asks the AI: "Explain why you chose the Factory pattern here instead of a Builder. What are the downsides?" The developer must verify and internalize this reasoning before accepting the code.3

### **9.2 Hybrid Intelligence Workflows**

We adopt a **Hybrid Intelligence** model.

- **AI's Role:** The "Junior Engineer on Speed." It handles boilerplate, test generation, and initial drafts.
- **Human's Role:** The "Principal Architect." The human defines the interfaces (Ports), reviews the domain model, and performs the Red Teaming.
- **Synergy:** The human defines the _What_ (Domain); the AI implements the _How_ (Infrastructure). This plays to the strengths of both: human strategic intent and AI tactical velocity.

## ---

**Conclusion**

The transition to AI-assisted engineering is inevitable, but the descent into "AI Slop" is not. By imposing the **Human-Grade AI Development System**—a rigor built on Hexagonal Architecture, Domain-Driven Design, and adversarial testing—we can harness the speed of Claude Code Opus 4.6 without sacrificing the structural integrity of our systems. The future of software belongs to those who can command the AI to build cathedrals of logic, rather than shanty towns of code. The tools have changed, but the engineering discipline remains the same: structure, testing, and a relentless focus on the management of complexity.

## ---

**Appendix: Implementation Reference Tables**

### **Table 1: Human-Grade vs. AI-Slop Coding Patterns**

| Feature            | AI Slop Pattern (Vibe Coding)                                   | Human-Grade Pattern (Engineering)                                          | Impact of Human-Grade Approach                                                 |
| :----------------- | :-------------------------------------------------------------- | :------------------------------------------------------------------------- | :----------------------------------------------------------------------------- |
| **Architecture**   | Big Ball of Mud; mixed concerns; glue code sprawl.              | Hexagonal (Ports & Adapters); strict layer separation.                     | Decouples business logic from frameworks; enables easier testing and upgrades. |
| **Naming**         | Generic (data, item, obj); tech-centric (userList).             | Domain-Specific (OrderManifest, ShippableItem); Ubiquitous Language.       | Preserves business intent; reduces cognitive load for future readers.          |
| **Error Handling** | Swallowed exceptions; generic 500 errors; blind retries.        | Custom Domain Exceptions; Circuit Breakers; Dead Letter Queues.            | Prevents cascading failures; provides clear debugging signals.                 |
| **Testing**        | Happy path only; fragile mocks; testing implementation details. | TDD; Characterization Tests; Boundary Value Analysis; Testing Public APIs. | Ensures resilience against edge cases; allows safe refactoring.                |
| **Dependencies**   | "Import everything"; unnecessary libraries; security risks.     | Minimal dependencies; explicit "Dependency Approval" gates.                | Reduces attack surface; minimizes "supply chain" risk.                         |
| **Logging**        | print() statements; unstructured text.                          | Structured JSON logging; OpenTelemetry tracing; Correlation IDs.           | Enables observability and rapid root-cause analysis in production.             |

### **Table 2: Claude Code Opus 4.6 Feature Utilization Matrix**

| Feature              | Enterprise Application                                | Best Practice Prompt Strategy                                                               |
| :------------------- | :---------------------------------------------------- | :------------------------------------------------------------------------------------------ |
| **Thinking Mode**    | Complex logic implementation; Edge case discovery.    | "Use your thinking block to analyze all potential race conditions before writing code."     |
| **Plan Mode**        | Site-wide refactoring; Architectural impact analysis. | "Create a multi-file plan for this feature. Identify every file that imports OrderService." |
| **MCP (Filesystem)** | Safe repository access; Context gathering.            | "Read docs/architecture before starting. Only edit files listed in the approved plan."      |
| **MCP (Postgres)**   | Schema validation; Query optimization.                | "Inspect the orders table schema. Ensure the query uses the existing index on customer_id." |
| **CLI Hooks**        | Governance; Security; Formatting.                     | "Configure PreToolUse to block rm \-rf. Configure PostToolUse to run black formatter."      |

#### **Works cited**

1. Is AI-Generated Code Poisoning Your Software Supply Chain? \- ActiveState, accessed February 15, 2026, [https://www.activestate.com/blog/is-ai-generated-code-poisoning-your-software-supply-chain/](https://www.activestate.com/blog/is-ai-generated-code-poisoning-your-software-supply-chain/)
2. The AI Coding Technical Debt Crisis: What 2026-2027 Holds (And How We Address It), accessed February 15, 2026, [https://www.pixelmojo.io/blogs/vibe-coding-technical-debt-crisis-2026-2027](https://www.pixelmojo.io/blogs/vibe-coding-technical-debt-crisis-2026-2027)
3. AI-Created Code Is Putting Us in Debt \- RunLLM, accessed February 15, 2026, [https://www.runllm.com/blog/ai-created-code-is-putting-us-in-debt](https://www.runllm.com/blog/ai-created-code-is-putting-us-in-debt)
4. The rise of vibe coding: Why architecture still matters in the age of AI agents \- vFunction, accessed February 15, 2026, [https://vfunction.com/blog/vibe-coding-architecture-ai-agents/](https://vfunction.com/blog/vibe-coding-architecture-ai-agents/)
5. The cognitive debt of offloading software development to AI | by Naveen Raju Mudhunuri | Medium, accessed February 15, 2026, [https://medium.com/@naveenfy/the-cognitive-debt-of-offloading-software-development-to-ai-c012963542d5](https://medium.com/@naveenfy/the-cognitive-debt-of-offloading-software-development-to-ai-c012963542d5)
6. As AI usage accelerates, companies need to avoid cognitive debt & decay among their talent \- Thomson Reuters Institute, accessed February 15, 2026, [https://www.thomsonreuters.com/en-us/posts/sustainability/avoiding-cognitive-debt-agency-decay/](https://www.thomsonreuters.com/en-us/posts/sustainability/avoiding-cognitive-debt-agency-decay/)
7. AI Slop Code: AI is hiding incompetence that used to be obvious : r/cscareerquestions, accessed February 15, 2026, [https://www.reddit.com/r/cscareerquestions/comments/1oa5nx7/ai_slop_code_ai_is_hiding_incompetence_that_used/](https://www.reddit.com/r/cscareerquestions/comments/1oa5nx7/ai_slop_code_ai_is_hiding_incompetence_that_used/)
8. OWASP Top 10 for Business Logic Abuse, accessed February 15, 2026, [https://owasp.org/www-project-top-10-for-business-logic-abuse/](https://owasp.org/www-project-top-10-for-business-logic-abuse/)
9. Edge Case Testing Explained – What to Test & How to Do It \- Virtuoso QA, accessed February 15, 2026, [https://www.virtuosoqa.com/post/edge-case-testing](https://www.virtuosoqa.com/post/edge-case-testing)
10. Backend Coding AI Context Coding Agents: DDD and Hexagonal Architecture \- Medium, accessed February 15, 2026, [https://medium.com/@bardia.khosravi/backend-coding-rules-for-ai-coding-agents-ddd-and-hexagonal-architecture-ecafe91c753f](https://medium.com/@bardia.khosravi/backend-coding-rules-for-ai-coding-agents-ddd-and-hexagonal-architecture-ecafe91c753f)
11. Hexagonal Architecture: Isolate AI Logic Effectively \- Sparkco, accessed February 15, 2026, [https://sparkco.ai/blog/hexagonal-architecture-isolate-ai-logic-effectively](https://sparkco.ai/blog/hexagonal-architecture-isolate-ai-logic-effectively)
12. Hexagonal Architecture and Clean Architecture (with examples) \- DEV Community, accessed February 15, 2026, [https://dev.to/dyarleniber/hexagonal-architecture-and-clean-architecture-with-examples-48oi](https://dev.to/dyarleniber/hexagonal-architecture-and-clean-architecture-with-examples-48oi)
13. How Can Domain-Driven Design and Hexagonal Architecture Improve Data Product Development in Practice? \- OCTO Talks \!, accessed February 15, 2026, [https://blog.octo.com/how-can-domain-driven-design-and-hexagonal-architecture-improve-data-product-development-in-practice-1](https://blog.octo.com/how-can-domain-driven-design-and-hexagonal-architecture-improve-data-product-development-in-practice-1)
14. Domain-Driven Design: Streamlining AI-Powered Software Development | by Leric Zhang, accessed February 15, 2026, [https://medium.com/@lericzhang/domain-driven-design-streamlining-ai-powered-software-development-0ea0b8ded573](https://medium.com/@lericzhang/domain-driven-design-streamlining-ai-powered-software-development-0ea0b8ded573)
15. DDD.7 – Using the language \- @hgraca, accessed February 15, 2026, [https://herbertograca.com/2015/10/15/ddd-7-using-the-language/](https://herbertograca.com/2015/10/15/ddd-7-using-the-language/)
16. Best Practice \- An Introduction To Domain-Driven Design | Microsoft Learn, accessed February 15, 2026, [https://learn.microsoft.com/en-us/archive/msdn-magazine/2009/february/best-practice-an-introduction-to-domain-driven-design](https://learn.microsoft.com/en-us/archive/msdn-magazine/2009/february/best-practice-an-introduction-to-domain-driven-design)
17. Claude Code creator Boris shares his setup with 13 detailed steps,full details below \- Reddit, accessed February 15, 2026, [https://www.reddit.com/r/ClaudeAI/comments/1q2c0ne/claude_code_creator_boris_shares_his_setup_with/](https://www.reddit.com/r/ClaudeAI/comments/1q2c0ne/claude_code_creator_boris_shares_his_setup_with/)
18. Anthropic Launches Claude Opus 4.6: Key Upgrades and Strategic Insights | iWeaver AI, accessed February 15, 2026, [https://www.iweaver.ai/blog/anthropic-launches-claude-opus-4-6/](https://www.iweaver.ai/blog/anthropic-launches-claude-opus-4-6/)
19. How to Use Claude Opus 4.5 API \- CometAPI \- All AI Models in One API, accessed February 15, 2026, [https://www.cometapi.com/how-to-use-claude-opus-4-5-api/](https://www.cometapi.com/how-to-use-claude-opus-4-5-api/)
20. How I use Claude Code for real engineering \- YouTube, accessed February 15, 2026, [https://www.youtube.com/watch?v=kZ-zzHVUrO4](https://www.youtube.com/watch?v=kZ-zzHVUrO4)
21. Common workflows \- Claude Code Docs, accessed February 15, 2026, [https://code.claude.com/docs/en/common-workflows](https://code.claude.com/docs/en/common-workflows)
22. Improve AI Code Awareness with Mermaid Diagram Context | AI Workflows \- ChatPRD, accessed February 15, 2026, [https://www.chatprd.ai/how-i-ai/workflows/improve-ai-code-awareness-with-mermaid-diagram-context](https://www.chatprd.ai/how-i-ai/workflows/improve-ai-code-awareness-with-mermaid-diagram-context)
23. What is the Model Context Protocol (MCP)? \- Model Context Protocol, accessed February 15, 2026, [https://modelcontextprotocol.io/](https://modelcontextprotocol.io/)
24. Introducing the Model Context Protocol \- Anthropic, accessed February 15, 2026, [https://www.anthropic.com/news/model-context-protocol](https://www.anthropic.com/news/model-context-protocol)
25. The Ultimate Guide to AI-Powered Development with Cursor: From ..., accessed February 15, 2026, [https://medium.com/@vrknetha/the-ultimate-guide-to-ai-powered-development-with-cursor-from-chaos-to-clean-code-fc679973bbc4](https://medium.com/@vrknetha/the-ultimate-guide-to-ai-powered-development-with-cursor-from-chaos-to-clean-code-fc679973bbc4)
26. disler/claude-code-hooks-mastery \- GitHub, accessed February 15, 2026, [https://github.com/disler/claude-code-hooks-mastery](https://github.com/disler/claude-code-hooks-mastery)
27. Claude Code Hooks: A Practical Guide to Workflow Automation \- DataCamp, accessed February 15, 2026, [https://www.datacamp.com/tutorial/claude-code-hooks](https://www.datacamp.com/tutorial/claude-code-hooks)
28. claude-code-ultimate-guide/guide/workflows/tdd-with-claude.md at main \- GitHub, accessed February 15, 2026, [https://github.com/FlorianBruniaux/claude-code-ultimate-guide/blob/main/guide/workflows/tdd-with-claude.md](https://github.com/FlorianBruniaux/claude-code-ultimate-guide/blob/main/guide/workflows/tdd-with-claude.md)
29. Forcing Claude Code to TDD: An Agentic Red-Green-Refactor Loop | alexop.dev, accessed February 15, 2026, [https://alexop.dev/posts/custom-tdd-workflow-claude-code-vue/](https://alexop.dev/posts/custom-tdd-workflow-claude-code-vue/)
30. Circuit breaker pattern \- AWS Prescriptive Guidance, accessed February 15, 2026, [https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/circuit-breaker.html](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/circuit-breaker.html)
31. Resilience Circuit Breakers for Agentic AI \- Medium, accessed February 15, 2026, [https://medium.com/@michael.hannecke/resilience-circuit-breakers-for-agentic-ai-cc7075101486](https://medium.com/@michael.hannecke/resilience-circuit-breakers-for-agentic-ai-cc7075101486)
32. AI Red Teaming Explained: Why Modern Enterprises Need it Now \- Zscaler, accessed February 15, 2026, [https://www.zscaler.com/zpedia/ai-red-teaming](https://www.zscaler.com/zpedia/ai-red-teaming)
33. Red Teaming AI Red Teaming \- arXiv, accessed February 15, 2026, [https://arxiv.org/html/2507.05538v1](https://arxiv.org/html/2507.05538v1)
34. Observability, insights, and automation: Use the practice of observability to simplify and automate large parts of the incident management process \- IBM Developer, accessed February 15, 2026, [https://developer.ibm.com/articles/observability-insights-and-automation/](https://developer.ibm.com/articles/observability-insights-and-automation/)
35. Set Up Your Logs for Better Insight: Make Logs First-class Citizens In Your Codebase, accessed February 15, 2026, [https://www.crowdstrike.com/en-us/blog/set-up-your-logs-for-better-insight-make-logs-first-class-citizens-in-your-codebase/](https://www.crowdstrike.com/en-us/blog/set-up-your-logs-for-better-insight-make-logs-first-class-citizens-in-your-codebase/)
36. Securing AI Coding Tools: Permission Controls and Credential Protection for Engineering Teams | Brian Gershon, accessed February 15, 2026, [https://www.briangershon.com/blog/securing-ai-coding-tools/](https://www.briangershon.com/blog/securing-ai-coding-tools/)
37. Test-Driven Development (TDD) \- Medium, accessed February 15, 2026, [https://medium.com/@thakuraloksingh186/test-driven-development-tdd-455f1cc31a4b](https://medium.com/@thakuraloksingh186/test-driven-development-tdd-455f1cc31a4b)
