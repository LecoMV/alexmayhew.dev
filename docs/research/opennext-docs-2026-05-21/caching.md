---
source: https://opennext.js.org/cloudflare/caching
scraped: 2026-05-21
bytes: 31201
---

Caching - OpenNext

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
      - [Contribute](/cloudflare/caching#)

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

- [Caching](#caching)
- [Guidelines](#guidelines)
- [Small site using revalidation](#small-site-using-revalidation)
- [Large site using revalidation](#large-site-using-revalidation)
- [SSG site](#ssg-site)
- [Staging](#staging)
- [References](#references)
- [Static Assets Caching](#static-assets-caching)
- [Incremental Static Regeneration (ISR)](#incremental-static-regeneration-isr)
- [Queue](#queue)
- [Tag Cache for On-Demand Revalidation](#tag-cache-for-on-demand-revalidation)
- [Automatic Cache Purge](#automatic-cache-purge)
- [Debugging](#debugging)

[Question? Give us feedback → (opens in a new tab)](https://github.com/opennextjs)[Edit this page](https://github.com/opennextjs/docs/tree/main/pages/cloudflare/caching.mdx)

Cloudflare

Caching

## Caching[](#caching)

Everything in this page only concerns SSG/ISR and the data cache, SSR route will work out of the box without any caching config.

Next.js offers multiple ways to improve an application's performance by [caching (opens in a new tab)](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#caching-data) routes and network requests. An application will try to pre-render and cache as much data as possible during build-time to reduce the amount of work required when serving a response to a user.

The cache data are updated using revalidation, either periodically or on-demand:

- "[Time-based revalidation (opens in a new tab)](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration#time-based-revalidation)" updates the cache data after the revalidation delay specified by the applications expires
- "[On-demand revalidation (opens in a new tab)](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration#on-demand-revalidation-with-revalidatetag)" allows to invalid cache entries with a specific tag (via `revalidateTag`) or at a given path (via `revalidatePath`). You can also use `res.revalidate` in Pages router API route.

The `@opennextjs/cloudflare` caching supports rely on 3 components:

- An **Incremental Cache** to store the cache data
- A **Queue** to synchronize and deduplicate time-based revalidations
- A **Tag Cache** for On-demand revalidations via [`revalidateTag` (opens in a new tab)](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) and [`revalidatePath` (opens in a new tab)](https://nextjs.org/docs/app/api-reference/functions/revalidatePath).

You can also enable cache interception, to avoid calling the `NextServer` and thus loading the javascript associated with the page. It can slightly improve cold start performance for ISR/SSG route on cached routes. As of now, cache interception does not work with PPR and is not enabled by default.

Additionally some components uses the [Cache Api (opens in a new tab)](https://developers.cloudflare.com/workers/runtime-apis/cache/) to improve the performance of these different components. If you're planning on using On-Demand revalidation, you should also use the [Cache Purge component](/cloudflare/caching#automatic-cache-purge) to automatically purge the cache when a page is revalidated.

The adapter provides several implementations for each of those components configured in `open-next.config.ts`.

This guide provides guidelines for common use cases before detailing all the configuration options.

### Guidelines[](#guidelines)

#### Small site using revalidation[](#small-site-using-revalidation)

You should use the following implementation for a small site:

- Incremental Cache: use R2 to store the data
- Queue: use a Queue backed by Durable Objects
- Tag Cache: `D1NextModeTagCache`

wrangler.jsoncopen-next.config.ts

wrangler.jsonc

    {
      "name": "<WORKER_NAME>",
      // ...

      "services": [
        {
          "binding": "WORKER_SELF_REFERENCE",
          "service": "<WORKER_NAME>",
        },
      ],

      // R2 incremental cache
      "r2_buckets": [
        {
          "binding": "NEXT_INC_CACHE_R2_BUCKET",
          "bucket_name": "<BUCKET_NAME>",
        },
      ],

      // DO Queue
      "durable_objects": {
        "bindings": [
          {
            "name": "NEXT_CACHE_DO_QUEUE",
            "class_name": "DOQueueHandler",
          },
        ],
      },
      "migrations": [
        {
          "tag": "v1",
          "new_sqlite_classes": ["DOQueueHandler"],
        },
      ],

      // D1 Tag Cache (Next mode)
      // This is only required if you use On-demand revalidation
      "d1_databases": [
        {
          "binding": "NEXT_TAG_CACHE_D1",
          "database_id": "<DATABASE_ID>",
          "database_name": "<DATABASE_NAME>",
        },
      ],
    }

#### Large site using revalidation[](#large-site-using-revalidation)

For a larger site, you should use the `ShardedDOTagCache` that can handle a higher load than the `D1NextModeTagCache`:

wrangler.jsoncopen-next.config.ts

wrangler.jsonc

    {
      "name": "<WORKER_NAME>",
      // ...

      "services": [
        {
          "binding": "WORKER_SELF_REFERENCE",
          "service": "<WORKER_NAME>",
        },
      ],

      // R2 incremental cache
      "r2_buckets": [
        {
          "binding": "NEXT_INC_CACHE_R2_BUCKET",
          "bucket_name": "<BUCKET_NAME>",
        },
      ],

      // DO Queue and DO Sharded Tag Cache
      "durable_objects": {
        "bindings": [
          {
            "name": "NEXT_CACHE_DO_QUEUE",
            "class_name": "DOQueueHandler",
          },
          // This is only required if you use On-demand revalidation
          {
            "name": "NEXT_TAG_CACHE_DO_SHARDED",
            "class_name": "DOShardedTagCache",
          },
          {
            "name": "NEXT_CACHE_DO_PURGE",
            "class_name": "BucketCachePurge",
          },
        ],
      },
      "migrations": [
        {
          "tag": "v1",
          "new_sqlite_classes": [
            "DOQueueHandler",
            // This is only required if you use On-demand revalidation
            "DOShardedTagCache",
            "BucketCachePurge",
          ],
        },
      ],
    }

#### SSG site[](#ssg-site)

If your site is static, you do not need a Queue nor a Tag Cache. You can use a read-only Workers Static Assets-based incremental cache for the prerendered routes.

open-next.config.ts

open-next.config.ts

    import { defineCloudflareConfig } from "@opennextjs/cloudflare";
    import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

    export default defineCloudflareConfig({
      incrementalCache: staticAssetsIncrementalCache,
      enableCacheInterception: true,
    });

#### Staging[](#staging)

For staging, when your site receives low traffic from a single IP, you can replace the DO queue with a memory queue.

### References[](#references)

#### Static Assets Caching[](#static-assets-caching)

The worker doesn't run **in front** of static assets, so the `headers` option of `next.config.ts` doesn't apply to public files (`public`) and immutable build files (like `_next/static`).

By default, Cloudflare [Static Assets headers (opens in a new tab)](https://developers.cloudflare.com/workers/static-assets/headers/#default-headers) use `max-age=0` with `must-revalidate`, allowing the browser to cache assets but with a revalidation request. This is the [same default behavior as the `public` folder on Next.js (opens in a new tab)](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder#caching).

Next.js also generates _immutable_ files that don't change between builds. Those files will also be served from Static Assets. To match the [default cache behavior of immutable assets in Next.js (opens in a new tab)](https://nextjs.org/docs/app/guides/self-hosting#automatic-caching), avoiding unnecessary revalidation requests, add the following header to the [`public/_headers` (opens in a new tab)](https://developers.cloudflare.com/workers/static-assets/headers/#custom-headers) file:

public/\_headers

    /_next/static/*
      Cache-Control: public,max-age=31536000,immutable

#### Incremental Static Regeneration (ISR)[](#incremental-static-regeneration-isr)

There are 3 storage options for the incremental cache:

- **R2 Object Storage:** A [cost-effective (opens in a new tab)](https://developers.cloudflare.com/r2/pricing/) S3-compatible object storage option for large amounts of unstructured data. Data is stored in a single region, meaning cache interactions may be slower - this can be mitigated with a regional cache.
- **Workers KV:** A [fast (opens in a new tab)](https://blog.cloudflare.com/faster-workers-kv) key value store, it uses Cloudflare's [Tiered Cache (opens in a new tab)](https://developers.cloudflare.com/cache/how-to/tiered-cache/) to increase cache hit rates. When you write cached data to Workers KV, you write to storage that can be read by any Cloudflare location. This means your app can fetch data, cache it in KV, and then subsequent requests anywhere around the world can read from this cache. We do not recommend using KV because it is eventually consistent.
- **Workers Static Assets:** A read-only store for the incremental cache, serving build-time values from [Workers Static Assets (opens in a new tab)](https://developers.cloudflare.com/workers/static-assets/). Revalidation is not supported with this cache.

R2 Object StorageWorkers KVWorkers Static Assets

##### 1\. Create an R2 Bucket

    npx wrangler@latest r2 bucket create <YOUR_BUCKET_NAME>

##### 2\. Add the R2 Bucket and Service Binding to your Worker

The binding name used in your app's worker is `NEXT_INC_CACHE_R2_BUCKET`. The service binding should be a self reference to your worker where `<WORKER_NAME>` is the name in your wrangler configuration file.

The prefix used by the R2 bucket can be configured with the `NEXT_INC_CACHE_R2_PREFIX` environment variable, and defaults to `incremental-cache`.

wrangler.jsonc

    {
      // ...
      "name": "<WORKER_NAME>",
      "r2_buckets": [
        {
          "binding": "NEXT_INC_CACHE_R2_BUCKET",
          "bucket_name": "<BUCKET_NAME>",
        },
      ],
      "services": [
        {
          "binding": "WORKER_SELF_REFERENCE",
          "service": "<WORKER_NAME>",
        },
      ],
    }

##### 3\. Configure the cache

In your project's OpenNext config, enable the R2 cache.

You can optionally setup a regional cache to use with the R2 incremental cache. This will enable faster retrieval of cache entries and reduce the amount of requests being sent to object storage.

The regional cache has two modes:

- `short-lived`: Responses are re-used for up to a minute.
- `long-lived`: Fetch responses are re-used until revalidated, and ISR/SSG responses are re-used for up to 30 minutes.

Additionally there are options you can use to customize the behavior of the regional cache:

- `shouldLazilyUpdateOnCacheHit`: Instructs the cache to be lazily updated, meaning that when requesting data from the cache, a background request is sent to the R2 bucket to get the latest entry. This is enabled by default for the `long-lived` mode.
- `bypassTagCacheOnCacheHit`: Instructs the cache not to check the tag cache when there is a regional cache hit. This enables reducing response times. When this option is used you need to make sure that the cache gets correctly purged either by enabling the [automatic cache purge](/cloudflare/caching#automatic-cache-purge) or purging the cache manually. Defaults to `false`.

open-next.config.ts

    import { defineCloudflareConfig } from "@opennextjs/cloudflare";
    import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
    import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";
    // ...

    // With regional cache enabled:
    export default defineCloudflareConfig({
      incrementalCache: withRegionalCache(r2IncrementalCache, {
        mode: "long-lived",
        bypassTagCacheOnCacheHit: true,
      }),
      // ...
    });

    // Without regional cache:
    export default defineCloudflareConfig({
      incrementalCache: r2IncrementalCache,
      // ...
    });

#### Queue[](#queue)

A queue must be setup for projects using Time-Based revalidation. It is not needed when revalidation is not used nor only On-Demand revalidation is used.

**Configure the queue**

In your project's OpenNext config, enable the cache and set up a queue.

The Durable Object Queue will send revalidation requests to a page when needed, and offers support for de-duplicating requests. By default there will be a maximum of 10 instance of the Durables Object Queue and they can each process up to 5 requests in parallel, for up to 50 concurrent ISR revalidations.

open-next.config.ts

    import { defineCloudflareConfig } from "@opennextjs/cloudflare";
    // ...
    import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
    import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

    export default defineCloudflareConfig({
      // ...
      incrementalCache: r2IncrementalCache,
      queue: doQueue,
    });

You will also need to add some binding to your `wrangler.jsonc` file.

wrangler.jsonc

    {
      "durable_objects": {
        "bindings": [
          {
            "name": "NEXT_CACHE_DO_QUEUE",
            "class_name": "DOQueueHandler",
          },
        ],
      },
      "migrations": [
        {
          "tag": "v1",
          "new_sqlite_classes": ["DOQueueHandler"],
        },
      ],
    }

You can customize the behaviors of the queue with environment variables:

- The max number of revalidations that can be processed by an instance of durable object at the same time (`NEXT_CACHE_DO_QUEUE_MAX_REVALIDATION`)
- The max time in milliseconds that a revalidation can take before being considered as failed (`NEXT_CACHE_DO_QUEUE_REVALIDATION_TIMEOUT_MS`)
- The amount of time after which a revalidation will be attempted again if it failed. If it fails again it will exponentially back off until it reaches the max retry interval (`NEXT_CACHE_DO_QUEUE_RETRY_INTERVAL_MS`)
- The maximum number of attempts that can be made to revalidate a path (`NEXT_CACHE_DO_QUEUE_MAX_RETRIES`)
- Disable SQLite for this durable object. It should only be used if your incremental cache is not eventually consistent (`NEXT_CACHE_DO_QUEUE_DISABLE_SQLITE`)

💡

There is 2 additional modes that you can use for the queue `direct` and the memory queue

- The memory queue will dedupe request but only on a per isolate basis. It is not fully suitable for production deployments, you can use it at your own risk!
- The `direct` mode for the queue is intended for debugging purposes and is not recommended for use in production. It only works in preview mode (i.e. `wrangler dev`)

  For apps using the Page Router, `res.revalidate` requires to provide a self reference service binding named `WORKER_SELF_REFERENCE`.

In certain situations, you may encounter the limits of what the Durable Object queue can manage for a single page or route. In such cases, you can utilize the queueCache to minimize the number of stale requests sent to the queue. This is achieved by adding and verifying a cache entry via the Cache API before dispatching a request to the queue. If a cache entry already exists, the request will not be sent to the queue, as it will be considered already in process.

open-next.config.ts

    import { defineCloudflareConfig } from "@opennextjs/cloudflare";
    // ...
    import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
    import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";
    import queueCache from "@opennextjs/cloudflare/overrides/queue/queue-cache";

    export default defineCloudflareConfig({
      // ...
      incrementalCache: r2IncrementalCache,
      queue: queueCache(doQueue, {
        regionalCacheTtlSec: 5, // The TTL for the regional cache, defaults to 5 seconds

        // Whether to wait for the queue to acknowledge the request before returning
        // When set to false, the cache will be populated asap and the queue will be called after.
        // When set to true, the cache will be populated only after the queue ack is received.
        waitForQueueAck: true,
      }),
    });

#### Tag Cache for On-Demand Revalidation[](#tag-cache-for-on-demand-revalidation)

The tag revalidation mechanism can use either a [Cloudflare D1 (opens in a new tab)](https://developers.cloudflare.com/d1/) database or [Durable Objects (opens in a new tab)](https://developers.cloudflare.com/durable-objects/) with `SqliteStorage` as its backing store for information about tags, paths, and revalidation times.

To use on-demand revalidation, you should also follow the [ISR setup steps](/cloudflare/caching#incremental-static-regeneration-isr).

💡

If your app **only** uses the pages router, it does not need to have a tag cache and should skip this step. You can also skip this step if your app doesn't use `revalidateTag` nor `revalidatePath`.

There are 2 different options to choose from for the tag cache: `d1NextTagCache`, `doShardedTagCache`. Which one to choose should be based on two key factors:

1.  **Expected Load**: Consider the volume of traffic or data you anticipate.
2.  **Usage of** `revalidateTag` / `revalidatePath`: Evaluate how frequently these features will be utilized.

If either of these factors is significant, opting for a sharded database is recommended. Additionally, incorporating a regional cache can further enhance performance.

D1NextTagCachedoShardedTagCachewithFilter

**Create a D1 database and Service Binding**

The binding name used in your app's worker is `NEXT_TAG_CACHE_D1`. The `WORKER_SELF_REFERENCE` service binding should be a self reference to your worker where `<WORKER_NAME>` is the name in your wrangler configuration file.

wrangler.jsonc

    {
      // ...
      "d1_databases": [
        {
          "binding": "NEXT_TAG_CACHE_D1",
          "database_id": "<DATABASE_ID>",
          "database_name": "<DATABASE_NAME>",
        },
      ],
      "services": [
        {
          "binding": "WORKER_SELF_REFERENCE",
          "service": "<WORKER_NAME>",
        },
      ],
    }

**Create table for tag revalidations**

The D1 tag cache requires a `revalidations` table that tracks On-Demand revalidation times.

**Configure the cache**

In your project's OpenNext config, enable the R2 cache and set up a queue (see above). The queue will send a revalidation request to a page when needed, but it will not dedupe requests.

open-next.config.ts

    import { defineCloudflareConfig } from "@opennextjs/cloudflare";
    import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
    import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";
    import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";

    export default defineCloudflareConfig({
      incrementalCache: r2IncrementalCache,
      queue: doQueue,
      tagCache: d1NextTagCache,
    });

##### 4\. Initialize the cache during deployments

In order for the cache to be properly initialized with the build-time revalidation data, you need to run a command as part of your deploy step. This should be run as part of each deployment to ensure that the cache is being populated with each build's data.

To populate remote bindings and create a new [version (opens in a new tab)](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/#versions) of your application at the same time, you can use either the [`deploy`](/cloudflare/cli#deploy-command) command or the [`upload`](/cloudflare/cli#upload-command) command. Similarly, the [`preview`](/cloudflare/cli#preview-command) command will populate your local bindings and start a Wrangler dev server.

#### Automatic Cache Purge[](#automatic-cache-purge)

💡

You can only enable cache purge functionality on a zone (e.g., when using a custom domain).

The cache purge component automatically clears the cache when a page is revalidated. It is only necessary if you use On-Demand revalidation along with one of the cache components that leverage the Cache API.

This component can either call the Cache API's purge function directly or route the purge request through an intermediate durable object. Using a durable object helps buffer requests and avoid reaching [API rate limits (opens in a new tab)](https://developers.cloudflare.com/cache/how-to/purge-cache/#hostname-tag-prefix-url-and-purge-everything-limits).

Cache purge are only called when you call `revalidateTag`, `revalidatePath` or `res.revalidate` in the pages router. It is not called for ISR revalidation.

To use cache purge, you need to define the following wrangler secrets:

- `CACHE_PURGE_API_TOKEN` should be set to [an API token (opens in a new tab)](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/) with the `Cache Purge` permission
- `CACHE_PURGE_ZONE_ID` should be set to the [zone ID of your deployment domain (opens in a new tab)](https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/)

Below is an example configuration for integrating the cache purge component in your `open-next.config.ts`:

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
      tagCache: doShardedTagCache({ baseShardSize: 12 }),
      // Disable this if you want to use PPR
      enableCacheInterception: true,
      // you can also use the `durableObject` option to use a durable object as a cache purge
      cachePurge: purgeCache({ type: "direct" }),
    });

If you want to use the durable object option, you will need to add the following binding to your `wrangler.jsonc` file:

wrangler.jsonc

    {
      "durable_objects": {
        "bindings": [
          {
            "name": "NEXT_CACHE_DO_PURGE",
            "class_name": "BucketCachePurge",
          },
        ],
      },
      "migrations": [
        {
          "tag": "v1",
          "new_sqlite_classes": ["BucketCachePurge"],
        },
      ],
    }

You can customize the duration of the cache purge buffering with the `NEXT_CACHE_DO_PURGE_BUFFER_TIME_IN_SECONDS` environment variable. The default is 5 seconds. It works by buffering the purge requests for a given amount of time and then sending them all at once. This is useful to avoid hitting the API rate limits.

### Debugging[](#debugging)

You can add `NEXT_PRIVATE_DEBUG_CACHE=1` to your app `.env` file to debug any cache issue. The app will output logs whenever the cache is accessed - those logs are generated by both Next and the cache adapter. You can find more details in [the Next documentation (opens in a new tab)](https://nextjs.org/docs/app/guides/incremental-static-regeneration#verifying-correct-production-behavior)

Light

---

Maintained by the OpenNext community

[GitHub](https://github.com/opennextjs)[Discord](https://discord.gg/ope
