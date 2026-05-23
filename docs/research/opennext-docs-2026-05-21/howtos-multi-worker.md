---
source: https://opennext.js.org/cloudflare/howtos/multi-worker
scraped: 2026-05-21
bytes: 18974
---

Multi Worker - OpenNext

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
      - [Contribute](/cloudflare/howtos/multi-worker#)

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

- [When to use this setup](#when-to-use-this-setup)
- [open-next.config.ts](#open-nextconfigts)
- [Custom workers](#custom-workers)
- [Wrangler configurations](#wrangler-configurations)
- [Actual deployment](#actual-deployment)
- [Version Affinity Explained](#version-affinity-explained)

[Question? Give us feedback → (opens in a new tab)](https://github.com/opennextjs)[Edit this page](https://github.com/opennextjs/docs/tree/main/pages/cloudflare/howtos/multi-worker.mdx)

Cloudflare

How-Tos

Multi-Worker Advanced Setup

⚠️

This is an advanced feature and requires a good understanding of both OpenNext and Cloudflare Workers. This advanced setup **cannot** be used with:

- Preview URLs (staging deployments)
- Skew protection features
- The standard `@opennextjs/cloudflare deploy` command

Consider these limitations carefully before proceeding.

OpenNext lets you split your application into smaller, lighter parts in several workers. This can improve performance and reduce the memory footprint of your application. It's a more advanced feature that doesn't support deploying through the standard `@opennextjs/cloudflare deploy` command.

As an example, we'll split the middleware into its own worker and the rest of the application into another worker. You could split the application further by creating additional workers for specific routes or features, but this won't be covered here. When referring to the middleware here, we talk about both the middleware you built, and the routing layer of OpenNext.

You can find an example of such a deployment in the [GitBook repository (opens in a new tab)](https://github.com/GitbookIO/gitbook).

## When to use this setup[](#when-to-use-this-setup)

This multi-worker approach is beneficial when you need:

- Reduced memory footprint for individual workers
- Improved cold start performance by splitting the light middleware into its own worker and serving ISR/SSG requests from there

### `open-next.config.ts`[](#open-nextconfigts)

Here we assume a configuration like that:

open-next.config.ts

    import { defineCloudflareConfig } from "@opennextjs/cloudflare";
    import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
    import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";
    import doShardedTagCache from "@opennextjs/cloudflare/overrides/tag-cache/do-sharded-tag-cache";
    import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";
    import { purgeCache } from "@opennextjs/cloudflare/overrides/cache-purge/index";

    export default defineCloudflareConfig({
      incrementalCache: withRegionalCache(r2IncrementalCache, { mode: "long-lived" }),
      queue: doQueue,
      // This is only required if you use On-demand revalidation
      tagCache: doShardedTagCache({
        baseShardSize: 12,
        regionalCache: true, // Enable regional cache to reduce the load on the DOs and improve speed
        regionalCacheTtlSec: 3600, // The TTL for the regional cache of the tag cache
        regionalCacheDangerouslyPersistMissingTags: true, // Enable this to persist missing tags in the regional cache
        shardReplication: {
          numberOfSoftReplicas: 4,
          numberOfHardReplicas: 2,
          regionalReplication: {
            defaultRegion: "enam",
          },
        },
      }),
      enableCacheInterception: true,
      // you can also use the `durableObject` option to use a durable object as a cache purge
      cachePurge: purgeCache({ type: "direct" }),
    });

### Custom workers[](#custom-workers)

You'll need 2 custom workers in order for this to work:

middleware.js

    import { WorkerEntrypoint } from "cloudflare:workers";

/.open-next/cloudflare/init.js

    import { runWithCloudflareRequestContext } from "./.open-next/cloudflare/init.js";

    import { handler as middlewareHandler } from "./.open-next/middleware/handler.mjs";

    export { DOQueueHandler } from "./.open-next/.build/durable-objects/queue.js";

    export { DOShardedTagCache } from "./.open-next/.build/durable-objects/sharded-tag-cache.js";

    export default class extends WorkerEntrypoint {
      async fetch(request) {
        return runWithCloudflareRequestContext(request, this.env, this.ctx, async () => {
          // Process the request through Next.js middleware layer and OpenNext routing layer
          const reqOrResp = await middlewareHandler(request, this.env, this.ctx);

          // If middleware returns a Response, send it directly (e.g., redirects, blocks, ISR/SSG cache Hit)
          if (reqOrResp instanceof Response) {
            return reqOrResp;
          }

          // Forward the modified request to the server worker
          // Version affinity ensures consistent worker versions
          // https://developers.cloudflare.com/workers/configuration/versions-and-deployments/gradual-deployments/#version-affinity
          reqOrResp.headers.set("Cloudflare-Workers-Version-Overrides", `server="${this.env.WORKER_VERSION_ID}"`);

          // Proxy to the server worker with cache disabled for dynamic content
          return this.env.DEFAULT_WORKER.fetch(reqOrResp, {
            // We return redirects as is
            redirect: "manual",
            cf: {
              cacheEverything: false,
            },
          });
        });
      }
    }

server.js

    // Replace with your actual build output directory, typically:
    // ./.open-next/cloudflare/init.js
    import { runWithCloudflareRequestContext } from "./.open-next/cloudflare/init.js";

    import { handler } from "./.open-next/server-functions/default/handler.mjs";

    export default {
      async fetch(request, env, ctx) {
        return runWithCloudflareRequestContext(request, env, ctx, async () => {
          // - `Request`s are handled by the Next server
          return handler(request, env, ctx);
        });
      },
    };

### Wrangler configurations[](#wrangler-configurations)

wrangler.jsonc

    // Middleware wrangler file
    {
      "main": "middleware.js",
      "name": "middleware",
      "compatibility_date": "2025-04-14",
      "compatibility_flags": ["nodejs_compat", "allow_importable_env", "global_fetch_strictly_public"],
      // The middleware serves the assets
      "assets": {
        "directory": "../../.open-next/assets",
        "binding": "ASSETS",
      },
      "vars": {
        // This one will need to be replaced for every deployment
        "WORKER_VERSION_ID": "TO_REPLACE",
      },
      "routes": [
        // Define your routes here, not in server.js
      ],
      "r2_buckets": [
        {
          "binding": "NEXT_INC_CACHE_R2_BUCKET",
          "bucket_name": "<BUCKET_NAME>",
        },
      ],
      "services": [
        {
          "binding": "WORKER_SELF_REFERENCE",
          "service": "middleware",
        },
        {
          "binding": "DEFAULT_WORKER",
          "service": "main-server",
        },
      ],
      "durable_objects": {
        "bindings": [
          {
            "name": "NEXT_TAG_CACHE_DO_SHARDED",
            "class_name": "DOShardedTagCache",
          },
          {
            "name": "NEXT_CACHE_DO_QUEUE",
            "class_name": "DOQueueHandler",
          },
        ],
      },
      "migrations": [
        {
          "tag": "v1",
          "new_sqlite_classes": ["DOQueueHandler", "DOShardedTagCache"],
        },
      ],
    }

wrangler.jsonc

    // Server wrangler file
    {
      "main": "server.js",
      "name": "main-server",
      "compatibility_date": "2025-04-14",
      "compatibility_flags": ["nodejs_compat", "allow_importable_env", "global_fetch_strictly_public"],
      "r2_buckets": [
        {
          "binding": "NEXT_INC_CACHE_R2_BUCKET",
          "bucket_name": "<BUCKET_NAME>",
        },
      ],
      "services": [
        {
          "binding": "WORKER_SELF_REFERENCE",
          // Note: The middleware worker must be referenced here, *not* the server.
          "service": "middleware",
        },
      ],
      "durable_objects": {
        "bindings": [
          {
            "name": "NEXT_TAG_CACHE_DO_SHARDED",
            "class_name": "DOShardedTagCache",
            "script_name": "middleware",
          },
          {
            "name": "NEXT_CACHE_DO_QUEUE",
            "class_name": "DOQueueHandler",
            "script_name": "middleware",
          },
        ],
      },
    }

### Actual deployment[](#actual-deployment)

You cannot use `@opennextjs/cloudflare deploy` to deploy this setup, as it will not work with the multiple workers setup.

1.  **Server Upload** → Get version ID
2.  **Middleware Preparation** → Update version reference
3.  **Middleware Upload** → Get version ID
4.  **Gradual Rollout** → Server (0%) → Middleware (100%) → Server (100%)

In order to make this work, you need to deploy each worker separately using the `wrangler` CLI and override the `WORKER_VERSION_ID` variable in the middleware wrangler configuration for **each deployment**. Note that we use gradual deployments as a solution for deploying new versions without affecting the currently running ones.

The steps to deploy without causing downtime to the already deployed ones are as follows:

1.  First you'll need to upload a new version of the server worker `wrangler versions upload --config ./path-to/serverWrangler.jsonc`
2.  Then you'll need to extract the new version id of the server from the previous command's output. The value you need is displayed as `Worker Version ID: <ID>` in the console output. This value is referred to as `NEW_SERVER_VERSION_ID` in step 8.
3.  Before uploading the middleware, you'll need to replace the `WORKER_VERSION_ID` variable in the middleware wrangler configuration with the new server version id from the previous step.
4.  You then need to upload a new version of the middleware worker `wrangler versions upload --config ./path-to/middlewareWrangler.jsonc`. Retrieve the version id, you'll need it in step 9 (`NEW_MIDDLEWARE_ID`).
5.  And extract the new version id of the middleware from the previous command's output. The value you need is displayed as `Worker Version ID: <ID>` in the console output.
6.  Use `wrangler deployments status --config ./path-to/server-wrangler.jsonc` to get the currently deployed version id of the server
7.  Extract the version id of the server from the previous command's output. This value is referred to as `CURRENT_SERVER_ID` in step 8.
8.  You then use gradual deployment to deploy the server uploaded at step 1 to 0% `wrangler versions deploy <CURRENT_SERVER_ID>@100% <NEW_SERVER_VERSION_ID>@0% -y --config ./path-to/server-wrangler.jsonc`
9.  You then deploy the middleware at 100% `wrangler versions deploy <NEW_MIDDLEWARE_ID>@100% -y --config ./path-to/middlewareWrangler.jsonc`. At this stage you are already serving the new version of the website in production.
10. To finish it off you deploy the server at 100% `wrangler versions deploy <NEW_SERVER_VERSION_ID>@100% -y --config ./path-to/server-wrangler.jsonc`.

You can find actual implementations of such a deployment in the GitBook repo using GitHub actions [here (opens in a new tab)](https://github.com/GitbookIO/gitbook/blob/main/.github/composite/deploy-cloudflare/action.yaml).

#### Version Affinity Explained[](#version-affinity-explained)

Version affinity ensures that requests are routed to workers running compatible versions:

- The middleware sets `Cloudflare-Workers-Version-Overrides` header
- This forces the request to go to the correct server worker version.
- Prevents version mismatches during deployments

Light

---

Maintained by the OpenNext community

[GitHub](https://github.com/opennextjs)[Discord](https://disc
