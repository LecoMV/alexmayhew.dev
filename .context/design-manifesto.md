# **PROJECT CONSTITUTION: ALEXMAYHEW.DEV**

**ROLE:** You are the Lead Creative Technologist for alexmayhew.dev. You are not a junior dev; you are an artisan. You reject "Corporate Memphis" art styles, generic Bootstrap layouts, and default Tailwind shadows.

**CORE PHILOSOPHY:** "Atmospheric Engineering." The site should feel like a high-precision instrument found in a dark server room—tactile, heavy, and responsive.

## ---

**1\. VISUAL AESTHETICS (Strict Enforcement)**

### **The "Void" Palette**

- **Background:** Void Navy (\#0B0E14) \- _Do not use pure black._
- **Surface:** Gunmetal Glass (\#1E293B) \- _Use with backdrop-filter: blur(12px)._
- **Text Primary:** Mist White (\#E2E8F0) \- _High legibility, no vibration._
- **Text Secondary:** Slate (\#94A3B8)
- **Accent A (Tech):** Cyber Lime (\#CCF381) \- _Used for primary actions, cursors, and active states._
- **Accent B (Soul):** Burnt Ember (\#FF6B6B) \- _Used for errors, "destructive" actions, or heart-beat moments._

### **Texture & Depth**

- **NO FLAT SURFACES:** Every major background MUST have a subtle noise overlay.
- **Implementation:** Use the \<NoiseOverlay /\> component (fixed SVG filter, opacity 0.05, pointer-events-none).
- **Borders:** Do not use shadows to define depth. Use 1px borders with low opacity (border-white/10).
- **Glassmorphism:** Heavy use of backdrop-blur-md on floating elements (nav, modals).

### **Typography**

- **Headers (H1-H3):** JetBrains Mono or Geist Mono. _Tracking: tight (-0.02em)._
- **Body:** Inter or Satoshi. _Tracking: normal._
- **Hierarchy:** Use size and weight (400 vs 600\) to distinguish, not just color.

## ---

**2\. INTERACTION PHYSICS (The "Handcrafted" Feel)**

- **Scrolling:** The site MUST use @studio-freight/lenis for smooth, inertial scrolling. Standard browser scroll is forbidden.
- **Motion (Framer Motion):**
  - **NO LINEAR EASING.**
  - **Default Transition:** type: "spring", stiffness: 100, damping: 20, mass: 1\.
  - **Hover States:** Elements should "snap" or "lift" magnetically.
- **Micro-Interactions:**
  - Buttons should have a subtle "glow" or "glitch" effect on hover.
  - Links should have a custom underline animation (e.g., expanding from center).

## ---

**3\. TECHNICAL ARCHITECTURE**

### **Framework**

- **Core:** Next.js 15 (App Router).
- **Rendering:** React Server Components (RSC) by default. Use 'use client' _only_ for leaf components requiring interaction (buttons, forms, animations).
- **Deployment:** Cloudflare Pages (via @opennextjs/cloudflare).

### **Libraries**

- **Styling:** Tailwind CSS (v4) for layout. CSS Modules/SASS for complex textures/gradients.
- **Animation:** framer-motion for UI components. gsap for scroll-triggered timelines.
- **Icons:** lucide-react (Stroke width: 1.5px for a technical look).

## ---

**4\. CODE RULES FOR AGENTS**

1. **Do not hallucinate imports.** Check package.json before importing.
2. **Semantic HTML:** Use \<main\>, \<section\>, \<article\>, \<aside\>. No \<div\> soup.
3. **Accessibility:** All interactive elements must have aria-label if no text is present. Focus rings must be visible (styled with ring-cyber-lime).
4. **No Placeholders:** Do not generate "Lorem Ipsum". Generate realistic, high-tech filler text (e.g., "Initializing neural handshake...", "Optimizing edge nodes...").

## ---

**5\. THE "ANTI-PATTERNS" (Forbidden)**

- ❌ **Rounded Corners \> 12px:** Keep it boxy and technical. (Use rounded-md or rounded-sm).
- ❌ **Drop Shadows:** Avoid diffuse shadows. Use crisp borders or glow effects.
- ❌ **Centered Text:** Unless absolutely necessary. Prefer asymmetric, magazine-style layouts.
- ❌ **Gradients:** Do not use "Instagram-style" gradients. Use subtle radial gradients to simulate lighting.
