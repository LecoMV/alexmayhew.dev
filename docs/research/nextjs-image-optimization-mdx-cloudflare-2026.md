# Next.js Image Optimization in MDX with Fumadocs + Cloudflare (2026-03-14)

**Status:** CURRENT
**Session:** Research for upgrading raw `<img>` in mdx-components.tsx to optimized `next/image`

---

## Executive Summary

The site is well-positioned to adopt `next/image` in MDX. The IMAGES binding is already configured in `wrangler.jsonc`. Fumadocs ships a `remark-image` plugin that handles static imports and dimension injection at build time — eliminating the hardest part of this problem. The upgrade path is a small, focused change to `source.config.ts` + `mdx-components.tsx`.

**Current state:** `mdx-components.tsx` renders a raw `<img>` with `// eslint-disable-next-line @next/next/no-img-element`. No optimization, no dimension hints, CLS risk for any inline images added in the future.

**Key fact:** Current blog posts use `image:` frontmatter for featured images only; the MDX _body_ contains no inline `![alt](src)` images as of this writing. This means the upgrade is low-risk and forward-looking.

---

## 1. Can next/image Be Used in MDX Components?

Yes, directly. Map the `img` MDX component to a wrapper around `next/image`:

```tsx
// src/components/mdx/mdx-components.tsx
import Image from "next/image";

img: ({ src, alt, width, height, ...props }) => (
  <figure className="my-6">
    <div className="bg-gunmetal-glass/20 relative border border-white/10 p-2">
      <div className="border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r" />
      <div className="border-cyber-lime absolute bottom-0 left-0 h-3 w-3 border-b border-l" />
      <Image
        src={src as string}
        alt={alt ?? ""}
        width={width ? Number(width) : 1200}
        height={height ? Number(height) : 630}
        className="w-full h-auto"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 800px"
      />
    </div>
    {alt && (
      <figcaption className="text-slate-text mt-2 font-mono text-xs">{`// ${alt}`}</figcaption>
    )}
  </figure>
),
```

The `img` element in MDX receives `src`, `alt`, `width`, and `height` as props. The `width`/`height` will be present if `remark-image` is enabled (see section 2).

**Edge runtime compatibility:** `next/image` works on Cloudflare Workers via the IMAGES binding. No `fs` or `path` usage — it's pure browser-compatible rendering.

---

## 2. Fumadocs remark-image Plugin

### What it does

Fumadocs ships `remark-image` (from `fumadocs-core/mdx-plugins`) which automatically:

1. Detects local images referenced in MDX (`![alt](./image.png)` or absolute `/images/...`)
2. Converts them to **static imports** (when `useImport: true`, the default)
3. Injects `width` and `height` props onto the `img` element from the imported module
4. Supports `blur` placeholder via the statically imported image object

The transformation: `![Hello](./hello.png)` becomes:

```js
import HelloImage from "./hello.png";
<img alt="Hello" src={HelloImage} />;
```

When passed to `next/image`, this static import object carries the dimensions automatically — no manual `width`/`height` needed.

### Configuration in source.config.ts

```ts
// source.config.ts
import { remarkImage } from "fumadocs-core/mdx-plugins";
import { defineConfig } from "fumadocs-mdx/config";

export default defineConfig({
	mdxOptions: {
		remarkPlugins: [
			[
				remarkImage,
				{
					useImport: true, // Default. Required for static imports + blur placeholder
					placeholder: "blur", // Enables blur-up loading (local images only)
					publicDir: "public", // Resolves absolute paths like /images/blog/...
				},
			],
		],
		rehypeCodeOptions: {
			themes: {
				light: "github-dark",
				dark: "github-dark",
			},
		},
	},
});
```

**Critical:** `useImport: true` is required. Setting it to `false` disables static imports and breaks asset bundling — Next.js won't copy the images to the build output.

### When remark-image runs

It runs at **build time** during the Fumadocs MDX compilation step. Width/height are embedded into the compiled MDX output. Zero runtime cost.

---

## 3. Remote vs Local Images in MDX

### Local images (in /public/)

With `remark-image` and `useImport: true`:

- Referenced as `/images/blog/my-image.webp` (absolute from `/public/`)
- Or `./relative-path.webp` (relative to the MDX file)
- Dimensions auto-detected at build time via static import
- Blur placeholder available

In `mdx-components.tsx`, the `src` prop will be a static import **object** (not a string), which `next/image` accepts natively and extracts dimensions from automatically.

### Remote images (CDN/external URLs)

`remark-image` can fetch dimensions from remote URLs at build time (controlled by `external: true` option). However, `next/image` also requires remote domains to be listed in `next.config.mjs`:

```js
// next.config.mjs
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "example.com",
    },
  ],
},
```

No remote images are currently used in the blog MDX body.

---

## 4. Width/Height for MDX Images — Handling Unknown Dimensions

Three strategies, ranked by preference for this site:

### Strategy A: Static imports via remark-image (RECOMMENDED)

remark-image resolves dimensions at build time. The `img` component in MDX receives the correct `width` and `height` props. The `next/image` component uses them to infer aspect ratio and reserve space — zero CLS.

```tsx
// In mdx-components.tsx: width/height come from remark-image
<Image
	src={src} // StaticImageData object (has .width, .height, .blurDataURL)
	alt={alt ?? ""}
	width={width}
	height={height}
	style={{ width: "100%", height: "auto" }} // responsive CSS
	sizes="(max-width: 768px) 100vw, 800px"
/>
```

When `src` is a static import object, `width` and `height` can be omitted from the JSX — next/image reads them from the object directly.

### Strategy B: fill + aspect-ratio container (fallback for unknown dimensions)

When dimensions cannot be known at build time (rare edge case):

```tsx
<div style={{ position: "relative", aspectRatio: "16/9" }}>
	<Image
		src={src as string}
		alt={alt ?? ""}
		fill
		style={{ objectFit: "contain" }}
		sizes="(max-width: 768px) 100vw, 800px"
	/>
</div>
```

The parent's `aspect-ratio` tells the browser how much space to reserve — preventing CLS — even before the image loads.

**fill requirement:** Parent must have `position: relative|fixed|absolute`. The image will be absolutely positioned within it.

### Strategy C: Fallback dimensions (pragmatic for known-size blog images)

Since all current blog images are 1200×630 WebP featured images, a sensible default of `width={1200} height={630}` is acceptable as a fallback when remark-image dimensions are absent (e.g., for absolute `/images/` paths without static import resolution).

---

## 5. Cloudflare IMAGES Binding — Format Conversion

### Current configuration

`wrangler.jsonc` already has:

```json
"images": {
  "binding": "IMAGES"
}
```

This is fully configured. OpenNext's Cloudflare adapter uses this binding to power `next/image` optimization.

### What the IMAGES binding provides

OpenNext's Cloudflare adapter intercepts `/_next/image` requests and routes them through Cloudflare Images via the binding. It:

- Resizes images to the requested `width` (from the `w=` query param next/image generates)
- Applies quality compression (`q=` param, default 75)
- **Serves WebP/AVIF automatically** based on the browser's `Accept` header — this is handled by Cloudflare at the CDN layer

### Format conversion behavior

Cloudflare Images automatically transcodes:

1. Check if browser supports AVIF → serve AVIF
2. Fallback to WebP if browser supports it
3. Fallback to original format (JPEG/PNG)

This is transparent — no `images.formats` config needed in `next.config.mjs`. The IMAGES binding handles format negotiation.

**Important:** The binding's `.output()` method requires an explicit format for raw Worker API usage. But OpenNext's adapter wraps this correctly — from the app developer's perspective, format is automatic.

### Supported input formats

PNG, JPEG, WEBP, AVIF, GIF, SVG. Unsupported inputs pass through unchanged.

All current blog images are `.webp` — fully supported.

### Cost note

Each image transformation costs per Cloudflare Images pricing. Aggressively set `sizes` prop to avoid requesting unnecessarily large widths.

---

## 6. CLS Prevention Best Practices

CLS (Cumulative Layout Shift) from images has two causes:

### Cause 1: Missing dimensions

**Fix:** Provide explicit `width` + `height` (or use `fill` with a sized container). next/image uses these to emit `aspect-ratio` CSS inline, which reserves space before the image loads.

With remark-image + static imports, this is automatic for local images.

### Cause 2: CSS overriding reserved space

After setting width/height, render the image responsively with:

```css
width: 100%;
height: auto;
```

This stretches the image to the container while maintaining the reserved aspect ratio. Without `height: auto`, the CSS `width: 100%` can break the layout reservation.

In Tailwind: `className="w-full h-auto"`.

### sizes prop is required for fill and responsive images

Without `sizes`, next/image assumes `100vw` width and downloads the largest variant. For a blog post with ~800px max content width:

```tsx
sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 800px";
```

This tells the browser the image will be at most 800px wide on large screens, so it picks the correct srcset entry.

### fetchPriority for above-the-fold images

Featured images (hero) should get `fetchPriority="high"` (replaces deprecated `priority` prop in Next.js 16+, but `priority` still works in 15.x):

```tsx
<Image src={...} priority />  // still valid in Next.js 15
```

For inline MDX body images: `loading="lazy"` (the default) is correct.

---

## 7. WebP/AVIF on Cloudflare Workers

### Does next/image on Cloudflare Workers support format conversion?

Yes, through the IMAGES binding. The adapter handles:

- Automatic WebP/AVIF serving based on Accept header
- Width-based resizing (generates srcset variants)
- Quality compression

### Does `images.formats` in next.config.mjs matter?

With the default OpenNext Cloudflare adapter (not a custom loader), the `images.formats` config in next.config.mjs is not the mechanism used. The IMAGES binding handles format negotiation at the CDN level. Setting `formats: ['image/avif', 'image/webp']` in next.config.mjs is a no-op or redundant.

### Custom loader alternative

An alternative to the default adapter is a custom loader pointed at `/cdn-cgi/image/`:

```ts
// image-loader.ts
export default function cloudflareLoader({ src, width, quality }) {
	const params = [`width=${width}`, `quality=${quality ?? 75}`, `format=auto`];
	return `/cdn-cgi/image/${params.join(",")}/${src.replace(/^\//, "")}`;
}
```

Then in next.config.mjs:

```js
images: {
  loader: "custom",
  loaderFile: "./image-loader.ts",
}
```

**Tradeoff:** Custom loader bypasses Next.js `remotePatterns` enforcement. The default OpenNext adapter is safer and already configured. Use custom loader only if the default adapter has issues.

---

## 8. Recommended Implementation

### Phase 1: Enable remark-image in source.config.ts

```ts
// source.config.ts — add remarkImage to mdxOptions
import { remarkImage } from "fumadocs-core/mdx-plugins";

export default defineConfig({
	mdxOptions: {
		remarkPlugins: [
			[
				remarkImage,
				{
					useImport: true,
					placeholder: "blur",
					publicDir: "public",
				},
			],
		],
		// ... existing rehypeCodeOptions
	},
});
```

### Phase 2: Upgrade img in mdx-components.tsx

```tsx
import Image from "next/image";
import type { StaticImageData } from "next/image";

img: ({ src, alt, width, height, className, ...props }: ComponentProps<"img">) => {
  // remark-image provides width/height when static import is used
  const imgSrc = src as string | StaticImageData;
  const imgWidth = width ? Number(width) : 1200;
  const imgHeight = height ? Number(height) : 630;

  return (
    <figure className="my-6">
      <div className="bg-gunmetal-glass/20 relative border border-white/10 p-2">
        <div className="border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r" />
        <div className="border-cyber-lime absolute bottom-0 left-0 h-3 w-3 border-b border-l" />
        <Image
          src={imgSrc}
          alt={alt ?? ""}
          width={imgWidth}
          height={imgHeight}
          className={cn("w-full h-auto", className)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 800px"
          loading="lazy"
        />
      </div>
      {alt && (
        <figcaption className="text-slate-text mt-2 font-mono text-xs">
          {`// ${alt}`}
        </figcaption>
      )}
    </figure>
  );
},
```

Remove the `// eslint-disable-next-line @next/next/no-img-element` comment.

### Phase 3: Verify build

```bash
npm run build
```

Check that:

1. Build completes without type errors
2. Images in blog post MDX body (if any) render correctly
3. No `@next/next/no-img-element` lint warnings remain

---

## 9. What About the Featured Image (image: frontmatter)?

The featured image (`post.image` field — e.g., `/images/blog/post-slug-featured.webp`) is rendered separately in `BlogArticle` component, not through MDX. It already uses `next/image` or should. Check `src/components/blog/blog-article.tsx` to verify.

The MDX optimization work described above only affects inline images in the MDX _body_ (using `![alt](src)` syntax). These are currently absent from all 44 blog posts — this is purely forward-looking infrastructure.

---

## Sources

- [Fumadocs — Remark Image](https://www.fumadocs.dev/docs/headless/mdx/remark-image)
- [Fumadocs — Performance](https://www.fumadocs.dev/docs/mdx/performance)
- [Fumadocs — Image Zoom Component](https://www.fumadocs.dev/docs/ui/components/image-zoom)
- [OpenNext — Image Optimization on Cloudflare](https://opennext.js.org/cloudflare/howtos/image)
- [Cloudflare Images — Workers Binding](https://developers.cloudflare.com/images/transform-images/bindings/)
- [Cloudflare Images — Framework Integration](https://developers.cloudflare.com/images/transform-images/integrate-with-frameworks/)
- [Next.js — Image Component API Reference](https://nextjs.org/docs/app/api-reference/components/image)
- [MDX Image Size Auto-Detection Pattern](https://mmazzarolo.com/blog/2023-07-29-nextjs-mdx-image-size/)
- [next/image in MDX with Static Imports](https://chris.lu/web_development/tutorials/next-js-static-mdx-blog/optimizing-using-next-image)
