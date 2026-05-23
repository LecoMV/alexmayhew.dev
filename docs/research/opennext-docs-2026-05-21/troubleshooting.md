---
source: https://opennext.js.org/cloudflare/troubleshooting
scraped: 2026-05-21
bytes: 15608
---

Troubleshooting - OpenNext

[](/)

[GitHubGitHub (opens in a new tab)](https://github.com/opennextjs)[DiscordDiscord (opens in a new tab)](https://discord.gg/opennextjs)

- [Overview](/)
- AWS
  - [Overview](/aws)
  - [Getting started](/aws/get_started)
  - [Compatibility](/aws/compatibility)
  - [Configuration](/aws/config)
    - [Simple Example](/aws/config/simple_example)
    - [Custom Overrides](/aws/config/custom_overrides)
    - [Reference](/aws/config/reference)
    - [Full Example](/aws/config/full_example)
    - [Nx Monorepo](/aws/config/nx)
    - Overrides
      - [Wrapper](/aws/config/overrides/wrapper)
      - [Converter](/aws/config/overrides/converter)
      - [Incremental Cache](/aws/config/overrides/incremental_cache)
      - [Tag Cache](/aws/config/overrides/tag_cache)
      - [Revalidation Queue](/aws/config/overrides/queue)
      - [Image Loader](/aws/config/overrides/image_loader)
      - [External Request Proxy](/aws/config/overrides/proxy_external_request)
      - [Origin Resolver](/aws/config/overrides/origin_resolver)
      - [Invoke Function for the warmer](/aws/config/overrides/invoke_function)
      - [Automatic CDN Invalidation](/aws/config/overrides/automatic_cdn_invalidation)
      - [Asset Resolver](/aws/config/overrides/asset_resolver)

  - [Comparison](/aws/comparison)
  - [How does it work?](/aws/inner_workings)
    - [Routing Layer](/aws/inner_workings/routing)
    - [Caching (ISR/SSG)](/aws/inner_workings/caching)
    - [Optional Cache Interception](/aws/inner_workings/cache_interception)
    - Main Components
      - [Overview](/aws/inner_workings/components/overview)
      - Server
        - [Edge](/aws/inner_workings/components/server/edge)
        - [Node](/aws/inner_workings/components/server/node)

      - [Middleware](/aws/inner_workings/components/middleware)
      - [Image Optimization](/aws/inner_workings/components/image_optimization)
      - [Revalidation](/aws/inner_workings/components/revalidation)
      - [Warmer](/aws/inner_workings/components/warmer)
      - [Initializer](/aws/inner_workings/components/initializer)

    - [Default Architecture](/aws/inner_workings/architecture)

  - [FAQ](/aws/faq)
  - [Troubleshooting](/aws/common_issues)
  - [Contributing](/aws/contribute)
    - [Run locally](/aws/contribute/local_run)
    - [Internal plugin system](/aws/contribute/plugin)

  - [Migration](/aws/migration)
  - [Reference Implementation](/aws/reference-implementation)
  - [V2](/aws/v2)
    - [Troubleshooting](/aws/v2/common_issues)
      - [ISR](/aws/v2/common_issues/isr)
      - [Bundle Size](/aws/v2/common_issues/bundle_size)

    - Inner Workings
      - [ISR](/aws/v2/inner_workings/isr)
      - [Plugin](/aws/v2/inner_workings/plugin)
      - [Streaming](/aws/v2/inner_workings/streaming)
      - [Warming](/aws/v2/inner_workings/warming)

    - Advanced
      - [Architecture](/aws/v2/advanced/architecture)
      - [Options](/aws/v2/advanced/options)
      - [Workaround](/aws/v2/advanced/workaround)
      - [Debugging](/aws/v2/advanced/debugging)
      - [Contribute](/cloudflare/troubleshooting#)

- Cloudflare
  - [Overview](/cloudflare)
  - [Get Started](/cloudflare/get-started)
  - [CLI (opennextjs-cloudflare)](/cloudflare/cli)
  - [Bindings](/cloudflare/bindings)
  - [Caching](/cloudflare/caching)
  - How-Tos
    - [Stripe API](/cloudflare/howtos/stripeAPI)
    - [Database & ORM](/cloudflare/howtos/db)
    - [Develop and Deploy](/cloudflare/howtos/dev-deploy)
    - [Environment Variables](/cloudflare/howtos/env-vars)
    - [Image Optimization](/cloudflare/howtos/image)
    - [Custom Worker](/cloudflare/howtos/custom-worker)
    - [\_\_name issues](/cloudflare/howtos/keep_names)
    - [workerd specific packages](/cloudflare/howtos/workerd)
    - [Skew Protection](/cloudflare/howtos/skew)
    - [Static assets](/cloudflare/howtos/assets)
    - [Multi-Worker Advanced Setup](/cloudflare/howtos/multi-worker)

  - [Examples](/cloudflare/examples)
  - [Performance Tips](/cloudflare/perf)
  - [Known issues](/cloudflare/known-issues)
  - [Troubleshooting](/cloudflare/troubleshooting)
  - [Migrate from 0.6 to 1.0.0-beta](/cloudflare/migrate-from-0.6-to-1.0.0-beta)
  - Former releases
    - Release 0.6
      - Overview
      - [Get Started](/cloudflare/former-releases/0.6/get-started)
      - [Bindings](/cloudflare/former-releases/0.6/bindings)
      - [Caching](/cloudflare/former-releases/0.6/caching)
      - [Examples](/cloudflare/former-releases/0.6/examples)

    - [Migrate from 0.5 to 0.6](/cloudflare/former-releases/migrate-from-0.5-to-0.6)
    - Release 0.5
      - [Overview](/cloudflare/former-releases/0.5)
      - [Get Started](/cloudflare/former-releases/0.5/get-started)
      - [Bindings](/cloudflare/former-releases/0.5/bindings)
      - [Caching](/cloudflare/former-releases/0.5/caching)
      - [Examples](/cloudflare/former-releases/0.5/examples)

    - [Migrate from 0.4 to 0.5](/cloudflare/former-releases/migrate-from-0.4-to-0.5)
    - [Migrate from 0.3 to 0.4](/cloudflare/former-releases/migrate-from-0.3-to-0.4)
    - Release 0.3
      - [Overview](/cloudflare/former-releases/0.3)
      - [Get Started](/cloudflare/former-releases/0.3/get-started)
      - [Bindings](/cloudflare/former-releases/0.3/bindings)
      - [Caching](/cloudflare/former-releases/0.3/caching)
      - [Examples](/cloudflare/former-releases/0.3/examples)

    - [Migrate from 0.2 to 0.3](/cloudflare/former-releases/migrate-from-0.2-to-0.3)
    - Release 0.2
      - [Overview](/cloudflare/former-releases/0.2)
      - [Get Started](/cloudflare/former-releases/0.2/get-started)
      - [Bindings](/cloudflare/former-releases/0.2/bindings)
      - [Caching](/cloudflare/former-releases/0.2/caching)
      - [Examples](/cloudflare/former-releases/0.2/examples)

- Netlify
  - [Overview](/netlify)
  - [Netlify Forms](/netlify/forms)

---

- News
  - [All Posts](/news)
  - [3 Years of OpenNext](/news/2026-03-25-3-years-of-opennext)

Light

On This Page

- [Troubleshooting](#troubleshooting)
- ["Your Worker exceeded the size limit of 3 MiB"](#your-worker-exceeded-the-size-limit-of-3-mib)
- ["Your Worker exceeded the size limit of 10 MiB"](#your-worker-exceeded-the-size-limit-of-10-mib)
- [My app fails to build when I import a specific NPM package](#my-app-fails-to-build-when-i-import-a-specific-npm-package)
- [Error: Cannot perform I/O on behalf of a different request.](#error-cannot-perform-io-on-behalf-of-a-different-request)
- [Error: Failed to load chunk server/chunks/ssr/<chunk_name>.js](#error-failed-to-load-chunk-serverchunksssrchunk_namejs)
- [X \[ERROR\] Could not resolve "<package>"](#x-error-could-not-resolve-package)
- [ReferenceError: FinalizationRegistry is not defined](#referenceerror-finalizationregistry-is-not-defined)
- [Failed to send request to R2 worker or Could not determine Cloudflare auth credentials after login](#failed-to-send-request-to-r2-worker-or-could-not-determine-cloudflare-auth-credentials-after-login)

[Question? Give us feedback → (opens in a new tab)](https://github.com/opennextjs)[Edit this page](https://github.com/opennextjs/docs/tree/main/pages/cloudflare/troubleshooting.mdx)

Cloudflare

Troubleshooting

## Troubleshooting[](#troubleshooting)

### "Your Worker exceeded the size limit of 3 MiB"[](#your-worker-exceeded-the-size-limit-of-3-mib)

The Cloudflare Account you are deploying to is on the Workers Free plan, which [limits the size of each Worker to 3 MiB (opens in a new tab)](https://developers.cloudflare.com/workers/platform/limits/#worker-size). When you subscribe to the Workers Paid plan, each Worker can be up to 10 MiB.

When deploying your Worker, `wrangler` will show both the original and compressed sizes. Only the latter (gzipped size) matters for these limits.

### "Your Worker exceeded the size limit of 10 MiB"[](#your-worker-exceeded-the-size-limit-of-10-mib)

If your Worker is larger than 10 MiB compressed — there might be unnecessary code ending up in your production bundle. You can visualize and understand this by running:

1.  `npx @opennextjs/cloudflare build` within your project's root directory
2.  `cd .open-next/server-functions/default` to open the directory that contains the bundled code
3.  Take the file named `handler.mjs.meta.json` and use the [ESBuild Bundle Analyzer (opens in a new tab)](https://esbuild.github.io/analyze/) to visualize your application's code, and understand the largest parts of your production bundle

### My app fails to build when I import a specific NPM package[](#my-app-fails-to-build-when-i-import-a-specific-npm-package)

First, make sure that the `nodejs_compat` compatibility flag is enabled, and your compatibility date is set to on or after "2024-09-23", in your [wrangler configuration file (opens in a new tab)](https://developers.cloudflare.com/workers/wrangler/configuration/). Refer to the [Node.js Workers docs (opens in a new tab)](https://developers.cloudflare.com/workers/runtime-apis/nodejs/) for more details on Node.js support in Cloudflare Workers.

Some NPM packages define multiple exports. For example:

package.json

    "exports": {
        "other": "./src/other.js",
        "node": "./src/node.js",
        "browser": "./src/browser.js",
        "default": "./src/default.js"
    },

When you use `@opennextjs/cloudflare`, [Wrangler (opens in a new tab)](https://developers.cloudflare.com/workers/wrangler/) bundles your code before running it locally, or deploying it to Cloudflare. Wrangler has to choose which export to use, when you import a module. By default, Wrangler, which uses [esbuild (opens in a new tab)](https://esbuild.github.io/), handles this in a way that is not compatible with some NPM packages.

You may want to modify how Wrangler resolves multiple exports, such that when you import packages, the `node` export, if present, is used. You can do do by defining the following variables in a `.env` file within the root directory of your Next.js app:

.env

    WRANGLER_BUILD_CONDITIONS=""
    WRANGLER_BUILD_PLATFORM="node"

### `Error: Cannot perform I/O on behalf of a different request.`[](#error-cannot-perform-io-on-behalf-of-a-different-request)

Some DB clients (i.e. [`postgres` (opens in a new tab)](https://www.npmjs.com/package/postgres)) create a connection to the DB server when they are first instantiated and re-use it for later requests. This programming model is not compatible with the Workers runtime where a connection can not be re-used in a different request.

The following error is generated in such a case:

    ⨯ Error: Cannot perform I/O on behalf of a different request. I/O objects (such as streams, request/response bodies, and others) created in the context of one request handler cannot be accessed from a different request's handler. This is a limitation of Cloudflare Workers which allows us to improve overall performance. (I/O type: Writable)

To solve this, you should create the DB client inside a request context and not keep a global DB client.

A global client would not work:

src/lib/db.ts

    import postgres from "postgres";

    // `client` is global.
    // As the connection would be shared across requests, it fails on worker
    export const client = postgres(process.env.DATABASE_URL, { max: 5 });

src/app/api/route.ts

    import { client } from "@/db/db";

    export const dynamic = "force-dynamic";

    export async function GET() {
      return new Response(JSON.stringify(await client`SELECT * FROM users;`));
    }

It can fixed by creating the client for each incoming request:

src/app/api/route.ts

    export const dynamic = "force-dynamic";

    export async function GET() {
      // The client is created for each incoming request and no connection is shared across requests
      const client = postgres(process.env.DATABASE_URL, { max: 5 });
      return new Response(JSON.stringify(await client`SELECT * FROM users;`));
    }

### `Error: Failed to load chunk server/chunks/ssr/<chunk_name>.js`[](#error-failed-to-load-chunk-serverchunksssrchunk_namejs)

If you see an error similar to:

    ✘ [ERROR] ⨯ Error: Failed to load chunk server/chunks/ssr/<chunk_name>.js

          at loadChunkPath
      (...)
          at Object.loadChunk
      (...)
          at .open-next/server-functions/default/.next/server/app/page.js

You are likely using an older version of the OpenNext adapter with Turbopack builds. Please upgrade `@opennextjs/cloudflare` to the latest version for Turbopack support, or use Webpack builds.

### `X [ERROR] Could not resolve "<package>"`[](#x-error-could-not-resolve-package)

When you see the following error during the build:

    ⚙️ Bundling the OpenNext server...

    X [ERROR] Could not resolve "<package name>"

It might be because the package contains workerd specific code.

Check this [howto](/cloudflare/howtos/workerd) for a solution.

### `ReferenceError: FinalizationRegistry is not defined`[](#referenceerror-finalizationregistry-is-not-defined)

If you encounter this error when using features that rely on modern JavaScript APIs:

    ✘ [ERROR] ⨯ ReferenceError: FinalizationRegistry is not defined

This error occurs because the `FinalizationRegistry` API is not available in older Cloudflare Workers compatibility dates.

To fix this issue, update your `compatibility_date` in `wrangler.toml` or `wrangler.jsonc` to `2025-05-05` or later:

wrangler.jsonc

    {
      "compatibility_date": "2025-05-05",
    }

Refer to the [Cloudflare Workers compatibility flags documentation (opens in a new tab)](https://developers.cloudflare.com/workers/configuration/compatibility-flags/#enable-finalizationregistry-and-weakref) for more details.

### `Failed to send request to R2 worker` or `Could not determine Cloudflare auth credentials after login`[](#failed-to-send-request-to-r2-worker-or-could-not-determine-cloudflare-auth-credentials-after-login)

These errors come from `populateCache remote` (called implicitly by `deploy` and `upload`) when the temporary `open-next-cache-populate.<account>.workers.dev` helper Worker is fronted by a Cloudflare Access application.

See [Populating remote bindings when Workers are protected by Cloudflare Access](/cloudflare/cli#populating-remote-bindings-when-workers-are-protected-by-cloudflare-access) for setup steps.

Light

---

Maintained by the OpenNext community

[GitHub](https://github.com/opennextjs)[Discord](https://disc
