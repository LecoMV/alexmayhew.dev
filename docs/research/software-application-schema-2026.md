# SoftwareApplication Structured Data Research (2026-03-19)

**Status:** CURRENT
**Session:** Research for tool/product pages on alexmayhew.dev — schema type selection, required fields, complete JSON-LD examples

---

## Key Findings

### 1. Schema Type Hierarchy: Which to Use When

Schema.org hierarchy for software:

```
SoftwareApplication
├── MobileApplication      (iOS / Google Play distributed apps)
├── WebApplication         (browser-based tools accessed via URL)
├── DesktopApplication     (downloadable desktop software)
└── VideoGame              (games — requires co-typing for Google rich results)
```

**Decision matrix for alexmayhew.dev tool pages:**

| Tool Type                                 | Correct @type                                 | operatingSystem                | downloadUrl          |
| ----------------------------------------- | --------------------------------------------- | ------------------------------ | -------------------- |
| Web-based tool (vectorizer, voice cloner) | `SoftwareApplication` or `WebApplication`     | `"Web Browser"`                | Omit                 |
| SaaS product with subscription            | `SoftwareApplication`                         | `"Web Browser"`                | Omit                 |
| Desktop app (macOS/Windows)               | `SoftwareApplication` or `DesktopApplication` | `"macOS 12+"` etc.             | Required             |
| Browser extension                         | `BrowserApplication`                          | `"Google Chrome"`              | Chrome Web Store URL |
| iOS/Android app                           | `MobileApplication`                           | `"iOS 14+"` / `"Android 5.0+"` | App Store URL        |

**Use `SoftwareApplication` (the parent type) as the default** — it covers all platforms. Only use a subtype (`WebApplication`, `MobileApplication`) when you need to signal a specific distribution channel to Google. For web tools on alexmayhew.dev, `SoftwareApplication` with `operatingSystem: "Web Browser"` is sufficient and correct.

**Do NOT use `Product`** for software — Product is for physical goods and e-commerce. While SaaS blogs sometimes suggest it, Google does not map `Product` rich results to software apps. `SoftwareApplication` is the correct type with its own dedicated rich result format.

### 2. Google's Required vs Recommended Fields

**Source:** [Google Search Central — Software App Structured Data](https://developers.google.com/search/docs/appearance/structured-data/software-app)

#### Required for rich result eligibility

| Property                              | Type                     | Notes                                                             |
| ------------------------------------- | ------------------------ | ----------------------------------------------------------------- |
| `name`                                | Text                     | The official name of the software                                 |
| `offers.price`                        | Offer                    | Required. Use `0` for free apps — do NOT omit even for free tools |
| One of: `aggregateRating` OR `review` | AggregateRating / Review | Required to show stars in SERP                                    |

#### Recommended (improve rich result quality)

| Property              | Type | Notes                                              |
| --------------------- | ---- | -------------------------------------------------- |
| `applicationCategory` | Text | Must be from Google's approved list (see below)    |
| `operatingSystem`     | Text | `"Web Browser"`, `"iOS 14+"`, `"Windows 10"`, etc. |

#### Additional schema.org properties Google parses (not in rich result but AEO/AI value)

| Property          | Type                  | Notes                                  |
| ----------------- | --------------------- | -------------------------------------- |
| `description`     | Text                  | Short description of what the app does |
| `url`             | URL                   | Canonical URL of the landing page      |
| `screenshot`      | URL                   | Screenshot image URL                   |
| `featureList`     | Text or URL           | Key features as string or array        |
| `softwareVersion` | Text                  | e.g., `"3.0"`                          |
| `datePublished`   | Date                  | ISO 8601                               |
| `author`          | Organization / Person | Who built it                           |

#### applicationCategory values (Google-approved list only)

```
GameApplication           SocialNetworkingApplication   TravelApplication
ShoppingApplication       SportsApplication             LifestyleApplication
BusinessApplication       DesignApplication             DeveloperApplication
DriverApplication         EducationalApplication        HealthApplication
FinanceApplication        SecurityApplication           BrowserApplication
CommunicationApplication  DesktopEnhancementApplication EntertainmentApplication
MultimediaApplication     HomeApplication               UtilitiesApplication
ReferenceApplication
```

### 3. SoftwareApplication vs WebApplication vs Product

**SoftwareApplication** — Use as the default for any software. Works for web apps, desktop apps, SaaS, CLI tools.

**WebApplication** — A subtype of SoftwareApplication. Adds the `browserRequirements` property (e.g., `"Requires JavaScript"`). Use this when you want to explicitly signal browser-only access and need to specify browser requirements. For most web tools, SoftwareApplication is sufficient.

**Product** — For physical or e-commerce goods. Google does NOT map Product rich results to software. Using Product for SaaS or web tools gets no rich result and sends wrong semantic signals. Do not use it for software.

**MobileApplication** — Subtype for App Store / Play Store apps. Adds `installUrl` and `downloadUrl`. Use only for native mobile apps.

**Co-typing:** For a tool available both as a web app and mobile app, you can co-type:

```json
"@type": ["SoftwareApplication", "MobileApplication"]
```

Only valid when both access methods genuinely apply.

### 4. Rich Result Display

When Google shows a SoftwareApplication rich result in SERPs, it displays:

- App name
- Star rating (from `aggregateRating`)
- Price / pricing model (from `offers`)
- Operating system (from `operatingSystem`)

**Critical constraints:**

- `aggregateRating.ratingCount` must reflect real, verifiable user reviews. Do NOT fabricate numbers — manual action risk.
- If a tool has no reviews yet, omit `aggregateRating` entirely. The rich result still works without stars.
- Google does not guarantee rich results will show — they are displayed at Google's discretion.
- SoftwareApplication does NOT have its own GSC Enhancements section. Monitor via URL Inspection and Rich Results Test.

### 5. Where to Add the Schema

Add SoftwareApplication schema ONLY to the primary marketing/landing page for the tool:

- `/tools/traceforge` — yes
- `/tools/pilot` — yes
- `/tools/voice-cloner` — yes
- Interior app pages (dashboard, settings) — no, use WebPage schema instead
- Homepage — no (use WebSite + Person/Organization schema)

### 6. Subscription Pricing (SaaS-specific)

For subscription pricing use `UnitPriceSpecification`:

```json
"offers": {
  "@type": "Offer",
  "price": "29",
  "priceCurrency": "USD",
  "priceSpecification": {
    "@type": "UnitPriceSpecification",
    "billingDuration": "P1M"
  }
}
```

`P1M` = monthly, `P1Y` = annual (ISO 8601 duration format).

For freemium (free tier + paid tier), use `AggregateOffer`:

```json
"offers": {
  "@type": "AggregateOffer",
  "lowPrice": "0",
  "highPrice": "49",
  "priceCurrency": "USD"
}
```

---

## Complete JSON-LD Examples

### Web-Based Tool (Free, No Reviews Yet)

```json
{
	"@context": "https://schema.org",
	"@type": "SoftwareApplication",
	"name": "TraceForge",
	"description": "Distributed tracing and observability tool for microservice architectures. Visualize request flows, identify bottlenecks, and debug performance issues across services.",
	"url": "https://alexmayhew.dev/tools/traceforge",
	"applicationCategory": "DeveloperApplication",
	"operatingSystem": "Web Browser",
	"softwareVersion": "1.0",
	"datePublished": "2026-01-01",
	"offers": {
		"@type": "Offer",
		"price": "0",
		"priceCurrency": "USD"
	},
	"author": {
		"@type": "Person",
		"@id": "https://alexmayhew.dev/#person"
	},
	"featureList": [
		"Distributed trace visualization",
		"Service dependency mapping",
		"Latency percentile analysis",
		"OpenTelemetry compatible"
	],
	"screenshot": "https://alexmayhew.dev/images/tools/traceforge-screenshot.webp"
}
```

### Web-Based SaaS Tool (Paid, With Reviews)

```json
{
	"@context": "https://schema.org",
	"@type": "SoftwareApplication",
	"name": "Voice Cloner",
	"description": "AI-powered voice cloning tool. Upload a voice sample and generate natural-sounding speech in any language.",
	"url": "https://alexmayhew.dev/tools/voice-cloner",
	"applicationCategory": "MultimediaApplication",
	"operatingSystem": "Web Browser",
	"offers": {
		"@type": "AggregateOffer",
		"lowPrice": "0",
		"highPrice": "49",
		"priceCurrency": "USD"
	},
	"aggregateRating": {
		"@type": "AggregateRating",
		"ratingValue": "4.7",
		"ratingCount": "312",
		"bestRating": "5",
		"worstRating": "1"
	},
	"author": {
		"@type": "Person",
		"@id": "https://alexmayhew.dev/#person"
	},
	"featureList": [
		"Voice cloning from 30-second sample",
		"Multi-language synthesis",
		"Real-time preview",
		"API access"
	]
}
```

### Desktop App (macOS)

```json
{
	"@context": "https://schema.org",
	"@type": "SoftwareApplication",
	"name": "Pilot",
	"description": "Local AI development assistant. Runs entirely on-device with no cloud dependency.",
	"url": "https://alexmayhew.dev/tools/pilot",
	"applicationCategory": "DeveloperApplication",
	"operatingSystem": "macOS 13+",
	"downloadUrl": "https://alexmayhew.dev/downloads/pilot-latest.dmg",
	"softwareVersion": "2.1",
	"offers": {
		"@type": "Offer",
		"price": "0",
		"priceCurrency": "USD"
	},
	"author": {
		"@type": "Person",
		"@id": "https://alexmayhew.dev/#person"
	}
}
```

---

## Next.js 15 Implementation Pattern

### Component: `SoftwareApplicationJsonLd`

Create a reusable server component at `src/components/schema/SoftwareApplicationJsonLd.tsx`:

```typescript
// src/components/schema/SoftwareApplicationJsonLd.tsx
// Server component — no 'use client' needed

interface SoftwareApplicationSchema {
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem?: string;
  price: number | string;
  priceCurrency?: string;
  aggregateRating?: {
    ratingValue: string;
    ratingCount: string;
    bestRating?: string;
    worstRating?: string;
  };
  author?: {
    "@id": string;
  };
  featureList?: string[];
  screenshot?: string;
  softwareVersion?: string;
  downloadUrl?: string;
}

export function SoftwareApplicationJsonLd({
  schema,
}: {
  schema: SoftwareApplicationSchema;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: schema.name,
    description: schema.description,
    url: schema.url,
    applicationCategory: schema.applicationCategory,
    operatingSystem: schema.operatingSystem ?? "Web Browser",
    offers: {
      "@type": "Offer",
      price: schema.price,
      priceCurrency: schema.priceCurrency ?? "USD",
    },
    ...(schema.aggregateRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ...schema.aggregateRating,
      },
    }),
    ...(schema.author && { author: { "@type": "Person", ...schema.author } }),
    ...(schema.featureList && { featureList: schema.featureList }),
    ...(schema.screenshot && { screenshot: schema.screenshot }),
    ...(schema.softwareVersion && {
      softwareVersion: schema.softwareVersion,
    }),
    ...(schema.downloadUrl && { downloadUrl: schema.downloadUrl }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

### Usage in a tool page layout:

```typescript
// src/app/tools/traceforge/page.tsx
import { SoftwareApplicationJsonLd } from "@/components/schema/SoftwareApplicationJsonLd";

export default function TraceForgePage() {
  return (
    <>
      <SoftwareApplicationJsonLd
        schema={{
          name: "TraceForge",
          description: "Distributed tracing for microservices.",
          url: "https://alexmayhew.dev/tools/traceforge",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web Browser",
          price: 0,
          author: { "@id": "https://alexmayhew.dev/#person" },
        }}
      />
      {/* rest of page */}
    </>
  );
}
```

---

## Common Mistakes to Avoid

1. **Missing `offers` block** — Without it, Google cannot show pricing. Always include, even for free tools (`price: 0`).
2. **Fabricated `aggregateRating`** — Must be real user reviews. If you have no reviews, omit the property entirely. Adding fake numbers risks a manual action.
3. **Adding schema to interior app pages** — Landing page only.
4. **Using `Product` instead of `SoftwareApplication`** — Wrong type, no rich results.
5. **Fabricated `ratingCount: 0`** — Even 0 reviews breaks the property semantics. Just omit `aggregateRating` until you have real data.
6. **Wrong `applicationCategory`** — Must match Google's approved list exactly. `"Productivity"` is NOT valid; `"BusinessApplication"` is.

---

## Validation

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- Google Search Console URL Inspection → More Info → Structured Data

---

## Sources

- [Software App (SoftwareApplication) Structured Data — Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/software-app)
- [SoftwareApplication — Schema.org Type](https://schema.org/SoftwareApplication)
- [WebApplication — Schema.org Type](https://schema.org/WebApplication)
- [SoftwareApplication Schema: Get App Rich Results in Google (2026) — schemavalidator.org](https://schemavalidator.org/guides/software-application-schema)
- [Schema for SaaS & tech companies — Dan Taylor SEO](https://dantaylor.online/blog/schema-for-saas-subscription-products/)
- [SoftwareApplication Schema JSON-LD Guide — Unhead](https://unhead.unjs.io/docs/schema-org/api/schema/software-app)
