"use client";

import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { highlight } from "sugar-high";

import type { Components } from "react-markdown";

interface ChatMarkdownProps {
	content: string;
}

const components: Components = {
	p: ({ children }) => <p className="mb-2 text-sm leading-relaxed last:mb-0">{children}</p>,
	pre: ({ children }) => <>{children}</>,
	code: ({ className, children }) => {
		const isBlock = className?.includes("language-");
		if (isBlock) {
			const html = highlight(String(children).replace(/\n$/, ""));
			const safeHtml = DOMPurify.sanitize(html, {
				ALLOWED_TAGS: ["span", "code", "pre"],
				ALLOWED_ATTR: ["class", "style"],
			});
			return (
				<pre className="bg-gunmetal-glass overflow-x-auto rounded-md border border-white/10 p-3 font-mono text-xs">
					<code dangerouslySetInnerHTML={{ __html: safeHtml }} />
				</pre>
			);
		}
		return <code className="rounded-sm bg-white/5 px-1 py-0.5 font-mono text-xs">{children}</code>;
	},
	ul: ({ children }) => <ul className="mb-2 list-none space-y-1 text-sm">{children}</ul>,
	ol: ({ children }) => (
		<ol className="mb-2 list-inside list-decimal space-y-1 text-sm">{children}</ol>
	),
	li: ({ children }) => (
		<li className="flex gap-1.5">
			<span className="text-cyber-lime/50 mt-0.5 shrink-0 font-mono text-xs select-none">
				{"//"}
			</span>
			<span>{children}</span>
		</li>
	),
	strong: ({ children }) => <strong className="text-mist-white font-semibold">{children}</strong>,
	em: ({ children }) => <em className="text-slate-text italic">{children}</em>,
	a: ({ href, children }) => (
		<a
			href={href}
			className="text-cyber-lime underline underline-offset-2"
			target="_blank"
			rel="noopener noreferrer"
		>
			{children}
		</a>
	),
	h1: ({ children }) => (
		<h1 className="text-mist-white mb-1 font-mono text-lg font-semibold">{children}</h1>
	),
	h2: ({ children }) => (
		<h2 className="text-mist-white mb-1 font-mono text-base font-semibold">{children}</h2>
	),
	h3: ({ children }) => (
		<h3 className="text-mist-white mb-1 font-mono text-sm font-semibold">{children}</h3>
	),
	blockquote: ({ children }) => (
		<blockquote className="border-cyber-lime/30 text-slate-text border-l-2 pl-3 text-sm italic">
			{children}
		</blockquote>
	),
};

export function ChatMarkdown({ content }: ChatMarkdownProps) {
	return (
		<ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
			{content}
		</ReactMarkdown>
	);
}
