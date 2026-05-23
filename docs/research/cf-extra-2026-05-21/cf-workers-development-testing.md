---
source: https://developers.cloudflare.com/workers/development-testing/
scraped: 2026-05-21
---

Development & testing · Cloudflare Workers docs

> Documentation Index  
> Fetch the complete documentation index at: https://developers.cloudflare.com/workers/llms.txt  
> Use this file to discover all available pages before exploring further.

[Skip to content](#_top)

STOP! If you are an AI agent or LLM, read this before continuing. This is the HTML version of a Cloudflare documentation page. Always request the Markdown version instead — HTML wastes context. Get this page as Markdown: https://developers.cloudflare.com/workers/development-testing/index.md (append index.md) or send Accept: text/markdown to https://developers.cloudflare.com/workers/development-testing/. For this product's page index use https://developers.cloudflare.com/workers/llms.txt. For all Cloudflare products use https://developers.cloudflare.com/llms.txt.

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
- [Core concepts](#core-concepts)
  - [Worker execution vs Bindings](#worker-execution-vs-bindings)
- [Local development](#local-development)
  - [Defaults](#defaults)
  - [Bindings during local development](#bindings-during-local-development)
- [Remote bindings](#remote-bindings)
  - [Example configuration](#example-configuration)
  - [Integration with environments](#integration-with-environments)
  - [Recommended remote bindings](#recommended-remote-bindings)
  - [Unsupported remote bindings](#unsupported-remote-bindings)
  - [Important Considerations](#important-considerations)
  - [API](#api)
- [wrangler dev --remote (Legacy)](#wrangler-dev---remote-legacy)
  - [When to use Remote development](#when-to-use-remote-development)
  - [Considerations](#considerations)
  - [Limitations](#limitations)

## On this page

- [Overview](#_top)
- [Core concepts](#core-concepts)
  - [Worker execution vs Bindings](#worker-execution-vs-bindings)
- [Local development](#local-development)
  - [Defaults](#defaults)
  - [Bindings during local development](#bindings-during-local-development)
- [Remote bindings](#remote-bindings)
  - [Example configuration](#example-configuration)
  - [Integration with environments](#integration-with-environments)
  - [Recommended remote bindings](#recommended-remote-bindings)
  - [Unsupported remote bindings](#unsupported-remote-bindings)
  - [Important Considerations](#important-considerations)
  - [API](#api)
- [wrangler dev --remote (Legacy)](#wrangler-dev---remote-legacy)
  - [When to use Remote development](#when-to-use-remote-development)
  - [Considerations](#considerations)
  - [Limitations](#limitations)

[Edit page](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/workers/development-testing/index.mdx) [Report issue](https://github.com/cloudflare/cloudflare-docs/issues/new/choose)

1.  [Directory](/directory/)
2.  …
3.  [Workers](/workers/)
4.  [Development & testing](/workers/development-testing/)

# Development & testing

Copy as Markdown Copied! | [View as Markdown](index.md) | Agent setup | Docs for agents

You can build, run, and test your Worker code on your own local machine before deploying it to Cloudflare's network. This is made possible through [Miniflare](/workers/testing/miniflare/), a simulator that executes your Worker code using the same runtime used in production, [`workerd` ↗](https://github.com/cloudflare/workerd).

[By default](/workers/development-testing/#defaults), your Worker's bindings [connect to locally simulated resources](/workers/development-testing/#bindings-during-local-development), but can be configured to interact with the real, production resource with [remote bindings](/workers/development-testing/#remote-bindings).

## Core concepts

[](#core-concepts)

### Worker execution vs Bindings

[](#worker-execution-vs-bindings)

When developing Workers, it's important to understand two distinct concepts:

- **Worker execution**: Where your Worker code actually runs (on your local machine vs on Cloudflare's infrastructure).
- [**Bindings**](/workers/runtime-apis/bindings/): How your Worker interacts with Cloudflare resources (like [KV namespaces](/kv), [R2 buckets](/r2), [D1 databases](/d1), [Queues](/queues/), [Durable Objects](/durable-objects/), etc). In your Worker code, these are accessed via the `env` object (such as `env.MY_KV`).

## Local development

[](#local-development)

**You can start a local development server using:**

1.  The Cloudflare Workers CLI [**Wrangler**](/workers/wrangler/), using the built-in [`wrangler dev`](/workers/wrangler/commands/general/#dev) command.

npm yarn pnpm

    npx wrangler dev

    yarn wrangler dev

    pnpm wrangler dev

2.  [**Vite** ↗](https://vite.dev/), using the [**Cloudflare Vite plugin**](/workers/vite-plugin/).

npm yarn pnpm

    npx vite dev

    yarn vite dev

    pnpm vite dev

Both Wrangler and the Cloudflare Vite plugin use [Miniflare](/workers/testing/miniflare/) under the hood, and are developed and maintained by the Cloudflare team. For guidance on choosing when to use Wrangler versus Vite, see our guide [Choosing between Wrangler & Vite](/workers/development-testing/wrangler-vs-vite/).

- [Get started with Wrangler](/workers/wrangler/install-and-update/)
- [Get started with the Cloudflare Vite plugin](/workers/vite-plugin/get-started/)

### Defaults

[](#defaults)

By default, running `wrangler dev` / `vite dev` (when using the [Vite plugin](/workers/vite-plugin/get-started/)) means that:

- Your Worker code runs on your local machine.
- All resources your Worker is bound to in your [Wrangler configuration](/workers/wrangler/configuration/) are simulated locally.
- The local `workerd` runtime runs with `TZ=UTC` so that `Date` and `Intl` APIs inside your Worker observe UTC, matching the production Cloudflare runtime regardless of your machine's timezone.

### Bindings during local development

[](#bindings-during-local-development)

[Bindings](/workers/runtime-apis/bindings/) are interfaces that allow your Worker to interact with various Cloudflare resources (like [KV namespaces](/kv), [R2 buckets](/r2), [D1 databases](/d1), [Queues](/queues/), [Durable Objects](/durable-objects/), etc). In your Worker code, these are accessed via the `env` object (such as `env.MY_KV`).

During local development, your Worker code interacts with these bindings using the exact same API calls (such as `env.MY_KV.put()`) as it would in a deployed environment. These local resources are initially empty, but you can populate them with data, as documented in [Adding local data](/workers/development-testing/local-data/).

- By default, bindings connect to **local resource simulations** (except for [AI bindings](/workers-ai/configuration/bindings/), as AI models always run remotely).
- You can override this default behavior and **connect to the remote resource** on a per-binding basis with [remote bindings](/workers/development-testing/#remote-bindings). This lets you connect to real, production resources while still running your Worker code locally.
- When using `wrangler dev`, you can temporarily disable all [remote bindings](/workers/development-testing/#remote-bindings) (and connect only to local resources) by providing the `--local` flag (i.e. `wrangler dev --local`)

## Remote bindings

[](#remote-bindings)

**Remote bindings** are bindings that are configured to connect to the deployed, remote resource during local development _instead_ of the locally simulated resource. Remote bindings are supported by [**Wrangler**](/workers/wrangler/), the [**Cloudflare Vite plugin**](/workers/vite-plugin/), and the `@cloudflare/vitest-pool-workers` package. You can configure remote bindings by setting `remote: true` in the binding definition.

### Example configuration

[](#example-configuration)

- [wrangler.jsonc](#tab-panel-9368)
- [wrangler.toml](#tab-panel-9369)

JSONC

    {  "name": "my-worker",  // Set this to today's date  "compatibility_date": "2026-05-21",
      "r2_buckets": [    {      "bucket_name": "screenshots-bucket",      "binding": "screenshots_bucket",      "remote": true,    },  ],}

TOML

    name = "my-worker"# Set this to today's datecompatibility_date = "2026-05-21"
    [[r2_buckets]]bucket_name = "screenshots-bucket"binding = "screenshots_bucket"remote = true

When remote bindings are configured, your Worker still **executes locally**, only the underlying resources your bindings connect to change. For all bindings marked with `remote: true`, Miniflare will route its operations (such as `env.MY_KV.put()`) to the deployed resource. All other bindings not explicitly configured with `remote: true` continue to use their default local simulations.

### Integration with environments

[](#integration-with-environments)

Remote Bindings work well together with [Workers Environments](/workers/wrangler/environments). To protect production data, you can create a development or staging environment and specify different resources in your [Wrangler configuration](/workers/wrangler/configuration/) than you would use for production.

**For example:**

- [wrangler.jsonc](#tab-panel-9380)
- [wrangler.toml](#tab-panel-9381)

JSONC

    {  "name": "my-worker",  // Set this to today's date  "compatibility_date": "2026-05-21",
      "env": {    "production": {      "r2_buckets": [        {          "bucket_name": "screenshots-bucket",          "binding": "screenshots_bucket",        },      ],    },    "staging": {      "r2_buckets": [        {          "bucket_name": "preview-screenshots-bucket",          "binding": "screenshots_bucket",          "remote": true,        },      ],    },  },}

TOML

    name = "my-worker"# Set this to today's datecompatibility_date = "2026-05-21"
    [[env.production.r2_buckets]]bucket_name = "screenshots-bucket"binding = "screenshots_bucket"
    [[env.staging.r2_buckets]]bucket_name = "preview-screenshots-bucket"binding = "screenshots_bucket"remote = true

Running `wrangler dev -e staging` (or `CLOUDFLARE_ENV=staging vite dev`) with the above configuration means that:

- Your Worker code runs locally
- All calls made to `env.screenshots_bucket` will use the `preview-screenshots-bucket` resource, rather than the production `screenshots-bucket`.

### Recommended remote bindings

[](#recommended-remote-bindings)

We recommend configuring specific bindings to connect to their remote counterparts. These services often rely on Cloudflare's network infrastructure or have complex backends that are not fully simulated locally.

The following bindings are recommended to have `remote: true` in your Wrangler configuration:

#### [Browser Run](/workers/wrangler/configuration/#browser-run):

[](#browser-run)

To interact with a real headless browser for rendering. There is no current local simulation for Browser Run.

- [wrangler.jsonc](#tab-panel-9366)
- [wrangler.toml](#tab-panel-9367)

JSONC

    {  "browser": {    "binding": "MY_BROWSER",    "remote": true  },}

TOML

    [browser]binding = "MY_BROWSER"remote = true

#### [Workers AI](/workers/wrangler/configuration/#workers-ai):

[](#workers-ai)

To utilize actual AI models deployed on Cloudflare's network for inference. There is no current local simulation for Workers AI.

- [wrangler.jsonc](#tab-panel-9370)
- [wrangler.toml](#tab-panel-9371)

JSONC

    {  "ai": {    "binding": "AI",    "remote": true  },}

TOML

    [ai]binding = "AI"remote = true

#### [Vectorize](/workers/wrangler/configuration/#vectorize-indexes):

[](#vectorize)

To connect to your production Vectorize indexes for accurate vector search and similarity operations. There is no current local simulation for Vectorize.

- [wrangler.jsonc](#tab-panel-9372)
- [wrangler.toml](#tab-panel-9373)

JSONC

    {  "vectorize": [    {      "binding": "MY_VECTORIZE_INDEX",      "index_name": "my-prod-index",      "remote": true    }  ],}

TOML

    [[vectorize]]binding = "MY_VECTORIZE_INDEX"index_name = "my-prod-index"remote = true

#### [mTLS](/workers/wrangler/configuration/#mtls-certificates):

[](#mtls)

To verify that the certificate exchange and validation process work as expected. There is no current local simulation for mTLS bindings.

- [wrangler.jsonc](#tab-panel-9376)
- [wrangler.toml](#tab-panel-9377)

JSONC

    {  "mtls_certificates": [    {      "binding": "MY_CLIENT_CERT_FETCHER",      "certificate_id": "<YOUR_UPLOADED_CERT_ID>",      "remote": true      }  ]}

TOML

    [[mtls_certificates]]binding = "MY_CLIENT_CERT_FETCHER"certificate_id = "<YOUR_UPLOADED_CERT_ID>"remote = true

#### [Images](/workers/wrangler/configuration/#images):

[](#images)

To connect to a high-fidelity version of the Images API, and verify that all transformations work as expected. Local simulation for Cloudflare Images is [limited with only a subset of features](/images/optimization/transformations/bindings/#interact-with-your-images-binding-locally).

- [wrangler.jsonc](#tab-panel-9374)
- [wrangler.toml](#tab-panel-9375)

JSONC

    {  "images": {    "binding": "IMAGES" ,    "remote": true  }}

TOML

    [images]binding = "IMAGES"remote = true

Note

If `remote: true` is not specified for Browser Run, Vectorize, mTLS, or Images, Cloudflare **will issue a warning**. This prompts you to consider enabling it for a more production-like testing experience.

If a Workers AI binding has `remote` set to `false`, Cloudflare will **produce an error**. If the property is omitted, Cloudflare will connect to the remote resource and issue a warning to add the property to configuration.

#### [Dispatch Namespaces](/cloudflare-for-platforms/workers-for-platforms/reference/local-development/):

[](#dispatch-namespaces)

Workers for Platforms users can configure `remote: true` in dispatch namespace binding definitions:

- [wrangler.jsonc](#tab-panel-9378)
- [wrangler.toml](#tab-panel-9379)

JSONC

    {  "dispatch_namespaces": [    {      "binding": "DISPATCH_NAMESPACE",      "namespace": "testing",      "remote":true    }  ]}

TOML

    [[dispatch_namespaces]]binding = "DISPATCH_NAMESPACE"namespace = "testing"remote = true

This allows you to run your [dynamic dispatch Worker](/cloudflare-for-platforms/workers-for-platforms/how-workers-for-platforms-works/#dynamic-dispatch-worker) locally, while connecting it to your remote dispatch namespace binding. This allows you to test changes to your core dispatching logic against real, deployed [user Workers](/cloudflare-for-platforms/workers-for-platforms/how-workers-for-platforms-works/#user-workers).

### Unsupported remote bindings

[](#unsupported-remote-bindings)

Certain bindings are not supported for remote connections (i.e. with `remote: true`) during local development. These will always use local simulations or local values.

If `remote: true` is specified in Wrangler configuration for any of the following unsupported binding types, Cloudflare **will issue an error**. See [all supported and unsupported bindings for remote bindings](/workers/development-testing/bindings-per-env/).

- [**Durable Objects**](/workers/wrangler/configuration/#durable-objects): Enabling remote connections for Durable Objects may be supported in the future, but currently will always run locally. However, using Durable Objects in combination with remote bindings is possible. Refer to [Using remote resources with Durable Objects and Workflows](#using-remote-resources-with-durable-objects-and-workflows) below.
- [**Workflows**](/workflows/): Enabling remote connections for Workflows may be supported in the future, but currently will only run locally. However, using Workflows in combination with remote bindings is possible. Refer to [Using remote resources with Durable Objects and Workflows](#using-remote-resources-with-durable-objects-and-workflows) below.
- [**Environment Variables (`vars`)**](/workers/wrangler/configuration/#environment-variables): Environment variables are intended to be distinct between local development and deployed environments. They are easily configurable locally (such as in a `.dev.vars` file or directly in Wrangler configuration).
- [**Secrets**](/workers/wrangler/configuration/#secrets): Like environment variables, secrets are expected to have different values in local development versus deployed environments for security reasons. Use `.dev.vars` for local secret management.
- [**Static Assets**](/workers/wrangler/configuration/#assets) Static assets are always served from your local disk during development for speed and direct feedback on changes.
- [**Version Metadata**](/workers/runtime-apis/bindings/version-metadata/): Since your Worker code is running locally, version metadata (like commit hash, version tags) associated with a specific deployed version is not applicable or accurate.
- [**Analytics Engine**](/analytics/analytics-engine/): Local development sessions typically don't contribute data directly to production Analytics Engine.
- [**Hyperdrive**](/workers/wrangler/configuration/#hyperdrive): This is being actively worked on, but is currently unsupported.
- [**Rate Limiting**](/workers/runtime-apis/bindings/rate-limit/#configuration): Local development sessions typically should not share or affect rate limits of your deployed Workers. Rate limiting logic should be tested against local simulations.

Note

If you have use-cases for connecting to any of the remote resources above, please [open a feature request ↗](https://github.com/cloudflare/workers-sdk/issues) in our [`workers-sdk` repository ↗](https://github.com/cloudflare/workers-sdk).

#### Using remote resources with Durable Objects and Workflows

[](#using-remote-resources-with-durable-objects-and-workflows)

While Durable Object and Workflow bindings cannot currently be remote, you can still use them during local development and have them interact with remote resources.

There are two recommended patterns for this:

- **Local Durable Objects/Workflows with remote bindings:**

  When you enable remote bindings in your [Wrangler configuration](/workers/wrangler/configuration), your locally running Durable Objects and Workflows can access remote resources. This allows such bindings, although run locally, to interact with remote resources during local development.

- **Accessing remote Durable Objects/Workflows via service bindings:**

  To interact with remote Durable Object or Workflow instances, deploy a Worker that defines those. Then, in your local Worker, configure a remote [service binding](/workers/runtime-apis/bindings/service-bindings/) pointing to the deployed Worker. Your local Worker will be then able to interact with the remote deployed Worker, which in turn can communicate with the remote Durable Objects/Workflows. Using this method, you can create a communication channel via the remote service binding, effectively using the deployed Worker as a proxy interface to the remote bindings during local development.

### Important Considerations

[](#important-considerations)

- **Data modification**: Operations (writes, deletes, updates) on bindings connected remotely will affect your actual data in the targeted Cloudflare resource (be it preview or production).
- **Billing**: Interactions with remote Cloudflare services through these connections will incur standard operational costs for those services (such as KV operations, R2 storage/operations, AI requests, D1 usage).
- **Network latency**: Expect network latency for operations on these remotely connected bindings, as they involve communication over the internet.
- **CI and non-interactive environments**: If your worker uses [Cloudflare Access](/cloudflare-one/), Wrangler must authenticate with Access when connecting to remote bindings. In non-interactive environments such as CI/CD pipelines, set the `CLOUDFLARE_ACCESS_CLIENT_ID` and `CLOUDFLARE_ACCESS_CLIENT_SECRET` [system environment variables](/workers/wrangler/system-environment-variables/) to authenticate using an [Access Service Token](/cloudflare-one/access-controls/service-credentials/service-tokens/). Without these variables, Wrangler throws an error instead of launching the interactive `cloudflared access login` flow.

### API

[](#api)

Wrangler provides programmatic utilities to help tooling authors support remote binding connections when running Workers code with [Miniflare](/workers/testing/miniflare/).

**Key APIs include:**

- [`startRemoteProxySession`](#startRemoteProxySession): Starts a proxy session that allows interaction with remote bindings.
- [`unstable_convertConfigBindingsToStartWorkerBindings`](#unstable_convertconfigbindingstostartworkerbindings): Utility for converting binding definitions.
- [`experimental_maybeStartOrUpdateProxySession`](#experimental_maybestartorupdatemixedmodesession): Convenience function to easily start or update a proxy session.

#### `startRemoteProxySession`

[](#startremoteproxysession)

This function starts a proxy session for a given set of bindings. It accepts options to control session behavior, including an `auth` option with your Cloudflare account ID and API token for remote binding access.

It returns an object with:

- `ready` `Promise<void>` : Resolves when the session is ready.
- `dispose` `() => Promise<void>` : Stops the session.
- `updateBindings` `(bindings: StartDevWorkerInput['bindings']) => Promise<void>` : Updates session bindings.
- `remoteProxyConnectionString` `remoteProxyConnectionString` : String to pass to Miniflare for remote binding access.

#### `unstable_convertConfigBindingsToStartWorkerBindings`

[](#unstable_convertconfigbindingstostartworkerbindings)

The `unstable_readConfig` utility returns an `Unstable_Config` object which includes the definition of the bindings included in the configuration file. These bindings definitions are however not directly compatible with `startRemoteProxySession`. It can be quite convenient to however read the binding declarations with `unstable_readConfig` and then pass them to `startRemoteProxySession`, so for this wrangler exposes `unstable_convertConfigBindingsToStartWorkerBindings` which is a simple utility to convert the bindings in an `Unstable_Config` object into a structure that can be passed to `startRemoteProxySession`.

Note

This type conversion is temporary. In the future, the types will be unified so you can pass the config object directly to `startRemoteProxySession`.

#### `maybeStartOrUpdateRemoteProxySession`

[](#maybestartorupdateremoteproxysession)

This wrapper simplifies proxy session management. It takes:

- An object that contains either:
  - the path to a Wrangler configuration and a potential target environment
  - the name of the Worker and the bindings it is using
- The current proxy session details (this parameter can be set to `null` or not being provided if none).
- Potentially the auth data to use for the remote proxy session.

It returns an object with the proxy session details if started or updated, or `null` if no proxy session is needed.

The function:

- Based on the first argument prepares the input arguments for the proxy session.
- If there are no remote bindings to be used (nor a pre-existing proxy session) it returns null, signaling that no proxy session is needed.
- If the details of an existing proxy session have been provided it updates the proxy session accordingly.
- Otherwise if starts a new proxy session.
- Returns the proxy session details (that can later be passed as the second argument to `maybeStartOrUpdateRemoteProxySession`).

#### Example

[](#example)

Here's a basic example of using Miniflare with `maybeStartOrUpdateRemoteProxySession` to provide a local dev session with remote bindings. This example uses a single hardcoded KV binding.

- [JavaScript](#tab-panel-9382)
- [TypeScript](#tab-panel-9383)

JavaScript

    import { Miniflare, MiniflareOptions } from "miniflare";import { maybeStartOrUpdateRemoteProxySession } from "wrangler";
    let mf;
    let remoteProxySessionDetails = null;
    async function startOrUpdateDevSession() {  remoteProxySessionDetails = await maybeStartOrUpdateRemoteProxySession(    {      bindings: {        MY_KV: {          type: "kv_namespace",          id: "kv-id",          remote: true,        },      },    },    remoteProxySessionDetails,  );
      const miniflareOptions = {    scriptPath: "./worker.js",    kvNamespaces: {      MY_KV: {        id: "kv-id",        remoteProxyConnectionString:          remoteProxySessionDetails?.session.remoteProxyConnectionString,      },    },  };
      if (!mf) {    mf = new Miniflare(miniflareOptions);  } else {    mf.setOptions(miniflareOptions);  }}
    // ... tool logic that invokes `startOrUpdateDevSession()` ...
    // ... once the dev session is no longer needed run// `remoteProxySessionDetails?.session.dispose()`

TypeScript

    import { Miniflare, MiniflareOptions } from "miniflare";import { maybeStartOrUpdateRemoteProxySession } from "wrangler";
    let mf: Miniflare | null;
    let remoteProxySessionDetails: Awaited<  ReturnType<typeof maybeStartOrUpdateRemoteProxySession>> | null = null;
    async function startOrUpdateDevSession() {  remoteProxySessionDetails = await maybeStartOrUpdateRemoteProxySession(    {      bindings: {        MY_KV: {          type: "kv_namespace",          id: "kv-id",          remote: true,        },      },    },    remoteProxySessionDetails,  );
      const miniflareOptions: MiniflareOptions = {    scriptPath: "./worker.js",    kvNamespaces: {      MY_KV: {        id: "kv-id",        remoteProxyConnectionString:          remoteProxySessionDetails?.session.remoteProxyConnectionString,      },    },  };
      if (!mf) {    mf = new Miniflare(miniflareOptions);  } else {    mf.setOptions(miniflareOptions);  }}
    // ... tool logic that invokes `startOrUpdateDevSession()` ...
    // ... once the dev session is no longer needed run// `remoteProxySessionDetails?.session.dispose()`

## `wrangler dev --remote` (Legacy)

[](#wrangler-dev---remote-legacy)

Separate from Miniflare-powered local development, Wrangler also offers a fully remote development mode via [`wrangler dev --remote`](/workers/wrangler/commands/general/#dev). Remote development is [**not** supported in the Vite plugin](/workers/development-testing/wrangler-vs-vite/).

npm yarn pnpm

    npx wrangler dev --remote

    yarn wrangler dev --remote

    pnpm wrangler dev --remote

During **remote development**, all of your Worker code is uploaded to a temporary preview environment on Cloudflare's infrastructure, and changes to your code are automatically uploaded as you save.

When using remote development, all bindings automatically connect to their remote resources. Unlike local development, you cannot configure bindings to use local simulations - they will always use the deployed resources on Cloudflare's network.

### When to use Remote development

[](#when-to-use-remote-development)

- For most development tasks, the most efficient and productive experience will be local development along with [remote bindings](/workers/development-testing/#remote-bindings) when needed.
- You may want to use `wrangler dev --remote` for testing features or behaviors that are highly specific to Cloudflare's network and cannot be adequately simulated locally or tested via remote bindings.

### Considerations

[](#considerations)

- Iteration is significantly slower than local development due to the upload/deployment step for each change.

### Limitations

[](#limitations)

- When you run a remote development session using the `--remote` flag, a limit of 50 [routes](/workers/configuration/routing/routes/) per zone is enforced. Learn more in [Workers platform limits](/workers/platform/limits/#routes-and-domains-when-using-wrangler-dev---remote).

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
Demos and architectures](/workers/demos/) [Next  
Environment variables and secrets](/workers/development-testing/environment-variables/)

[Edit page](https://github.com/cloudflare/cloudflare-docs/edit/product
