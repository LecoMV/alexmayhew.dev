interface HowToStep {
	name: string;
	text: string;
	url?: string;
	image?: string;
}

interface HowToJsonLdProps {
	name: string;
	description: string;
	steps: HowToStep[];
	totalTime?: string; // ISO 8601 duration (e.g., "PT2H30M")
	estimatedCost?: {
		currency: string;
		minValue: number;
		maxValue: number;
	};
	tool?: string[];
	supply?: string[];
	image?: string;
}

export function HowToJsonLd({
	name,
	description,
	steps,
	totalTime,
	estimatedCost,
	tool,
	supply,
	image,
}: HowToJsonLdProps) {
	const schema = {
		"@context": "https://schema.org",
		"@type": "HowTo",
		name,
		description,
		...(image && { image }),
		...(totalTime && { totalTime }),
		...(estimatedCost && {
			estimatedCost: {
				"@type": "MonetaryAmount",
				currency: estimatedCost.currency,
				value: {
					"@type": "QuantitativeValue",
					minValue: estimatedCost.minValue,
					maxValue: estimatedCost.maxValue,
				},
			},
		}),
		...(tool &&
			tool.length > 0 && {
				tool: tool.map((t) => ({
					"@type": "HowToTool",
					name: t,
				})),
			}),
		...(supply &&
			supply.length > 0 && {
				supply: supply.map((s) => ({
					"@type": "HowToSupply",
					name: s,
				})),
			}),
		step: steps.map((step, index) => ({
			"@type": "HowToStep",
			position: index + 1,
			name: step.name,
			text: step.text,
			...(step.url && { url: step.url }),
			...(step.image && { image: step.image }),
		})),
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	);
}

// Helper to generate migration HowTo steps
export function generateMigrationHowToSteps(legacyTech: string, modernTech: string): HowToStep[] {
	return [
		{
			name: "Assessment & Discovery",
			text: `Conduct comprehensive audit of existing ${legacyTech} codebase. Identify dependencies, technical debt, and integration points. Document business-critical functionality and performance baselines.`,
		},
		{
			name: "Architecture Planning",
			text: `Design target ${modernTech} architecture. Choose migration pattern (Strangler Fig, Big Bang, or Parallel Run). Define API contracts and data migration strategy.`,
		},
		{
			name: "Infrastructure Setup",
			text: `Provision ${modernTech} infrastructure with CI/CD pipelines. Configure monitoring, logging, and alerting. Establish development and staging environments.`,
		},
		{
			name: "Incremental Migration",
			text: `Migrate functionality module-by-module using feature flags. Implement adapter patterns to maintain compatibility during transition. Continuously validate against production data.`,
		},
		{
			name: "Testing & Validation",
			text: `Execute comprehensive testing: unit, integration, E2E, and performance. Compare metrics against ${legacyTech} baselines. Conduct security audit and penetration testing.`,
		},
		{
			name: "Cutover & Decommissioning",
			text: `Execute production cutover with rollback plan. Monitor for 2-4 weeks before decommissioning ${legacyTech}. Document lessons learned and update runbooks.`,
		},
	];
}

// Helper to generate integration HowTo steps
export function generateIntegrationHowToSteps(saasA: string, saasB: string): HowToStep[] {
	return [
		{
			name: "API Discovery & Authentication",
			text: `Review ${saasA} and ${saasB} API documentation. Configure OAuth2/API key authentication. Test API connectivity and rate limits in sandbox environment.`,
		},
		{
			name: "Data Mapping & Transformation",
			text: `Map data fields between ${saasA} and ${saasB}. Design transformation logic for format differences. Define conflict resolution rules for bi-directional sync.`,
		},
		{
			name: "Middleware Architecture",
			text: `Design middleware layer with queue-based processing. Implement retry logic and dead-letter queues. Configure webhook endpoints for real-time updates.`,
		},
		{
			name: "Error Handling & Monitoring",
			text: `Implement comprehensive error handling with categorized alerts. Set up monitoring dashboards for sync health. Configure PagerDuty/Slack notifications for critical failures.`,
		},
		{
			name: "Testing & Compliance",
			text: `Execute end-to-end integration tests. Validate data integrity across systems. Ensure SOC2/GDPR compliance for data handling.`,
		},
		{
			name: "Deployment & Documentation",
			text: `Deploy to production with gradual rollout. Create operational runbooks and troubleshooting guides. Train team on monitoring and incident response.`,
		},
	];
}
