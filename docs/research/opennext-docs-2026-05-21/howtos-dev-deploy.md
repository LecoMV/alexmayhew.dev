---
source: https://opennext.js.org/cloudflare/howtos/dev-deploy
scraped: 2026-05-21
bytes: 12742
---

Dev Deploy - OpenNext

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
      - [Contribute](/cloudflare/howtos/dev-deploy#)

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

- [Develop and deploy](#develop-and-deploy)
- [Development workflow](#development-workflow)
- [Create a new application based on a template](#create-a-new-application-based-on-a-template)
- [Develop locally using next dev](#develop-locally-using-next-dev)
- [Use opennextjs-cloudflare to build and test on the Workers runtime](#use-opennextjs-cloudflare-to-build-and-test-on-the-workers-runtime)
- [Deploy your application to Cloudflare Workers](#deploy-your-application-to-cloudflare-workers)
- [Local build](#local-build)
- [Workers Builds](#workers-builds)

[Question? Give us feedback → (opens in a new tab)](https://github.com/opennextjs)[Edit this page](https://github.com/opennextjs/docs/tree/main/pages/cloudflare/howtos/dev-deploy.mdx)

Cloudflare

How-Tos

Develop and Deploy

## Develop and deploy[](#develop-and-deploy)

### Development workflow[](#development-workflow)

The primary purpose of `@opennextjs/cloudflare` is to take a Next.js application, built with standard Next.js tooling, and convert it into a format compatible with Cloudflare Workers.

This code transformation process takes some time, making the adapter less than ideal for active application development, where a very fast feedback loop and other quality-of-life features, such as Hot Module Replacement (HMR), are crucial. Fortunately, Vercel already provides excellent tooling for this workflow, which Next.js developers are likely already familiar with.

We recommend that developers continue using the tools they are already comfortable with for local development and then use `@opennextjs/cloudflare` when they are ready to deploy their applications to the Cloudflare platform.

Let's explore, in more detail, the application development workflow we recommend for the best developer experience.

#### Create a new application based on a template[](#create-a-new-application-based-on-a-template)

To create a new Next.js app, pre-configured to run on Cloudflare using `@opennextjs/cloudflare`, run:

    npm create cloudflare@latest -- my-next-app --framework=next --platform=workers

#### Develop locally using `next dev`[](#develop-locally-using-next-dev)

We believe that the best development workflow uses the `next dev` command provided by Next.js.

To access Cloudflare resources using the `getCloudflareContext` API while running `next dev`, you will need to update the Next.js configuration to call `initOpenNextCloudflareForDev`, as shown in the following example:

next.config.ts

    import type { NextConfig } from "next";

    const nextConfig: NextConfig = {
      /* config options here */
    };

    export default nextConfig;

    import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
    initOpenNextCloudflareForDev();

#### Use `opennextjs-cloudflare` to build and test on the Workers runtime[](#use-opennextjs-cloudflare-to-build-and-test-on-the-workers-runtime)

After you've finished iterating on your Next.js application with `next dev`, you can convert it to a Cloudflare Worker by running the [`opennextjs-cloudflare build` command](/cloudflare/cli#build-command). This will generate the Worker code in the `.open-next` directory.

You can then preview the app locally in the Cloudflare Workers runtime.

To preview your worker locally, run the [`opennextjs-cloudflare preview` command](/cloudflare/cli#preview-command). This will populate the cache and create a local server that runs your worker in the Cloudflare Workers runtime. Testing your worker is important to ensure that it has been properly built and is working as expected.

### Deploy your application to Cloudflare Workers[](#deploy-your-application-to-cloudflare-workers)

Both the [`deploy`](/cloudflare/cli#deploy-command) and [`upload`](/cloudflare/cli#upload-command) commands of `opennextjs-cloudflare` can be used to deploy your application to cloudflare Workers. Both commands will initialize the remote cache and upload your application to the Cloudflare infrastructure.

While `deploy` will start serving your application as soon as it is uploaded, `upload` only creates a new version of the application so that you can use [gradual deployments (opens in a new tab)](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/gradual-deployments/).

#### Local build[](#local-build)

Use the `build` command followed by either `deploy` or `upload` to deploy your local build.

⚠️

When running the `build` command locally, `.dev.vars` and [Next `.env` files (opens in a new tab)](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables) might override your configuration. It is preferable to use a CD system as [Workers Builds (opens in a new tab)](https://developers.cloudflare.com/workers/ci-cd/builds/) to deploy your application for reproducible deployments.

#### Workers Builds[](#workers-builds)

When using Workers Builds, make sure to setup your environment variables as explained in [this guide (opens in a new tab)](https://opennext.js.org/cloudflare/howtos/env-vars#production).

You can then connect your GitHub repository by following [the documentation (opens in a new tab)](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/).

In the Build settings:

- The "Build command" should be set to `npx @opennextjs/cloudflare build`.
- The "Deploy command" should be set to `npx @opennextjs/cloudflare deploy` (or `upload` to use gradual deployments).

Light

---

Maintained by the OpenNext community

[GitHub](https://github.com/opennextjs)[Discord](https://discord.gg/openn
