# Rapise Test Automation Research (2026-02-15)

**Status:** CURRENT
**Session:** Evaluating Rapise for alexmayhew.dev testing (Next.js 15 / Cloudflare Workers)

## Executive Summary

**Rapise** is an AI-driven, enterprise test automation platform by Inflectra that supports web, desktop, mobile, and API testing. The Node.js CLI version (`rapise` npm package v8.6.34-build.26) is installed and provides headless test execution capabilities suitable for CI/CD pipelines.

**Key Finding for alexmayhew.dev:** Rapise is **likely overkill** for this project. It's designed for enterprise multi-platform testing (desktop/mobile/web/API), while we only need web testing. **Playwright (already installed) is the better fit** for Next.js testing on Cloudflare Workers.

---

## 1. What is Rapise?

**Rapise** is a next-generation software test automation platform by [Inflectra](https://www.inflectra.com/Rapise/) that supports:

- **Web applications** (Chrome, Edge, Firefox, Safari, IE via Selenium WebDriver)
- **Desktop applications** (Windows native, Java, Qt, etc.)
- **Mobile applications** (iOS/Android via Appium)
- **API testing** (REST, SOAP, GraphQL)
- **Terminal applications** (AS400, mainframe)

### Core Architecture

- **Primary platform:** Windows desktop IDE (full-featured GUI)
- **Secondary platform:** Node.js CLI (headless execution for CI/CD)
- **Test language:** JavaScript or Rapise Visual Language (RVL - codeless/scriptless)
- **Recording:** Object-based recording with Selenium WebDriver integration
- **AI features:** Embedded Inflectra.ai (Agentic AI) for vision-based testing and auto-generating scripts from manual tests

---

## 2. Node.js/CLI Version (`rapise` npm package)

### Installation Details

- **Package:** `rapise@8.6.34-build.26` (installed globally)
- **Location:** `/home/deploy/.config/nvm/versions/node/v22.21.1/lib/node_modules/rapise`
- **Binaries provided:**
  - `rapise` - Main CLI for running tests
  - `rapiselauncher` - SpiraTest integration launcher
  - `rapise-ai-server` - AI server component for AI-driven testing

### Key Dependencies

```json
"selenium-webdriver": "^4.0.0-alpha.5"
"@aws-sdk/client-bedrock-runtime": "^3.687.0"  // AWS Bedrock AI integration
"@google/generative-ai": "^0.21.0"              // Google AI integration
"openai": "^4.53.0"                             // OpenAI integration
"axios": "^1.9.0"                               // HTTP client
"express": "^4.18.2"                            // REST server
"soap": "^1.1.11"                               // SOAP testing
"xlsx": "^0.18.5"                               // Excel data handling
"winston": "^3.17.0"                            // Logging
```

### CLI Usage

```bash
# Run a Rapise test (requires .sstest or .js file)
rapise <test-file>.sstest
rapise <test-file>.js

# The CLI expects to be run from the test folder containing:
# - node.json (configuration)
# - Test files (.sstest or .js)
# - Objects.js (object repository)
```

**Important:** The `rapise` CLI is NOT like Jest/Playwright where you just run `npx playwright test`. It requires **pre-created test projects** from the Windows IDE or manual configuration of `.sstest` files.

---

## 3. Official Documentation

### Primary Resources

- **Main Documentation Portal:** [rapisedoc.inflectra.com](https://rapisedoc.inflectra.com/)
- **Product Page:** [inflectra.com/Products/Rapise](https://www.inflectra.com/Products/Rapise/)
- **GitHub (docs):** [github.com/Inflectra/rapise-documentation](https://github.com/Inflectra/rapise-documentation)

### Documentation Structure

- **User's Guide:** UI features, technologies, concepts
- **RVL (Rapise Visual Language):** Codeless test automation syntax
- **Libraries:** Object API reference
- **Manuals:** Environment setup, installation, configuration
- **KB:** Knowledge base articles
- **Release Notes:** Version history (currently 8.6+)

---

## 4. How Rapise Works with Web Testing (Selenium WebDriver)

### Browser Support

**Native Rapise browsers:**

- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Internet Explorer

**Additional via Selenium:**

- Apple Safari
- Opera
- Headless Chrome/Firefox

### Recording & Playback Workflow

1. **Record** tests using Chrome/Edge (native recorder with object learning)
2. **Generate** object repository (Objects.js) with learned elements
3. **Playback** tests across multiple browsers via Selenium profiles
4. **Shadow DOM support** (v7.3+) for web components

### Selenium Configuration

- Managed via `Settings > Selenium` in the Windows IDE
- Automatic WebDriver download (chromedriver, geckodriver, etc.)
- Custom profiles for remote Selenium Grid
- Most defaults work out-of-the-box except Safari (requires URI config)

### Test Execution Flow

```javascript
// Main.js - Entry point
function Test() {
	// Test logic using learned objects
	SeS("Button_Login").DoClick();
	SeS("TextBox_Username").DoSetText("admin");
	// ...
}
```

Objects are referenced via `SeS()` (Selenium Select) function and stored in `Objects.js`.

---

## 5. .sstest File Format

### What is .sstest?

The `.sstest` file is the **test project file** that serves as the container for a Rapise test. It's an XML-based metadata file that defines:

- Test name and description
- Test type (Web, Desktop, Mobile, API)
- Framework configuration
- File paths (Main.js, Objects.js, User.js)
- Parameters and settings
- Browser profile selection

### Typical Test Structure

```
MyTest/
├── MyTest.sstest       # Test project file (XML metadata)
├── Main.js             # Test entry point (Test() function)
├── Objects.js          # Recorded object repository
├── User.js             # User-defined functions
├── Common.js           # Shared utility functions
├── node.json           # Node.js execution config
└── Data/               # Test data (Excel, JSON, CSV)
    └── input.xlsx
```

### Framework Organization

- **Root test:** Framework entry point with %WORKDIR% context
- **Sub-tests:** Nested tests for modular organization
- **Shared folder:** Common functions, data files, shared Objects.js
- **Page Objects:** Reusable modules for common UI interactions

---

## 6. SpiraTest Integration

### What is SpiraTest?

[SpiraTest](https://www.inflectra.com/Products/SpiraTest/) is Inflectra's **test management platform** that integrates with Rapise for centralized test orchestration.

### Integration Features

- **Central test repository:** Store versioned Rapise tests in SpiraTest
- **Remote scheduling:** Schedule tests to run on distributed RapiseLauncher agents
- **Automated test sets:** Trigger test execution on CI/CD pipeline completion (Jenkins, Azure DevOps, etc.)
- **Requirements traceability:** Link automated tests to manual test cases and requirements
- **Real-time reporting:** Test results sync back to SpiraTest dashboard

### Remote Execution

- **RapiseLauncher:** Free add-on that polls SpiraTest every N minutes (default 60)
- **Auto-scheduled test sets:** Run when builds succeed in CI/CD
- **Distributed test labs:** Execute tests on Windows/Mac/Linux/containers
- **Batch execution:** External scripts can trigger Rapise via `rapiselauncher` CLI

### Use Case for alexmayhew.dev

**Not applicable.** SpiraTest is an enterprise test management system ($500-$5000/year licensing). For a solo developer portfolio site, GitHub Actions + Playwright is sufficient.

---

## 7. AI Server Component (`rapise-ai-server`)

### What is rapise-ai-server?

The `rapise-ai-server` is an embedded **AI server** that provides:

- **Vision-based testing:** AI analyzes screenshots to locate UI elements (no explicit selectors needed)
- **Script generation:** Converts manual test descriptions into executable JavaScript
- **Autonomous testing:** AI Robot/Tester features for real-time decision-making
- **Self-healing:** AI adjusts selectors when UI changes

### AI Integrations

Rapise 8.6 supports multiple AI backends:

- **AWS Bedrock:** Anthropic Claude 3.5 Sonnet, Haiku (primary)
- **Google Generative AI:** Gemini models
- **OpenAI:** GPT-4, GPT-3.5

### Embedded Inflectra.ai

Unlike competitors that rely on third-party AI (e.g., Selenium with external AI services), Rapise 8.6 introduced **Inflectra.ai**, an embedded Agentic AI engine that runs entirely within the Inflectra environment (no external API calls required for basic AI features).

### Use Case for alexmayhew.dev

**Overkill.** AI-driven testing is useful for complex enterprise apps with frequent UI changes or when testers lack coding skills. For a static Next.js site with stable UI, traditional Playwright selectors (data-testid) are faster, more reliable, and free.

---

## 8. Best Practices for Web Application Testing with Rapise

### From Rapise Documentation

1. **Start small:** Implement 2-5 simple test cases before scaling
2. **Establish nightly runs early:** Set up automated execution from the start
3. **Extract Page Objects:** Identify recurring UI interactions and modularize
4. **Use parametrization:** Define test-specific and runtime settings via parameters editor
5. **Shared object repository:** Maintain framework-wide Objects.js for common elements
6. **Test sets for organization:** Group related tests in SpiraTest dashboard

### Framework Design Principles

- **Progressive refactoring:** Begin with inline tests, extract patterns as they emerge
- **Hierarchical structure:** Root test → sub-tests → page objects → shared resources
- **Data-driven testing:** Store input data in Excel/JSON, load via Common.js
- **Version control:** Store tests in Git, use SpiraTest for artifact versioning

### Rapise-Specific Limitations for Next.js

- **No native React component testing:** Rapise tests full pages via Selenium (like E2E), not isolated components
- **No SSR testing:** Cannot directly test server-side rendering behavior
- **No Edge runtime validation:** Cannot verify Cloudflare Workers edge compatibility
- **Windows IDE dependency:** Full test creation/modification requires Windows (CLI is playback-only)

---

## 9. API Testing with Rapise

### Supported Protocols

- **REST:** Full HTTP client with axios (GET, POST, PUT, DELETE, PATCH)
- **SOAP:** Built-in SOAP client (`soap` npm package)
- **GraphQL:** Supported via REST client (send GraphQL queries as POST)

### API Testing Features

- **Integrated API + UI tests:** Mix RPA (UI automation) and API calls in one test
- **Response validation:** JSON/XML parsing and assertion
- **Authentication:** OAuth, Basic Auth, JWT token handling
- **Data extraction:** Parse API responses for use in subsequent UI steps

### Example Use Case

```javascript
// Login via API to get auth token
var response = Global.DoInvokeHTTPRequest('POST', 'https://api.example.com/login', {...});
var token = JSON.parse(response.body).token;

// Use token in UI test
Navigator.Open('https://app.example.com');
SeS('TextBox_APIToken').DoSetText(token);
SeS('Button_Submit').DoClick();
```

### Comparison to Dedicated API Tools

- **Rapise API testing:** Good for hybrid UI+API workflows
- **Postman/Insomnia:** Better for pure API testing with collections
- **Playwright API testing:** Better for Next.js API routes (same codebase, built-in TypeScript)

---

## 10. Rapise vs. Playwright Comparison

| Feature               | Rapise                                             | Playwright                                     |
| --------------------- | -------------------------------------------------- | ---------------------------------------------- |
| **Primary Use Case**  | Enterprise multi-platform (Web/Desktop/Mobile/API) | Modern web application testing                 |
| **Platform Coverage** | Full-stack (Web, Desktop, Mobile, Terminal, API)   | Web + API only                                 |
| **Programming Model** | Hybrid (Codeless RVL + JavaScript)                 | Code-centric (JavaScript/TypeScript/Python/C#) |
| **Installation**      | Windows IDE (primary) + Node.js CLI (secondary)    | npm install (cross-platform)                   |
| **Test Creation**     | GUI recorder (Windows) or manual .sstest creation  | Code-first or Codegen CLI                      |
| **Browser Support**   | Chrome, Edge, Firefox, IE, Safari (via Selenium)   | Chromium, Firefox, WebKit (native)             |
| **Execution Speed**   | Slower (Selenium WebDriver overhead)               | Faster (native browser protocols)              |
| **Auto-wait**         | Manual wait configuration                          | Built-in auto-wait                             |
| **Parallelization**   | Limited (requires SpiraTest orchestration)         | Built-in (--workers flag)                      |
| **CI/CD Integration** | Via RapiseLauncher + SpiraTest                     | Native (GitHub Actions, GitLab CI, etc.)       |
| **Shadow DOM**        | Supported (v7.3+)                                  | Fully supported                                |
| **API Testing**       | REST, SOAP, GraphQL via axios/soap                 | Built-in API testing context                   |
| **Component Testing** | Not supported                                      | Experimental (component CT mode)               |
| **Tracing**           | Via SpiraTest reports                              | Built-in trace viewer                          |
| **License**           | Commercial ($$$ - enterprise pricing)              | Open source (Apache 2.0)                       |
| **Learning Curve**    | Moderate (GUI-based, codeless option)              | Moderate-High (code-first)                     |
| **Maintenance**       | Higher (Selenium selector brittleness)             | Lower (auto-wait, smart selectors)             |

### When to Use Rapise

- Testing **Windows desktop applications** alongside web apps
- Testing **mainframe/AS400 terminals** (legacy enterprise)
- **Non-technical testers** need to create tests (codeless RVL)
- **SpiraTest ecosystem** already in use
- **Multi-protocol testing** (UI + SOAP + REST + Desktop in one test)

### When to Use Playwright (Recommended for alexmayhew.dev)

- **Modern web applications** (React, Next.js, Vue, Angular)
- **Fast CI/CD pipelines** (Playwright = 3-5x faster than Selenium)
- **Developer-centric teams** (comfortable with TypeScript)
- **Cost-sensitive** (open source vs. enterprise licensing)
- **Next.js specific features** (can test API routes, middleware, server components indirectly)

---

## Recommendation for alexmayhew.dev

### Why Playwright is the Better Choice

**1. Already Installed**
Playwright is likely already in the project or easily added with `npm install -D @playwright/test`.

**2. Next.js Native Testing**
Playwright integrates seamlessly with Next.js:

- Test API routes (`/api/health`, `/api/contact`)
- Verify server-rendered pages
- Use `next dev` server for local testing
- Production testing against Cloudflare Workers

**3. No Windows Dependency**
Rapise requires Windows IDE for test creation. Playwright is fully cross-platform.

**4. Faster Execution**
Playwright is 3-5x faster than Selenium-based tools due to native browser protocols.

**5. Better CI/CD Integration**
Playwright has first-class GitHub Actions support (already in alexmayhew.dev workflow).

**6. Free & Open Source**
Rapise is commercial software ($$$). Playwright is Apache 2.0 licensed.

**7. TypeScript-First**
Matches the Next.js 15 codebase TypeScript standards.

### When Rapise WOULD Be Useful

- If you were testing a **Windows desktop CRM** alongside the web app
- If you needed **SOAP API testing** for legacy enterprise integration
- If you had **non-technical QA testers** who need codeless testing
- If you were already paying for **SpiraTest enterprise** licensing

### Suggested Testing Stack for alexmayhew.dev

```bash
# Unit/Integration (existing)
npm run test  # Vitest or Jest

# E2E (add Playwright)
npm install -D @playwright/test
npx playwright install chromium  # Lightweight, Cloudflare Workers uses Chromium V8

# API testing
# Use Playwright's built-in API testing context
```

**Example Playwright test:**

```typescript
// tests/e2e/contact.spec.ts
import { test, expect } from "@playwright/test";

test("contact form submission", async ({ page }) => {
	await page.goto("http://localhost:3001/contact");

	await page.fill('[data-testid="name"]', "Test User");
	await page.fill('[data-testid="email"]', "test@example.com");
	await page.fill('[data-testid="message"]', "Test message");

	await page.click('[data-testid="submit"]');

	await expect(page.locator('[data-testid="success"]')).toBeVisible();
});

test("health API endpoint", async ({ request }) => {
	const response = await request.get("http://localhost:3001/api/health");
	expect(response.ok()).toBeTruthy();
	const data = await response.json();
	expect(data.status).toBe("healthy");
});
```

---

## Technical Limitations of Rapise for This Project

### 1. Edge Runtime Incompatibility

Rapise uses Node.js runtime. Next.js on Cloudflare Workers uses **Edge Runtime** (V8 isolates, not full Node.js). Rapise cannot test Edge-specific behavior.

### 2. No Server Components Testing

Rapise tests via browser (client-side only). Cannot verify React Server Components behavior directly.

### 3. No Middleware Testing

Cannot test Next.js middleware in isolation (would require full E2E flow).

### 4. Selenium Overhead

Selenium WebDriver adds latency (100-300ms per action). Playwright's native protocols are 10-50ms.

### 5. Windows IDE Lock-In

Creating/modifying Rapise tests requires Windows. Kali Linux development environment would need VM or Wine.

---

## Sources

### Official Documentation

- [Rapise Documentation Portal](https://rapisedoc.inflectra.com/)
- [Rapise Overview](https://rapisedoc.inflectra.com/Guide/overview/)
- [Rapise Product Page](https://www.inflectra.com/Products/Rapise/)
- [Rapise Test Frameworks Guide](https://rapisedoc.inflectra.com/Guide/Frameworks/frameworks/)
- [Rapise Selenium WebDriver Integration](https://rapisedoc.inflectra.com/Guide/selenium_webdriver/)
- [Rapise SpiraTest Integration](https://rapisedoc.inflectra.com/Guide/spiratest_integration/)
- [Rapise GitHub Documentation](https://github.com/Inflectra/rapise-documentation)

### Product Information

- [Rapise vs Playwright Comparison](https://www.inflectra.com/Products/Comparison/Rapise-vs-Playwright.aspx)
- [Rapise AWS Marketplace](https://aws.amazon.com/marketplace/pp/prodview-k7di34vsndll4)
- [Rapise AI Features Announcement](https://www.inflectra.com/Products/Rapise/Highlights/Artificial-Intelligence.aspx)
- [Rapise 8.6 AI Release](https://itbrief.news/story/inflectra-unveils-rapise-8-6-with-embedded-ai-for-secure-testing)

### Technical Articles

- [Rapise Containers/Docker Support](https://www.inflectra.com/Ideas/Entry/rapise-scripts-containers-docker-kubernetes-939.aspx)
- [Next.js Testing Guide](https://nextjs.org/docs/app/guides/testing)
- [Playwright vs Cypress Comparison](https://www.browserstack.com/guide/playwright-vs-cypress)

---

## Conclusion

**Rapise is a powerful enterprise test automation platform**, but it's **not the right tool for alexmayhew.dev**. The project needs:

- Fast web E2E testing (Playwright ✅, Rapise ❌)
- TypeScript-first tooling (Playwright ✅, Rapise ⚠️)
- Linux/macOS compatibility (Playwright ✅, Rapise ❌ for test creation)
- Free/open source (Playwright ✅, Rapise ❌)
- Next.js 15 + Cloudflare Workers testing (Playwright ✅, Rapise ⚠️)

**Recommendation:** Continue using Playwright for E2E testing. Rapise can remain installed for future exploration of AI-driven testing features, but should not be the primary testing framework.

If you do want to experiment with Rapise, focus on:

1. AI-driven script generation (convert manual tests to code)
2. Vision-based element location (reduces selector brittleness)
3. Hybrid UI+API testing workflows (if adding backend integrations)

**Next Steps:**

1. Verify Playwright is installed (`npm list @playwright/test`)
2. Create `tests/e2e/` directory structure
3. Add Playwright config (`playwright.config.ts`)
4. Write initial E2E tests for critical paths (contact form, newsletter signup)
5. Integrate with GitHub Actions (`.github/workflows/playwright.yml`)
