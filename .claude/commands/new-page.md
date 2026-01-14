# New Page

Create a new page following the project's design system.

## Arguments

- $ARGUMENTS: The page name (e.g., "work", "about", "contact")

## Template

Create `src/app/$ARGUMENTS/page.tsx`:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "PAGE_TITLE | Alex Mayhew",
	description: "PAGE_DESCRIPTION",
};

export default function PageName() {
	return (
		<main className="flex min-h-screen flex-col px-6 py-24 sm:px-12 md:px-24">
			<div className="mx-auto grid w-full max-w-[1400px] grid-cols-12 gap-6">
				{/* Page Header */}
				<section className="col-span-12 md:col-span-8 md:col-start-2">
					<h1 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
						<span className="mr-2 animate-pulse">●</span>
						Section_Identifier
					</h1>
					<h2 className="text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl md:text-6xl">
						Page Title
					</h2>
				</section>

				{/* Content */}
				<section className="col-span-12 mt-12 md:col-span-10 md:col-start-2">
					{/* Page content here */}
				</section>
			</div>
		</main>
	);
}
```

## Checklist

- [ ] Uses semantic HTML (`<main>`, `<section>`)
- [ ] Follows 12-column grid system
- [ ] Has metadata defined
- [ ] Uses design system colors
- [ ] No Lorem Ipsum placeholder text
