---
paths:
  - "src/components/**/*.tsx"
  - "src/app/**/*.tsx"
---

# Design System Rules

## Forbidden Patterns

| Pattern                                    | Why                              | Alternative                         |
| ------------------------------------------ | -------------------------------- | ----------------------------------- |
| `rounded-lg`, `rounded-xl`, `rounded-full` | Too soft for brutalist aesthetic | `rounded-sm`, `rounded-md` max      |
| `shadow-*` (any)                           | Generic, diffuse                 | `border border-white/10` or glow    |
| Centered text blocks                       | Magazine-style preferred         | Asymmetric, left-aligned            |
| Linear animations                          | Robotic/cheap feel               | Spring physics always               |
| Pure black `#000`                          | Too harsh                        | `bg-void-navy` (#0B0E14)            |
| Generic gradients                          | Instagram aesthetic              | Subtle radial for lighting only     |
| `<div>` soup                               | Bad semantics                    | `<section>`, `<article>`, `<aside>` |

## Typography

- **Headers:** `font-mono` (JetBrains Mono), `tracking-tight`
- **Body:** `font-sans` (Inter), `tracking-normal`
- **Code/Tech:** `font-mono text-xs`

## Motion (Framer Motion)

ALWAYS use spring physics:

```tsx
transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}
```

## Accessibility

- All interactive elements: `aria-label` if no visible text
- Focus states: `focus:ring-2 focus:ring-cyber-lime focus:outline-none`
- Skip links for navigation
