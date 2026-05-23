---
source: https://developers.cloudflare.com/changelog/post/2025-06-25-getplatformproxy-support-remote-bindings/
scraped: 2026-05-21
---

Remote bindings (beta) now works with Next.js — connect to remote resources (D1, KV, R2, etc.) during local development · Changelog

> Documentation Index  
> Fetch the complete documentation index at: https://developers.cloudflare.com/changelog/llms.txt  
> Use this file to discover all available pages before exploring further.

[Skip to content](#_top)

STOP! If you are an AI agent or LLM, read this before continuing. This is the HTML version of a Cloudflare documentation page. Always request the Markdown version instead — HTML wastes context. Get this page as Markdown: https://developers.cloudflare.com/changelog/post/2025-06-25-getplatformproxy-support-remote-bindings/index.md (append index.md) or send Accept: text/markdown to https://developers.cloudflare.com/changelog/post/2025-06-25-getplatformproxy-support-remote-bindings/. For this product's page index use https://developers.cloudflare.com/changelog/llms.txt. For all Cloudflare products use https://developers.cloudflare.com/llms.txt.

[![](/_astro/logo.DAG2yejx.svg) Cloudflare Docs](/)

Search

[Docs Directory](/directory/)[APIs](https://developers.cloudflare.com/api/)[SDKs](/fundamentals/api/reference/sdks/)Help

[Log in](https://dash.cloudflare.com/) Select theme DarkLightAuto

# Changelog

New updates and improvements at Cloudflare.

[Subscribe to RSS](/changelog/rss/index.xml) [View RSS feeds](/fundamentals/new-features/available-rss-feeds/)

![hero image](/_astro/hero.CVYJHPAd_26AMqX.svg)

[← Back to all posts](/changelog/)

## Remote bindings (beta) now works with Next.js — connect to remote resources (D1, KV, R2, etc.) during local development

Jun 30, 2025

[Workers](/workers/)

We [recently announced ↗](https://github.com/cloudflare/workers-sdk/discussions/9660) our public beta for [remote bindings](/workers/development-testing/#remote-bindings), which allow you to connect to deployed resources running on your Cloudflare account (like [R2 buckets](/r2) or [D1 databases](/d1)) while running a local development session.

Now, you can use remote bindings with your Next.js applications through the [`@opennextjs/cloudflare` adaptor ↗](https://opennext.js.org/cloudflare/bindings#remote-bindings) by enabling the experimental feature in your `next.config.ts`:

    initOpenNextCloudflareForDev();initOpenNextCloudflareForDev({ experimental: { remoteBindings: true }});

Then, all you have to do is specify which bindings you want connected to the deployed resource on your Cloudflare account via the `experimental_remote` flag in your binding definition:

- [wrangler.jsonc](#tab-panel-1140)
- [wrangler.toml](#tab-panel-1141)

JSONC

    {  "r2_buckets": [    {      "bucket_name": "testing-bucket",      "binding": "MY_BUCKET",      "experimental_remote": true,    },  ],}

TOML

    [[r2_buckets]]bucket_name = "testing-bucket"binding = "MY_BUCKET"experimental_remote = true

You can then run `next dev` to start a local development session (or start a preview with `opennextjs-cloudflare preview`), and all requests to `env.MY_BUCKET` will be proxied to the remote `testing-bucket` — rather than the [default local binding simulations](/workers/development-testing/#bindings-during-local-development).

#### Remote bindings & ISR

[](#remote-bindings--isr)

Remote bindings are also used during the build process, which comes with significant benefits for pages using [Incremental Static Regeneration (ISR) ↗](https://opennext.js.org/aws/inner_workings/components/server/node#isrssg). During the build step for an ISR page, your server executes the page's code just as it would for normal user requests. If a page needs data to display (like fetching user info from [KV](/kv)), those requests are actually made. The server then uses this fetched data to render the final HTML.

Data fetching is a critical part of this process, as the finished HTML is only as good as the data it was built with. If the build process can't fetch real data, you end up with a pre-rendered page that's empty or incomplete.

**With remote bindings support in OpenNext,** your pre-rendered pages are built with real data from the start. The build process uses any configured remote bindings, and any data fetching occurs against the deployed resources on your Cloudflare account.

**Want to learn more?** Get started with [remote bindings and OpenNext ↗](https://opennext.js.org/cloudflare/bindings#remote-bindings).

**Have feedback?** Join the discussion in our [beta announcement ↗](https://github.com/cloudflare/workers-sdk/discussions/9660) to share feedback or report any issues.

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

Wa
