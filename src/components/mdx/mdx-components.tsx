import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// Neo-brutalist styled MDX components
export const mdxComponents = {
	h1: ({ className, ...props }: ComponentProps<"h1">) => (
		<h1
			className={cn("mt-12 mb-6 font-mono text-3xl font-bold tracking-tight first:mt-0", className)}
			{...props}
		/>
	),

	h2: ({ className, children, ...props }: ComponentProps<"h2">) => (
		<h2
			className={cn(
				"text-mist-white mt-10 mb-4 font-mono text-xl font-semibold tracking-tight",
				className
			)}
			{...props}
		>
			<span className="text-cyber-lime mr-3 text-sm">●</span>
			{children}
		</h2>
	),

	h3: ({ className, ...props }: ComponentProps<"h3">) => (
		<h3 className={cn("mt-8 mb-3 font-mono text-lg tracking-tight", className)} {...props} />
	),

	p: ({ className, ...props }: ComponentProps<"p">) => (
		<p
			className={cn("text-slate-text mb-4 leading-relaxed [&:not(:first-child)]:mt-4", className)}
			{...props}
		/>
	),

	a: ({ className, href, ...props }: ComponentProps<"a">) => (
		<a
			href={href}
			className={cn(
				"text-cyber-lime decoration-cyber-lime/30 hover:decoration-cyber-lime underline underline-offset-4 transition-colors",
				className
			)}
			{...props}
		/>
	),

	ul: ({ className, ...props }: ComponentProps<"ul">) => (
		<ul className={cn("text-slate-text my-4 ml-6 list-none space-y-2", className)} {...props} />
	),

	ol: ({ className, ...props }: ComponentProps<"ol">) => (
		<ol className={cn("text-slate-text my-4 ml-6 list-none space-y-2", className)} {...props} />
	),

	li: ({ className, ...props }: ComponentProps<"li">) => (
		<li
			className={cn(
				"text-slate-text before:text-cyber-lime/50 relative pl-6 before:absolute before:left-0 before:font-mono before:text-sm before:content-['//']",
				className
			)}
			{...props}
		/>
	),

	code: ({ className, ...props }: ComponentProps<"code">) => (
		<code
			className={cn(
				"bg-gunmetal-glass/50 text-cyber-lime rounded-sm px-1.5 py-0.5 font-mono text-sm",
				className
			)}
			{...props}
		/>
	),

	pre: ({ className, children, ...props }: ComponentProps<"pre">) => (
		<pre
			className={cn(
				"bg-gunmetal-glass/30 relative my-6 overflow-x-auto border border-white/10 p-4 font-mono text-sm",
				className
			)}
			{...props}
		>
			{/* Corner accents */}
			<div className="border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r" />
			<div className="border-cyber-lime absolute bottom-0 left-0 h-3 w-3 border-b border-l" />
			{children}
		</pre>
	),

	blockquote: ({ className, ...props }: ComponentProps<"blockquote">) => (
		<blockquote
			className={cn(
				"border-cyber-lime bg-gunmetal-glass/10 my-6 border-l-2 py-4 pl-6 italic",
				className
			)}
			{...props}
		/>
	),

	table: ({ className, ...props }: ComponentProps<"table">) => (
		<div className="my-6 overflow-x-auto">
			<table className={cn("w-full border-collapse font-mono text-sm", className)} {...props} />
		</div>
	),

	th: ({ className, ...props }: ComponentProps<"th">) => (
		<th
			className={cn(
				"text-cyber-lime border-b border-white/10 px-4 py-2 text-left text-xs tracking-wider uppercase",
				className
			)}
			{...props}
		/>
	),

	td: ({ className, ...props }: ComponentProps<"td">) => (
		<td className={cn("text-slate-text border-b border-white/5 px-4 py-2", className)} {...props} />
	),

	hr: ({ className, ...props }: ComponentProps<"hr">) => (
		<hr className={cn("my-8 h-px border-none bg-white/10", className)} {...props} />
	),

	img: ({ className, alt, ...props }: ComponentProps<"img">) => (
		<figure className="my-6">
			<div className="bg-gunmetal-glass/20 relative border border-white/10 p-2">
				<div className="border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r" />
				<div className="border-cyber-lime absolute bottom-0 left-0 h-3 w-3 border-b border-l" />
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img className={cn("w-full", className)} alt={alt} {...props} />
			</div>
			{alt && (
				<figcaption className="text-slate-text mt-2 font-mono text-xs">{`// ${alt}`}</figcaption>
			)}
		</figure>
	),

	strong: ({ className, ...props }: ComponentProps<"strong">) => (
		<strong className={cn("text-mist-white font-semibold", className)} {...props} />
	),

	em: ({ className, ...props }: ComponentProps<"em">) => (
		<em className={cn("text-cyber-lime/80 not-italic", className)} {...props} />
	),
};
