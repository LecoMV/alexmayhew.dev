# GA4 Analytics Setup Guide - alexmayhew.dev

> **Updated:** 2026-01-28
> **Status:** Comprehensive implementation following GA4 2026 best practices
> **Focus:** B2B lead generation and technical content engagement

## Overview

This implementation follows Google Analytics 4 (GA4) 2026 best practices specifically optimized for a technical advisor portfolio site focused on lead generation and content marketing.

## Key Features Implemented

### 🎯 Lead Generation Tracking (GA4 2026 Standards)

Following [Google's lead generation reports update](https://support.google.com/analytics/answer/12944921?hl=en):

- **generate_lead**: Contact form submissions, consultation requests
- **qualify_lead**: When leads meet qualification criteria (future CRM integration)
- **close_convert_lead**: When leads become paying clients
- **newsletter_subscribe**: Email signups for nurturing funnel

### 📊 Enhanced Ecommerce for Consultation Funnel

Services treated as products in ecommerce tracking:

- **view_item**: Service page views (e.g., "Next.js Developer for SaaS")
- **begin_checkout**: Contact form initiated
- **add_to_cart**: Consultation scheduled (future implementation)

### 📖 Content Engagement Analytics

Comprehensive tracking for technical blog content:

- **Scroll depth tracking**: 25%, 50%, 75%, 90% milestones
- **Engagement time**: 30s, 60s, 2min, 5min milestones
- **Content categories**: Blog posts, service pages, technology pages
- **Read completion**: Based on scroll + time combination

### 🔗 Attribution & Campaign Tracking

- **UTM parameter capture**: Source, medium, campaign, content, term
- **Custom dimensions**: Page category, content type, user type
- **Cross-platform attribution**: Multi-touch B2B buyer journey
- **Referrer classification**: LinkedIn, Twitter, GitHub, search, direct

## Implementation Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         GA4 Analytics                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Lead Generation Events:                                         │
│  ├── generate_lead (Contact Form)                                │
│  ├── newsletter_subscribe (Email Signup)                         │
│  ├── qualify_lead (CRM Integration - Future)                     │
│  └── close_convert_lead (Client Conversion - Future)             │
│                                                                  │
│  Content Engagement Events:                                      │
│  ├── content_view (Page views with metadata)                     │
│  ├── scroll (Depth milestones)                                   │
│  ├── engagement_time (Time milestones)                           │
│  └── content_interaction (Custom interactions)                   │
│                                                                  │
│  Service Funnel Events:                                          │
│  ├── view_item (Service page views)                              │
│  ├── begin_checkout (Contact form start)                         │
│  └── purchase (Consultation booked - Future)                     │
│                                                                  │
│  Enhanced Measurement (Auto-enabled):                            │
│  ├── Outbound clicks                                             │
│  ├── Site search                                                 │
│  ├── File downloads                                              │
│  ├── Video engagement                                            │
│  └── Scroll tracking                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Files Modified/Created

### New Components

- `src/components/analytics/page-analytics.tsx` - App Router page tracking
- `src/lib/hooks/use-content-analytics.ts` - Content engagement tracking hook

### Enhanced Components

- `src/components/analytics/google-analytics.tsx` - Enhanced GA4 configuration
- `src/components/analytics/index.ts` - Updated exports
- `src/components/pages/contact-page.tsx` - Lead generation events
- `src/components/newsletter/newsletter-signup.tsx` - Newsletter tracking
- `src/components/blog/blog-article.tsx` - Blog engagement analytics
- `src/app/services/[slug]/service-page-content.tsx` - Service page analytics
- `src/app/layout.tsx` - Added PageAnalytics component

## Environment Setup

### Required Environment Variables

```bash
# Production GA4 Measurement ID
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXX

# Optional: Cloudflare Analytics (already configured)
NEXT_PUBLIC_CF_BEACON_TOKEN=your-beacon-token
```

### Setting Up GA4 Property

1. **Create GA4 Property**:
   - Go to [Google Analytics](https://analytics.google.com)
   - Create new property for "alexmayhew.dev"
   - Set industry category: "Business and Industrial Markets"
   - Set business size: "Small business"

2. **Configure Enhanced Measurement**:
   - Enable all enhanced measurement options
   - Enable Google Signals for demographics
   - Set conversion goals

3. **Set Up Conversions**:
   Mark these events as conversions in GA4:
   - `generate_lead`
   - `newsletter_subscribe`
   - `close_convert_lead`

4. **Configure Custom Dimensions** (Admin > Custom Definitions):
   - `page_category`: Text dimension
   - `content_type`: Text dimension
   - `user_type`: Text dimension
   - `project_type`: Text dimension
   - `budget_range`: Text dimension
   - `technology`: Text dimension
   - `industry`: Text dimension

## Key Events Reference

### Lead Generation Events

```typescript
// Contact form submission
trackLeadEvent("generate_lead", {
	lead_source: "contact_form",
	project_type: "saas_development",
	budget_range: "10k-25k",
	form_type: "consultation_request",
});

// Newsletter signup
trackNewsletterEvent("newsletter_subscribe", {
	method: "email",
	source: "blog_post",
	location: "inline",
});
```

### Content Engagement Events

```typescript
// Scroll depth milestone
trackContentEvent("scroll", {
	content_id: "nextjs-developer-for-saas",
	content_type: "service_page",
	scroll_depth: 75,
	content_category: "service",
});

// Engagement time milestone
trackContentEvent("engagement_time", {
	content_id: "saas-architecture-guide",
	content_type: "blog_post",
	engagement_time_msec: 120000, // 2 minutes
	content_category: "technical",
});
```

### Service Funnel Events

```typescript
// Service page view
trackServiceEvent("view_item", {
	item_id: "nextjs-developer-for-saas",
	item_name: "Next.js Developer for SaaS",
	item_category: "service",
	service_type: "consulting",
	technology: "nextjs",
	industry: "saas",
});
```

## Integration with Existing Systems

### Sentry Integration

Web Vitals data is automatically sent to both GA4 and Sentry for performance monitoring correlation.

### Future CRM Integration

The lead events are designed to integrate with CRM systems via:

1. **Webhooks**: Send lead data to CRM on `generate_lead` events
2. **Measurement Protocol**: Update lead status from CRM to GA4
3. **BigQuery Export**: Advanced lead attribution analysis

### n8n Automation Integration

Connect GA4 events to n8n workflows:

```javascript
// Example: Trigger workflow on qualified lead
if (event_name === "qualify_lead") {
	fetch("http://localhost:5678/webhook/qualified-lead", {
		method: "POST",
		body: JSON.stringify({
			lead_source: eventParams.lead_source,
			project_type: eventParams.project_type,
			budget_range: eventParams.budget_range,
		}),
	});
}
```

## Testing & Verification

### DebugView Testing

1. **Enable Debug Mode**:

   ```javascript
   gtag("config", "GA_MEASUREMENT_ID", {
   	debug_mode: true,
   });
   ```

2. **Test Key Events**:
   - Fill out contact form → Should see `generate_lead`
   - Subscribe to newsletter → Should see `newsletter_subscribe`
   - Scroll on blog post → Should see `scroll` events
   - View service page → Should see `view_item` event

3. **Verify in GA4 DebugView**:
   - Go to Configure > DebugView in GA4
   - Perform test actions on site
   - Verify events appear in real-time

### Real-Time Reports

Monitor these reports in GA4:

- **Real-time**: Verify events are firing
- **Conversions**: Check conversion rates
- **Events**: Monitor event parameters
- **Audiences**: Lead generation audience segments

## Performance Considerations

### Script Loading

- Uses `strategy="afterInteractive"` for optimal LCP
- Environment-specific loading (dev/production)
- Proper consent management integration

### Data Layer Optimization

- Minimal data layer calls
- Batch event parameters
- Async event tracking to avoid blocking

### Privacy Compliance

- Google Signals enabled with user consent
- GDPR/CCPA compliant event tracking
- No PII in event parameters

## Monitoring & Maintenance

### Regular Checks

- **Weekly**: Review conversion rates and lead quality
- **Monthly**: Analyze content performance and engagement
- **Quarterly**: Update custom dimensions and audience definitions

### Key Metrics to Monitor

- **Lead Generation Rate**: Contact forms per 1000 visitors
- **Content Engagement**: Average engagement time by content type
- **Conversion Funnel**: Homepage → Services → Contact completion rate
- **Attribution**: Which content drives highest-quality leads

### Alerts & Notifications

Set up GA4 Intelligence alerts for:

- Sudden drop in lead generation events
- Unusual spike in bounce rate on service pages
- Significant changes in content engagement metrics

## Troubleshooting

### Common Issues

1. **Events not firing**: Check browser console for gtag errors
2. **Wrong parameters**: Verify event parameter names match GA4 schema
3. **Missing conversions**: Ensure events are marked as conversions in GA4
4. **Development mode**: Verify `NODE_ENV` check in GoogleAnalytics component

### Debug Commands

```javascript
// Check if gtag is loaded
console.log(window.gtag);
console.log(window.dataLayer);

// Manually fire test event
gtag("event", "generate_lead", {
	lead_source: "test",
	project_type: "test",
	debug_mode: true,
});
```

## References

- [GA4 Lead Generation Reports](https://support.google.com/analytics/answer/12944921?hl=en)
- [GA4 Enhanced Ecommerce Events](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
- [Next.js GA4 Implementation](https://nextjs.org/docs/messages/next-script-for-ga)
- [GA4 Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4)
- [GA4 Event Reference](https://support.google.com/analytics/answer/9267735)

---

_This implementation follows GA4 2026 best practices for technical advisor sites with emphasis on lead generation, content engagement, and B2B attribution modeling._
