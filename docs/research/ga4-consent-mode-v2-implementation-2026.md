# GA4 Consent Mode v2: Professional Implementation Guide (2026-03-31)

**Status:** CURRENT
**Session:** Deep research on GA4 Consent Mode v2 region-specific defaults, GDPR/CCPA compliance, and professional-grade implementation patterns
**Sources:** 15+ sources across WebSearch, NimbleWay (deep), Exa (neural), WebFetch (Google docs)

---

## Key Findings

1. **Google's official docs explicitly support region-specific consent defaults** — you can set `analytics_storage: 'denied'` for EU and `analytics_storage: 'granted'` for everywhere else in a single configuration [1]
2. **CCPA (California) does NOT require opt-in consent for analytics** — it follows an opt-out model. You can default to `'granted'` and offer opt-out [2][3]
3. **The professional pattern: multiple `gtag('consent', 'default', {...})` calls with region arrays** — Google resolves the most specific region match per visitor [1]
4. **Advanced Consent Mode (not Basic) is required for behavioral modeling** — this recovers ~70% of consented user data through AI modeling [4][5]
5. **The cookie banner should ONLY show to users in consent-required jurisdictions** — non-EU/non-CCPA users should track by default [6]

---

## 1. Google's Official Region-Specific Consent Pattern

From [Google's official consent mode documentation](https://developers.google.com/tag-platform/security/guides/consent):

```javascript
// Step 1: Set STRICT defaults for EEA/UK (GDPR requires opt-in)
gtag("consent", "default", {
	ad_storage: "denied",
	ad_user_data: "denied",
	ad_personalization: "denied",
	analytics_storage: "denied",
	region: [
		"AT",
		"BE",
		"BG",
		"HR",
		"CY",
		"CZ",
		"DK",
		"EE",
		"FI",
		"FR",
		"DE",
		"GR",
		"HU",
		"IE",
		"IT",
		"LV",
		"LT",
		"LU",
		"MT",
		"NL",
		"PL",
		"PT",
		"RO",
		"SK",
		"SI",
		"ES",
		"SE",
		"IS",
		"LI",
		"NO", // EEA non-EU
		"CH", // Switzerland (required since July 2024)
		"GB",
	], // UK (UK GDPR)
});

// Step 2: Set opt-out defaults for California (CCPA — no opt-in required for analytics)
gtag("consent", "default", {
	ad_storage: "denied", // Ads require opt-out mechanism
	ad_user_data: "denied",
	ad_personalization: "denied",
	analytics_storage: "granted", // Analytics OK by default under CCPA
	region: ["US-CA"],
});

// Step 3: Set permissive defaults for all OTHER regions (no consent law requires opt-in)
gtag("consent", "default", {
	ad_storage: "granted",
	ad_user_data: "granted",
	ad_personalization: "granted",
	analytics_storage: "granted",
});
```

**Precedence rules (from Google docs):**

- "If two default consent commands occur on the same page with values for a region and subregion, the one with a more specific region will take effect"
- "A gtag consent default command without a region parameter sets the default for all visitors not covered by another region-specific command"

This means: EEA visitors get `denied`, California visitors get ads `denied` but analytics `granted`, everyone else gets `granted` for everything.

---

## 2. Legal Framework by Region

| Region              | Law                    | Analytics Consent                        | Model                           |
| ------------------- | ---------------------- | ---------------------------------------- | ------------------------------- |
| **EU/EEA** (27+3)   | GDPR                   | **Opt-in required**                      | Default: denied                 |
| **UK**              | UK GDPR                | **Opt-in required**                      | Default: denied                 |
| **Switzerland**     | nDSG (since Sept 2023) | **Opt-in required**                      | Default: denied                 |
| **California**      | CCPA/CPRA              | Opt-out (not opt-in)                     | Default: granted, offer opt-out |
| **Other US states** | Varies                 | Generally opt-out                        | Default: granted                |
| **Canada**          | PIPEDA                 | Implied consent OK for analytics         | Default: granted                |
| **Brazil**          | LGPD                   | Consent required (less strict than GDPR) | Default: denied (conservative)  |
| **Australia**       | Privacy Act            | No explicit cookie consent required      | Default: granted                |
| **Japan**           | APPI                   | No cookie consent required               | Default: granted                |

**For alexmayhew.dev (primarily US-targeted technical advisory site):**

- EEA+UK+CH: `denied` (GDPR/UK GDPR/nDSG)
- US-CA: analytics `granted`, ads `denied` (CCPA opt-out model)
- Rest of world: `granted` (no opt-in requirement)

Sources: [2] CookieYes CPRA guide, [3] Osano CCPA guide, [7] Clym CCPA+GA4

---

## 3. Advanced vs Basic Consent Mode

| Feature                     | Basic                         | Advanced                                                                                           |
| --------------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------- |
| Tags fire when denied       | NO — tags don't load at all   | YES — tags load but send cookieless pings                                                          |
| Behavioral modeling         | NO                            | YES — Google models ~70% of missing data                                                           |
| Data collection when denied | Zero                          | Anonymized pings (no cookies, no user IDs)                                                         |
| Google recommendation       | Not recommended for analytics | **Recommended** — "If you're serious about performance, Advanced is the only realistic option" [4] |

**alexmayhew.dev currently uses Advanced mode** — the gtag script loads regardless of consent state, and `send_page_view: false` is set. This is correct. The issue is that consent stays `denied` for non-EU users who never see the banner.

---

## 4. Cookie Banner Strategy

**Professional pattern:**

- **EEA/UK/CH visitors:** Show full consent banner with Accept/Decline (GDPR requires explicit opt-in)
- **California visitors:** Show simplified notice with "Do Not Sell/Share" link (CCPA opt-out model)
- **All other visitors:** No banner needed — track by default, provide opt-out in privacy policy

**Current alexmayhew.dev bug:** The `/api/geo` endpoint correctly identifies non-EU users, but the Consent Mode v2 inline script defaults ALL users to `denied` globally. Non-EU users never see a banner to grant consent, so they stay `denied` forever.

---

## 5. url_passthrough and ads_data_redaction

**url_passthrough:** When `ad_storage` is `denied`, enables passing GCLID/DCLID through URL parameters instead of cookies. Set to `true` for better ads measurement without cookies.

**ads_data_redaction:** When `ad_storage` is `denied` and this is `true`, ad click identifiers sent in network requests are redacted. Recommended for privacy-conservative implementations.

---

## 6. Implementation Recommendation for alexmayhew.dev

Replace the current single global `denied` default with Google's region-specific pattern:

```javascript
// In <head>, BEFORE gtag loads:
window.dataLayer = window.dataLayer || [];
function gtag() {
	dataLayer.push(arguments);
}

// EEA + UK + Switzerland: GDPR opt-in required
gtag("consent", "default", {
	analytics_storage: "denied",
	ad_storage: "denied",
	ad_user_data: "denied",
	ad_personalization: "denied",
	wait_for_update: 500,
	region: [
		"AT",
		"BE",
		"BG",
		"HR",
		"CY",
		"CZ",
		"DK",
		"EE",
		"FI",
		"FR",
		"DE",
		"GR",
		"HU",
		"IE",
		"IT",
		"LV",
		"LT",
		"LU",
		"MT",
		"NL",
		"PL",
		"PT",
		"RO",
		"SK",
		"SI",
		"ES",
		"SE",
		"IS",
		"LI",
		"NO",
		"CH",
		"GB",
	],
});

// Everyone else: granted by default (no opt-in law applies)
gtag("consent", "default", {
	analytics_storage: "granted",
	ad_storage: "denied",
	ad_user_data: "denied",
	ad_personalization: "denied",
});

// Restore any existing user consent from localStorage
try {
	var s = localStorage.getItem("cookie-consent");
	if (s) {
		var c = JSON.parse(s);
		if (c.version === "1" && c.analytics) {
			gtag("consent", "update", { analytics_storage: "granted" });
		}
	}
} catch (e) {}
```

This is Google's documented pattern. The cookie banner continues to show for EU users. Non-EU users track immediately.

---

## Sources

1. [Google - Set up consent mode on websites](https://developers.google.com/tag-platform/security/guides/consent) — Official implementation docs with region-specific examples
2. [CookieYes - CPRA Cookie Consent Guide 2026](https://www.cookieyes.com/blog/cpra-cookie-consent/) — CCPA opt-out model explanation
3. [Osano - CCPA Cookie Consent Requirements](https://www.osano.com/articles/ccpa-cookie-consent) — CCPA does not require opt-in
4. [UnifiedInfotech - Basic vs Advanced GA4 Consent Mode 2026](https://www.unifiedinfotech.net/blog/google-consent-mode-basic-vs-advanced-ga4/) — Advanced mode is the only realistic option
5. [Cookie-Script - How Consent Mode v2 Impacts Revenue](https://cookie-script.com/guides/how-google-consent-mode-v2-impact-revenue) — Behavioral modeling data
6. [Bounteous - Top 7 Consent Mode Mistakes](https://www.bounteous.com/insights/top-7-google-consent-mode-mistakes-and-how-fix-them-2025/) — Common implementation errors
7. [Clym - GA4 and CCPA 2026](https://www.clym.io/blog/how-to-configure-google-analytics-for-ccpa-in-2026) — CCPA-specific GA4 configuration
8. [SecurePrivacy - Consent Mode v2 Outside EEA](https://secureprivacy.ai/blog/how-to-use-google-consent-mode-v2-outside-eea-uk) — Non-EU implementation
9. [Google Analytics Help - Consent Mode Reference](https://support.google.com/analytics/answer/13802165?hl=en) — Parameter reference
10. [Google - Consent Mode Overview](https://developers.google.com/tag-platform/security/concepts/consent-mode) — Conceptual overview
