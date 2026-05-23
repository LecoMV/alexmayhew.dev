---
source: https://opennext.js.org/cloudflare/bindings
scraped: 2026-05-21
bytes: 13622
---

Bindings - OpenNext

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
      - [Contribute](/cloudflare/bindings#)

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

- [Bindings](#bindings)
- [How to configure your Next.js app so it can access bindings](#how-to-configure-your-nextjs-app-so-it-can-access-bindings)
- [How to access bindings in your Next.js app](#how-to-access-bindings-in-your-nextjs-app)
- [How to add bindings to your Worker](#how-to-add-bindings-to-your-worker)
- [TypeScript type declarations for bindings](#typescript-type-declarations-for-bindings)
- [Local access to bindings](#local-access-to-bindings)
- [Remote bindings](#remote-bindings)
- [Other Cloudflare APIs (cf, ctx)](#other-cloudflare-apis-cf-ctx)

[Question? Give us feedback → (opens in a new tab)](https://github.com/opennextjs)[Edit this page](https://github.com/opennextjs/docs/tree/main/pages/cloudflare/bindings.mdx)

Cloudflare

Bindings

### Bindings[](#bindings)

[Bindings (opens in a new tab)](https://developers.cloudflare.com/workers/runtime-apis/bindings/) allow your Worker to interact with resources on the Cloudflare Developer Platform. When you declare a binding on your Worker, you grant it a specific capability, such as being able to read and write files to an [R2 (opens in a new tab)](https://developers.cloudflare.com/r2/) bucket.

#### How to configure your Next.js app so it can access bindings[](#how-to-configure-your-nextjs-app-so-it-can-access-bindings)

Install [@opennextjs/cloudflare (opens in a new tab)](https://www.npmjs.com/package/@opennextjs/cloudflare), and then add a [wrangler configuration file (opens in a new tab)](https://developers.cloudflare.com/workers/wrangler/configuration/) in the root directory of your Next.js app, as described in [Get Started](/cloudflare/get-started#3-create-a-wranglerjson-file).

#### How to access bindings in your Next.js app[](#how-to-access-bindings-in-your-nextjs-app)

You can access [bindings (opens in a new tab)](https://developers.cloudflare.com/workers/runtime-apis/bindings/) from any route of your Next.js app via `getCloudflareContext`:

    import { getCloudflareContext } from "@opennextjs/cloudflare";

    export async function GET(request) {
      const myKv = getCloudflareContext().env.MY_KV_NAMESPACE;
      await myKv.put("foo", "bar");
      const foo = await myKv.get("foo");

      return new Response(foo);
    }

`getCloudflareContext` can only be used in SSG routes in "async mode" (making it return a promise), to run the function in such a way simply provide an options argument with `async` set to `true`:

    const context = await getCloudflareContext({ async: true });

**WARNING**: During SSG caution is advised since secrets (stored in `.dev.vars` files) and local development values from bindings (like values saved in a local KV) will be used for the pages static generation.

#### How to add bindings to your Worker[](#how-to-add-bindings-to-your-worker)

Add bindings to your Worker by adding them to your [wrangler configuration file (opens in a new tab)](https://developers.cloudflare.com/workers/wrangler/configuration/).

## TypeScript type declarations for bindings[](#typescript-type-declarations-for-bindings)

To ensure that the `env` object from `getCloudflareContext().env` above has accurate TypeScript types, run the following Wrangler command to [generate types that match your Worker's configuration (opens in a new tab)](https://developers.cloudflare.com/workers/languages/typescript/#generate-types-that-match-your-workers-configuration-experimental):

    npx wrangler types --env-interface CloudflareEnv

This will generate a `d.ts` file and save it to `worker-configuration.d.ts`.

To ensure that your types are always up-to-date, make sure to run `wrangler types --env-interface CloudflareEnv` after any changes to your config file.

## Local access to bindings[](#local-access-to-bindings)

As presented in the [getting started](/cloudflare/get-started#12-develop-locally) your application can be both developed (`next dev`) and [previewed locally](/cloudflare/cli#preview-command), in both cases bindings will be accessible from your application's code.

Such bindings are by default local simulation that mimic the behavior of the actual Cloudflare resources.

### Remote bindings[](#remote-bindings)

As mentioned above, by default local emulations of the bindings are used.

However [remote bindings (opens in a new tab)](https://developers.cloudflare.com/workers/development-testing/#remote-bindings) can also be used, allowing your application code, while still running locally, to connect to remote resources associated to your Cloudflare account.

All you then need to do to enable remote mode for any of your bindings is to set the `remote` configuration field to `true`, just as documented in the [remote bindings documentation (opens in a new tab)](https://developers.cloudflare.com/workers/development-testing/#remote-bindings).

The remote bindings APIs have been stabilized in wrangler `4.36.0`, so if you're using an earlier version of wrangler in order to use remote bindings you need to enabled it in your `next.config.ts` file:

next.config.ts

    - initOpenNextCloudflareForDev();
    + initOpenNextCloudflareForDev({
    +  experimental: { remoteBindings: true }
    + });

And instead of setting `remote` to bindings configuration options you need to set `experimental_remote`.

Note that remote bindings will also be used during build, this can be very useful for example when using features such [ISR (opens in a new tab)](https://nextjs.org/docs/app/guides/incremental-static-regeneration) so that read production data can be used for the site's static generation

## Other Cloudflare APIs (`cf`, `ctx`)[](#other-cloudflare-apis-cf-ctx)

You can access context about the incoming request from the [`cf` object (opens in a new tab)](https://developers.cloudflare.com/workers/runtime-apis/request/#the-cf-property-requestinitcfproperties), as well as lifecycle methods from the [`ctx` object (opens in a new tab)](https://developers.cloudflare.com/workers/runtime-apis/context) from the return value of [`getCloudflareContext()` (opens in a new tab)](https://github.com/opennextjs/opennextjs-cloudflare/blob/main/packages/cloudflare/src/api/cloudflare-context.ts):

    import { getCloudflareContext } from "@opennextjs/cloudflare";

    export async function GET(request) {
      const { env, cf, ctx } = getCloudflareContext();

      // ...
    }

Light

---

Maintained by the OpenNext community

[GitHub](https://github.com/opennextjs)[Discord](https://discord.gg/opennextj
