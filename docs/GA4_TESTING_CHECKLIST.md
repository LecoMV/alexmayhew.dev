# GA4 Analytics Testing Checklist

> **Created:** 2026-01-28
> **Purpose:** Comprehensive testing guide for the GA4 implementation
> **Prerequisites:** GA4 Measurement ID configured in environment

## 🔧 Setup Requirements

### Environment Variables

```bash
# Required for production tracking
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXX

# Optional for additional analytics
NEXT_PUBLIC_CF_BEACON_TOKEN=your-beacon-token
```

### GA4 Property Configuration

1. **Create GA4 Property**:
   - Property name: "alexmayhew.dev"
   - Industry: "Business and Industrial Markets"
   - Business size: "Small business"

2. **Enable Enhanced Measurement**:
   - ✅ Scrolls
   - ✅ Outbound clicks
   - ✅ Site search
   - ✅ Video engagement
   - ✅ File downloads

3. **Mark Events as Conversions**:
   - `generate_lead`
   - `newsletter_subscribe`
   - `close_convert_lead`

## 📊 Testing Scenarios

### Priority 1: Lead Generation Events

#### Test 1: Contact Form Submission

**Action**: Fill out and submit contact form at `/contact`
**Expected Events**:

```
generate_lead {
  event_category: "lead_generation"
  lead_source: "contact_form"
  project_type: [selected value]
  budget_range: [selected value]
  form_type: "consultation_request"
}
```

**Verification**:

- ✅ Event fires in GA4 DebugView
- ✅ Conversion tracked in Conversions report
- ✅ Lead source attribution captured

#### Test 2: Newsletter Signup

**Action**: Subscribe to newsletter (any variant)
**Expected Events**:

```
newsletter_subscribe {
  event_category: "newsletter"
  method: "email"
  source: [page context]
  location: [variant type]
}
```

**Verification**:

- ✅ Event fires from blog posts (inline)
- ✅ Event fires from sidebar (card)
- ✅ Event fires from footer (minimal)

### Priority 2: Content Engagement Events

#### Test 3: Blog Post Engagement

**Action**: Read a blog post completely
**Expected Events**:

```
content_view {
  content_id: "blog-post-slug"
  content_type: "blog_post"
  content_category: "technical"
  content_group: "blog"
}

scroll {
  scroll_depth: 25 | 50 | 75 | 90
  content_id: "blog-post-slug"
  content_type: "blog_post"
}

engagement_time {
  engagement_time_msec: 30000 | 60000 | 120000 | 300000
  content_id: "blog-post-slug"
}
```

**Verification**:

- ✅ Initial content view tracked
- ✅ Scroll milestones fire at 25%, 50%, 75%, 90%
- ✅ Time milestones fire at 30s, 60s, 2min, 5min

#### Test 4: Service Page Engagement

**Action**: Visit service pages (e.g., `/services/nextjs-developer-for-saas`)
**Expected Events**:

```
content_view {
  content_id: "nextjs-developer-for-saas"
  content_type: "service_page"
  content_category: "service"
}

view_item {
  event_category: "service_engagement"
  item_id: "nextjs-developer-for-saas"
  item_category: "service"
  service_type: "consulting"
  technology: "nextjs"
  industry: "saas"
}
```

**Verification**:

- ✅ Service viewed as both content and ecommerce item
- ✅ Technology and industry parameters captured
- ✅ Engagement tracking active

### Priority 3: Page Navigation Events

#### Test 5: SPA Navigation

**Action**: Navigate between pages without full reload
**Expected Events**:

```
page_view {
  page_path: "/new-page"
  page_title: "Page Title"
  page_location: "https://alexmayhew.dev/new-page"
  page_category: [auto-detected]
  content_type: [auto-detected]
  user_type: [auto-detected]
}
```

**Verification**:

- ✅ Page views tracked on route changes
- ✅ UTM parameters captured when present
- ✅ Custom dimensions populated

#### Test 6: UTM Campaign Tracking

**Action**: Visit with UTM parameters

```
https://alexmayhew.dev/?utm_source=linkedin&utm_medium=social&utm_campaign=content_marketing
```

**Expected Events**:

```
page_view {
  campaign_source: "linkedin"
  campaign_medium: "social"
  campaign_name: "content_marketing"
}
```

**Verification**:

- ✅ All UTM parameters captured
- ✅ Attribution data available in reports

## 🧪 Debug Testing Instructions

### 1. Enable Debug Mode

```javascript
// In browser console
gtag("config", "G-MEASUREMENT-ID", {
	debug_mode: true,
});
```

### 2. Manual Event Testing

```javascript
// Test lead generation event
gtag("event", "generate_lead", {
	lead_source: "test",
	project_type: "test_project",
	debug_mode: true,
});

// Test content event
gtag("event", "content_view", {
	content_id: "test-content",
	content_type: "test_page",
	debug_mode: true,
});
```

### 3. Verify Data Layer

```javascript
// Check data layer
console.log(window.dataLayer);

// Check gtag function
console.log(window.gtag);
```

## 📈 Verification in GA4

### Real-Time Reports

1. **Configure > DebugView**: See events as they fire
2. **Reports > Realtime**: Monitor active users and events
3. **Events**: Verify event parameters are captured

### Standard Reports

1. **Acquisition > Traffic acquisition**: Lead source attribution
2. **Engagement > Events**: Event volumes and parameters
3. **Monetization > Ecommerce purchases**: Service page views as items

### Custom Reports

Create custom reports for:

- Lead generation funnel analysis
- Content engagement by type
- Service page performance
- Newsletter signup conversion rates

## 🔍 Automated Testing Script

```javascript
// GA4 Analytics Test Suite
// Run in browser console on live site

const runGA4Tests = async () => {
	console.log("🧪 Starting GA4 Analytics Tests...");

	// Test 1: Check gtag loading
	if (typeof window.gtag === "undefined") {
		console.error("❌ gtag not loaded");
		return;
	}
	console.log("✅ gtag loaded successfully");

	// Test 2: Fire test events
	const testEvents = [
		["generate_lead", { lead_source: "test", project_type: "test" }],
		["content_view", { content_id: "test", content_type: "test" }],
		["newsletter_subscribe", { method: "test", source: "test" }],
	];

	testEvents.forEach(([eventName, params]) => {
		window.gtag("event", eventName, { ...params, debug_mode: true });
		console.log(`✅ Fired ${eventName} event`);
	});

	// Test 3: Check data layer
	if (window.dataLayer && window.dataLayer.length > 0) {
		console.log("✅ Data layer active with", window.dataLayer.length, "entries");
	} else {
		console.error("❌ Data layer empty or missing");
	}

	console.log("🎉 GA4 Analytics tests complete!");
	console.log("📊 Check GA4 DebugView for event verification");
};

// Run tests
runGA4Tests();
```

## 🚨 Troubleshooting Guide

### Issue: Events Not Firing

**Check**:

1. `NEXT_PUBLIC_GA_MEASUREMENT_ID` environment variable set
2. Not in development mode (`NODE_ENV !== 'development'`)
3. Browser console for gtag errors
4. Ad blockers disabled

**Debug**:

```javascript
// Check environment
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("GA_ID:", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
```

### Issue: Wrong Event Parameters

**Check**:

1. Event parameter names match GA4 schema
2. Parameter values are correct type (string/number/boolean)
3. No undefined or null values passed

### Issue: Missing Conversions

**Check**:

1. Events marked as conversions in GA4 interface
2. Conversion attribution window settings
3. Debug mode disabled for production tracking

### Issue: Page Views Not Tracking

**Check**:

1. `PageAnalytics` component included in layout
2. Next.js App Router navigation working correctly
3. `usePathname` and `useSearchParams` functioning

## 📋 Production Launch Checklist

### Pre-Launch

- [ ] GA4 property created and configured
- [ ] Measurement ID added to production environment
- [ ] Enhanced measurement enabled
- [ ] Key events marked as conversions
- [ ] Custom dimensions configured
- [ ] Debug testing completed on staging

### Launch Day

- [ ] Deploy with GA4 measurement ID
- [ ] Verify events firing in production
- [ ] Monitor real-time reports for 24 hours
- [ ] Check for any console errors
- [ ] Validate conversion tracking

### Post-Launch (Week 1)

- [ ] Review lead generation reports
- [ ] Analyze content engagement patterns
- [ ] Monitor service page funnel performance
- [ ] Set up automated alerts for key metrics
- [ ] Document baseline performance metrics

## 📊 Key Metrics to Monitor

### Lead Generation KPIs

- **Lead Conversion Rate**: Contact forms per 1000 visitors
- **Newsletter Signup Rate**: Subscriptions per 1000 page views
- **Lead Quality Score**: Qualified leads / total leads
- **Source Attribution**: Which channels drive highest-quality leads

### Content Engagement KPIs

- **Average Engagement Time**: Per content type and category
- **Content Completion Rate**: 90% scroll depth + 2min engagement
- **Top Performing Content**: By engagement and lead generation
- **Content Funnel**: Blog → Service → Contact conversion rate

### Technical KPIs

- **Event Firing Success Rate**: >98% for critical events
- **Page Load Impact**: GA4 script load time <100ms
- **Attribution Accuracy**: UTM parameter capture rate
- **Data Quality**: Parameter completeness rate

---

_This testing checklist ensures the GA4 implementation captures all critical user journeys and business events for the technical advisor portfolio site._
