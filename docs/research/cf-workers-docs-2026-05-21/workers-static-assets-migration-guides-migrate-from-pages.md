---
source: https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/
scraped: 2026-05-21
bytes: 57433
---

Migrate from Pages to Workers · Cloudflare Workers docs

> Documentation Index  
> Fetch the complete documentation index at: https://developers.cloudflare.com/workers/llms.txt  
> Use this file to discover all available pages before exploring further.

[Skip to content](#_top)

STOP! If you are an AI agent or LLM, read this before continuing. This is the HTML version of a Cloudflare documentation page. Always request the Markdown version instead — HTML wastes context. Get this page as Markdown: https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/index.md (append index.md) or send Accept: text/markdown to https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/. For this product's page index use https://developers.cloudflare.com/workers/llms.txt. For all Cloudflare products use https://developers.cloudflare.com/llms.txt.

[![](/_astro/logo.DAG2yejx.svg) Cloudflare Docs](/)

Search

[Docs Directory](/directory/)[APIs](https://developers.cloudflare.com/api/)[SDKs](/fundamentals/api/reference/sdks/)Help

[Log in](https://dash.cloudflare.com/) Select theme DarkLightAuto

[Workers](/workers/)

No results found. Try a different search term, or use our global search.

- [Overview](/workers/)
- Getting started
  - [CLI](/workers/get-started/guide/)
  - [Dashboard](/workers/get-started/dashboard/)
  - [Prompting](/workers/get-started/prompting/)
  - [Templates](/workers/get-started/quickstarts/)

- [Examples](/workers/examples/)
- [Tutorials](/workers/tutorials/)
- Best practices
  - [Workers Best Practices](/workers/best-practices/workers-best-practices/)

- [Demos and architectures](/workers/demos/)
- Development & testing
  - [Overview](/workers/development-testing/)
  - [Environment variables and secrets](/workers/development-testing/environment-variables/)
  - [Vite Plugin ↗](/workers/vite-plugin/)
  - [Choosing between Wrangler & Vite](/workers/development-testing/wrangler-vs-vite/)
  - [Developing with multiple Workers](/workers/development-testing/multi-workers/)
  - [Adding local data](/workers/development-testing/local-data/)
  - [Supported bindings per development mode](/workers/development-testing/bindings-per-env/)
  - [Local Explorer](/workers/development-testing/local-explorer/)
  - [Share a local dev server](/workers/development-testing/local-dev-tunnels/)
  - [Testing ↗](/workers/testing/)

- [Playground](/workers/playground/)
- Configuration
  - [Overview](/workers/configuration/)
  - [Bindings ↗](/workers/runtime-apis/bindings/)
  - [Compatibility dates](/workers/configuration/compatibility-dates/)
  - [Compatibility flags](/workers/configuration/compatibility-flags/)
  - [Cron Triggers](/workers/configuration/cron-triggers/)
  - [Environment variables](/workers/configuration/environment-variables/)
  - Integrations
    - [Overview](/workers/configuration/integrations/)
    - [APIs](/workers/configuration/integrations/apis/)
    - [External Services](/workers/configuration/integrations/external-services/)

  - [Multipart upload metadata](/workers/configuration/multipart-upload-metadata/)
  - [Page Rules](/workers/configuration/workers-with-page-rules/)
  - [Placement Beta](/workers/configuration/placement/)
  - [Preview URLs](/workers/configuration/previews/)
  - Routes and domains
    - [Overview](/workers/configuration/routing/)
    - [Custom Domains](/workers/configuration/routing/custom-domains/)
    - [Routes](/workers/configuration/routing/routes/)
    - [workers.dev](/workers/configuration/routing/workers-dev/)

  - [Secrets](/workers/configuration/secrets/)
  - Versions & Deployments
    - [Overview](/workers/configuration/versions-and-deployments/)
    - [Gradual deployments](/workers/configuration/versions-and-deployments/gradual-deployments/)
    - [Version overrides](/workers/configuration/versions-and-deployments/version-overrides/)
    - [Rollbacks](/workers/configuration/versions-and-deployments/rollbacks/)

  - Workers Sites
    - [Overview](/workers/configuration/sites/)
    - [Start from existing](/workers/configuration/sites/start-from-existing/)
    - [Start from scratch](/workers/configuration/sites/start-from-scratch/)
    - [Start from Worker](/workers/configuration/sites/start-from-worker/)
    - [Workers Sites configuration](/workers/configuration/sites/configuration/)

- CI/CD
  - [Overview](/workers/ci-cd/)
  - Builds
    - [Overview](/workers/ci-cd/builds/)
    - [Configuration](/workers/ci-cd/builds/configuration/)
    - [Automatic pull requests](/workers/ci-cd/builds/automatic-prs/)
    - Git integration
      - [Overview](/workers/ci-cd/builds/git-integration/)
      - [GitHub integration](/workers/ci-cd/builds/git-integration/github-integration/)
      - [GitLab integration](/workers/ci-cd/builds/git-integration/gitlab-integration/)

    - [Build image](/workers/ci-cd/builds/build-image/)
    - [Build caching](/workers/ci-cd/builds/build-caching/)
    - [Build branches](/workers/ci-cd/builds/build-branches/)
    - [Build watch paths](/workers/ci-cd/builds/build-watch-paths/)
    - [Deploy Hooks](/workers/ci-cd/builds/deploy-hooks/)
    - [Advanced setups](/workers/ci-cd/builds/advanced-setups/)
    - [Event subscriptions](/workers/ci-cd/builds/event-subscriptions/)
    - [Troubleshooting builds](/workers/ci-cd/builds/troubleshoot/)
    - [Builds API reference](/workers/ci-cd/builds/api-reference/)
    - [Limits & pricing](/workers/ci-cd/builds/limits-and-pricing/)
    - [MCP server ↗ MCP](https://github.com/cloudflare/mcp-server-cloudflare/tree/main/apps/workers-builds)

  - External CI/CD
    - [Overview](/workers/ci-cd/external-cicd/)
    - [GitHub Actions](/workers/ci-cd/external-cicd/github-actions/)
    - [GitLab CI/CD](/workers/ci-cd/external-cicd/gitlab-cicd/)

- Runtime APIs
  - [Overview](/workers/runtime-apis/)
  - Bindings (env)
    - [Overview](/workers/runtime-apis/bindings/)
    - [AI ↗](/workers-ai/get-started/workers-wrangler/#2-connect-your-worker-to-workers-ai)
    - [Analytics Engine ↗](/analytics/analytics-engine)
    - [Assets ↗](/workers/static-assets/binding/)
    - [Browser Run ↗](/browser-run/)
    - [D1 ↗](/d1/worker-api/)
    - [Dispatcher (Workers for Platforms) ↗](/cloudflare-for-platforms/workers-for-platforms/configuration/dynamic-dispatch/)
    - [Durable Objects ↗](/durable-objects/api/)
    - [Dynamic Worker Loaders](/workers/runtime-apis/bindings/worker-loader/)
    - [Environment Variables ↗](/workers/configuration/environment-variables/)
    - [Hyperdrive ↗](/hyperdrive)
    - [Images ↗](/images/optimization/transformations/bindings/)
    - [KV ↗](/kv/api/)
    - [Media Transformations ↗](/stream/transform-videos/bindings/)
    - [mTLS](/workers/runtime-apis/bindings/mtls/)
    - [Queues ↗](/queues/configuration/javascript-apis/)
    - [R2 ↗](/r2/api/workers/workers-api-reference/)
    - [Rate Limiting](/workers/runtime-apis/bindings/rate-limit/)
    - [Secrets ↗](/workers/configuration/secrets/)
    - [Secrets Store ↗ Beta](/secrets-store/integrations/workers/)
    - Service bindings
      - [Overview](/workers/runtime-apis/bindings/service-bindings/)
      - [HTTP](/workers/runtime-apis/bindings/service-bindings/http/)
      - [RPC (WorkerEntrypoint)](/workers/runtime-apis/bindings/service-bindings/rpc/)

    - [Stream ↗](/stream/manage-video-library/bindings/)
    - [Vectorize ↗](/vectorize/reference/client-api/)
    - [Version metadata Beta](/workers/runtime-apis/bindings/version-metadata/)
    - [Workflows ↗](/workflows/)

  - [Cache](/workers/runtime-apis/cache/)
  - [Console](/workers/runtime-apis/console/)
  - [Context (ctx)](/workers/runtime-apis/context/)
  - [Encoding](/workers/runtime-apis/encoding/)
  - [EventSource](/workers/runtime-apis/eventsource/)
  - [Fetch](/workers/runtime-apis/fetch/)
  - Handlers
    - [Overview](/workers/runtime-apis/handlers/)
    - [Alarm Handler ↗](/durable-objects/api/alarms/)
    - [Email Handler ↗](/email-routing/email-workers/runtime-api/)
    - [Fetch Handler](/workers/runtime-apis/handlers/fetch/)
    - [Queue Handler ↗](/queues/configuration/javascript-apis/#consumer)
    - [Scheduled Handler](/workers/runtime-apis/handlers/scheduled/)
    - [Tail Handler](/workers/runtime-apis/handlers/tail/)

  - [Headers](/workers/runtime-apis/headers/)
  - [HTMLRewriter](/workers/runtime-apis/html-rewriter/)
  - [MessageChannel](/workers/runtime-apis/messagechannel/)
  - Node.js compatibility
    - [Overview](/workers/runtime-apis/nodejs/)
    - [assert](/workers/runtime-apis/nodejs/assert/)
    - [AsyncLocalStorage](/workers/runtime-apis/nodejs/asynclocalstorage/)
    - [Buffer](/workers/runtime-apis/nodejs/buffer/)
    - [crypto](/workers/runtime-apis/nodejs/crypto/)
    - [Diagnostics Channel](/workers/runtime-apis/nodejs/diagnostics-channel/)
    - [dns](/workers/runtime-apis/nodejs/dns/)
    - [EventEmitter](/workers/runtime-apis/nodejs/eventemitter/)
    - [fs](/workers/runtime-apis/nodejs/fs/)
    - [http](/workers/runtime-apis/nodejs/http/)
    - [https](/workers/runtime-apis/nodejs/https/)
    - [net](/workers/runtime-apis/nodejs/net/)
    - [path](/workers/runtime-apis/nodejs/path/)
    - [process](/workers/runtime-apis/nodejs/process/)
    - [Streams](/workers/runtime-apis/nodejs/streams/)
    - [StringDecoder](/workers/runtime-apis/nodejs/string-decoder/)
    - [test](/workers/runtime-apis/nodejs/test/)
    - [timers](/workers/runtime-apis/nodejs/timers/)
    - [tls](/workers/runtime-apis/nodejs/tls/)
    - [url](/workers/runtime-apis/nodejs/url/)
    - [util](/workers/runtime-apis/nodejs/util/)
    - [zlib](/workers/runtime-apis/nodejs/zlib/)

  - [Performance and timers](/workers/runtime-apis/performance/)
  - Remote-procedure call (RPC)
    - [Overview](/workers/runtime-apis/rpc/)
    - [Lifecycle](/workers/runtime-apis/rpc/lifecycle/)
    - [Reserved Methods](/workers/runtime-apis/rpc/reserved-methods/)
    - [Visibility and Security Model](/workers/runtime-apis/rpc/visibility/)
    - [TypeScript](/workers/runtime-apis/rpc/typescript/)
    - [Error handling](/workers/runtime-apis/rpc/error-handling/)

  - [Request](/workers/runtime-apis/request/)
  - [Response](/workers/runtime-apis/response/)
  - [Scheduler](/workers/runtime-apis/scheduler/)
  - Streams
    - [Overview](/workers/runtime-apis/streams/)
    - [ReadableStream](/workers/runtime-apis/streams/readablestream/)
    - [ReadableStream BYOBReader](/workers/runtime-apis/streams/readablestreambyobreader/)
    - [ReadableStream DefaultReader](/workers/runtime-apis/streams/readablestreamdefaultreader/)
    - [TransformStream](/workers/runtime-apis/streams/transformstream/)
    - [WritableStream](/workers/runtime-apis/streams/writablestream/)
    - [WritableStream DefaultWriter](/workers/runtime-apis/streams/writablestreamdefaultwriter/)

  - [TCP sockets](/workers/runtime-apis/tcp-sockets/)
  - [Web Crypto](/workers/runtime-apis/web-crypto/)
  - [Web standards](/workers/runtime-apis/web-standards/)
  - WebAssembly (Wasm)
    - [Overview](/workers/runtime-apis/webassembly/)
    - [Wasm in JavaScript](/workers/runtime-apis/webassembly/javascript/)

  - [WebSockets](/workers/runtime-apis/websockets/)

- Static Assets
  - [Overview](/workers/static-assets/)
  - [Get Started](/workers/static-assets/get-started/)
  - [Configuration and Bindings](/workers/static-assets/binding/)
  - Routing
    - [Full-stack application](/workers/static-assets/routing/full-stack-application/)
    - [Single Page Application (SPA)](/workers/static-assets/routing/single-page-application/)
    - [Static Site Generation (SSG) and custom 404 pages](/workers/static-assets/routing/static-site-generation/)
    - [Worker script](/workers/static-assets/routing/worker-script/)
    - Advanced
      - [Gradual rollouts](/workers/static-assets/routing/advanced/gradual-rollouts/)
      - [HTML handling](/workers/static-assets/routing/advanced/html-handling/)
      - [Serving a subdirectory](/workers/static-assets/routing/advanced/serving-a-subdirectory/)

  - [Headers](/workers/static-assets/headers/)
  - [Redirects](/workers/static-assets/redirects/)
  - [Direct Uploads](/workers/static-assets/direct-upload/)
  - [Billing and Limitations](/workers/static-assets/billing-and-limitations/)
  - Migration Guides
    - [Migrate from Pages to Workers](/workers/static-assets/migration-guides/migrate-from-pages/)
    - [Migrate from Netlify to Workers](/workers/static-assets/migration-guides/netlify-to-workers/)
    - [Migrate from Vercel to Workers](/workers/static-assets/migration-guides/vercel-to-workers/)

- Framework guides
  - [Deploy an existing project](/workers/framework-guides/automatic-configuration/)
  - Web applications
    - [React + Vite](/workers/framework-guides/web-apps/react/)
    - [Astro](/workers/framework-guides/web-apps/astro/)
    - [React Router (formerly Remix)](/workers/framework-guides/web-apps/react-router/)
    - [Next.js](/workers/framework-guides/web-apps/nextjs/)
    - [Vue](/workers/framework-guides/web-apps/vue/)
    - [RedwoodSDK](/workers/framework-guides/web-apps/redwoodsdk/)
    - [TanStack Start](/workers/framework-guides/web-apps/tanstack-start/)
    - [Microfrontends](/workers/framework-guides/web-apps/microfrontends/)
    - [SvelteKit](/workers/framework-guides/web-apps/sveltekit/)
    - [Vike](/workers/framework-guides/web-apps/vike/)
    - More guides...
      - [Analog](/workers/framework-guides/web-apps/more-web-frameworks/analog/)
      - [Angular](/workers/framework-guides/web-apps/more-web-frameworks/angular/)
      - [Docusaurus](/workers/framework-guides/web-apps/more-web-frameworks/docusaurus/)
      - [Gatsby](/workers/framework-guides/web-apps/more-web-frameworks/gatsby/)
      - [Hono](/workers/framework-guides/web-apps/more-web-frameworks/hono/)
      - [Nuxt](/workers/framework-guides/web-apps/more-web-frameworks/nuxt/)
      - [Qwik](/workers/framework-guides/web-apps/more-web-frameworks/qwik/)
      - [Solid Beta](/workers/framework-guides/web-apps/more-web-frameworks/solid/)
      - [Waku](/workers/framework-guides/web-apps/more-web-frameworks/waku/)

  - Mobile applications
    - [Expo ↗](https://docs.expo.dev/eas/hosting/reference/worker-runtime/)

  - APIs
    - [FastAPI ↗](/workers/languages/python/packages/fastapi/)
    - [Hono ↗](/workers/framework-guides/web-apps/more-web-frameworks/hono/)

  - AI & agents
    - [Agents SDK ↗](/agents/)
    - [LangChain ↗](/workers/languages/python/packages/langchain/)

- Databases
  - [Connect to databases](/workers/databases/connecting-to-databases/)
  - [Analytics Engine ↗](/analytics/analytics-engine/)
  - [Vectorize (vector database) ↗](/vectorize/)
  - [Cloudflare D1 ↗](/d1/)
  - [Hyperdrive ↗](/hyperdrive/)
  - 3rd Party Integrations
    - [Overview](/workers/databases/third-party-integrations/)
    - [Neon](/workers/databases/third-party-integrations/neon/)
    - [PlanetScale](/workers/databases/third-party-integrations/planetscale/)
    - [Supabase](/workers/databases/third-party-integrations/supabase/)
    - [Turso](/workers/databases/third-party-integrations/turso/)
    - [Upstash](/workers/databases/third-party-integrations/upstash/)
    - [Xata](/workers/databases/third-party-integrations/xata/)

- Testing
  - [Overview](/workers/testing/)
  - Vitest integration
    - [Overview](/workers/testing/vitest-integration/)
    - [Write your first test](/workers/testing/vitest-integration/write-your-first-test/)
    - [Recipes and examples](/workers/testing/vitest-integration/recipes/)
    - [Configuration](/workers/testing/vitest-integration/configuration/)
    - [Test APIs](/workers/testing/vitest-integration/test-apis/)
    - [Isolation and concurrency](/workers/testing/vitest-integration/isolation-and-concurrency/)
    - [Debugging](/workers/testing/vitest-integration/debugging/)
    - [Known issues](/workers/testing/vitest-integration/known-issues/)
    - Migration guides
      - [Migrate from Miniflare 2's test environments](/workers/testing/vitest-integration/migration-guides/migrate-from-miniflare-2/)
      - [Migrate from unstable_dev](/workers/testing/vitest-integration/migration-guides/migrate-from-unstable-dev/)

  - Miniflare
    - [Overview](/workers/testing/miniflare/)
    - [Get Started](/workers/testing/miniflare/get-started/)
    - [Writing tests](/workers/testing/miniflare/writing-tests/)
    - Core
      - [Compatibility Dates](/workers/testing/miniflare/core/compatibility/)
      - [Fetch Events](/workers/testing/miniflare/core/fetch/)
      - [Modules](/workers/testing/miniflare/core/modules/)
      - [Multiple Workers](/workers/testing/miniflare/core/multiple-workers/)
      - [Queues](/workers/testing/miniflare/core/queues/)
      - [Scheduled Events](/workers/testing/miniflare/core/scheduled/)
      - [Variables and Secrets](/workers/testing/miniflare/core/variables-secrets/)
      - [Web Standards](/workers/testing/miniflare/core/standards/)
      - [WebSockets](/workers/testing/miniflare/core/web-sockets/)

    - Developing
      - [Attaching a Debugger](/workers/testing/miniflare/developing/debugger/)
      - [Live Reload](/workers/testing/miniflare/developing/live-reload/)

    - Migrations
      - [Migrating from Version 2](/workers/testing/miniflare/migrations/from-v2/)

    - Storage
      - [Cache](/workers/testing/miniflare/storage/cache/)
      - [D1](/workers/testing/miniflare/storage/d1/)
      - [Durable Objects](/workers/testing/miniflare/storage/durable-objects/)
      - [KV](/workers/testing/miniflare/storage/kv/)
      - [R2](/workers/testing/miniflare/storage/r2/)

  - [Wrangler's unstable_startWorker()](/workers/testing/unstable_startworker/)

- Observability
  - [Overview](/workers/observability/)
  - [Metrics and analytics](/workers/observability/metrics-and-analytics/)
  - Logs
    - [Overview](/workers/observability/logs/)
    - [Workers Logs](/workers/observability/logs/workers-logs/)
    - [Real-time logs](/workers/observability/logs/real-time-logs/)
    - [Tail Workers](/workers/observability/logs/tail-workers/)
    - [Workers Logpush](/workers/observability/logs/logpush/)

  - Traces
    - [Overview Beta](/workers/observability/traces/)
    - [Spans and attributes](/workers/observability/traces/spans-and-attributes/)
    - [Known limitations](/workers/observability/traces/known-limitations/)

  - [Query Builder](/workers/observability/query-builder/)
  - Exporting OpenTelemetry Data
    - [Overview](/workers/observability/exporting-opentelemetry-data/)
    - [Export to Honeycomb](/workers/observability/exporting-opentelemetry-data/honeycomb/)
    - [Export to Grafana Cloud](/workers/observability/exporting-opentelemetry-data/grafana-cloud/)
    - [Export to Axiom](/workers/observability/exporting-opentelemetry-data/axiom/)
    - [Export to Sentry](/workers/observability/exporting-opentelemetry-data/sentry/)
    - [Export to PostHog](/workers/observability/exporting-opentelemetry-data/posthog/)

  - [MCP server ↗ MCP](https://github.com/cloudflare/mcp-server-cloudflare/tree/main/apps/workers-observability)
  - DevTools
    - [Overview](/workers/observability/dev-tools/)
    - [Breakpoints](/workers/observability/dev-tools/breakpoints/)
    - [Profiling CPU usage](/workers/observability/dev-tools/cpu-usage/)
    - [Profiling Memory](/workers/observability/dev-tools/memory-usage/)

  - [Errors and exceptions](/workers/observability/errors/)
  - Integrations
    - [Sentry ↗](https://docs.sentry.io/platforms/javascript/guides/cloudflare/)

  - [Source maps and stack traces](/workers/observability/source-maps/)

- Wrangler
  - [Overview](/workers/wrangler/)
  - [Install/Update Wrangler](/workers/wrangler/install-and-update/)
  - [API](/workers/wrangler/api/)
  - Commands
    - [Overview](/workers/wrangler/commands/)
    - [Workers](/workers/wrangler/commands/workers/)
    - [General commands](/workers/wrangler/commands/general/)
    - [Artifacts](/workers/wrangler/commands/artifacts/)
    - [Browser](/workers/wrangler/commands/browser/)
    - [Certificates](/workers/wrangler/commands/certificates/)
    - [Containers](/workers/wrangler/commands/containers/)
    - [D1](/workers/wrangler/commands/d1/)
    - [Hyperdrive](/workers/wrangler/commands/hyperdrive/)
    - [KV](/workers/wrangler/commands/kv/)
    - [Pages](/workers/wrangler/commands/pages/)
    - [Pipelines](/workers/wrangler/commands/pipelines/)
    - [Queues](/workers/wrangler/commands/queues/)
    - [R2](/workers/wrangler/commands/r2/)
    - [Secrets Store](/workers/wrangler/commands/secrets-store/)
    - [Tunnel](/workers/wrangler/commands/tunnel/)
    - [Vectorize](/workers/wrangler/commands/vectorize/)
    - [VPC](/workers/wrangler/commands/vpc/)
    - [Workers for Platforms](/workers/wrangler/commands/workers-for-platforms/)
    - [Workflows](/workers/wrangler/commands/workflows/)

  - [Bundling](/workers/wrangler/bundling/)
  - [Configuration](/workers/wrangler/configuration/)
  - [Custom builds](/workers/wrangler/custom-builds/)
  - [Deprecations](/workers/wrangler/deprecations/)
  - [Environments](/workers/wrangler/environments/)
  - Migrations
    - [Migrate from Wrangler v3 to v4](/workers/wrangler/migration/update-v3-to-v4/)
    - [Migrate from Wrangler v2 to v3](/workers/wrangler/migration/update-v2-to-v3/)
    - Migrate from Wrangler v1 to v2
      - [1\. Migrate webpack projects](/workers/wrangler/migration/v1-to-v2/eject-webpack/)
      - [2\. Update to Wrangler v2](/workers/wrangler/migration/v1-to-v2/update-v1-to-v2/)
      - Wrangler v1 (legacy)
        - [Overview](/workers/wrangler/migration/v1-to-v2/wrangler-legacy/)
        - [Install / Update](/workers/wrangler/migration/v1-to-v2/wrangler-legacy/install-update/)
        - [Authentication](/workers/wrangler/migration/v1-to-v2/wrangler-legacy/authentication/)
        - [Commands](/workers/wrangler/migration/v1-to-v2/wrangler-legacy/commands/)
        - [Configuration](/workers/wrangler/migration/v1-to-v2/wrangler-legacy/configuration/)
        - [Webpack](/workers/wrangler/migration/v1-to-v2/wrangler-legacy/webpack/)

  - [System environment variables](/workers/wrangler/system-environment-variables/)

- Vite plugin
  - [Overview](/workers/vite-plugin/)
  - [Get started](/workers/vite-plugin/get-started/)
  - [Tutorial - React SPA with an API](/workers/vite-plugin/tutorial/)
  - Reference
    - [API](/workers/vite-plugin/reference/api/)
    - [Static Assets](/workers/vite-plugin/reference/static-assets/)
    - [Debugging](/workers/vite-plugin/reference/debugging/)
    - [Migrating from wrangler dev](/workers/vite-plugin/reference/migrating-from-wrangler-dev/)
    - [Secrets](/workers/vite-plugin/reference/secrets/)
    - [Vite Environments](/workers/vite-plugin/reference/vite-environments/)
    - [Cloudflare Environments](/workers/vite-plugin/reference/cloudflare-environments/)
    - [Non-JavaScript modules](/workers/vite-plugin/reference/non-javascript-modules/)
    - [Programmatic configuration](/workers/vite-plugin/reference/programmatic-configuration/)

- Languages
  - [Overview](/workers/languages/)
  - JavaScript
    - [Overview](/workers/languages/javascript/)
    - [Examples ↗](/workers/examples/?languages=JavaScript)

  - TypeScript
    - [Overview](/workers/languages/typescript/)
    - [Examples ↗](/workers/examples/?languages=TypeScript)

  - Python Workers
    - [Overview Beta](/workers/languages/python/)
    - [The Basics](/workers/languages/python/basics/)
    - [How Python Workers Work](/workers/languages/python/how-python-workers-work/)
    - [Foreign Function Interface (FFI)](/workers/languages/python/ffi/)
    - [Standard Library](/workers/languages/python/stdlib/)
    - [Examples](/workers/languages/python/examples/)
    - Packages
      - [Overview](/workers/languages/python/packages/)
      - [FastAPI](/workers/languages/python/packages/fastapi/)
      - [Langchain](/workers/languages/python/packages/langchain/)

  - Rust
    - [Overview Beta](/workers/languages/rust/)
    - [Supported crates](/workers/languages/rust/crates/)

- Platform
  - [Overview](/workers/platform/)
  - [Pricing](/workers/platform/pricing/)
  - Changelog
    - [Overview](/workers/platform/changelog/)
    - [Workers (Historic)](/workers/platform/changelog/historical-changelog/)
    - [Wrangler ↗](https://github.com/cloudflare/workers-sdk/releases)

  - [Limits](/workers/platform/limits/)
  - [Choose a data or storage product](/workers/platform/storage-options/)
  - [Betas](/workers/platform/betas/)
  - [Deploy to Cloudflare buttons](/workers/platform/deploy-buttons/)
  - [Built with Cloudflare button](/workers/platform/built-with-cloudflare/)
  - [Known issues](/workers/platform/known-issues/)
  - [Workers for Platforms ↗](/cloudflare-for-platforms/workers-for-platforms/)
  - [Infrastructure as Code (IaC)](/workers/platform/infrastructure-as-code/)

- Reference
  - [How the Cache works](/workers/reference/how-the-cache-works/)
  - [How Workers works](/workers/reference/how-workers-works/)
  - [Migrate from Service Workers to ES Modules](/workers/reference/migrate-to-module-workers/)
  - [Protocols](/workers/reference/protocols/)
  - [Security model](/workers/reference/security-model/)

- [Glossary](/workers/glossary/)
- Agent resources
  - [Agent setup ↗](/agent-setup/)
  - [Cloudflare Skills ↗](https://github.com/cloudflare/skills)
  - [Code Mode MCP Server ↗](https://github.com/cloudflare/mcp)
  - [Domain-specific MCP Servers ↗](https://github.com/cloudflare/mcp-server-cloudflare)
  - [Workers llms.txt ↗](/workers/llms.txt)
  - [Workers llms-full.txt ↗](/workers/llms-full.txt)
  - [Cloudflare Docs llms.txt ↗](/llms.txt)
  - [Cloudflare Docs llms-full.txt ↗](/llms-full.txt)

[GitHub](https://github.com/cloudflare/cloudflare-docs)[X.com](https://x.com/cloudflare)[YouTube](https://www.youtube.com/cloudflare)

Select theme DarkLightAuto

On this page

- [Overview](#_top)
- [Migration](#migration)
  - [Frameworks](#frameworks)
  - [Project configuration](#project-configuration)
  - [Variables, secrets and bindings](#variables-secrets-and-bindings)
  - [Wrangler commands](#wrangler-commands)
  - [Builds](#builds)
  - [Preview environment](#preview-environment)
  - [Headers and redirects](#headers-and-redirects)
  - [pages.dev](#pagesdev)
  - [Custom domains](#custom-domains)
  - [Rollout](#rollout)
- [Migrate your project using an AI coding assistant](#migrate-your-project-using-an-ai-coding-assistant)
- [Compatibility matrix](#compatibility-matrix)

## On this page

- [Overview](#_top)
- [Migration](#migration)
  - [Frameworks](#frameworks)
  - [Project configuration](#project-configuration)
  - [Variables, secrets and bindings](#variables-secrets-and-bindings)
  - [Wrangler commands](#wrangler-commands)
  - [Builds](#builds)
  - [Preview environment](#preview-environment)
  - [Headers and redirects](#headers-and-redirects)
  - [pages.dev](#pagesdev)
  - [Custom domains](#custom-domains)
  - [Rollout](#rollout)
- [Migrate your project using an AI coding assistant](#migrate-your-project-using-an-ai-coding-assistant)
- [Compatibility matrix](#compatibility-matrix)

[Edit page](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/workers/static-assets/migration-guides/migrate-from-pages.mdx) [Report issue](https://github.com/cloudflare/cloudflare-docs/issues/new/choose)

1.  [Directory](/directory/)
2.  …
3.  [Workers](/workers/)
4.  [Static Assets](/workers/static-assets/)
5.  [Migration Guides](/workers/static-assets/migration-guides/)
6.  [Migrate from Pages to Workers](/workers/static-assets/migration-guides/migrate-from-pages/)

# Migrate from Pages to Workers

Copy as Markdown Copied! | [View as Markdown](index.md) | Agent setup | Docs for agents

You can deploy full-stack applications, including front-end static assets and back-end APIs, as well as server-side rendered pages (SSR), with [Cloudflare Workers](/workers/static-assets/).

Like Pages, requests for static assets on Workers are free, and [Pages Functions](#pages-functions) invocations are charged at the same rate as Workers, so you can expect [a similar cost structure](/workers/platform/pricing/#workers).

Unlike Pages, Workers has a distinctly broader set of features available to it, (including Durable Objects, Cron Triggers, and more comprehensive Observability). A complete list can be found at [the bottom of this page](#compatibility-matrix).

## Migration

[](#migration)

Migrating from Cloudflare Pages to Cloudflare Workers is often a straightforward process. The following are some of the most common steps you will need to take to migrate your project.

### Frameworks

[](#frameworks)

If your Pages project uses [a popular framework](/workers/framework-guides/), most frameworks already have adapters available for Cloudflare Workers. Switch out any Pages-specific adapters for the Workers equivalent and follow any guidance that they provide.

### Project configuration

[](#project-configuration)

If your project doesn't already have one, create a [Wrangler configuration file](/workers/wrangler/configuration/) (either `wrangler.jsonc`, `wrangler.json` or `wrangler.toml`) in the root of your project. The two mandatory fields are:

- [`name`](/workers/wrangler/configuration/#inheritable-keys)

  Set this to the name of the Worker you wish to deploy to. This can be the same as your existing Pages project name, so long as it conforms to Workers' name restrictions (e.g. max length).

- [`compatibility_date`](/workers/configuration/compatibility-dates/).

  If you were already using [Pages Functions](/pages/functions/wrangler-configuration/#inheritable-keys), set this to the same date configured there. Otherwise, set it to the current date.

#### Build output directory

[](#build-output-directory)

Where you previously would configure a "build output directory" for Pages (in either a [Wrangler configuration file](/pages/functions/wrangler-configuration/#inheritable-keys) or in [the Cloudflare dashboard](/pages/configuration/build-configuration/#build-commands-and-directories)), you must now set the [`assets.directory`](/workers/static-assets/binding/#directory) value for a Worker project.

Before, with **Cloudflare Pages**:

- [wrangler.jsonc](#tab-panel-9897)
- [wrangler.toml](#tab-panel-9898)

JSONC

    {  "name": "my-pages-project",  "pages_build_output_dir": "./dist/client/"}

TOML

    name = "my-pages-project"pages_build_output_dir = "./dist/client/"

Now, with **Cloudflare Workers**:

- [wrangler.jsonc](#tab-panel-9899)
- [wrangler.toml](#tab-panel-9900)

JSONC

    {  "name": "my-worker",  // Set this to today's date  "compatibility_date": "2026-05-21",  "assets": {    "directory": "./dist/client/"  }}

TOML

    name = "my-worker"# Set this to today's datecompatibility_date = "2026-05-21"
    [assets]directory = "./dist/client/"

Note

If your Worker will only contain assets and no Worker script, then you should remove the `"binding": "ASSETS"` field from your configuration file, since this is only valid if you have a Worker script indicated by a `"main"` property. See the [Assets binding](#assets-binding) section below.

#### Serving behavior

[](#serving-behavior)

Pages would automatically attempt to determine the type of project you deployed. It would look for `404.html` and `index.html` files as signals for whether the project was likely a [Single Page Application (SPA)](/pages/configuration/serving-pages/#single-page-application-spa-rendering) or if it should [serve custom 404 pages](/pages/configuration/serving-pages/#not-found-behavior).

In Workers, to prevent accidental misconfiguration, this behavior is explicit and [must be set up manually](/workers/static-assets/routing/).

For a Single Page Application (SPA):

- [wrangler.jsonc](#tab-panel-9901)
- [wrangler.toml](#tab-panel-9902)

JSONC

    {  "name": "my-worker",  // Set this to today's date  "compatibility_date": "2026-05-21",  "assets": {    "directory": "./dist/client/",    "not_found_handling": "single-page-application"  }}

TOML

    name = "my-worker"# Set this to today's datecompatibility_date = "2026-05-21"
    [assets]directory = "./dist/client/"not_found_handling = "single-page-application"

For custom 404 pages:

- [wrangler.jsonc](#tab-panel-9903)
- [wrangler.toml](#tab-panel-9904)

JSONC

    {  "name": "my-worker",  // Set this to today's date  "compatibility_date": "2026-05-21",  "assets": {    "directory": "./dist/client/",    "not_found_handling": "404-page"  }}

TOML

    name = "my-worker"# Set this to today's datecompatibility_date = "2026-05-21"
    [assets]directory = "./dist/client/"not_found_handling = "404-page"

##### Ignoring assets

[](#ignoring-assets)

Pages would automatically exclude some files and folders from being uploaded as static assets such as `node_modules`, `.DS_Store`, and `.git`. If you wish to also avoid uploading these files to Workers, you can create an [`.assetsignore` file](/workers/static-assets/binding/#ignoring-assets) in your project's static asset directory.

dist/client/.assetsignore

    **/node_modules**/.DS_Store**/.git

#### Pages Functions

[](#pages-functions)

##### Full-stack framework

[](#full-stack-framework)

If you use a full-stack framework powered by [Pages Functions](/pages/functions/), ensure you have [updated your framework](#frameworks) to target Workers instead of Pages.

##### Pages Functions with an "advanced mode" `_worker.js` file

[](#pages-functions-with-an-advanced-mode-_workerjs-file)

If you use Pages Functions with an ["advanced mode" `_worker.js` file](/pages/functions/advanced-mode/), you must first ensure this script doesn't get uploaded as a static asset. Either move `_worker.js` out of the static asset directory (recommended), or create [an `.assetsignore` file](/workers/static-assets/binding/#ignoring-assets) in the static asset directory and include `_worker.js` within it.

dist/client/.assetsignore

    _worker.js

Then, update your configuration file's `main` field to point to the location of this Worker script:

- [wrangler.jsonc](#tab-panel-9905)
- [wrangler.toml](#tab-panel-9906)

JSONC

    {  "name": "my-worker",  // Set this to today's date  "compatibility_date": "2026-05-21",  "main": "./dist/client/_worker.js", // or some other location if you moved the script out of the static asset directory  "assets": {    "directory": "./dist/client/"  }}

TOML

    name = "my-worker"# Set this to today's datecompatibility_date = "2026-05-21"main = "./dist/client/_worker.js"
    [assets]directory = "./dist/client/"

##### Pages Functions with a `functions/` folder

[](#pages-functions-with-a-functions-folder)

If you use **Pages Functions with a [folder of `functions/`](/pages/functions/)**, you must first compile these functions into a single Worker script with the [`wrangler pages functions build`](/workers/wrangler/commands/pages/#pages-functions-build) command.

npm yarn pnpm

    npx wrangler pages functions build --outdir=./dist/worker/

    yarn wrangler pages functions build --outdir=./dist/worker/

    pnpm wrangler pages functions build --outdir=./dist/worker/

Although this command will remain available to you to run at any time, we do recommend considering using another framework if you wish to continue to use file-based routing. [HonoX ↗](https://github.com/honojs/honox) is one popular option.

Once the Worker script has been compiled, you can update your configuration file's `main` field to point to the location it was built to:

- [wrangler.jsonc](#tab-panel-9907)
- [wrangler.toml](#tab-panel-9908)

JSONC

    {  "name": "my-worker",  // Set this to today's date  "compatibility_date": "2026-05-21",  "main": "./dist/worker/index.js",  "assets": {    "directory": "./dist/client/"  }}

TOML

    name = "my-worker"# Set this to today's datecompatibility_date = "2026-05-21"main = "./dist/worker/index.js"
    [assets]directory = "./dist/client/"

##### `_routes.json` and Pages Functions middleware

[](#_routesjson-and-pages-functions-middleware)

If you authored [a `_routes.json` file](/pages/functions/routing/#create-a-_routesjson-file) in your Pages project, or used [middleware](/pages/functions/middleware/) in Pages Functions, you must pay close attention to the configuration of your Worker script. Pages would default to serving your Pages Functions ahead of static assets and `_routes.json` and Pages Functions middleware allowed you to customize this behavior.

Workers, on the other hand, will default to serving static assets ahead of your Worker script, unless you have configured [`assets.run_worker_first`](/workers/static-assets/routing/worker-script/#run-your-worker-script-first). This option is required if you are, for example, performing any authentication checks or logging requests before serving static assets.

- [wrangler.jsonc](#tab-panel-9909)
- [wrangler.toml](#tab-panel-9910)

JSONC

    {  "name": "my-worker",  // Set this to today's date  "compatibility_date": "2026-05-21",  "main": "./dist/worker/index.js",  "assets": {    "directory": "./dist/client/",    "run_worker_first": true  }}

TOML

    name = "my-worker"# Set this to today's datecompatibility_date = "2026-05-21"main = "./dist/worker/index.js"
    [assets]directory = "./dist/client/"run_worker_first = true

##### Starting from scratch

[](#starting-from-scratch)

If you wish to, you can start a new Worker script from scratch and take advantage of all of Wrangler's and the latest runtime features (e.g. [`WorkerEntrypoint`s](/workers/runtime-apis/bindings/service-bindings/rpc/), [TypeScript support](/workers/languages/typescript/), [bundling](/workers/wrangler/bundling), etc.):

- [JavaScript](#tab-panel-9919)
- [TypeScript](#tab-panel-9920)

./worker/index.js

    import { WorkerEntrypoint } from "cloudflare:workers";
    export default class extends WorkerEntrypoint {  async fetch(request) {    return new Response("Hello, world!");  }}

./worker/index.ts

    import { WorkerEntrypoint } from "cloudflare:workers";
    export default class extends WorkerEntrypoint {  async fetch(request: Request) {    return new Response("Hello, world!");  }}

- [wrangler.jsonc](#tab-panel-9911)
- [wrangler.toml](#tab-panel-9912)

JSONC

    {  "name": "my-worker",  // Set this to today's date  "compatibility_date": "2026-05-21",  "main": "./worker/index.ts",  "assets": {    "directory": "./dist/client/"  }}

TOML

    name = "my-worker"# Set this to today's datecompatibility_date = "2026-05-21"main = "./worker/index.ts"
    [assets]directory = "./dist/client/"

#### Assets binding

[](#assets-binding)

Pages automatically provided [an `ASSETS` binding](/pages/functions/api-reference/#envassetsfetch) to access static assets from Pages Functions. In Workers, the name of this binding is customizable and it must be manually configured:

- [wrangler.jsonc](#tab-panel-9913)
- [wrangler.toml](#tab-panel-9914)

JSONC

    {  "name": "my-worker",  // Set this to today's date  "compatibility_date": "2026-05-21",  "main": "./worker/index.ts",  "assets": {    "directory": "./dist/client/",    "binding": "ASSETS"  }}

TOML

    name = "my-worker"# Set this to today's datecompatibility_date = "2026-05-21"main = "./worker/index.ts"
    [assets]directory = "./dist/client/"binding = "ASSETS"

#### Runtime

[](#runtime)

If you had customized [placement](/workers/configuration/placement/), or set a [compatibility date](/workers/configuration/compatibility-dates/) or any [compatibility flags](/workers/configuration/compatibility-flags/) in your Pages project, you can define the same in your Wrangler configuration file:

- [wrangler.jsonc](#tab-panel-9921)
- [wrangler.toml](#tab-panel-9922)

JSONC

    {  "name": "my-worker",  // Set this to today's date  "compatibility_date": "2026-05-21",  "compatibility_flags": ["nodejs_compat"],  "main": "./worker/index.ts",  "placement": {    "mode": "smart"  },  "assets": {    "directory": "./dist/client/",    "binding": "ASSETS"  }}

TOML

    name = "my-worker"# Set this to today's datecompatibility_date = "2026-05-21"compatibility_flags = [ "nodejs_compat" ]main = "./worker/index.ts"
    [placement]mode = "smart"
    [assets]directory = "./dist/client/"binding = "ASSETS"

### Variables, secrets and bindings

[](#variables-secrets-and-bindings)

[Variables](/workers/configuration/environment-variables/) and [bindings](/workers/runtime-apis/bindings/) can be set in your [Wrangler configuration file](/workers/wrangler/configuration/) and are made available in your Worker's environment (`env`). [Secrets](/workers/configuration/secrets/) can uploaded with Wrangler or defined in the Cloudflare dashboard for [production](/workers/configuration/secrets/#adding-secrets-to-your-project) and [`.dev.vars` for local development](/workers/configuration/secrets/#local-development-with-secrets).

If you are [using Workers Builds](#builds), ensure you also [configure any variables relevant to the build environment there](/workers/ci-cd/builds/configuration/). Unlike Pages, Workers does not share the same set of runtime and build-time variables.

### Wrangler commands

[](#wrangler-commands)

Where previously you used [`wrangler pages dev`](/workers/wrangler/commands/pages/#pages-dev) and [`wrangler pages deploy`](/workers/wrangler/commands/general/#deploy), now instead use [`wrangler dev`](/workers/wrangler/commands/general/#dev) and [`wrangler deploy`](/workers/wrangler/commands/general/#deploy). Additionally, if you are using a Vite-powered framework, [our new Vite plugin](/workers/vite-plugin/) may be able offer you an even simpler development experience.

Wrangler uses a different default port for the local development

`wrangler pages dev` will, by default, expose the local development server at `http://localhost:8788`, whereas `wrangler dev` will expose it at `http://localhost:8787/`.

You can customize the port using `--port`.

### Builds

[](#builds)

If you are using Pages' built-in CI/CD system, you can swap this for Workers Builds by first [connecting your repository to Workers Builds](/workers/ci-cd/builds/#get-started) and then [disabling automatic deployments on your Pages project](/pages/configuration/git-integration/#disable-automatic-deployments).

### Preview environment

[](#preview-environment)

Pages automatically creates a preview environment for each project, and can be independently configured.

To get a similar experience in Workers, you must:

1.  Ensure [preview URLs](/workers/configuration/previews/) are enabled (they are on by default).
    - [wrangler.jsonc](#tab-panel-9917)
    - [wrangler.toml](#tab-panel-9918)

    JSONC

        {  "name": "my-worker",  // Set this to today's date  "compatibility_date": "2026-05-21",  "main": "./worker/index.ts",  "assets": {    "directory": "./dist/client/"  },  "preview_urls": true}

    TOML

        name = "my-worker"# Set this to today's datecompatibility_date = "2026-05-21"main = "./worker/index.ts"preview_urls = true
        [assets]directory = "./dist/client/"

2.  [Enable non-production branch builds](/workers/ci-cd/builds/build-branches/#configure-non-production-branch-builds) in Workers Builds.

Optionally, you can also [protect these preview URLs with Cloudflare Access](/workers/configuration/previews/#manage-access-to-preview-urls).

Note

Unlike Pages, Workers does not natively support defining different bindings in production vs. non-production builds. This is something we are actively exploring, but in the meantime, you may wish to consider using [Wrangler Environments](/workers/wrangler/environments/) and an [appropriate Workers Build configuration](/workers/ci-cd/builds/advanced-setups/#wrangler-environments) to achieve this.

### Headers and redirects

[](#headers-and-redirects)

[`_headers`](/workers/static-assets/headers/) and [`_redirects`](/workers/static-assets/redirects/) files are supported natively in Workers with static assets. Ensure that, just like for Pages, these files are included in the static asset directory of your project.

### pages.dev

[](#pagesdev)

Where previously you were offered a `pages.dev` subdomain for your Pages project, you can now configure a personalized `workers.dev` subdomain for all of your Worker projects. You can [configure this subdomain in the Cloudflare dashboard](/workers/configuration/routing/workers-dev/#configure-workersdev), and opt-in to using it with the [`workers_dev` option](/workers/configuration/routing/workers-dev/#disabling-workersdev-in-the-wrangler-configuration-file) in your configuration file.

- [wrangler.jsonc](#tab-panel-9915)
- [wrangler.toml](#tab-panel-9916)

JSONC

    {  "name": "my-worker",  // Set this to today's date  "compatibility_date": "2026-05-21",  "main": "./worker/index.ts",  "workers_dev": true}

TOML

    name = "my-worker"# Set this to today's datecompatibility_date = "2026-05-21"main = "./worker/index.ts"workers_dev = true

### Custom domains

[](#custom-domains)

If your domain's nameservers are managed by Cloudflare, you can, like Pages, configure a [custom domain](/workers/configuration/routing/custom-domains/) for your Worker. Additionally, you can also configure a [route](/workers/configuration/routing/routes/) if you only wish to some subset of paths to be served by your Worker.

Note

Unlike Pages, Workers does not support any domain whose nameservers are not managed by Cloudflare.

### Rollout

[](#rollout)

Once you have validated the behavior of Worker, and are satisfied with the development workflows, and have migrated all of your production traffic, you can delete your Pages project in the Cloudflare dashboard or with Wrangler:

npm yarn pnpm

    npx wrangler pages project delete

    yarn wrangler pages project delete

    pnpm wrangler pages project delete

## Migrate your project using an AI coding assistant

[](#migrate-your-project-using-an-ai-coding-assistant)

You can add the following [experimental prompt ↗](https://developers.cloudflare.com/workers/prompts/pages-to-workers.txt) in your preferred coding assistant (e.g. Claude Code, Cursor) to make your project compatible with Workers:

    https://developers.cloudflare.com/workers/prompts/pages-to-workers.txt

You can also use the Cloudflare Documentation [MCP server ↗](https://github.com/cloudflare/mcp-server-cloudflare/tree/main/apps/docs-vectorize) in your coding assistant to provide better context to your LLM when building with Workers, which includes this prompt when you ask to migrate from Pages to Workers.

## Compatibility matrix

[](#compatibility-matrix)

This compatibility matrix compares the features of Workers and Pages. Unless otherwise stated below, what works in Pages works in Workers, and what works in Workers works in Pages. Think something is missing from this list? [Open a pull request ↗](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/workers/static-assets/compatibility-matrix.mdx) or [create a GitHub issue ↗](https://github.com/cloudflare/cloudflare-docs/issues/new).

**Legend**  
✅: Supported  
⏳: Coming soon  
🟡: Unsupported, workaround available  
❌: Unsupported

Workers

Pages

**Writing, Testing, and Deploying Code**

[Cloudflare Vite plugin](/workers/vite-plugin/)

✅

❌

[Rollbacks](/workers/configuration/versions-and-deployments/rollbacks/)

✅

✅

[Gradual Deployments](/workers/configuration/versions-and-deployments/)

✅

❌

[Preview URLs](/workers/configuration/previews)

✅

✅

[Testing tools](/workers/testing)

✅

✅

[Local Development](/workers/development-testing/)

✅

✅

[Remote Development (`--remote`)](/workers/wrangler/commands/)

✅

❌

[Quick Editor in Dashboard ↗](https://blog.cloudflare.com/improved-quick-edit)

✅

❌

**Static Assets**

[Early Hints](/pages/configuration/early-hints/)

❌

✅

[Custom HTTP headers for static assets](/workers/static-assets/headers/)

✅

✅

[Middleware](/workers/static-assets/binding/#run_worker_first)

✅ [1](#user-content-fn-1)

✅

[Redirects](/workers/static-assets/redirects/)

✅

✅

[Smart Placement](/workers/configuration/placement/)

✅

✅

[Serve assets on a path](/workers/static-assets/routing/advanced/serving-a-subdirectory/)

✅

❌

**Observability**

[Workers Logs](/workers/observability/)

✅

❌

[Logpush](/workers/observability/logs/logpush/)

✅

❌

[Tail Workers](/workers/observability/logs/tail-workers/)

✅

❌

[Real-time logs](/workers/observability/logs/real-time-logs/)

✅

✅

[Source Maps](/workers/observability/source-maps/)

✅

❌

**Runtime APIs & Compute Models**

[Node.js Compatibility Mode](/workers/runtime-apis/nodejs/)

✅

✅

[Durable Objects](/durable-objects/api/)

✅

🟡 [2](#user-content-fn-2)

[Cron Triggers](/workers/configuration/cron-triggers/)

✅

❌

**Bindings**

[AI](/workers-ai/get-started/workers-wrangler/#2-connect-your-worker-to-workers-ai)

✅

✅

[Analytics Engine](/analytics/analytics-engine)

✅

✅

[Assets](/workers/static-assets/binding/)

✅

✅

[Browser Run](/browser-run/)

✅

✅

[D1](/d1/worker-api/)

✅

✅

[Email Workers](/email-routing/email-workers/send-email-workers/)

✅

❌

[Environment Variables](/workers/configuration/environment-variables/)

✅

✅

[Hyperdrive](/hyperdrive/)

✅

✅

[Image Resizing](/images/optimization/transformations/bindings/)

✅

❌

[KV](/kv/)

✅

✅

[mTLS](/workers/runtime-apis/bindings/mtls/)

✅

✅

[Queue Producers](/queues/configuration/configure-queues/#producer-worker-configuration)

✅

✅

[Queue Consumers](/queues/configuration/configure-queues/#consumer-worker-configuration)

✅

❌

[R2](/r2/)

✅

✅

[Rate Limiting](/workers/runtime-apis/bindings/rate-limit/)

✅

❌

[Secrets](/workers/configuration/secrets/)

✅

✅

[Service bindings](/workers/runtime-apis/bindings/service-bindings/)

✅

✅

[Vectorize](/vectorize/get-started/intro/#3-bind-your-worker-to-your-index)

✅

✅

**Builds (CI/CD)**

[Monorepos](/workers/ci-cd/builds/advanced-setups/)

✅

✅

[Build Watch Paths](/workers/ci-cd/builds/build-watch-paths/)

✅

✅

[Build Caching](/workers/ci-cd/builds/build-caching/)

✅

✅

[Deploy Hooks](/workers/ci-cd/builds/deploy-hooks/)

✅

✅

[Branch Deploy Controls](/pages/configuration/branch-build-controls/)

🟡 [3](#user-content-fn-3)

✅

[Custom Branch Aliases](/pages/how-to/custom-branch-aliases/)

⏳

✅

**Pages Functions**

[File-based Routing](/pages/functions/routing/)

🟡 [4](#user-content-fn-4)

✅

[Pages Plugins](/pages/functions/plugins/)

🟡 [5](#user-content-fn-5)

✅

**Domain Configuration**

[Custom domains](/workers/configuration/routing/custom-domains/#add-a-custom-domain)

✅

✅

[Custom subdomains](/workers/configuration/routing/custom-domains/#set-up-a-custom-domain-in-the-dashboard)

✅

✅

[Custom domains outside Cloudflare zones](/pages/configuration/custom-domains/#add-a-custom-cname-record)

❌

✅

[Non-root routes](/workers/configuration/routing/routes/)

✅

❌

## Footnotes

[](#footnote-label)

1.  Middleware can be configured via the [`run_worker_first`](/workers/static-assets/binding/#run_worker_first) option, but is charged as a normal Worker invocation. We plan to explore additional related options in the future. [↩](#user-content-fnref-1)
2.  To [use Durable Objects with your Cloudflare Pages project](/pages/functions/bindings/#durable-objects), you must create a separate Worker with a Durable Object and then declare a binding to it in both your Production and Preview environments. Using Durable Objects with Workers is simpler and recommended. [↩](#user-content-fnref-2)
3.  Workers Builds supports enabling [non-production branch builds](/workers/ci-cd/builds/build-branches/#configure-non-production-branch-builds), though does not yet have the same level of configurability as Pages does. [↩](#user-content-fnref-3)
4.  Workers [supports popular frameworks](/workers/framework-guides/), many of which implement file-based routing. Additionally, you can use Wrangler to [compile your folder of `functions/`](#pages-functions-with-a-functions-folder) into a Worker to help ease the migration from Pages to Workers. [↩](#user-content-fnref-4)
5.  As in 4, Wrangler can [compile your Pages Functions into a Worker](#pages-functions-with-a-functions-folder). Or if you are starting from scratch, everything that is possible with Pages Functions can also be achieved by adding code to your Worker or by using framework-specific plugins for relevant third party tools. [↩](#user-content-fnref-5)

- **Resources**
- [API](/api/)
- [New to Cloudflare?](/fundamentals/)
- [Directory](/directory/)
- [Sponsorships](/sponsorships/)
- [Open Source](https://github.com/cloudflare)

- **Support**
- [Help Center](https://support.cloudflare.com/)
- [System Status](https://www.cloudflarestatus.com/)
- [Compliance](https://www.cloudflare.com/trust-hub/compliance-resources/)
- [GDPR](https://www.cloudflare.com/trust-hub/gdpr/)

- **Company**
- [cloudflare.com](https://www.cloudflare.com/)
- [Our team](https://www.cloudflare.com/people/)
- [Careers](https://www.cloudflare.com/careers/)

- **Tools**
- [Cloudflare Radar](https://radar.cloudflare.com/)
- [Speed Test](https://speed.cloudflare.com/)
- [Is BGP Safe Yet?](https://isbgpsafeyet.com/)
- [RPKI Toolkit](https://rpki.cloudflare.com/)
- [Certificate Transparency](https://ct.cloudflare.com/)

- **Community**
- [X](https://x.com/cloudflare)
- [Discord](http://discord.cloudflare.com/)
- [YouTube](https://www.youtube.com/cloudflare)
- [GitHub](https://github.com/cloudflare/cloudflare-docs)

- © 2026 Cloudflare, Inc.
- [Privacy Policy](https://www.cloudflare.com/privacypolicy/)
- [Terms of Use](https://www.cloudflare.com/website-terms/)
- [Report Security Issues](https://www.cloudflare.com/disclosure/)
- [Trademark](https://www.cloudflare.com/trademark/)
- ![privacy options](/_astro/privacyoptions.BWXSiJOZ_1zBYaH.svg) Cookie Settings

[Previous
Billing and Limitations](/workers/static-a
