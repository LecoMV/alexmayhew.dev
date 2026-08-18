// Canonical resume data. This module is the single source of truth for the
// /resume HTML page AND the committed PDF; keep every fact byte-identical with
// LinkedIn (linkedin.com/in/alexmmayhew) and the downloadable resume variants.

export interface ResumeRole {
	title: string;
	org: string;
	location: string;
	start: string;
	end: string;
	summary: string;
	bullets: string[];
}

export interface ResumeSkillGroup {
	label: string;
	items: string;
}

export const resumeMeta = {
	name: "Alex Mayhew",
	headline: "Technology Specialist: Web, SEO & Automation",
	location: "East Falmouth, MA",
	remote: "Remote (US Eastern)",
	email: "alex@alexmayhew.dev",
	site: "alexmayhew.dev",
	linkedin: "linkedin.com/in/alexmmayhew",
	github: "github.com/LecoMV",
	availability: "Available for part-time, contract, or full-time remote work.",
	pdfPath: "/Alex-Mayhew-Resume.pdf",
} as const;

export const resumeSummary =
	"Technology generalist who spent nine years as the one-person tech department for a Martha's Vineyard solar company: designing ~200 residential PV systems, handling permitting through historic and conservation boards, building and ranking the company website, coding its custom lead-intake system, and running office IT. Now self-employed doing web, automation, and AI-assisted work for clients and my own products. Used to being the only technical person in the room, and to explaining technology to people who aren't technical.";

export const resumeRoles: ResumeRole[] = [
	{
		title: "Senior PV Systems Designer & Technology Specialist",
		org: "Harvest Sun Solar",
		location: "Martha's Vineyard & Cape Cod, MA",
		start: "March 2016",
		end: "December 2025",
		summary:
			"The one-person tech department for a residential and commercial solar installer (company closed 2025).",
		bullets: [
			"Designed ~200 residential PV systems in Aurora Solar (module selection, stringing and component specification, fire-setback compliance, and production modeling), building custom 3D layouts from 2D blueprints, plus SketchUp models presented to historic-district and conservation-commission boards.",
			"Handled permitting end to end across Martha's Vineyard and Cape Cod (standard, historic-district, and conservation-commission review), and presented projects in person to town boards and building departments.",
			"Contributed design work on commercial projects of 2–3 MW, including two designed through proposal and permitting that are slated for construction.",
			"Built the company's lead-capture and customer-onboarding system solo (React/TypeScript, Node/Express, PostgreSQL): multi-step intake with address autocomplete and satellite-map property confirmation, service-area validation, automated customer emails, and two-way sync into the SolarNexus CRM. Containerized and deployed with Docker/Traefik.",
			"Built and ran the company WordPress site, reaching #1 Google rankings for the company's core Martha's Vineyard solar searches, and managed the full local-marketing presence (Google Business Profile, EnergySage, Angi, Yelp, BBB).",
			"Ran IT for the five-person office and field crews: Microsoft 365 administration, workstation setup and repair, network and ISP troubleshooting, vendor coordination, and first-line support; administered the SolarNexus CRM.",
		],
	},
	{
		title: "Self-Employed: Web, Automation & AI Services",
		org: "Mayhew Technology LLC",
		location: "Remote",
		start: "August 2025",
		end: "Present",
		summary: "Web, automation, and applied-AI work for clients and my own products.",
		bullets: [
			"Sole developer on a maritime data-intelligence platform for a private investment firm (engagement under NDA). Took over a demo-stage build and grew it into a production platform (Next.js + FastAPI + PostgreSQL/TimescaleDB), split the codebase into two independently deployed products under a hard deadline, and closed out with a written engineering handoff.",
			"Provision, harden, and operate production Linux servers, documented as reproducible install-and-verify runbooks: nginx, systemd, fail2ban/AppArmor/auditd, automated off-site backups (restic to Cloudflare R2), and Prometheus/Grafana monitoring.",
			"Built web apps for local small businesses, including an offline-first time-tracking and fleet app for a trucking and farm-services company (in production) and an active e-commerce site for a bakery (Next.js, Stripe, CMS).",
			"Built data-extraction tools for freelance clients, including a county tax-auction scraper that cross-references a 2,400-property auction book against a 1.5M-record ArcGIS tax-roll API into investment-ready spreadsheets (Python, TypeScript, Puppeteer, Redis).",
			"Build and support my own products, including an AI voice/audio platform and a commercial SaaS starter kit, plus automations and AI-assisted workflows (n8n, REST APIs, self-hosted LLMs). Publish a technical blog and newsletter (70+ articles).",
		],
	},
];

export const resumeSkills: ResumeSkillGroup[] = [
	{
		label: "Web",
		items:
			"WordPress, HTML/CSS/JavaScript, React/TypeScript, Next.js, hosting/DNS/domain and email administration, Docker",
	},
	{
		label: "SEO & Local Marketing",
		items:
			"technical and local SEO, Google Search Console, GA4, keyword research, schema/structured data, Google Business Profile, listings management, answer-engine optimization (AEO/GEO)",
	},
	{
		label: "Automation & Scripting",
		items:
			"n8n (Zapier/Make-equivalent), Python scripting, web scraping and data extraction, REST APIs, webhooks, JSON, LLM tools (Claude, ChatGPT), AI-assisted development, self-hosted LLMs (Ollama), vector/graph databases (Qdrant, Memgraph)",
	},
	{
		label: "Support & IT",
		items:
			"end-user and remote support, hardware and software troubleshooting, device setup, Windows/macOS/Linux, Microsoft 365 administration, CRM administration (SolarNexus, GoHighLevel), technical documentation and runbooks, customer service",
	},
	{
		label: "Servers & DevOps",
		items:
			"Linux server administration (Ubuntu/Debian), nginx, systemd, Docker/Traefik, security hardening (fail2ban, AppArmor, auditd), CI/CD (GitHub Actions, GitLab CI), backups (restic, Cloudflare R2), monitoring (Prometheus, Grafana)",
	},
	{
		label: "Solar",
		items:
			"Aurora Solar, Energy Toolbase, SketchUp, residential PV design, stringing and component specification, fire setbacks, permitting and AHJ processes, historic-district and conservation approvals",
	},
];

export const resumeEducation =
	"Self-taught in programming, web design, and IT since age 14, and still how I pick up new tools. High school diploma.";
