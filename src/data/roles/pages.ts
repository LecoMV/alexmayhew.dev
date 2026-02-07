/**
 * Role-Based Pages Data
 *
 * Contains all role-based landing pages for /for/[role] routes.
 * Each page targets a specific executive/founder role with tailored messaging.
 */

import type { RolePage } from "./types";

/**
 * All role-based pages.
 * Each page represents a unique target audience.
 */
export const rolePages: RolePage[] = [
	// ===========================================================================
	// CTO
	// ===========================================================================
	{
		slug: "cto",
		role: "cto",
		roleTitle: "Chief Technology Officer",
		published: true,

		headline: "Technical Partnership for CTOs Who Ship",
		subheadline:
			"When you need a trusted advisor who understands the weight of technical decisions at scale. Architecture reviews, vendor evaluations, and hands-on implementation for your highest-stakes projects.",

		painPoints: [
			{
				title: "Technical Debt Compounding Faster Than Revenue",
				description:
					"Every sprint, your team spends more time fighting legacy code than building features. Refactoring feels impossible when the business needs velocity.",
				whyMatters:
					"Technical debt isn't just an engineering problem—it's a revenue problem. Every hour spent on workarounds is an hour not spent on features that drive growth.",
				solution:
					"I conduct surgical technical debt assessments that identify high-impact, low-risk refactoring opportunities. We create a debt reduction roadmap that aligns with business priorities, not engineering perfectionism.",
			},
			{
				title: "Hiring Senior Engineers Who Actually Stay",
				description:
					"You're competing with FAANG salaries while trying to maintain culture. Interview processes are inconsistent, and new hires take months to become productive.",
				whyMatters:
					"A single bad senior hire costs 6-12 months of runway. Getting it right means the difference between scaling and stalling.",
				solution:
					"I help design technical interview processes that filter for impact, not leetcode prowess. I can conduct final-round architecture interviews and provide calibrated feedback, ensuring you hire engineers who thrive in your specific environment.",
			},
			{
				title: "System Reliability Under Pressure",
				description:
					"Every traffic spike is a held breath. Incidents happen at 3 AM. The team is reactive, not proactive, and burnout is spreading.",
				whyMatters:
					"Downtime doesn't just cost revenue—it costs trust. Customers don't remember the 99.9% uptime, they remember the outage during their demo.",
				solution:
					"I implement observability-first architectures with SLOs tied to business outcomes. We build runbooks, conduct game days, and establish incident response processes that prevent 3 AM fires, not just fight them.",
			},
			{
				title: "Vendor Decisions With 5-Year Consequences",
				description:
					"Every database, every cloud provider, every framework choice locks you in. The sales pitch sounds great, but you've been burned before.",
				whyMatters:
					"The wrong vendor choice today is a migration project in 18 months. Or worse, a constraint that limits your product roadmap.",
				solution:
					"I provide vendor-agnostic technical due diligence. I've seen what works at scale and what breaks. We evaluate against your specific requirements, not marketing materials, with explicit migration costs if the choice doesn't work out.",
			},
			{
				title: "Architecture Decisions Without Peer Review",
				description:
					"As CTO, you're often the most senior technical voice. But major architecture decisions benefit from external perspective, and your team may not push back.",
				whyMatters:
					"Echo chambers produce blind spots. The decisions that seem obvious internally are often the ones that need the most scrutiny.",
				solution:
					"I serve as an external architecture review partner—someone who challenges assumptions, asks uncomfortable questions, and brings patterns from other high-growth companies. Not to override your judgment, but to pressure-test it.",
			},
		],

		idealTiers: ["advisory-retainer", "strategic-implementation", "technical-audit"],

		proofMetrics: [
			"0 critical incidents in 18 months at a fintech processing $50M/month",
			"400% revenue growth during engagement without platform rewrites",
			"3 successful Series A technical due diligence processes",
			"Reduced P0 incident rate by 85% through observability improvements",
			"Hired 12 senior engineers with 100% retention at 18 months",
		],

		positioning: `As a CTO, you don't need another consultant who speaks in abstractions. You need someone who has been in the trenches—who has made the 2 AM decision about whether to roll back or push forward, who has explained technical debt to a board that just wants to know why features are slow.

I've been the technical leader at companies from seed to Series C. I've inherited codebases that made me question every architectural decision ever made, and I've built systems that scaled to millions of users without breaking. That experience is what I bring to every engagement.

My role isn't to replace your judgment—it's to augment it. When you're evaluating a major architecture change, I'm the person who asks the questions your team might not think to ask. When you're hiring a VP of Engineering, I'm the one who can calibrate your interview process against what high-performing teams actually need. When an incident happens, I'm the advisor who helps you conduct a blameless post-mortem that actually improves the system.

I work with CTOs on retainer because technical leadership is a continuous challenge, not a project. The most valuable conversations happen when I understand your codebase, your team dynamics, and your business context deeply enough to give advice that accounts for your specific constraints.

The goal isn't to create dependency—it's to level up your team's capabilities while providing you with a thinking partner who has no internal politics to navigate. I'm here for the decisions that keep you up at night.`,

		timelineExpectations: `Advisory retainer engagements typically start with a technical deep-dive: 2-3 days understanding your architecture, codebase, and team. From there, we establish a regular cadence—usually weekly 60-90 minute calls plus async access for time-sensitive decisions.

For strategic implementation work, I embed with your team for specific initiatives: typically 2-4 months of focused effort on a critical system. The goal is always to leave your team more capable, not create dependency on external help.

Communication happens through your preferred channels—Slack, email, or a dedicated space. I maintain context between conversations so we're not starting from scratch each week.`,

		relatedServices: [
			"nextjs-developer-for-saas",
			"technical-due-diligence-consultant",
			"technical-advisor-for-startups",
		],

		faqs: [
			{
				question: "How is this different from hiring a consulting firm?",
				answer:
					"Consulting firms send junior analysts who follow playbooks. I bring 15+ years of hands-on technical leadership experience. When I review your architecture, I'm drawing on patterns I've seen succeed and fail across dozens of high-growth companies. There's no bait-and-switch—you work directly with me, every engagement.",
			},
			{
				question: "What if I need hands-on implementation, not just advice?",
				answer:
					"Many of my CTO engagements include implementation work. I can embed with your team for critical initiatives—building the foundational architecture for a new product line, leading a complex migration, or mentoring senior engineers through a challenging project. The advisory component ensures the implementation aligns with your long-term strategy.",
			},
			{
				question: "How do you handle confidentiality with competitive clients?",
				answer:
					"I maintain strict information barriers between engagements. I never work with direct competitors simultaneously, and I'm explicit about what knowledge transfers between engagements (general patterns, not proprietary details). Many CTOs value this—they get insights from across the industry without compromising their own confidential information.",
			},
			{
				question: "What's the minimum commitment for an advisory retainer?",
				answer:
					"I typically work on 6-month initial engagements with quarterly renewals after that. The first month includes the technical deep-dive and relationship building. By month two, we're operating at full velocity. Shorter engagements don't allow enough context-building to provide the caliber of advice that justifies the investment.",
			},
		],

		seo: {
			title: "Technical Advisor for CTOs | Alex Mayhew",
			description:
				"Strategic technical partnership for CTOs. Architecture reviews, hiring support, incident response, and hands-on implementation from a seasoned technical leader.",
			keywords: [
				"cto advisor",
				"technical advisor for cto",
				"cto consultant",
				"fractional cto",
				"technical leadership consulting",
				"architecture review",
				"technical due diligence",
			],
		},
	},

	// ===========================================================================
	// TECHNICAL FOUNDER
	// ===========================================================================
	{
		slug: "technical-founder",
		role: "technical-founder",
		roleTitle: "Technical Founder",
		published: true,

		headline: "For Technical Founders Building the Future",
		subheadline:
			"You can build anything. The question is what to build first. Strategic technical guidance from someone who has been where you are.",

		painPoints: [
			{
				title: "MVP Speed vs. Technical Foundation",
				description:
					"You know the right way to build things, but investors want traction yesterday. Every shortcut feels like future pain, but velocity feels non-negotiable.",
				whyMatters:
					"The code you write in the first 6 months becomes the foundation for everything that follows. Get it wrong, and you're rebuilding while competitors ship.",
				solution:
					"I help you identify which corners to cut and which foundations to build right the first time. We prioritize ruthlessly—investing in the 20% of architecture that prevents 80% of future problems, while shipping fast everywhere else.",
			},
			{
				title: "Attracting Engineers Before Product-Market Fit",
				description:
					"You need strong engineers to build the product, but strong engineers want to join companies with traction. It's a chicken-and-egg problem that keeps you solo longer than you'd like.",
				whyMatters:
					"The first 3-5 engineers set the culture and codebase standards for everyone who follows. Hiring wrong early is catastrophic.",
				solution:
					"I help you craft an engineering narrative that attracts talent despite uncertainty—the technical challenges, the ownership opportunity, the learning velocity. And I provide a sounding board for early hires, helping you evaluate culture fit alongside technical skill.",
			},
			{
				title: "Scaling Before You Have Revenue to Fund It",
				description:
					"Your prototype works, but it won't survive real traffic. Cloud costs are unpredictable. You're terrified of the Hacker News hug of death.",
				whyMatters:
					"Premature scaling wastes runway. Insufficient scaling kills momentum at the worst possible moment—when people are finally paying attention.",
				solution:
					"I architect for predictable scaling: infrastructure that grows linearly with usage, not exponentially with features. We identify the real bottlenecks (hint: it's usually not the code) and build just enough infrastructure to handle 10x your current load.",
			},
			{
				title: "Technical Co-founder Responsibilities With Founder Loneliness",
				description:
					"Your co-founder handles business, but who do you bounce technical decisions off? The architecture choice that seems obvious might have hidden consequences you can't see.",
				whyMatters:
					"Technical founders often lack a peer who can engage at their level. That isolation leads to blind spots in decision-making.",
				solution:
					"I serve as a technical peer—someone who can engage with your architecture decisions at depth, challenge your assumptions, and share patterns from other companies at your stage. Not a replacement for a co-founder, but a resource when you need a second technical perspective.",
			},
			{
				title: "When to Build vs. When to Buy",
				description:
					"Every SaaS tool wants your startup discount, but lock-in is real. Building in-house feels expensive, but vendor dependencies feel risky.",
				whyMatters:
					"The wrong build/buy decision either wastes engineering time or creates vendor lock-in that constrains your product roadmap.",
				solution:
					"I evaluate build vs. buy decisions through the lens of your specific stage and trajectory. We identify where vendor solutions are no-brainers, where building makes strategic sense, and where the decision depends on factors we need to think through together.",
			},
		],

		idealTiers: ["advisory-retainer", "project-based", "fractional-cto"],

		proofMetrics: [
			"MVP shipped in 8 weeks that secured $1.2M seed round",
			"Scaled prototype to handle 50K concurrent users for Product Hunt launch",
			"Helped 7 technical founders close their first senior engineering hire",
			"Architecture that grew from 0 to $2M ARR without major rewrites",
			"73% infrastructure cost reduction through optimization audit",
		],

		positioning: `As a technical founder, you're used to being the smartest technical person in the room. Your co-founder defers to you on architecture decisions. Your early hires look to you for direction. But that can be isolating when you're facing decisions with 5-year consequences and no one to pressure-test your thinking.

I work with technical founders because I understand the unique challenges of your role. You're not just a CTO—you're a founder. The technical decisions you make are inseparable from the business strategy. You can't just optimize for engineering elegance; you have to balance velocity, runway, and long-term maintainability in ways that pure technical leaders never face.

My approach is collaborative, not prescriptive. I'm not here to tell you what to do—I'm here to help you think through the implications of your options. When you're considering a major architecture change, I ask the questions that surface hidden risks. When you're evaluating a vendor, I bring perspective from companies that made similar decisions at your stage. When you're frustrated with progress, I help distinguish between real problems and founder anxiety.

The best technical founders I work with use me as a thinking partner—someone who can engage at technical depth but also understands the business context that shapes every decision. We might spend one session debugging a production issue and the next discussing hiring strategy. That range is the point.

I'm especially valuable in the early stages, when decisions compound quickly and the cost of getting things wrong is highest. The architecture you build now becomes the foundation for everything that follows. I help you get that foundation right without over-engineering for problems you don't have yet.`,

		timelineExpectations: `Early-stage technical founders benefit most from flexible, ongoing access. We typically start with a focused session to understand your current architecture and near-term priorities, then establish an async communication rhythm (usually Slack) with periodic deep-dive calls as needed.

For specific projects—MVP builds, major architecture decisions, fundraising technical prep—I can provide more intensive support. The goal is always to match the engagement to your actual needs, not force you into a rigid structure.

I'm responsive to urgent questions (within hours during business hours) because I know startup problems don't wait for scheduled meetings.`,

		relatedServices: [
			"fullstack-developer-for-startups",
			"fullstack-developer-for-startups",
			"fractional-cto-for-startups",
		],

		faqs: [
			{
				question: "I'm technical—why would I need a technical advisor?",
				answer:
					"Being technical doesn't mean you have experience with every problem you'll face. The value isn't filling knowledge gaps—it's having a peer who can engage at depth and challenge your thinking. The best technical decisions come from pressure-tested reasoning, not isolated judgment.",
			},
			{
				question: "How do you work with my existing team?",
				answer:
					"I integrate with your team, not around it. In retainer engagements, I often participate in architecture discussions, review critical PRs, and help onboard new engineers. The goal is to make your team more capable, not create dependency on external expertise.",
			},
			{
				question: "What stage founders do you work with?",
				answer:
					"Most of my technical founder work is with companies from pre-seed through Series A. At this stage, technical decisions have the highest leverage—and the least margin for error. Post-Series A, I typically transition to CTO-level engagements as the role becomes more about leading teams than making architecture decisions.",
			},
			{
				question: "Can you help with fundraising technical due diligence?",
				answer:
					"Yes. I've been on both sides of the technical due diligence table. I help founders prepare for investor technical reviews—ensuring your architecture, security posture, and technical roadmap tell a compelling story. I can also provide independent technical assessments for investors evaluating deals.",
			},
		],

		seo: {
			title: "Technical Advisor for Technical Founders | Alex Mayhew",
			description:
				"Strategic technical guidance for technical founders. MVP architecture, scaling, hiring, and build/buy decisions from someone who has been in your seat.",
			keywords: [
				"technical founder advisor",
				"startup technical advisor",
				"technical co-founder alternative",
				"mvp development consultant",
				"startup architecture advisor",
				"technical founder mentor",
			],
		},
	},

	// ===========================================================================
	// SEED FOUNDER
	// ===========================================================================
	{
		slug: "seed-founder",
		role: "seed-founder",
		roleTitle: "Seed-Stage Founder",
		published: true,

		headline: "Technical Guidance for Non-Technical Founders",
		subheadline:
			"You have the vision and the business acumen. I provide the technical strategy to make it real—without the cost or commitment of a full-time technical co-founder.",

		painPoints: [
			{
				title: "Making Tech Stack Decisions Without Technical Background",
				description:
					"Every developer you talk to recommends something different. The agencies all want to use their preferred stack. You can't evaluate whether their recommendations serve your product or their comfort zone.",
				whyMatters:
					"The wrong tech stack decision today becomes a $100K migration project in 18 months. Or worse, it limits what your product can do.",
				solution:
					"I provide vendor-agnostic technical guidance based on your specific requirements. We evaluate options against your product roadmap, budget, and hiring plans—not against what's trendy or what agencies want to sell.",
			},
			{
				title: "Limited Budget, Unlimited Technical Ambition",
				description:
					"Your seed runway needs to last 18 months, but you have enterprise-grade ideas. How do you build something impressive enough to raise on while not burning through cash?",
				whyMatters:
					"Overspending on infrastructure kills startups before they find product-market fit. Underspending creates a product that can't compete.",
				solution:
					"I help you design a technical architecture that starts lean and scales incrementally. We identify where to invest (core product experiences) and where to minimize spend (infrastructure that can be upgraded later without rewrites).",
			},
			{
				title: "No Technical Co-founder to Evaluate Contractors",
				description:
					"The agency says they're building great code. The freelancer promises they're following best practices. You have no way to verify until something breaks.",
				whyMatters:
					"Without technical oversight, you're trusting contractors to prioritize your interests over their convenience. That trust is often misplaced.",
				solution:
					"I provide technical oversight for your development partners. Code reviews, architecture assessments, and regular check-ins that ensure the work meets professional standards. You get the visibility without needing to understand the code yourself.",
			},
			{
				title: "Investor-Ready Technical Story",
				description:
					"VCs ask about your technical architecture, team, and roadmap. You know your product and market, but struggle to articulate the technical vision with confidence.",
				whyMatters:
					"Technical credibility affects valuation and terms. Founders who can't speak to their technical approach signal risk to investors.",
				solution:
					"I help you develop a technical narrative that satisfies investor due diligence without overselling. We prepare for technical questions, document architecture decisions, and create materials that demonstrate you've thought through the hard problems.",
			},
			{
				title: "Finding and Evaluating Your First Technical Hire",
				description:
					"You need to hire a senior developer or CTO, but you can't evaluate technical skills. How do you know if a candidate is actually good or just good at interviews?",
				whyMatters:
					"Your first technical hire becomes your de facto technical co-founder. Getting this wrong is potentially fatal—bad hires at this stage take months to identify and more months to unwind.",
				solution:
					"I design technical interview processes you can run and evaluate. I conduct final-round architecture interviews and provide calibrated assessments. We discuss not just skills but culture fit, growth potential, and red flags you might miss without technical experience.",
			},
		],

		idealTiers: ["fractional-cto", "advisory-retainer", "technical-audit"],

		proofMetrics: [
			"73% infrastructure cost savings through architecture optimization",
			"Technical oversight for 12 seed-stage companies through first funding rounds",
			"Investor-ready codebase that closed $2.5M seed at 15% above initial valuation",
			"Identified and resolved critical security issues before public launch",
			"Helped 8 non-technical founders hire their first senior engineer",
		],

		positioning: `As a non-technical founder, you're at a disadvantage in conversations about technology—and everyone in the room knows it. Developers, agencies, and vendors can tell you anything, and you have limited ability to evaluate whether their advice serves your interests or theirs.

I exist to level that playing field. I'm not here to sell you development services or push a particular technology stack. I'm here to be your technical advocate—someone who evaluates options from your perspective, challenges vendor recommendations, and ensures your interests are protected in technical decisions.

Think of it as having a technical co-founder on retainer, without the equity dilution or commitment of a full-time hire. When you're evaluating an agency proposal, I review it and identify the red flags you wouldn't see. When a contractor says they need more time, I can assess whether that's legitimate or scope creep. When you're preparing for investor meetings, I help you articulate the technical vision with confidence.

The most common mistake non-technical founders make is deferring all technical decisions to whoever they've hired to build. That creates misaligned incentives—developers optimize for their convenience, agencies optimize for billable hours. My incentives are aligned with yours because my success is measured by your outcome, not by how much code gets written.

I work with seed-stage founders specifically because this is when technical decisions have the highest leverage. The architecture chosen now becomes the foundation for everything that follows. The contractor relationships established now set the patterns for how you engage with technical talent. Getting this stage right is worth disproportionate investment.`,

		timelineExpectations: `For non-technical founders, I typically recommend starting with a technical audit: a 1-2 week deep-dive into your current situation. We assess existing code (if any), evaluate your development partners, and create a technical roadmap aligned with your business goals.

From there, ongoing engagement depends on your needs. Some founders want fractional CTO involvement—active participation in technical decisions, regular contractor oversight, and investor prep. Others prefer lighter-touch advisory access for specific decisions.

The goal is always to build your technical capability, not create dependency. As you hire internal technical talent, my role naturally evolves toward higher-level strategy and eventually phases out.`,

		relatedServices: [
			"fractional-cto-for-startups",
			"fullstack-developer-for-startups",
			"technical-advisor-for-startups",
		],

		faqs: [
			{
				question: "How is this different from just hiring a CTO?",
				answer:
					"A full-time CTO at seed stage is usually overkill—and often not the best use of precious equity. Fractional CTO engagement gives you senior technical leadership when you need it, without the $200K+ salary and 3-5% equity. As you scale, you can hire a full-time CTO with my help, at which point I transition to an advisory role.",
			},
			{
				question: "Can you help me evaluate agency proposals?",
				answer:
					"Absolutely—this is one of my most common engagements. I review agency proposals, contracts, and technical recommendations. I identify red flags, suggest alternative approaches, and help you negotiate from a position of knowledge rather than uncertainty.",
			},
			{
				question: "What if I've already started building with a contractor?",
				answer:
					"It's never too early or too late for technical oversight. I can audit existing work, assess code quality, and identify issues before they become expensive problems. If the current approach needs correction, we can either work with your existing team to improve it or help you find better alternatives.",
			},
			{
				question: "How much technical involvement do I need to have?",
				answer:
					"My job is to translate technical complexity into business decisions you can evaluate. You don't need to understand the code—you need to understand the tradeoffs. I'll present options in terms of cost, risk, timeline, and business impact. Your job is to make informed decisions; my job is to ensure you have the information you need.",
			},
		],

		seo: {
			title: "Fractional CTO for Non-Technical Founders | Alex Mayhew",
			description:
				"Technical strategy for seed-stage founders without a technical co-founder. Vendor oversight, architecture guidance, and investor-ready technical narratives.",
			keywords: [
				"fractional cto",
				"non-technical founder advisor",
				"startup technical consultant",
				"technical co-founder alternative",
				"seed stage technical advisor",
				"startup cto services",
			],
		},
	},

	// ===========================================================================
	// VP ENGINEERING
	// ===========================================================================
	{
		slug: "vp-engineering",
		role: "vp-engineering",
		roleTitle: "VP of Engineering",
		published: true,

		headline: "External Perspective for Engineering Leaders",
		subheadline:
			"When you need an outside voice that understands engineering organizations at scale. Team building, architecture decisions, and modernization initiatives.",

		painPoints: [
			{
				title: "Building a High-Performing Engineering Culture",
				description:
					"You inherited a team, or you're scaling fast. Either way, the culture isn't where you want it. Incident response is chaotic, technical debt conversations are contentious, and sprint velocity metrics lie.",
				whyMatters:
					"Culture problems compound. Today's dysfunction becomes tomorrow's attrition, and the engineers you most want to keep are the first to leave.",
				solution:
					"I help you diagnose culture issues and design interventions that work. We assess incident response processes, technical decision-making patterns, and team dynamics. Then we build practices that create psychological safety for honest technical discussions.",
			},
			{
				title: "Architecture Decisions With Multi-Year Consequences",
				description:
					"The team is split on a major architecture decision. Both sides have valid points. You need to make a call, but the stakes are high and your internal expertise is conflicted.",
				whyMatters:
					"Major architecture decisions shape the next 2-5 years of engineering work. Getting these wrong is expensive—not just in dollars, but in team morale and velocity.",
				solution:
					"I provide external architecture review that's independent of internal politics. We evaluate options against your specific constraints, not abstract best practices. I ask the uncomfortable questions and help surface considerations that internal debate might miss.",
			},
			{
				title: "Legacy Modernization Without Breaking Everything",
				description:
					"The old system works, but it's a productivity drain. Every feature takes 3x longer than it should. But a rewrite is risky, and you've seen modernization projects fail before.",
				whyMatters:
					"Failed modernization projects destroy team morale and executive confidence. Successful ones unlock engineering velocity for years. The difference is in the approach.",
				solution:
					"I design incremental modernization strategies—strangler patterns, modular decomposition, and targeted rewrites. We identify the highest-leverage interventions and sequence them to deliver value continuously, not in a big-bang release.",
			},
			{
				title: "Scaling the Team Without Losing What Works",
				description:
					"You're hiring fast, but every new engineer dilutes the culture. Onboarding takes too long. Senior engineers spend more time mentoring than building. Knowledge is concentrated in too few heads.",
				whyMatters:
					"Scaling engineering organizations is one of the hardest leadership challenges. Get it wrong, and you end up with more engineers shipping less code than before.",
				solution:
					"I help design onboarding programs, mentorship structures, and team topologies that preserve velocity while growing headcount. We create documentation strategies, pairing rotations, and architectural decision records that spread knowledge without slowing down senior engineers.",
			},
			{
				title: "Managing Up: Translating Engineering Reality to Executives",
				description:
					"The CEO wants to know why features take so long. The board asks about AI initiatives. You understand the technical reality, but translating it into business terms that land with non-technical leaders is exhausting.",
				whyMatters:
					"Misaligned expectations between engineering and executive leadership create friction that erodes trust over time. Clear communication is essential for organizational health.",
				solution:
					"I help you develop communication frameworks for different stakeholders. We create dashboards and reports that tell the engineering story in business terms. I can also serve as an external voice when executive conversations need technical translation from someone without internal politics.",
			},
		],

		idealTiers: ["advisory-retainer", "strategic-implementation", "technical-audit"],

		proofMetrics: [
			"400% faster deployments through CI/CD modernization",
			"60% productivity increase after team restructuring initiative",
			"Reduced mean time to recovery from 4 hours to 15 minutes",
			"Successfully migrated 2M LOC codebase without production incidents",
			"Designed onboarding program that cut time-to-productivity from 3 months to 4 weeks",
		],

		positioning: `As VP Engineering, you're often caught between technical reality and business expectations. Your team wants more time for quality; executives want faster delivery. Your engineers have strong opinions about architecture; you need to make decisions that stick. You're accountable for outcomes, but you can't dictate how every technical decision gets made.

I work with VPs of Engineering as an external thought partner—someone who understands the organizational dynamics you navigate daily but isn't enmeshed in your internal politics. When you need to challenge a senior engineer's recommendation, I provide independent perspective. When you need to explain technical constraints to the board, I help you craft the narrative. When you're evaluating whether your team structure is working, I bring patterns from other organizations at similar scale.

My approach is not to impose external best practices but to understand your specific context and help you think through options. What works at a 20-person engineering org doesn't work at 200, and what works in fintech doesn't work in healthcare. Generic advice is worse than no advice—I start from your constraints and work toward solutions that fit your reality.

I'm especially valuable for high-stakes decisions where you need independent validation. Major architecture changes, team reorganizations, build vs. buy decisions for core infrastructure—these are moments when external perspective pays for itself many times over. Not because you need someone smarter, but because you need someone without blind spots created by being inside the organization.

The goal of every engagement is to make you and your team more capable, not to create dependency on external consulting. I share frameworks, document decision processes, and build internal muscle for the kinds of challenges I help you navigate.`,

		timelineExpectations: `VP Engineering engagements typically start with a listening tour: 2-3 days of conversations with you, your senior engineers, and key stakeholders. This surfaces the real challenges—which are often different from the presenting problems.

From there, we establish a regular cadence. For most VPs, that's bi-weekly strategy sessions plus async access for time-sensitive decisions. Major initiatives (modernization projects, reorgs, architecture changes) get more intensive involvement.

I can also embed with your team for specific projects—leading a modernization initiative, conducting a team health assessment, or facilitating a difficult technical decision. The format adapts to what you actually need.`,

		relatedServices: [
			"technical-advisor-for-startups",
			"technical-due-diligence-consultant",
			"nextjs-developer-for-saas",
		],

		faqs: [
			{
				question: "How do you work with my senior engineers?",
				answer:
					"Collaboratively, not hierarchically. I'm not here to override their expertise—I'm here to add perspective. In architecture discussions, I ask questions and surface considerations they might not have thought of. I never present recommendations without understanding their reasoning first. The goal is to make the team's decisions better, not to impose external decisions.",
			},
			{
				question: "What if my company has confidentiality concerns?",
				answer:
					"I work under NDA and maintain strict information barriers between engagements. I never work with direct competitors simultaneously. Your company's strategic and technical information stays confidential. The patterns I share are abstracted from specific implementations—useful insights without identifiable details.",
			},
			{
				question: "How do you measure impact?",
				answer:
					"Together, we define success criteria at the start of each engagement. These might be quantitative (deployment frequency, incident metrics, time-to-productivity) or qualitative (team satisfaction, stakeholder confidence). I track progress and adjust approach based on what's working. If an engagement isn't delivering value, I'll say so—continued billing isn't success.",
			},
			{
				question: "Can you help with executive communication?",
				answer:
					"Yes—this is often where VPs need the most support. I help you develop dashboards, reports, and narratives that translate engineering reality into business terms. I can also participate in board presentations or executive meetings as an external technical voice when that's helpful.",
			},
		],

		seo: {
			title: "Technical Advisor for VPs of Engineering | Alex Mayhew",
			description:
				"External perspective for engineering leaders. Team building, architecture decisions, legacy modernization, and executive communication from a seasoned technical advisor.",
			keywords: [
				"vp engineering advisor",
				"engineering leadership consultant",
				"technical advisor for engineering",
				"legacy modernization consultant",
				"engineering team scaling",
				"architecture review consultant",
			],
		},
	},
];

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get all published role pages
 */
export function getPublishedRolePages(): RolePage[] {
	return rolePages.filter((page) => page.published);
}

/**
 * Get a role page by slug
 */
export function getRolePageBySlug(slug: string): RolePage | undefined {
	return rolePages.find((page) => page.slug === slug);
}

/**
 * Get all role page slugs (for static generation)
 */
export function getAllRoleSlugs(): string[] {
	return rolePages.map((page) => page.slug);
}

/**
 * Get published role page slugs (for static generation)
 */
export function getPublishedRoleSlugs(): string[] {
	return getPublishedRolePages().map((page) => page.slug);
}
