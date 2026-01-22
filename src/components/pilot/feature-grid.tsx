"use client";

import { m } from "framer-motion";
import { Layout, Database, Server, Terminal, Activity, User, Shield, Zap } from "lucide-react";

const springTransition = {
	type: "spring" as const,
	stiffness: 100,
	damping: 20,
	mass: 1,
};

interface Feature {
	icon: React.ReactNode;
	title: string;
	description: string;
}

const features: Feature[] = [
	{
		icon: <Layout className="h-6 w-6" strokeWidth={1.5} />,
		title: "Session Management",
		description:
			"Monitor, inspect, and clean up Claude Code sessions with visual transcript viewer",
	},
	{
		icon: <Database className="h-6 w-6" strokeWidth={1.5} />,
		title: "Memory Browser",
		description: "Search across PostgreSQL, Memgraph, and Qdrant memory systems in one interface",
	},
	{
		icon: <Server className="h-6 w-6" strokeWidth={1.5} />,
		title: "MCP Control",
		description: "Configure MCP servers on the fly without restarting Claude Code",
	},
	{
		icon: <Terminal className="h-6 w-6" strokeWidth={1.5} />,
		title: "Integrated Terminal",
		description: "Multi-tab terminal with Claude CLI integration and command history",
	},
	{
		icon: <Activity className="h-6 w-6" strokeWidth={1.5} />,
		title: "System Monitor",
		description: "Real-time CPU, memory, and GPU metrics with resource alerts",
	},
	{
		icon: <User className="h-6 w-6" strokeWidth={1.5} />,
		title: "Profile Manager",
		description: "Switch between development contexts and project configurations instantly",
	},
];

export function FeatureGrid() {
	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{features.map((feature, index) => (
				<m.div
					key={feature.title}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ ...springTransition, delay: index * 0.05 }}
					className="group hover:border-cyber-lime/30 border border-white/10 p-6 transition-colors"
				>
					<div className="text-cyber-lime mb-4 transition-transform group-hover:scale-110">
						{feature.icon}
					</div>
					<h3 className="text-mist-white mb-2 font-mono text-sm">{feature.title}</h3>
					<p className="text-slate-text text-xs leading-relaxed">{feature.description}</p>
				</m.div>
			))}
		</div>
	);
}

const securityFeatures = [
	{
		icon: <Shield className="h-5 w-5" strokeWidth={1.5} />,
		title: "Context Isolation",
		description: "Renderer processes are sandboxed with strict security boundaries",
	},
	{
		icon: <Zap className="h-5 w-5" strokeWidth={1.5} />,
		title: "No Telemetry",
		description: "Zero analytics, no tracking, your data stays on your machine",
	},
	{
		icon: <Database className="h-5 w-5" strokeWidth={1.5} />,
		title: "OS Keychain",
		description: "Credentials stored securely in your operating system's keychain",
	},
];

export function SecuritySection() {
	return (
		<div className="border-t border-white/10 pt-8">
			<h3 className="text-mist-white mb-6 font-mono text-sm tracking-wider uppercase">
				Security First
			</h3>
			<div className="grid gap-4 sm:grid-cols-3">
				{securityFeatures.map((feature, index) => (
					<m.div
						key={feature.title}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ ...springTransition, delay: 0.3 + index * 0.05 }}
						className="flex items-start gap-3"
					>
						<div className="text-cyber-lime shrink-0">{feature.icon}</div>
						<div>
							<h4 className="text-mist-white font-mono text-xs">{feature.title}</h4>
							<p className="text-slate-text mt-1 text-xs">{feature.description}</p>
						</div>
					</m.div>
				))}
			</div>
		</div>
	);
}
