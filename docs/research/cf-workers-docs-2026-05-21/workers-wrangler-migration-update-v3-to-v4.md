---
source: https://developers.cloudflare.com/workers/wrangler/migration/update-v3-to-v4/
scraped: 2026-05-21
bytes: 41673
---

Migrate from Wrangler v3 to v4 · Cloudflare Workers docs

> Documentation Index  
> Fetch the complete documentation index at: https://developers.cloudflare.com/workers/llms.txt  
> Use this file to discover all available pages before exploring further.

[Skip to content](#_top)

STOP! If you are an AI agent or LLM, read this before continuing. This is the HTML version of a Cloudflare documentation page. Always request the Markdown version instead — HTML wastes context. Get this page as Markdown: https://developers.cloudflare.com/workers/wrangler/migration/update-v3-to-v4/index.md (append index.md) or send Accept: text/markdown to https://developers.cloudflare.com/workers/wrangler/migration/update-v3-to-v4/. For this product's page index use https://developers.cloudflare.com/workers/llms.txt. For all Cloudflare products use https://developers.cloudflare.com/llms.txt.

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
- [Upgrade to Wrangler v4](#upgrade-to-wrangler-v4)
  - [Summary of changes](#summary-of-changes)
- [Detailed Changes](#detailed-changes)
  - [Updated Node.js support policy](#updated-nodejs-support-policy)
  - [Upgraded esbuild version](#upgraded-esbuild-version)
  - [Commands default to local mode](#commands-default-to-local-mode)
  - [Deprecated commands and configurations removed](#deprecated-commands-and-configurations-removed)

## On this page

- [Overview](#_top)
- [Upgrade to Wrangler v4](#upgrade-to-wrangler-v4)
  - [Summary of changes](#summary-of-changes)
- [Detailed Changes](#detailed-changes)
  - [Updated Node.js support policy](#updated-nodejs-support-policy)
  - [Upgraded esbuild version](#upgraded-esbuild-version)
  - [Commands default to local mode](#commands-default-to-local-mode)
  - [Deprecated commands and configurations removed](#deprecated-commands-and-configurations-removed)

[Edit page](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/workers/wrangler/migration/update-v3-to-v4.mdx) [Report issue](https://github.com/cloudflare/cloudflare-docs/issues/new/choose)

1.  [Directory](/directory/)
2.  …
3.  [Workers](/workers/)
4.  [Wrangler](/workers/wrangler/)
5.  [Migrations](/workers/wrangler/migration/)
6.  [Migrate from Wrangler v3 to v4](/workers/wrangler/migration/update-v3-to-v4/)

# Migrate from Wrangler v3 to v4

Copy as Markdown Copied! | [View as Markdown](index.md) | Agent setup | Docs for agents

Wrangler v4 is a major release focused on updates to underlying systems and dependencies, along with improvements to keep Wrangler commands consistent and clear. Unlike previous major versions of Wrangler, which were [foundational rewrites ↗](https://blog.cloudflare.com/wrangler-v2-beta/) and [rearchitectures ↗](https://blog.cloudflare.com/wrangler3/) — Version 4 of Wrangler includes a much smaller set of changes. If you use Wrangler today, your workflow is very unlikely to change.

While many users should expect a no-op upgrade, the following sections outline the more significant changes and steps for migrating where necessary.

## Upgrade to Wrangler v4

[](#upgrade-to-wrangler-v4)

To upgrade to the latest version of Wrangler v4 within your Worker project, run:

npm yarn pnpm bun

    npm i -D wrangler@4

    yarn add -D wrangler@4

    pnpm add -D wrangler@4

    bun add -d wrangler@4

After upgrading, you can verify the installation:

npm yarn pnpm

    npx wrangler --version

    yarn wrangler --version

    pnpm wrangler --version

### Summary of changes

[](#summary-of-changes)

- **Updated Node.js support policy:** Node.js v16, which reached End-of-Life in 2022, is no longer supported in Wrangler v4. Wrangler now follows Node.js's [official support lifecycle ↗](https://nodejs.org/en/about/previous-releases).
- **Upgraded esbuild version**: Wrangler uses [esbuild ↗](https://esbuild.github.io/) to bundle Worker code before deploying it, and was previously pinned to esbuild v0.17.19. Wrangler v4 uses esbuild v0.24, which could impact dynamic wildcard imports. Going forward, Wrangler will be periodically updating the `esbuild` version included with Wrangler, and since `esbuild` is a pre-1.0.0 tool, this may sometimes include breaking changes to how bundling works. In particular, we may bump the `esbuild` version in a Wrangler minor version.
- **Commands default to local mode**: All commands that can run in either local or remote mode now default to local, requiring a `--remote` flag for API queries.
- **Deprecated commands and configurations removed:** Legacy commands, flags, and configurations are removed.

## Detailed Changes

[](#detailed-changes)

### Updated Node.js support policy

[](#updated-nodejs-support-policy)

Wrangler now supports only Node.js versions that align with [Node.js's official lifecycle ↗](https://nodejs.org/en/about/previous-releases):

- **Supported**: Current, Active LTS, Maintenance LTS
- **No longer supported:** Node.js v16 (EOL in 2022)

Wrangler tests no longer run on v16, and users still on this version may encounter unsupported behavior. Users still using Node.js v16 must upgrade to a supported version to continue receiving support and compatibility with Wrangler.

Am I affected?

Run the following command to check your Node.js version:

Terminal window

    node --version

**You need to take action if** your version starts with `v16` or `v18` (for example, `v16.20.0` or `v18.20.0`).

**To upgrade Node.js**, refer to the [Wrangler system requirements](/workers/wrangler/install-and-update/). Cloudflare recommends using the latest LTS version of Node.js.

### Upgraded esbuild version

[](#upgraded-esbuild-version)

Wrangler v4 upgrades esbuild from **v0.17.19** to **v0.24**, bringing improvements (such as the ability to use the `using` keyword with RPC) and changes to bundling behavior:

- **Dynamic imports:** Wildcard imports (for example, `import('./data/' + kind + '.json')`) now automatically include all matching files in the bundle.

Users relying on wildcard dynamic imports may see unwanted files bundled. Prior to esbuild v0.19, `import` statements with dynamic paths (like `import('./data/' + kind + '.json')`) did not bundle all files matching the glob pattern (`*.json`). Only files explicitly referenced or included using `find_additional_modules` were bundled. With esbuild v0.19, wildcard imports now automatically bundle all files matching the glob pattern. This could result in unwanted files being bundled, so users might want to avoid wildcard dynamic imports and use explicit imports instead.

### Commands default to local mode

[](#commands-default-to-local-mode)

All commands now run in **local mode by default.** Wrangler has many commands for accessing resources like KV and R2, but the commands were previously inconsistent in whether they ran in a local or remote environment. For example, D1 defaulted to querying a local datastore, and required the `--remote` flag to query via the API. KV, on the other hand, previously defaulted to querying via the API (implicitly using the `--remote` flag) and required a `--local` flag to query a local datastore. In order to make the behavior consistent across Wrangler, each command now uses the `--local` flag by default, and requires an explicit `--remote` flag to query via the API.

For example:

- **Previous Behavior (Wrangler v3):** `wrangler kv key get` queried remotely by default.
- **New Behavior (Wrangler v4):** `wrangler kv key get` queries locally unless `--remote` is specified.

Those using `wrangler kv key` and/or `wrangler r2 object` commands to query or write to their data store will need to add the `--remote` flag in order to replicate previous behavior.

Am I affected?

Check if you use any of these commands in scripts, CI/CD pipelines, or manual workflows:

**KV commands:**

- `wrangler kv key get`
- `wrangler kv key put`
- `wrangler kv key delete`
- `wrangler kv key list`
- `wrangler kv bulk put`
- `wrangler kv bulk delete`

**R2 commands:**

- `wrangler r2 object get`
- `wrangler r2 object put`
- `wrangler r2 object delete`

**You need to take action if:**

- You run these commands expecting them to interact with your remote/production data.
- You have scripts or CI/CD pipelines that use these commands without the `--local` or `--remote` flag.

Search your codebase and CI/CD configs:

Terminal window

    grep -rE "wrangler (kv|r2)" --include="*.sh" --include="*.yml" --include="*.yaml" --include="Makefile" --include="package.json" .

**What to do:**

Add `--remote` to commands that should interact with your Cloudflare account:

Terminal window

    # Before (Wrangler v3 - queried remote by default)wrangler kv key get --binding MY_KV "my-key"
    # After (Wrangler v4 - must specify --remote)wrangler kv key get --binding MY_KV "my-key" --remote

### Deprecated commands and configurations removed

[](#deprecated-commands-and-configurations-removed)

All previously deprecated features in [Wrangler v2](/workers/wrangler/deprecations/#wrangler-v2) and in [Wrangler v3](/workers/wrangler/deprecations/#wrangler-v3) are now removed. Additionally, the following features that were deprecated during the Wrangler v3 release are also now removed:

- Legacy Assets (using `wrangler dev/deploy --legacy-assets` or the `legacy_assets` config file property). Instead, we recommend you [migrate to Workers Static Assets](/workers/static-assets/).
- Legacy Node.js compatibility (using `wrangler dev/deploy --node-compat` or the `node_compat` config file property). Instead, use the [`nodejs_compat` compatibility flag](/workers/runtime-apis/nodejs/). This includes the functionality from legacy `node_compat` polyfills and natively implemented Node.js APIs.
- `wrangler version`. Instead, use `wrangler --version` to check the current version of Wrangler.
- `getBindingsProxy()` (via `import { getBindingsProxy } from "wrangler"`). Instead, use the [`getPlatformProxy()` API](/workers/wrangler/api/#getplatformproxy), which takes exactly the same arguments.
- `usage_model`. This no longer has any effect, after the [rollout of Workers Standard Pricing ↗](https://blog.cloudflare.com/workers-pricing-scale-to-zero/).

Am I affected?

**Check your Wrangler configuration file** (`wrangler.toml`, `wrangler.json`, or `wrangler.jsonc`) for deprecated settings:

Terminal window

    # For TOML filesgrep -E "(legacy_assets|node_compat|usage_model)\s*=" wrangler.toml
    # For JSON filesgrep -E "\"(legacy_assets|node_compat|usage_model)\"" wrangler.json wrangler.jsonc

**Check your commands and scripts** for deprecated flags:

Terminal window

    grep -rE "wrangler.*(--legacy-assets|--node-compat)" --include="*.sh" --include="*.yml" --include="*.yaml" --include="Makefile" --include="package.json" .

**Check for deprecated API usage** in your code:

Terminal window

    grep -rE "getBindingsProxy" --include="*.js" --include="*.ts" --include="*.mjs" .

**You need to take action if you find any of the following:**

Deprecated

Replacement

`legacy_assets` config or `--legacy-assets` flag

[Migrate to Workers Static Assets](/workers/static-assets/)

`node_compat` config or `--node-compat` flag

Use the [`nodejs_compat` compatibility flag](/workers/runtime-apis/nodejs/)

`usage_model` config

Remove it (no longer has any effect)

`wrangler version` command

Use `wrangler --version`

`getBindingsProxy()` import

Use [`getPlatformProxy()`](/workers/wrangler/api/#getplatformproxy) (same arguments)

`wrangler publish` command

Use `wrangler deploy`

`wrangler generate` command

Use `npm create cloudflare@latest`

`wrangler pages publish` command

Use `wrangler pages deploy`

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
Environments](/workers/wrangler/environments/) [Next  
Migrate from Wrangler v2 to v3](/workers/wrangler/migration/update-v2-to-v3/)

[Edit page](https://github.com/cloudflare/cloudflare-docs/edit/production/
