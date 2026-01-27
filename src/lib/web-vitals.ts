import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from "web-vitals";
import * as Sentry from "@sentry/nextjs";

// Core Web Vitals thresholds per Google/Atmospheric standards
const thresholds = {
	// LCP: Largest Contentful Paint
	LCP: { good: 2500, needsImprovement: 4000 }, // ms
	// INP: Interaction to Next Paint (target <50ms for "Atmospheric" brand)
	INP: { good: 200, needsImprovement: 500, atmospheric: 50 }, // ms
	// CLS: Cumulative Layout Shift
	CLS: { good: 0.1, needsImprovement: 0.25 },
	// FCP: First Contentful Paint
	FCP: { good: 1800, needsImprovement: 3000 }, // ms
	// TTFB: Time to First Byte
	TTFB: { good: 800, needsImprovement: 1800 }, // ms
};

type Rating = "good" | "needs-improvement" | "poor";

function getRating(metric: Metric): Rating {
	const threshold = thresholds[metric.name as keyof typeof thresholds];
	if (!threshold) return "good";

	if (metric.value <= threshold.good) return "good";
	if (metric.value <= threshold.needsImprovement) return "needs-improvement";
	return "poor";
}

function reportToSentry(metric: Metric) {
	const rating = getRating(metric);

	// Send as custom measurement to Sentry
	Sentry.setMeasurement(metric.name, metric.value, "millisecond");

	// Add breadcrumb for debugging
	Sentry.addBreadcrumb({
		category: "web-vitals",
		message: `${metric.name}: ${metric.value.toFixed(2)} (${rating})`,
		level: rating === "poor" ? "warning" : "info",
		data: {
			name: metric.name,
			value: metric.value,
			rating,
			id: metric.id,
			navigationType: metric.navigationType,
		},
	});

	// Alert on poor metrics
	if (rating === "poor") {
		Sentry.captureMessage(`Poor ${metric.name}: ${metric.value.toFixed(2)}`, {
			level: "warning",
			tags: {
				metric: metric.name,
				rating,
			},
			extra: {
				value: metric.value,
				threshold: thresholds[metric.name as keyof typeof thresholds],
				navigationType: metric.navigationType,
			},
		});
	}
}

function logToDev(metric: Metric) {
	if (process.env.NODE_ENV !== "development") return;

	const rating = getRating(metric);
	const color =
		rating === "good"
			? "\x1b[32m" // green
			: rating === "needs-improvement"
				? "\x1b[33m" // yellow
				: "\x1b[31m"; // red

	console.log(`${color}[CWV] ${metric.name}: ${metric.value.toFixed(2)} (${rating})\x1b[0m`);
}

function handleMetric(metric: Metric) {
	logToDev(metric);
	reportToSentry(metric);
}

export function reportWebVitals() {
	// Core Web Vitals (Google ranking signals)
	onLCP(handleMetric);
	onINP(handleMetric);
	onCLS(handleMetric);

	// Additional metrics for debugging
	onFCP(handleMetric);
	onTTFB(handleMetric);
}

export { thresholds };
