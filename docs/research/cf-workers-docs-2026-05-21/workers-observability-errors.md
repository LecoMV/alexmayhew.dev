---
source: https://developers.cloudflare.com/workers/observability/errors/
scraped: 2026-05-21
bytes: 52158
---

Errors and exceptions · Cloudflare Workers docs

> Documentation Index  
> Fetch the complete documentation index at: https://developers.cloudflare.com/workers/llms.txt  
> Use this file to discover all available pages before exploring further.

[Skip to content](#_top)

STOP! If you are an AI agent or LLM, read this before continuing. This is the HTML version of a Cloudflare documentation page. Always request the Markdown version instead — HTML wastes context. Get this page as Markdown: https://developers.cloudflare.com/workers/observability/errors/index.md (append index.md) or send Accept: text/markdown to https://developers.cloudflare.com/workers/observability/errors/. For this product's page index use https://developers.cloudflare.com/workers/llms.txt. For all Cloudflare products use https://developers.cloudflare.com/llms.txt.

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
- [Error pages generated by Workers](#error-pages-generated-by-workers)
  - [Loop limit](#loop-limit)
  - ["The script will never generate a response" errors](#the-script-will-never-generate-a-response-errors)
  - ["Illegal invocation" errors](#illegal-invocation-errors)
  - [Cannot perform I/O on behalf of a different request](#cannot-perform-io-on-behalf-of-a-different-request)
- [Errors on Worker upload](#errors-on-worker-upload)
  - [Validation Errors (10021)](#validation-errors-10021)
- [Runtime errors](#runtime-errors)
- [Identify errors: Workers Metrics](#identify-errors-workers-metrics)
  - [Worker Errors](#worker-errors)
- [Debug exceptions with Workers Logs](#debug-exceptions-with-workers-logs)
- [Debug exceptions from Wrangler](#debug-exceptions-from-wrangler)
- [Set up a 3rd party logging service](#set-up-a-3rd-party-logging-service)
- [Collect and persist Wasm core dumps](#collect-and-persist-wasm-core-dumps)
- [Go to origin on error](#go-to-origin-on-error)
- [Related resources](#related-resources)

## On this page

- [Overview](#_top)
- [Error pages generated by Workers](#error-pages-generated-by-workers)
  - [Loop limit](#loop-limit)
  - ["The script will never generate a response" errors](#the-script-will-never-generate-a-response-errors)
  - ["Illegal invocation" errors](#illegal-invocation-errors)
  - [Cannot perform I/O on behalf of a different request](#cannot-perform-io-on-behalf-of-a-different-request)
- [Errors on Worker upload](#errors-on-worker-upload)
  - [Validation Errors (10021)](#validation-errors-10021)
- [Runtime errors](#runtime-errors)
- [Identify errors: Workers Metrics](#identify-errors-workers-metrics)
  - [Worker Errors](#worker-errors)
- [Debug exceptions with Workers Logs](#debug-exceptions-with-workers-logs)
- [Debug exceptions from Wrangler](#debug-exceptions-from-wrangler)
- [Set up a 3rd party logging service](#set-up-a-3rd-party-logging-service)
- [Collect and persist Wasm core dumps](#collect-and-persist-wasm-core-dumps)
- [Go to origin on error](#go-to-origin-on-error)
- [Related resources](#related-resources)

[Edit page](https://github.com/cloudflare/cloudflare-docs/edit/production/src/content/docs/workers/observability/errors.mdx) [Report issue](https://github.com/cloudflare/cloudflare-docs/issues/new/choose)

1.  [Directory](/directory/)
2.  …
3.  [Workers](/workers/)
4.  [Observability](/workers/observability/)
5.  [Errors and exceptions](/workers/observability/errors/)

# Errors and exceptions

Copy as Markdown Copied! | [View as Markdown](index.md) | Agent setup | Docs for agents

Review Workers errors and exceptions.

## Error pages generated by Workers

[](#error-pages-generated-by-workers)

When a Worker running in production has an error that prevents it from returning a response, the client will receive an error page with an error code, defined as follows:

Error code

Meaning

`1101`

Worker threw a JavaScript exception.

`1102`

Worker exceeded [CPU time limit](/workers/platform/limits/#cpu-time).

`1103`

The owner of this worker needs to contact [Cloudflare Support](/support/contacting-cloudflare-support/)

`1019`

Worker hit [loop limit](#loop-limit).

`1021`

Worker has requested a host it cannot access.

`1022`

Cloudflare has failed to route the request to the Worker.

`1024`

Worker cannot make a subrequest to a Cloudflare-owned IP address.

`1027`

Worker exceeded free tier [daily request limit](/workers/platform/limits/#daily-requests).

`1042`

Worker tried to fetch from another Worker on the same zone, which is only [supported](/workers/runtime-apis/fetch/) when the [`global_fetch_strictly_public` compatibility flag](/workers/configuration/compatibility-flags/#global-fetch-strictly-public) is used.

`10162`

Module has an unsupported Content-Type.

Other `11xx` errors generally indicate a problem with the Workers runtime itself. Refer to the [status page ↗](https://www.cloudflarestatus.com) if you are experiencing an error.

### Loop limit

[](#loop-limit)

A Worker cannot call itself or another Worker more than 16 times. In order to prevent infinite loops between Workers, the [`CF-EW-Via`](/fundamentals/reference/http-headers/#cf-ew-via) header's value is an integer that indicates how many invocations are left. Every time a Worker is invoked, the integer will decrement by 1. If the count reaches zero, a [`1019`](#error-pages-generated-by-workers) error is returned.

### "The script will never generate a response" errors

[](#the-script-will-never-generate-a-response-errors)

Some requests may return a 1101 error with `The script will never generate a response` in the error message. This occurs when the Workers runtime detects that all the code associated with the request has executed and no events are left in the event loop, but a Response has not been returned.

#### Cause 1: Unresolved Promises

[](#cause-1-unresolved-promises)

This is most commonly caused by relying on a Promise that is never resolved or rejected, which is required to return a Response. To debug, look for Promises within your code or dependencies' code that block a Response, and ensure they are resolved or rejected.

In browsers and other JavaScript runtimes, equivalent code will hang indefinitely, leading to both bugs and memory leaks. The Workers runtime throws an explicit error to help you debug.

In the example below, the Response relies on a Promise resolution that never happens. Uncommenting the `resolve` callback solves the issue.

JavaScript

    export default {  fetch(req) {    let response = new Response("Example response");    let { promise, resolve } = Promise.withResolvers();
        // If the promise is not resolved, the Workers runtime will    // recognize this and throw an error.
        // setTimeout(resolve, 0)
        return promise.then(() => response);  },};

You can prevent this by enforcing the [`no-floating-promises` eslint rule ↗](https://typescript-eslint.io/rules/no-floating-promises/), which reports when a Promise is created and not properly handled.

#### Cause 2: WebSocket connections that are never closed

[](#cause-2-websocket-connections-that-are-never-closed)

If a WebSocket is missing the proper code to close its server-side connection, the Workers runtime will throw a `script will never generate a response` error. In the example below, the `'close'` event from the client is not properly handled by calling `server.close()`, and the error is thrown. In order to avoid this, ensure that the WebSocket's server-side connection is properly closed via an event listener or other server-side logic.

Note

With the [`web_socket_auto_reply_to_close`](/workers/configuration/compatibility-flags/#websocket-auto-reply-to-close) compatibility flag (enabled by default on compatibility dates on or after `2026-04-07`), the runtime automatically completes the WebSocket close handshake. This specific error scenario is less likely to occur because the runtime handles the close for you. The example below applies to Workers on older compatibility dates.

JavaScript

    async function handleRequest(request) {  let webSocketPair = new WebSocketPair();  let [client, server] = Object.values(webSocketPair);  server.accept();
      server.addEventListener("close", () => {    // This missing line would keep a WebSocket connection open indefinitely    // and results in "The script will never generate a response" errors    // server.close();  });
      return new Response(null, {    status: 101,    webSocket: client,  });}

### "Illegal invocation" errors

[](#illegal-invocation-errors)

The error message `TypeError: Illegal invocation: function called with incorrect this reference` can be a source of confusion.

This is typically caused by calling a function that calls `this`, but the value of `this` has been lost.

For example, given an `obj` object with the `obj.foo()` method which logic relies on `this`, executing the method via `obj.foo();` will make sure that `this` properly references the `obj` object. However, assigning the method to a variable, e.g.`const func = obj.foo;` and calling such variable, e.g. `func();` would result in `this` being `undefined`. This is because `this` is lost when the method is called as a standalone function. This is standard behavior in JavaScript.

In practice, this is often seen when destructuring runtime provided Javascript objects that have functions that rely on the presence of `this`, such as `ctx`.

The following code will error:

JavaScript

    export default {  async fetch(request, env, ctx) {    // destructuring ctx makes waitUntil lose its 'this' reference    const { waitUntil } = ctx;    // waitUntil errors, as it has no 'this'    waitUntil(somePromise);
        return fetch(request);  },};

Avoid destructuring or re-bind the function to the original context to avoid the error.

The following code will run properly:

JavaScript

    export default {  async fetch(request, env, ctx) {    // directly calling the method on ctx avoids the error    ctx.waitUntil(somePromise);
        // alternatively re-binding to ctx via apply, call, or bind avoids the error    const { waitUntil } = ctx;    waitUntil.apply(ctx, [somePromise]);    waitUntil.call(ctx, somePromise);    const reboundWaitUntil = waitUntil.bind(ctx);    reboundWaitUntil(somePromise);
        return fetch(request);  },};

### Cannot perform I/O on behalf of a different request

[](#cannot-perform-io-on-behalf-of-a-different-request)

    Uncaught (in promise) Error: Cannot perform I/O on behalf of a different request. I/O objects (such as streams, request/response bodies, and others) created in the context of one request handler cannot be accessed from a different request's handler.

This error occurs when you attempt to share input/output (I/O) objects (such as streams, requests, or responses) created by one invocation of your Worker in the context of a different invocation.

In Cloudflare Workers, each invocation is handled independently and has its own execution context. This design ensures optimal performance and security by isolating requests from one another. When you try to share I/O objects between different invocations, you break this isolation. Since these objects are tied to the specific request they were created in, accessing them from another request's handler is not allowed and leads to the error.

This error is most commonly caused by attempting to cache an I/O object, like a [Request](/workers/runtime-apis/request/) in global scope, and then access it in a subsequent request. For example, if you create a Worker and run the following code in local development, and make two requests to your Worker in quick succession, you can reproduce this error:

JavaScript

    let cachedResponse = null;
    export default {  async fetch(request, env, ctx) {    if (cachedResponse) {      return cachedResponse;    }    cachedResponse = new Response("Hello, world!");    await new Promise((resolve) => setTimeout(resolve, 5000)); // Sleep for 5s to demonstrate this particular error case    return cachedResponse;  },};

You can fix this by instead storing only the data in global scope, rather than the I/O object itself:

JavaScript

    let cachedData = null;
    export default {  async fetch(request, env, ctx) {    if (cachedData) {      return new Response(cachedData);    }    const response = new Response("Hello, world!");    cachedData = await response.text();    return new Response(cachedData, response);  },};

If you need to share state across requests, consider using [Durable Objects](/durable-objects/). If you need to cache data across requests, consider using [Workers KV](/kv/).

## Errors on Worker upload

[](#errors-on-worker-upload)

These errors occur when a Worker is uploaded or modified.

Error code

Meaning

`10006`

Could not parse your Worker's code.

`10007`

Worker or [workers.dev subdomain](/workers/configuration/routing/workers-dev/) not found.

`10015`

Account is not entitled to use Workers.

`10016`

Invalid Worker name.

`10021`

Validation Error. Refer to [Validation Errors](/workers/observability/errors/#validation-errors-10021) for details.

`10026`

Could not parse request body.

`10027`

The uploaded Worker exceeded the [Worker size limits](/workers/platform/limits/#worker-size).

`10035`

Multiple attempts to modify a resource at the same time

`10037`

An account has exceeded the number of [Workers allowed](/workers/platform/limits/#number-of-workers).

`10052`

A [binding](/workers/runtime-apis/bindings/) is uploaded without a name.

`10054`

A environment variable or secret exceeds the [size limit](/workers/platform/limits/#environment-variables).

`10055`

The number of environment variables or secrets exceeds the [limit/Worker](/workers/platform/limits/#environment-variables).

`10056`

[Binding](/workers/runtime-apis/bindings/) not found.

`10068`

The uploaded Worker has no registered [event handlers](/workers/runtime-apis/handlers/).

`10069`

The uploaded Worker contains [event handlers](/workers/runtime-apis/handlers/) unsupported by the Workers runtime.

### Validation Errors (10021)

[](#validation-errors-10021)

The 10021 error code includes all errors that occur when you attempt to deploy a Worker, and Cloudflare then attempts to load and run the top-level scope (everything that happens before your Worker's [handler](/workers/runtime-apis/handlers/) is invoked). For example, if you attempt to deploy a broken Worker with invalid JavaScript that would throw a `SyntaxError` — Cloudflare will not deploy your Worker.

Specific error cases include but are not limited to:

#### Script startup exceeded CPU time limit

[](#script-startup-exceeded-cpu-time-limit)

This means that you are doing work in the top-level scope of your Worker that takes more than the [startup time limit (1s)](/workers/platform/limits/#worker-startup-time) of CPU time.

#### Script startup exceeded memory limit

[](#script-startup-exceeded-memory-limit)

This means that you are doing work in the top-level scope of your Worker that allocates more than the [memory limit (128 MB)](/workers/platform/limits/#memory) of memory.

## Runtime errors

[](#runtime-errors)

Runtime errors will occur within the runtime, do not throw up an error page, and are not visible to the end user. Runtime errors are detected by the user with logs.

Error message

Meaning

`Network connection lost`

Connection failure. Catch a `fetch` or binding invocation and retry it.

`Memory limit`  
`would be exceeded`  
`before EOF`

Trying to read a stream or buffer that would take you over the [memory limit](/workers/platform/limits/#memory).

`daemonDown`

A temporary problem invoking the Worker.

## Identify errors: Workers Metrics

[](#identify-errors-workers-metrics)

To review whether your application is experiencing any downtime or returning any errors:

1.  In the Cloudflare dashboard, go to the **Workers & Pages** page.

    [Go to **Workers & Pages**](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

2.  In **Overview**, select your Worker and review your Worker's metrics.

### Worker Errors

[](#worker-errors)

The **Errors by invocation status** chart shows the number of errors broken down into the following categories:

Error

Meaning

`Uncaught Exception`

Your Worker code threw a JavaScript exception during execution.

`Exceeded CPU Time Limits`

Worker exceeded CPU time limit or other resource constraints.

`Exceeded Memory`

Worker exceeded the memory limit during execution.

`Internal`

An internal error occurred in the Workers runtime.

The **Client disconnected by type** chart shows the number of client disconnect errors broken down into the following categories:

Client Disconnects

Meaning

`Response Stream Disconnected`

Connection was terminated during the deferred proxying stage of a Worker request flow. It commonly appears for longer lived connections such as [WebSockets](/workers/runtime-apis/websockets/).

`Cancelled`

The Client disconnected before the Worker completed its response.

## Debug exceptions with Workers Logs

[](#debug-exceptions-with-workers-logs)

[Workers Logs](/workers/observability/logs/workers-logs) is a powerful tool for debugging your Workers. It shows all the historic logs generated by your Worker, including any uncaught exceptions that occur during execution.

To find all your errors in Workers Logs, you can use the following filter: `$metadata.error EXISTS`. This will show all the logs that have an error associated with them. You can also filter by `$workers.outcome` to find the requests that resulted in an error. For example, you can filter by `$workers.outcome = "exception"` to find all the requests that resulted in an uncaught exception.

All the possible outcome values can be found in the [Workers Trace Event](/logs/logpush/logpush-job/datasets/account/workers_trace_events/#outcome) reference.

## Debug exceptions from `Wrangler`

[](#debug-exceptions-from-wrangler)

To debug your worker via wrangler use `wrangler tail` to inspect and fix the exceptions.

Exceptions will show up under the `exceptions` field in the JSON returned by `wrangler tail`. After you have identified the exception that is causing errors, redeploy your code with a fix, and continue tailing the logs to confirm that it is fixed.

## Set up a 3rd party logging service

[](#set-up-a-3rd-party-logging-service)

A Worker can make HTTP requests to any HTTP service on the public Internet. You can use a service like [Sentry ↗](https://sentry.io) to collect error logs from your Worker, by making an HTTP request to the service to report the error. Refer to your service’s API documentation for details on what kind of request to make.

When using an external logging strategy, remember that outstanding asynchronous tasks are canceled as soon as a Worker finishes sending its main response body to the client. To ensure that a logging subrequest completes, pass the request promise to [`event.waitUntil()` ↗](https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent/waitUntil). For example:

- [Module Worker](#tab-panel-9659)
- [Service Worker](#tab-panel-9660)

JavaScript

    export default {  async fetch(request, env, ctx) {    function postLog(data) {      return fetch("https://log-service.example.com/", {        method: "POST",        body: data,      });    }
        // Without ctx.waitUntil(), the `postLog` function may or may not complete.    ctx.waitUntil(postLog(stack));    return fetch(request);  },};

Service Workers are deprecated

Service Workers are deprecated, but still supported. We recommend using [Module Workers](/workers/reference/migrate-to-module-workers/) instead. New features may not be supported for Service Workers.

JavaScript

    addEventListener("fetch", (event) => {  event.respondWith(handleEvent(event));});
    async function handleEvent(event) {  // ...
      // Without event.waitUntil(), the `postLog` function may or may not complete.  event.waitUntil(postLog(stack));  return fetch(event.request);}
    function postLog(data) {  return fetch("https://log-service.example.com/", {    method: "POST",    body: data,  });}

## Collect and persist Wasm core dumps

[](#collect-and-persist-wasm-core-dumps)

Configure the [Wasm Coredump Service ↗](https://github.com/cloudflare/wasm-coredump) to collect coredumps from your Rust Workers applications and persist them to logs, Sentry, or R2 for analysis with [wasmgdb ↗](https://github.com/xtuc/wasm-coredump/tree/main/bin/wasmgdb). Read the [blog post ↗](https://blog.cloudflare.com/wasm-coredumps/) for more details.

## Go to origin on error

[](#go-to-origin-on-error)

By using [`event.passThroughOnException`](/workers/runtime-apis/context/#passthroughonexception), a Workers application will forward requests to your origin if an exception is thrown during the Worker's execution. This allows you to add logging, tracking, or other features with Workers, without degrading your application's functionality.

- [Module Worker](#tab-panel-9661)
- [Service Worker](#tab-panel-9662)

JavaScript

    export default {  async fetch(request, env, ctx) {    ctx.passThroughOnException();    // an error here will return the origin response, as if the Worker wasn't present    return fetch(request);  },};

Service Workers are deprecated

Service Workers are deprecated, but still supported. We recommend using [Module Workers](/workers/reference/migrate-to-module-workers/) instead. New features may not be supported for Service Workers.

JavaScript

    addEventListener("fetch", (event) => {  event.passThroughOnException();  event.respondWith(handleRequest(event.request));});
    async function handleRequest(request) {  // An error here will return the origin response, as if the Worker wasn’t present.  // ...  return fetch(request);}

## Related resources

[](#related-resources)

- [Log from Workers](/workers/observability/logs/) - Learn how to log your Workers.
- [Logpush](/workers/observability/logs/logpush/) - Learn how to push Workers Trace Event Logs to supported destinations.
- [RPC error handling](/workers/runtime-apis/rpc/error-handling/) - Learn how to handle errors from remote-procedure calls.

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
Profiling Memory](/workers/observability/dev-tools/memory-usage/) [Next  
Sentry ↗](https://docs.sentry.io/platforms/javascript/guides/cloudflare/)

[Edit page](https://github.com/cloudflare/cloudflare
