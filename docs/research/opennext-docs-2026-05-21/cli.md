---
source: https://opennext.js.org/cloudflare/cli
scraped: 2026-05-21
bytes: 14789
---

CLI - OpenNext

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
      - [Contribute](/cloudflare/cli#)

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

- [opennextjs-cloudflare CLI](#opennextjs-cloudflare-cli)
- [commands](#commands)
- [build command](#build-command)
- [populateCache command](#populatecache-command)
- [Populating remote bindings when Workers are protected by Cloudflare Access](#populating-remote-bindings-when-workers-are-protected-by-cloudflare-access)
- [preview command](#preview-command)
- [deploy command](#deploy-command)
- [upload command](#upload-command)
- [migrate command](#migrate-command)

[Question? Give us feedback → (opens in a new tab)](https://github.com/opennextjs)[Edit this page](https://github.com/opennextjs/docs/tree/main/pages/cloudflare/cli.mdx)

Cloudflare

CLI (opennextjs-cloudflare)

## `opennextjs-cloudflare` CLI[](#opennextjs-cloudflare-cli)

The Cloudflare adapter provides a `opennextjs-cloudflare` CLI to develop, build, and deploy your application. You should not use `wrangler` commands directly unless documented otherwise or if you know what you are doing.

## commands[](#commands)

`opennextjs-cloudflare` support multiple commands, invoked via `opennextjs-cloudflare <command>`.

The currently supported commands are `build`, `populateCache`, `preview`, `deploy`, `upload`, and `migrate`.

You can list the commands by invoking `pnpm opennextjs-cloudflare` and get help with a given command by invoking `pnpm opennextjs-cloudflare <command> --help`.

Most commands take command specific options (i.e. `pnpm opennextjs-cloudflare build --skipNextBuild --noMinify`) and also accept wrangler options (i.e. `pnpm opennextjs-cloudflare build --config=/path/to/wrangler.jsonc --env=prod`).

### `build` command[](#build-command)

It first builds the Next.js application by invoking the `build` script of the `package.json` - which typically execute `next build`. It then runs the Cloudflare specific build step to update the built files to run on the Cloudflare runtime.

### `populateCache` command[](#populatecache-command)

It populates the configured [Open Next cache components](/cloudflare/caching) so that caching works at runtime. It can populate the local bindings (`populateCache local`) used during development on your local machine or the remote bindings (`populateCache remote`) used by the deployed application. Note that this command is implicitly called by the `preview`, `deploy`, and `upload` commands so there is no need to explicitly call `populateCache` when one of those is used.

From version 1.13.0 of the Cloudflare adapter, R2 batch uploads are supported out of the box for preview and deploy without any additional setup.

Before version 1.13.0 of the Cloudflare adapter, the `populateCache` command was supporting R2 batch uploads via `rclone` which required the following additional setup:

The `populateCache` command supports R2 batching to speed up the upload of large number of files. To enable R2 batching, you need to create an R2 Account API token as described [in the docs (opens in a new tab)](https://developers.cloudflare.com/r2/api/tokens/) and provide the following environment variables:

- `R2_ACCESS_KEY_ID`: The access key ID of the R2 API token
- `R2_SECRET_ACCESS_KEY`: The secret access key of the R2 API token
- `CLOUDFLARE_ACCOUNT_ID`: The [account ID (opens in a new tab)](https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/#copy-your-account-id) where the R2 bucket is located

#### Populating remote bindings when Workers are protected by Cloudflare Access[](#populating-remote-bindings-when-workers-are-protected-by-cloudflare-access)

`populateCache remote` (also called implicitly by `deploy` and `upload`) temporarily deploys a helper Worker named `open-next-cache-populate` at `open-next-cache-populate.<account>.workers.dev` and uses it to write to your remote R2 bucket.

If your account's `workers.dev` subdomain — or a parent route on a custom domain — is protected by [Cloudflare Access (opens in a new tab)](https://developers.cloudflare.com/cloudflare-one/applications/), the helper Worker is protected by the same policy and the upload fails with either:

    Failed to send request to R2 worker: The operation was aborted due to timeout.

or a `403 Forbidden` returned by the Access edge.

To let the adapter authenticate:

1.  Open the **existing** Cloudflare Access application that already covers `open-next-cache-populate.<account>.workers.dev` — typically the wildcard application for `*.<account>.workers.dev` — and attach the policy described below to that application.

    ⚠️

    Creating a separate Access application scoped specifically to the `open-next-cache-populate` hostname has been observed to block the upload, even when kept alongside the existing wildcard application (see [#1171 (opens in a new tab)](https://github.com/opennextjs/opennextjs-cloudflare/issues/1171)). Prefer attaching the policy to the existing application that already protects the hostname.

2.  Add a **Service Auth** policy to that application:
    - Set the policy **Action** to "Service Auth".
    - Add an **Include** rule for "Any Access Service Token", or for a specific service token.

3.  Create the service token under Zero Trust → Access → Service Auth → Service Tokens, then expose its credentials to the environment that runs `opennextjs-cloudflare`:

        export CLOUDFLARE_ACCESS_CLIENT_ID=<id>
        export CLOUDFLARE_ACCESS_CLIENT_SECRET=<secret>

    Then run `opennextjs-cloudflare populateCache remote` (or `deploy` / `upload`). In CI, set the two values as secrets and expose them to the deploy step.

### `preview` command[](#preview-command)

It starts by populating the local cache and then launches a local development server (via `wrangler dev`) so that you can preview the application locally.

### `deploy` command[](#deploy-command)

It starts by populating the remote cache and then deploys your application to Cloudflare (via `wrangler deploy`). The application will start serving as soon as it is deployed.

### `upload` command[](#upload-command)

It starts by populating the remote cache and then uploads a version of your application to Cloudflare (via `wrangler versions upload`). Note that the application will not automatically be served on uploads. See [Gradual deployments (opens in a new tab)](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/gradual-deployments/) to learn more about how to serve an uploaded version.

### `migrate` command[](#migrate-command)

Converts a standard Next.js project into an OpenNext-compatible one. This command automates the setup steps described in the [Get Started guide](/cloudflare/get-started#existing-nextjs-apps), including:

- Installing required dependencies (`@opennextjs/cloudflare` and `wrangler`)
- Creating a `wrangler.jsonc` configuration file
- Creating an `open-next.config.ts` file
- Adding a `.dev.vars` file
- Updating the `package.json` scripts
- Adding static asset caching headers (`public/_headers`)
- Adding `.open-next` to `.gitignore`
- Setting up local development with `initOpenNextCloudflareForDev()` in your Next.js config

Additionally, the command creates an R2 bucket and configures it for caching.

The R2 bucket for caching is only created if R2 is enabled on your Cloudflare account. If R2 is not enabled, no caching setup is performed by the migrate command. See the [Caching docs](/cloudflare/caching) for information on manually configuring caching.

Run the command in your existing Next.js project:

    npx @opennextjs/cloudflare migrate

Light

---

Maintained by the OpenNext community

[GitHub](https://github.com/opennextjs)[Discord](https://di
