---
source: https://opennext.js.org/cloudflare/howtos/env-vars
scraped: 2026-05-21
---

Env Vars - OpenNext

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
      - [Contribute](/cloudflare/howtos/env-vars#)

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

- [Environment variables](#environment-variables)
- [Local development](#local-development)
- [Production](#production)
- [Workers Builds](#workers-builds)
- [Runtime variables](#runtime-variables)

[Question? Give us feedback → (opens in a new tab)](https://github.com/opennextjs)[Edit this page](https://github.com/opennextjs/docs/tree/main/pages/cloudflare/howtos/env-vars.mdx)

Cloudflare

How-Tos

Environment Variables

## Environment variables[](#environment-variables)

This entry describe the most sensible way to handle your environment variables which works well both during local development and once your application is deployed to Cloudflare Workers.

On the Cloudflare platform, your environment variables can be stored in either ["Environment variables" (opens in a new tab)](https://developers.cloudflare.com/workers/configuration/environment-variables/) or ["Secrets" (opens in a new tab)](https://developers.cloudflare.com/workers/configuration/secrets/). The difference being that Secrets can not be read back from either the dashboard or the CLI after being created.

### Local development[](#local-development)

While there are multiple ways to set environment variables for local development on the Cloudflare platform (adding them to to your [wrangler configuration (opens in a new tab)](https://developers.cloudflare.com/workers/configuration/secrets/) or to a [.dev.vars (opens in a new tab)](https://developers.cloudflare.com/workers/configuration/secrets/) file) that does not play well with the recommended development workflow as they would not be available while using `next dev`.

What you should do instead is to use the Next.js [`.env` files (opens in a new tab)](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables). By doing so the environment variables will be available on `process.env` both while running `next dev` and when running your app locally on a Worker with `wrangler dev`.

Next.js `.env` files are environment specific. That is a `.env.development` will take precedence over a `.env` file when you use the "development" environment. See the Next.js site for a detailed explanation of the [loading order (opens in a new tab)](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables).

You should use the `NEXTJS_ENV` environment variable to select the environment to use when running your app locally on a worker, that's how you would select the "development" environment:

.dev.vars

    NEXTJS_ENV=development

The "production" environment is used by default when `NEXTJS_ENV` is not explicitly set.

### Production[](#production)

`.env` and `.dev.vars` are local files that should not be added to source control. You should instead use the Cloudflare dashboard to set your environment variables for production.

#### Workers Builds[](#workers-builds)

When you use [Workers Builds (opens in a new tab)](https://developers.cloudflare.com/workers/ci-cd/builds/) to deploy your application, the environment variables must be set in the ["Build variables and secrets" (opens in a new tab)](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/).

By settings the "Build variables and secrets", the Next build executed by Workers Builds will have access to the environment variables. It needs that access to inline the [`NEXT_PUBLIC_...` variables (opens in a new tab)](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser) and access non-`NEXT_PUBLIC_...` variables needed for SSG pages.

#### Runtime variables[](#runtime-variables)

Your Next application needs to access environment variables at runtime. You should always set the runtime environment variables [in the Cloudflare dashboard (opens in a new tab)](https://developers.cloudflare.com/workers/configuration/environment-variables/#add-environment-variables-via-the-dashboard)

If you set environment variables from the dashboard, you can use the [`--keep-vars` (opens in a new tab)](https://developers.cloudflare.com/workers/wrangler/commands/#deploy) option of wrangler to prevent them from being deleted by deployments, i.e. `opennextjs-cloudflare deploy -- --keep-vars`

Light

---

Maintained by the OpenNext community

[GitHub](https://github.com/opennextjs)[Discord](https://discord.gg/opennextj
