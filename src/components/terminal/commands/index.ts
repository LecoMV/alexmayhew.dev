// Terminal Command Registry
// Each command returns a string or JSX output

export interface CommandResult {
	output: string | React.ReactNode;
	isError?: boolean;
	shouldClear?: boolean;
	redirect?: string;
}

export interface CommandContext {
	currentPath: string;
	setCurrentPath: (path: string) => void;
	addOutput: (output: CommandResult) => void;
}

export type CommandHandler = (args: string[], ctx: CommandContext) => CommandResult;

// Portfolio data for commands
const projects = {
	"photokeep-ai": {
		name: "PhotoKeep AI",
		description: "AI-powered photo organization and memory preservation platform",
		tech: ["Next.js", "Python", "TensorFlow", "PostgreSQL", "AWS"],
		status: "Production",
		url: "https://photokeep.ai",
	},
	"tradecraft-pro": {
		name: "TradeCraft Pro",
		description: "Real-time cryptocurrency trading analytics dashboard",
		tech: ["React", "Node.js", "WebSocket", "Redis", "TradingView"],
		status: "Production",
		url: "https://tradecraft.pro",
	},
	"sovereign-cbam": {
		name: "Sovereign CBAM",
		description: "EU Carbon Border Adjustment compliance platform for importers",
		tech: ["Next.js", "Hono", "PostgreSQL", "Cloudflare Workers"],
		status: "Development",
		url: null,
	},
};

const skills = {
	frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
	backend: ["Node.js", "Python", "Go", "PostgreSQL", "Redis"],
	infrastructure: ["AWS", "Cloudflare", "Docker", "Kubernetes", "Terraform"],
	data: ["PostgreSQL", "MongoDB", "GraphQL", "Prisma", "Drizzle"],
};

const blogPosts = [
	{ slug: "saas-authentication-patterns", title: "SaaS Authentication Patterns for 2025" },
	{ slug: "cloudflare-workers-edge", title: "Building at the Edge with Cloudflare Workers" },
	{ slug: "typescript-strict-mode", title: "Why TypeScript Strict Mode is Non-Negotiable" },
];

// Command Implementations
const commands: Record<string, CommandHandler> = {
	help: () => ({
		output: `
┌─────────────────────────────────────────────────────────────┐
│ ALEX_OS v1.0.0 — Available Commands                         │
├─────────────────────────────────────────────────────────────┤
│  whoami          Who is Alex Mayhew?                        │
│  ls [path]       List contents (projects/, blog/, skills/)  │
│  cat <file>      View file contents                         │
│  cd <path>       Navigate to section                        │
│  skills          Technical skillset overview                │
│  contact         Contact information                        │
│  clear           Clear terminal                             │
│  theme [name]    Switch theme (matrix/amber/cyan)           │
│  neofetch        System information                         │
│  sudo hire alex  🎯 Hire Alex                               │
└─────────────────────────────────────────────────────────────┘`,
	}),

	whoami: () => ({
		output: `
┌─────────────────────────────────────────────────────────────┐
│ IDENTITY: Alex Mayhew                                       │
├─────────────────────────────────────────────────────────────┤
│ Role:       Full-Stack Developer & Technical Architect      │
│ Location:   Remote / Worldwide                              │
│ Experience: 6+ years                                        │
│ Status:     ● Currently accepting projects                  │
├─────────────────────────────────────────────────────────────┤
│ Philosophy: "Building high-precision digital instruments    │
│             that feel tactile, heavy, and responsive."      │
│                                                             │
│ I reject generic solutions and cookie-cutter templates.     │
│ Every project is an opportunity to craft something          │
│ exceptional.                                                │
└─────────────────────────────────────────────────────────────┘`,
	}),

	ls: (args, ctx) => {
		const path = args[0] || ctx.currentPath;
		const normalizedPath = path.replace(/^\//, "").replace(/\/$/, "") || "/";

		if (normalizedPath === "/" || normalizedPath === "") {
			return {
				output: `
drwxr-xr-x  projects/
drwxr-xr-x  blog/
drwxr-xr-x  skills/
-rw-r--r--  README.md
-rw-r--r--  contact.txt`,
			};
		}

		if (normalizedPath === "projects" || normalizedPath === "projects/") {
			const projectList = Object.entries(projects)
				.map(([slug, p]) => `-rw-r--r--  ${slug}.md    [${p.status}]`)
				.join("\n");
			return { output: projectList };
		}

		if (normalizedPath === "blog" || normalizedPath === "blog/") {
			const blogList = blogPosts.map((p) => `-rw-r--r--  ${p.slug}.md`).join("\n");
			return { output: blogList };
		}

		if (normalizedPath === "skills" || normalizedPath === "skills/") {
			const skillDirs = Object.keys(skills)
				.map((cat) => `drwxr-xr-x  ${cat}/`)
				.join("\n");
			return { output: skillDirs };
		}

		return { output: `ls: cannot access '${path}': No such file or directory`, isError: true };
	},

	cat: (args) => {
		if (!args[0]) {
			return { output: "cat: missing operand", isError: true };
		}

		const file = args[0].replace(/^\//, "").replace(/\.md$/, "");

		// Check projects
		if (file.startsWith("projects/")) {
			const projectSlug = file.replace("projects/", "");
			const project = projects[projectSlug as keyof typeof projects];
			if (project) {
				return {
					output: `
# ${project.name}

${project.description}

## Tech Stack
${project.tech.map((t) => `  - ${t}`).join("\n")}

## Status
${project.status}
${project.url ? `\n## URL\n${project.url}` : ""}`,
				};
			}
		}

		// Check blog
		if (file.startsWith("blog/")) {
			const blogSlug = file.replace("blog/", "");
			const post = blogPosts.find((p) => p.slug === blogSlug);
			if (post) {
				return {
					output: `
# ${post.title}

→ Read full article at: /blog/${post.slug}

Type 'cd /blog' to navigate to the blog section.`,
				};
			}
		}

		// README
		if (file === "README" || file === "README.md") {
			return {
				output: `
# alexmayhew.dev

Welcome to my digital workspace.

## Quick Navigation
- Type 'ls projects/' to see my work
- Type 'skills' for my technical expertise
- Type 'contact' for ways to reach me
- Type 'sudo hire alex' to start a project

Built with atmospheric precision. ◆`,
			};
		}

		// contact.txt
		if (file === "contact" || file === "contact.txt") {
			return {
				output: `
┌─────────────────────────────────────────────────────────────┐
│ CONTACT ENDPOINTS                                           │
├─────────────────────────────────────────────────────────────┤
│ Email:    alex@alexmayhew.dev                               │
│ GitHub:   github.com/alexmayhew                             │
│ LinkedIn: linkedin.com/in/alexmayhew                        │
│                                                             │
│ Response time: Within 24 hours                              │
│ Timezone:      UTC-flexible                                 │
│                                                             │
│ → Type 'cd /contact' to navigate to contact form            │
└─────────────────────────────────────────────────────────────┘`,
			};
		}

		return { output: `cat: ${args[0]}: No such file or directory`, isError: true };
	},

	cd: (args, ctx) => {
		if (!args[0] || args[0] === "~" || args[0] === "/") {
			ctx.setCurrentPath("/");
			return { output: "" };
		}

		const validPaths: Record<string, string | undefined> = {
			"/work": "/work",
			"/projects": "/work",
			work: "/work",
			projects: "/work",
			"/blog": "/blog",
			blog: "/blog",
			"/about": "/about",
			about: "/about",
			"/contact": "/contact",
			contact: "/contact",
			"/skills": "/about",
			skills: "/about",
		};

		const redirect = validPaths[args[0]];
		if (redirect) {
			return {
				output: `Navigating to ${redirect}...`,
				redirect,
			};
		}

		return { output: `cd: ${args[0]}: No such directory`, isError: true };
	},

	skills: () => ({
		output: `
┌─────────────────────────────────────────────────────────────┐
│ TECHNICAL SKILLSET                                          │
├─────────────────────────────────────────────────────────────┤
│ ▸ FRONTEND                                                  │
│   React, Next.js, TypeScript, Tailwind CSS, Framer Motion   │
│                                                             │
│ ▸ BACKEND                                                   │
│   Node.js, Python, Go, PostgreSQL, Redis                    │
│                                                             │
│ ▸ INFRASTRUCTURE                                            │
│   AWS, Cloudflare, Docker, Kubernetes, Terraform            │
│                                                             │
│ ▸ DATA                                                      │
│   PostgreSQL, MongoDB, GraphQL, Prisma, Drizzle             │
└─────────────────────────────────────────────────────────────┘`,
	}),

	contact: () => ({
		output: `
┌─────────────────────────────────────────────────────────────┐
│ INITIALIZE CONNECTION                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Email:     alex@alexmayhew.dev                              │
│ Response:  Within 24 hours                                  │
│ Status:    ● Currently accepting projects                   │
│                                                             │
│ → Type 'cd /contact' to open contact form                   │
│ → Or email directly for faster response                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘`,
	}),

	clear: () => ({
		output: "",
		shouldClear: true,
	}),

	theme: (args) => {
		const themes = ["matrix", "amber", "cyan", "default"];
		if (!args[0]) {
			return {
				output: `Current themes: ${themes.join(", ")}\nUsage: theme <name>`,
			};
		}
		if (!themes.includes(args[0])) {
			return {
				output: `theme: '${args[0]}' not found. Available: ${themes.join(", ")}`,
				isError: true,
			};
		}
		return {
			output: `Theme switched to '${args[0]}' — but this is just a demo! The real thing would change colors.`,
		};
	},

	neofetch: () => ({
		output: `
                    ████████                    visitor@alexmayhew.dev
                  ██        ██                  ─────────────────────────
                ██    ████    ██                OS: ALEX_OS v1.0.0
              ██    ██    ██    ██              Host: alexmayhew.dev
            ██    ██        ██    ██            Kernel: Next.js 15.5
          ██    ██            ██    ██          Shell: Terminal v1.0
        ██    ██    ████████    ██    ██        Resolution: Atmospheric
      ██    ██    ██        ██    ██    ██      DE: Neo-Brutalist
    ██    ██    ██    ████    ██    ██    ██    WM: Framer Motion
    ██  ██    ██    ██    ██    ██    ██  ██    Theme: Void Navy
    ██  ██    ██    ████████    ██    ██  ██    Icons: Lucide
    ██  ██    ██                ██    ██  ██    Terminal: ALEX_OS Terminal
    ██  ██    ████████████████████    ██  ██    CPU: TypeScript @ 5.5GHz
    ██  ██                            ██  ██    GPU: React Three Fiber
    ██    ██                        ██    ██    Memory: 6+ Years XP
      ██    ████████████████████████    ██
        ██                            ██        Uptime: Since 2018
          ████████████████████████████          Status: ● Available`,
	}),

	sudo: (args) => {
		if (args.join(" ").toLowerCase() === "hire alex") {
			return {
				output: `
[sudo] password for visitor: ********
✓ Authentication successful

┌─────────────────────────────────────────────────────────────┐
│ 🎯 INITIATING HIRE SEQUENCE                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Excellent choice! You're about to work with someone who:    │
│                                                             │
│   ✓ Builds atmospheric, high-precision digital instruments  │
│   ✓ Rejects generic solutions and cookie-cutter templates   │
│   ✓ Delivers exceptional quality on every project           │
│                                                             │
│ → Redirecting to contact form...                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘`,
				redirect: "/contact",
			};
		}
		return { output: `sudo: '${args.join(" ")}': command not found`, isError: true };
	},

	// Easter eggs
	rm: (args) => {
		if (args.includes("-rf") && (args.includes("/") || args.includes("*"))) {
			return {
				output: `Nice try! 😎 But this is a read-only filesystem. Your mischief has been logged.`,
				isError: true,
			};
		}
		return { output: `rm: cannot remove: Read-only file system`, isError: true };
	},

	vim: () => ({ output: `How do I exit this thing?! Just kidding. Try 'cat' instead.` }),
	nano: () => ({ output: `Editor not available. This terminal is for exploration only.` }),
	exit: () => ({ output: `You can't escape that easily. Try 'cd /contact' instead.` }),
	pwd: (_args, ctx) => ({ output: ctx.currentPath || "/" }),
	echo: (args) => ({ output: args.join(" ") }),
	date: () => ({ output: new Date().toString() }),
	uptime: () => ({
		output: `System online since 2018. That's ${new Date().getFullYear() - 2018}+ years of experience.`,
	}),
};

// Default handler for unknown commands
const unknownCommand: CommandHandler = (args) => ({
	output: `Command not found: ${args[0] || ""}. Type 'help' for available commands.`,
	isError: true,
});

export function executeCommand(input: string, ctx: CommandContext): CommandResult {
	const trimmed = input.trim();
	if (!trimmed) return { output: "" };

	const parts = trimmed.split(/\s+/);
	const cmd = parts[0].toLowerCase();
	const args = parts.slice(1);

	const handler = commands[cmd];
	if (handler) {
		return handler(args, ctx);
	}

	return unknownCommand([cmd, ...args], ctx);
}

export { commands };
