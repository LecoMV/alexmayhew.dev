---
source: https://developers.cloudflare.com/workers/wrangler/api/
scraped: 2026-05-21
bytes: 53533
---

API · Cloudflare Workers docs

> Documentation Index  
> Fetch the complete documentation index at: https://developers.cloudflare.com/workers/llms.txt  
> Use this file to discover all available pages before exploring further.

[Skip to content](#_top)

STOP! If you are an AI agent or LLM, read this before continuing. This is the HTML version of a Cloudflare documentation page. Always request the Markdown version instead — HTML wastes context. Get this page as Markdown: https://developers.cloudflare.com/workers/wrangler/api/index.md (append index.md) or send Accept: text/markdown to https://developers.cloudflare.com/workers/wrangler/api/. For this product's page index use https://developers.cloudflare.com/workers/llms.txt. For all Cloudflare products use https://developers.cloudflare.com/llms.txt.

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
- [experimental_generateTypes](#experimental_generatetypes)
  - [Syntax](#syntax)
  - [Parameters](#parameters)
  - [Return Type](#return-type)
  - [Usage](#usage)
- [unstable_startWorker](#unstable_startworker)
- [unstable_dev](#unstable_dev)
  - [Constructor](#constructor)
  - [Parameters](#parameters-1)
  - [Return Type](#return-type-1)
  - [Usage](#usage-1)
- [getPlatformProxy](#getplatformproxy)
  - [Syntax](#syntax-1)
  - [Parameters](#parameters-2)
  - [Return Type](#return-type-2)
  - [Usage](#usage-2)
  - [Supported bindings](#supported-bindings)

## On this page

- [Overview](#_top)
- [experimental_generateTypes](#experimental_generatetypes)
  - [Syntax](#syntax)
  - [Parameters](#parameters)
  - [Return Type](#return-type)
  - [Usage](#usage)
- [unstable_startWorker](#unstable_startworker)
- [unstable_dev](#unstable_dev)
  - [Constructor](#constructor)
  - [Parameters](#parameters-1)
  - [Return Type](#return-type-1)
  - [Usage](#usage-1)
- [getPlatformProxy](#getplatformproxy)
  - [Syntax](#syntax-1)
  - [Parameters](#parameters-2)
  - [Return Type](#return-type-2)
  - [Usage](#usage-2)
  - [Supported bindings](#supported-bindings)

[Edit page](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/workers/wrangler/api.mdx) [Report issue](https://github.com/cloudflare/cloudflare-docs/issues/new/choose)

1.  [Directory](/directory/)
2.  …
3.  [Workers](/workers/)
4.  [Wrangler](/workers/wrangler/)
5.  [API](/workers/wrangler/api/)

# API

Copy as Markdown Copied! | [View as Markdown](index.md) | Agent setup | Docs for agents

Wrangler offers APIs to programmatically interact with your Cloudflare Workers.

- [`experimental_generateTypes`](#experimental_generatetypes) - Generate TypeScript type definitions from your Worker configuration.
- [`unstable_startWorker`](#unstable_startworker) - Start a server for running integration tests against your Worker.
- [`unstable_dev`](#unstable_dev) - Start a server for running either end-to-end (e2e) or integration tests against your Worker.
- [`getPlatformProxy`](#getplatformproxy) - Get proxies and values for emulating the Cloudflare Workers platform in a Node.js process.

## `experimental_generateTypes`

[](#experimental_generatetypes)

Generate TypeScript type definitions from your Worker configuration. This API uses the same core logic as the `wrangler types` CLI command, so outputs stay aligned between the CLI and programmatic API.

Unlike the CLI command, `experimental_generateTypes` does not write to disk automatically. Instead, it returns the generated type content as structured strings for you to handle as needed.

Note

The `experimental_generateTypes()` function has an `experimental_` prefix because the API is experimental and may change in the future.

### Syntax

[](#syntax)

TypeScript

    import { experimental_generateTypes } from "wrangler";
    const result = await experimental_generateTypes(options);

### Parameters

[](#parameters)

- `options` `object` optional
  - Optional options object mirroring the `wrangler types` CLI flags:
    - `config` `string | string[]`

      Path to the Wrangler configuration file to use. Can be an array for multi-config type resolution.

    - `env` `string`

      Name of the Wrangler environment to generate types for.

    - `envFile` `string[]`

      Paths to `.env` files to load when inferring local variables and secrets.

    - `envInterface` `string`

      Name of the generated environment interface. Defaults to `Env`.

    - `includeEnv` `boolean`

      Whether to include environment and bindings types in the output. Defaults to `true`.

    - `includeRuntime` `boolean`

      Whether to include runtime types in the output. Defaults to `true`.

    - `path` `string`

      Path to the declaration file for generated types. Defaults to `worker-configuration.d.ts`.

    - `strictVars` `boolean`

      Whether to generate strict literal and union types for variables. Defaults to `true`.

### Return Type

[](#return-type)

`experimental_generateTypes()` returns a `Promise` resolving to an object containing the following fields:

- `content` `string`
  - Combined formatted output containing all generated sections, including headers and both env and runtime types.

- `env` `string | null`
  - Generated environment and bindings types, or `null` when env types are excluded.

- `path` `string`
  - Target declaration file path associated with this generation run.

- `runtime` `string | null`
  - Generated runtime types, or `null` when runtime types are excluded.

### Usage

[](#usage)

You can use `experimental_generateTypes` to generate types programmatically and write them to disk yourself, or pass them to other tools:

TypeScript

    import { experimental_generateTypes } from "wrangler";import * as fs from "node:fs";
    const result = await experimental_generateTypes({  config: "wrangler.json",  includeRuntime: true,  includeEnv: true,});
    // Write the combined content to the path specified in optionsfs.writeFileSync(result.path, result.content, "utf-8");

To generate only env types without runtime types:

TypeScript

    const result = await experimental_generateTypes({  includeRuntime: false,});

To generate types for a specific environment with a custom interface name:

TypeScript

    const result = await experimental_generateTypes({  env: "staging",  envInterface: "StagingEnv",  path: "./types/staging.d.ts",});

## `unstable_startWorker`

[](#unstable_startworker)

This API exposes the internals of Wrangler's dev server, and allows you to customise how it runs. For example, you could use `unstable_startWorker()` to run integration tests against your Worker. This example uses `node:test`, but should apply to any testing framework:

JavaScript

    import assert from "node:assert";import test, { after, before, describe } from "node:test";import { unstable_startWorker } from "wrangler";
    describe("worker", () => {  let worker;
      before(async () => {    worker = await unstable_startWorker({ config: "wrangler.json" });  });
      test("hello world", async () => {    assert.strictEqual(      await (await worker.fetch("http://example.com")).text(),      "Hello world",    );  });
      after(async () => {    await worker.dispose();  });});

## `unstable_dev`

[](#unstable_dev)

Start an HTTP server for testing your Worker.

Once called, `unstable_dev` will return a `fetch()` function for invoking your Worker without needing to know the address or port, as well as a `stop()` function to shut down the HTTP server.

By default, `unstable_dev` will perform integration tests against a local server. If you wish to perform an e2e test against a preview Worker, pass `local: false` in the `options` object when calling the `unstable_dev()` function. Note that e2e tests can be significantly slower than integration tests.

Note

The `unstable_dev()` function has an `unstable_` prefix because the API is experimental and may change in the future. We recommend migrating to the `unstable_startWorker()` API, documented above.

If you have been using `unstable_dev()` for integration testing and want to migrate to Cloudflare's Vitest integration, refer to the [Migrate from `unstable_dev` migration guide](/workers/testing/vitest-integration/migration-guides/migrate-from-unstable-dev/) for more information.

### Constructor

[](#constructor)

JavaScript

    const worker = await unstable_dev(script, options);

### Parameters

[](#parameters-1)

- `script` `string`
  - A string containing a path to your Worker script, relative to your Worker project's root directory.

- `options` `object` optional
  - Optional options object containing `wrangler dev` configuration settings.
  - Include an `experimental` object inside `options` to access experimental features such as `disableExperimentalWarning`.
    - Set `disableExperimentalWarning` to `true` to disable Wrangler's warning about using `unstable_` prefixed APIs.

### Return Type

[](#return-type-1)

`unstable_dev()` returns an object containing the following methods:

- `fetch()` `Promise<Response>`
  - Send a request to your Worker. Returns a Promise that resolves with a [`Response`](/workers/runtime-apis/response) object.
  - Refer to [`Fetch`](/workers/runtime-apis/fetch/).

- `stop()` `Promise<void>`
  - Shuts down the dev server.

### Usage

[](#usage-1)

When initiating each test suite, use a `beforeAll()` function to start `unstable_dev()`. The `beforeAll()` function is used to minimize overhead: starting the dev server takes a few hundred milliseconds, starting and stopping for each individual test adds up quickly, slowing your tests down.

In each test case, call `await worker.fetch()`, and check that the response is what you expect.

To wrap up a test suite, call `await worker.stop()` in an `afterAll` function.

#### Single Worker example

[](#single-worker-example)

- [JavaScript](#tab-panel-10027)
- [TypeScript](#tab-panel-10028)

JavaScript

    const { unstable_dev } = require("wrangler");
    describe("Worker", () => {  let worker;
      beforeAll(async () => {    worker = await unstable_dev("src/index.js", {      experimental: { disableExperimentalWarning: true },    });  });
      afterAll(async () => {    await worker.stop();  });
      it("should return Hello World", async () => {    const resp = await worker.fetch();    const text = await resp.text();    expect(text).toMatchInlineSnapshot(`"Hello World!"`);  });});

TypeScript

    import { unstable_dev } from "wrangler";import type { UnstableDevWorker } from "wrangler";
    describe("Worker", () => {  let worker: UnstableDevWorker;
      beforeAll(async () => {    worker = await unstable_dev("src/index.ts", {      experimental: { disableExperimentalWarning: true },    });  });
      afterAll(async () => {    await worker.stop();  });
      it("should return Hello World", async () => {    const resp = await worker.fetch();    const text = await resp.text();    expect(text).toMatchInlineSnapshot(`"Hello World!"`);  });});

#### Multi-Worker example

[](#multi-worker-example)

You can test Workers that call other Workers. In the below example, we refer to the Worker that calls other Workers as the parent Worker, and the Worker being called as a child Worker.

If you shut down the child Worker prematurely, the parent Worker will not know the child Worker exists and your tests will fail.

- [JavaScript](#tab-panel-10029)
- [TypeScript](#tab-panel-10030)

JavaScript

    import { unstable_dev } from "wrangler";
    describe("multi-worker testing", () => {  let childWorker;  let parentWorker;
      beforeAll(async () => {    childWorker = await unstable_dev("src/child-worker.js", {      config: "src/child-wrangler.toml",      experimental: { disableExperimentalWarning: true },    });    parentWorker = await unstable_dev("src/parent-worker.js", {      config: "src/parent-wrangler.toml",      experimental: { disableExperimentalWarning: true },    });  });
      afterAll(async () => {    await childWorker.stop();    await parentWorker.stop();  });
      it("childWorker should return Hello World itself", async () => {    const resp = await childWorker.fetch();    const text = await resp.text();    expect(text).toMatchInlineSnapshot(`"Hello World!"`);  });
      it("parentWorker should return Hello World by invoking the child worker", async () => {    const resp = await parentWorker.fetch();    const parsedResp = await resp.text();    expect(parsedResp).toEqual("Parent worker sees: Hello World!");  });});

TypeScript

    import { unstable_dev } from "wrangler";import type { UnstableDevWorker } from "wrangler";
    describe("multi-worker testing", () => {  let childWorker: UnstableDevWorker;  let parentWorker: UnstableDevWorker;
      beforeAll(async () => {    childWorker = await unstable_dev("src/child-worker.js", {      config: "src/child-wrangler.toml",      experimental: { disableExperimentalWarning: true },    });    parentWorker = await unstable_dev("src/parent-worker.js", {      config: "src/parent-wrangler.toml",      experimental: { disableExperimentalWarning: true },    });  });
      afterAll(async () => {    await childWorker.stop();    await parentWorker.stop();  });
      it("childWorker should return Hello World itself", async () => {    const resp = await childWorker.fetch();    const text = await resp.text();    expect(text).toMatchInlineSnapshot(`"Hello World!"`);  });
      it("parentWorker should return Hello World by invoking the child worker", async () => {    const resp = await parentWorker.fetch();    const parsedResp = await resp.text();    expect(parsedResp).toEqual("Parent worker sees: Hello World!");  });});

## `getPlatformProxy`

[](#getplatformproxy)

The `getPlatformProxy` function provides a way to obtain an object containing proxies (to **local** `workerd` bindings) and emulations of Cloudflare Workers specific values, allowing the emulation of such in a Node.js process.

Warning

`getPlatformProxy` is, by design, to be used exclusively in Node.js applications. `getPlatformProxy` cannot be run inside the Workers runtime.

One general use case for getting a platform proxy is for emulating bindings in applications targeting Workers, but running outside the Workers runtime (for example, framework local development servers running in Node.js), or for testing purposes (for example, ensuring code properly interacts with a type of binding).

Note

Binding proxies provided by this function are a best effort emulation of the real production bindings. Although they are designed to be as close as possible to the real thing, there might be slight differences and inconsistencies between the two.

### Syntax

[](#syntax-1)

JavaScript

    const platform = await getPlatformProxy(options);

### Parameters

[](#parameters-2)

- `options` `object` optional
  - Optional options object containing preferences for the bindings:
    - `environment` string

      The environment to use.

    - `configPath` string

      The path to the config file to use.

      If no path is specified, the default behavior is to search from the current directory up the filesystem for a [Wrangler configuration file](/workers/wrangler/configuration/) to use.

      **Note:** this field is optional but if a path is specified it must point to a valid file on the filesystem.

    - `persist` boolean | `{ path: string }`

      Indicates if and where to persist the bindings data. If `true` or `undefined`, defaults to the same location used by Wrangler, so data can be shared between it and the caller. If `false`, no data is persisted to or read from the filesystem.

      **Note:** If you use `wrangler`'s `--persist-to` option, note that this option adds a subdirectory called `v3` under the hood while `getPlatformProxy`'s `persist` does not. For example, if you run `wrangler dev --persist-to ./my-directory`, to reuse the same location using `getPlatformProxy`, you will have to specify: `persist: { path: "./my-directory/v3" }`.

    - `remoteBindings` boolean optional (default: \`true\`)

      Whether or not [remote bindings](/workers/development-testing/#remote-bindings) should be enabled.

### Return Type

[](#return-type-2)

`getPlatformProxy()` returns a `Promise` resolving to an object containing the following fields.

- `env` `Record<string, unknown>`
  - Object containing proxies to bindings that can be used in the same way as production bindings. This matches the shape of the `env` object passed as the second argument to modules-format workers. These proxy to binding implementations run inside `workerd`.
  - TypeScript Tip: `getPlatformProxy<Env>()` is a generic function. You can pass the shape of the bindings record as a type argument to get proper types without `unknown` values.

- `cf` IncomingRequestCfProperties read-only
  - Mock of the `Request`'s `cf` property, containing data similar to what you would see in production.

- `ctx` object
  - Mock object containing implementations of the [`waitUntil`](/workers/runtime-apis/context/#waituntil) and [`passThroughOnException`](/workers/runtime-apis/context/#passthroughonexception) functions that do nothing.

- `caches` object
  - Emulation of the [Workers `caches` runtime API](/workers/runtime-apis/cache/).
  - For the time being, all cache operations do nothing. A more accurate emulation will be made available soon.

- `dispose()` () => `Promise<void>`
  - Terminates the underlying `workerd` process.
  - Call this after the platform proxy is no longer required by the program. If you are running a long running process (such as a dev server) that can indefinitely make use of the proxy, you do not need to call this function.

### Usage

[](#usage-2)

The `getPlatformProxy` function uses bindings found in the [Wrangler configuration file](/workers/wrangler/configuration/). For example, if you have an [environment variable](/workers/configuration/environment-variables/#add-environment-variables-via-wrangler) configuration set up in the Wrangler configuration file:

- [wrangler.jsonc](#tab-panel-10031)
- [wrangler.toml](#tab-panel-10032)

JSONC

    {  "vars": {    "MY_VARIABLE": "test"  }}

TOML

    [vars]MY_VARIABLE = "test"

You can access the bindings by importing `getPlatformProxy` like this:

JavaScript

    import { getPlatformProxy } from "wrangler";
    const { env } = await getPlatformProxy();

To access the value of the `MY_VARIABLE` binding add the following to your code:

JavaScript

    console.log(`MY_VARIABLE = ${env.MY_VARIABLE}`);

This will print the following output: `MY_VARIABLE = test`.

### Supported bindings

[](#supported-bindings)

All supported bindings found in your [Wrangler configuration file](/workers/wrangler/configuration/) are available to you via `env`.

The bindings supported by `getPlatformProxy` are:

- [Environment variables](/workers/configuration/environment-variables/)
- [Service bindings](/workers/runtime-apis/bindings/service-bindings/)
- [KV namespace bindings](/kv/api/)
- [R2 bucket bindings](/r2/api/workers/workers-api-reference/)
- [Queue bindings](/queues/configuration/javascript-apis/)
- [D1 database bindings](/d1/worker-api/)
- [Hyperdrive bindings](/hyperdrive)

  Hyperdrive values are simple passthrough ones

  Values provided by hyperdrive bindings such as `connectionString` and `host` do not have a valid meaning outside of a `workerd` process. This means that Hyperdrive proxies return passthrough values, which are values corresponding to the database connection provided by the user. Otherwise, it would return values which would be unusable from within node.js.

- [Workers AI bindings](/workers-ai/get-started/workers-wrangler/#2-connect-your-worker-to-workers-ai)

  Workers AI local development usage charges

  Using Workers AI always accesses your Cloudflare account in order to run AI models and will incur usage charges even in local development.

- [Durable Object bindings](/durable-objects/api/)
  - To use a Durable Object binding with `getPlatformProxy`, always specify a [`script_name`](/workers/wrangler/configuration/#durable-objects).

    For example, you might have the following binding in a Wrangler configuration file read by `getPlatformProxy`.
    - [wrangler.jsonc](#tab-panel-10035)
    - [wrangler.toml](#tab-panel-10036)

    JSONC

        {  "durable_objects": {    "bindings": [      {        "name": "MyDurableObject",        "class_name": "MyDurableObject",        "script_name": "external-do-worker"      }    ]  }}

    TOML

        [[durable_objects.bindings]]name = "MyDurableObject"class_name = "MyDurableObject"script_name = "external-do-worker"

    You will need to declare your Durable Object `"MyDurableObject"` in another Worker, called `external-do-worker` in this example.

    ./external-do-worker/src/index.ts

        export class MyDurableObject extends DurableObject {  // Your DO code goes here}
        export default {  fetch() {    // Doesn't have to do anything, but a DO cannot be the default export    return new Response("Hello, world!");  },};

    That Worker also needs a Wrangler configuration file that looks like this:
    - [wrangler.jsonc](#tab-panel-10033)
    - [wrangler.toml](#tab-panel-10034)

    JSONC

        {  "name": "external-do-worker",  "main": "src/index.ts",  "compatibility_date": "XXXX-XX-XX"}

    TOML

        name = "external-do-worker"main = "src/index.ts"compatibility_date = "XXXX-XX-XX"

    If you are not using RPC with your Durable Object, you can run a separate Wrangler dev session alongside your framework development server.

    Otherwise, you can build your application and run both Workers in the same Wrangler dev session.

    If you are using Pages run:

    npm yarn pnpm

        npx wrangler pages dev -c path/to/pages/wrangler.jsonc -c path/to/external-do-worker/wrangler.jsonc

        yarn wrangler pages dev -c path/to/pages/wrangler.jsonc -c path/to/external-do-worker/wrangler.jsonc

        pnpm wrangler pages dev -c path/to/pages/wrangler.jsonc -c path/to/external-do-worker/wrangler.jsonc

    If you are using Workers with Assets run:

    npm yarn pnpm

        npx wrangler dev -c path/to/workers-assets/wrangler.jsonc -c path/to/external-do-worker/wrangler.jsonc

        yarn wrangler dev -c path/to/workers-assets/wrangler.jsonc -c path/to/external-do-worker/wrangler.jsonc

        pnpm wrangler dev -c path/to/workers-assets/wrangler.jsonc -c path/to/external-do-worker/wrangler.jsonc

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
Install/Update Wrangler](/workers/wrangler/install-and-update/) [Next  
Commands](/workers/wrangler/commands/)

[Edit page](https://github.com/cloudflare/cloudflare-docs/edit/pro
