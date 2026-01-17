import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Section,
	Text,
} from "@react-email/components";

interface ContactNotificationProps {
	name: string;
	email: string;
	projectType: string;
	budget: string;
	message: string;
	timestamp: string;
}

export function ContactNotification({
	name,
	email,
	projectType,
	budget,
	message,
	timestamp,
}: ContactNotificationProps) {
	return (
		<Html>
			<Head />
			<Preview>[INCOMING_TRANSMISSION] New contact from {name}</Preview>
			<Body style={main}>
				<Container style={container}>
					<Section style={header}>
						<Text style={headerText}>
							<span style={statusDot}>●</span> TRANSMISSION_RECEIVED
						</Text>
						<Text style={timestampText}>{timestamp}</Text>
					</Section>

					<Hr style={divider} />

					<Heading style={heading}>New Project Inquiry</Heading>

					<Section style={dataSection}>
						<Text style={label}>SENDER_IDENTITY</Text>
						<Text style={value}>{name}</Text>

						<Text style={label}>RETURN_ADDRESS</Text>
						<Text style={value}>{email}</Text>

						<Text style={label}>PROJECT_CLASSIFICATION</Text>
						<Text style={value}>{formatProjectType(projectType)}</Text>

						<Text style={label}>BUDGET_RANGE</Text>
						<Text style={value}>{formatBudget(budget)}</Text>
					</Section>

					<Hr style={divider} />

					<Section style={messageSection}>
						<Text style={label}>MESSAGE_PAYLOAD</Text>
						<Text style={messageText}>{message}</Text>
					</Section>

					<Hr style={divider} />

					<Section style={footer}>
						<Text style={footerText}>This transmission was routed through alexmayhew.dev</Text>
						<Text style={footerNote}>Reply directly to this email to respond to {name}</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}

function formatProjectType(type: string): string {
	const types: Record<string, string> = {
		"web-app": "Web Application",
		saas: "SaaS Platform",
		ecommerce: "E-Commerce",
		consulting: "Technical Consulting",
		other: "Other",
	};
	return types[type] || type;
}

function formatBudget(budget: string): string {
	const budgets: Record<string, string> = {
		"5k-10k": "$5,000 - $10,000",
		"10k-25k": "$10,000 - $25,000",
		"25k-50k": "$25,000 - $50,000",
		"50k+": "$50,000+",
	};
	return budgets[budget] || budget;
}

const main = {
	backgroundColor: "#0B0E14",
	fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace",
};

const container = {
	margin: "0 auto",
	padding: "32px 24px",
	maxWidth: "600px",
};

const header = {
	marginBottom: "24px",
};

const headerText = {
	color: "#CCF381",
	fontSize: "12px",
	fontWeight: "600",
	letterSpacing: "0.1em",
	textTransform: "uppercase" as const,
	margin: "0",
};

const statusDot = {
	marginRight: "8px",
};

const timestampText = {
	color: "#94A3B8",
	fontSize: "11px",
	margin: "8px 0 0 0",
};

const divider = {
	borderColor: "rgba(255, 255, 255, 0.1)",
	borderTopWidth: "1px",
	margin: "24px 0",
};

const heading = {
	color: "#E2E8F0",
	fontSize: "24px",
	fontWeight: "700",
	letterSpacing: "-0.02em",
	margin: "0 0 24px 0",
};

const dataSection = {
	backgroundColor: "#1E293B",
	borderRadius: "4px",
	padding: "20px",
	border: "1px solid rgba(255, 255, 255, 0.1)",
};

const label = {
	color: "#94A3B8",
	fontSize: "10px",
	fontWeight: "600",
	letterSpacing: "0.1em",
	textTransform: "uppercase" as const,
	margin: "16px 0 4px 0",
};

const value = {
	color: "#E2E8F0",
	fontSize: "14px",
	margin: "0 0 8px 0",
};

const messageSection = {
	marginTop: "8px",
};

const messageText = {
	color: "#E2E8F0",
	fontSize: "14px",
	lineHeight: "1.6",
	whiteSpace: "pre-wrap" as const,
	backgroundColor: "#1E293B",
	padding: "16px",
	borderRadius: "4px",
	border: "1px solid rgba(255, 255, 255, 0.1)",
};

const footer = {
	marginTop: "8px",
};

const footerText = {
	color: "#94A3B8",
	fontSize: "11px",
	margin: "0",
};

const footerNote = {
	color: "#CCF381",
	fontSize: "11px",
	margin: "8px 0 0 0",
};

export default ContactNotification;
