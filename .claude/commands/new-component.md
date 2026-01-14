# New Component

Create a new UI component following the project's patterns.

## Arguments

- $ARGUMENTS: Component name in PascalCase (e.g., "ProjectCard", "NavLink")

## Determine Type

1. **Server Component (default):** Static display, no interactivity
2. **Client Component:** Requires useState, useEffect, onClick, animations

## Server Component Template

Create `src/components/ui/$ARGUMENTS.tsx`:

```tsx
import { cn } from "@/lib/utils";

interface ComponentNameProps {
	className?: string;
	children?: React.ReactNode;
}

export function ComponentName({ className, children }: ComponentNameProps) {
	return (
		<div
			className={cn("bg-gunmetal-glass/20 border border-white/10 p-6 backdrop-blur-md", className)}
		>
			{children}
		</div>
	);
}
```

## Client Component Template

Create `src/components/ui/$ARGUMENTS.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ComponentNameProps {
	className?: string;
	children?: React.ReactNode;
}

export function ComponentName({ className, children }: ComponentNameProps) {
	return (
		<motion.div
			className={cn("bg-gunmetal-glass/20 border border-white/10 p-6 backdrop-blur-md", className)}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ type: "spring", stiffness: 100, damping: 20 }}
		>
			{children}
		</motion.div>
	);
}
```

## Checklist

- [ ] Uses TypeScript with explicit types
- [ ] Accepts className prop for customization
- [ ] Uses cn() utility for class merging
- [ ] Follows design system (no shadows, correct colors)
- [ ] Has proper motion if interactive
