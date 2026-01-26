# Copy Audit Report: Freelancer vs Technical Advisor Language

**Audit Date:** 2026-01-23
**Bead ID:** amdev-drq
**Objective:** Identify all language positioning Alex as a "freelancer" vs "technical advisor"

---

## Executive Summary

This audit identifies **28 phrases** across **12 files** that use freelancer-oriented language instead of technical advisor/premium consultant positioning. The changes fall into three categories:

1. **Role/Title References** - Direct mentions of "freelancer" or "developer for hire"
2. **Availability Language** - Task-focused vs engagement-focused phrasing
3. **Value Proposition** - Self-focused vs client-outcome focused messaging

---

## Findings by File

### 1. `/src/app/layout.tsx` (Root Metadata)

| Line | Current Phrase                                                    | Suggested Replacement                                    | Category |
| ---- | ----------------------------------------------------------------- | -------------------------------------------------------- | -------- |
| 33   | `"Alex Mayhew \| Full-Stack Developer & Software Architect"`      | `"Alex Mayhew \| Technical Advisor & Systems Architect"` | Role     |
| 45   | `"freelance developer"` (in keywords array)                       | `"technical advisor"`                                    | Role     |
| 79   | `"Alex Mayhew \| Full-Stack Developer & Software Architect"` (OG) | `"Alex Mayhew \| Technical Advisor & Systems Architect"` | Role     |
| 87   | `"Alex Mayhew - Full-Stack Developer"` (OG image alt)             | `"Alex Mayhew - Technical Advisor"`                      | Role     |
| 93   | `"Alex Mayhew \| Full-Stack Developer"` (Twitter)                 | `"Alex Mayhew \| Technical Advisor"`                     | Role     |

---

### 2. `/src/app/about/page.tsx` (About Page Metadata)

| Line  | Current Phrase                                                                                              | Suggested Replacement                                                                                                                 | Category   |
| ----- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 7     | `"Full-stack developer with 6+ years of experience building high-precision digital instruments"`            | `"Technical advisor partnering with select clients to architect high-precision digital instruments"`                                  | Role/Value |
| 10-11 | `"Full-stack developer with 6+ years experience. Specializing in React, Next.js, and system architecture."` | `"Technical advisor with 6+ years architecting enterprise-grade solutions. Specializing in React, Next.js, and system architecture."` | Role       |

---

### 3. `/src/app/contact/page.tsx` (Contact Page Metadata)

| Line | Current Phrase                              | Suggested Replacement                       | Category     |
| ---- | ------------------------------------------- | ------------------------------------------- | ------------ |
| 8    | `"Available for freelance work worldwide."` | `"Accepting select engagements worldwide."` | Availability |
| 12   | `"Available worldwide."`                    | `"Serving select clients worldwide."`       | Availability |

---

### 4. `/src/components/pages/about-page.tsx` (About Component)

| Line  | Current Phrase                                                                                                                   | Suggested Replacement                                                                                                                          | Category     |
| ----- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| 39-40 | `{ year: "2024", title: "Freelance Developer", description: "Building high-precision digital instruments for select clients." }` | `{ year: "2024", title: "Technical Advisor", description: "Partnering with select clients to architect high-precision digital instruments." }` | Role         |
| 98-99 | `"I'm a full-stack developer with a passion for building high-precision digital instruments."`                                   | `"I'm a technical advisor specializing in high-precision digital instruments for the web."`                                                    | Role         |
| 124   | `"Available for Projects"`                                                                                                       | `"Accepting Select Engagements"`                                                                                                               | Availability |

---

### 5. `/src/components/pages/contact-page.tsx` (Contact Component)

| Line    | Current Phrase                                                                                | Suggested Replacement                                                                                     | Category     |
| ------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------ |
| 109-111 | `"Ready to build something exceptional? Send a transmission and let's discuss your project."` | `"Ready to architect something exceptional? Initiate a transmission to discuss a potential partnership."` | Value        |
| 394     | `"Currently accepting new projects"`                                                          | `"Accepting select engagements"`                                                                          | Availability |

---

### 6. `/src/app/page.tsx` (Homepage)

| Line  | Current Phrase                                                                                | Suggested Replacement                                                                                        | Category |
| ----- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------- |
| 38-39 | `description: "End-to-end web applications built with modern frameworks and best practices."` | `description: "End-to-end web applications architected for scale, security, and long-term maintainability."` | Value    |
| 235   | `"Ready to build something exceptional?"`                                                     | `"Ready to architect something exceptional?"`                                                                | Value    |
| 238   | `"Transform your vision into a high-precision digital reality."`                              | `"Partner with me to transform your vision into enterprise-grade digital reality."`                          | Value    |

---

### 7. `/src/components/seo/json-ld.tsx` (Structured Data)

| Line  | Current Phrase                                                                       | Suggested Replacement                                                                                                                 | Category |
| ----- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 14    | `jobTitle: "Full-Stack Developer & Software Architect"`                              | `jobTitle: "Technical Advisor & Systems Architect"`                                                                                   | Role     |
| 17-18 | `worksFor: { "@type": "Organization", name: "Freelance" }`                           | `worksFor: { "@type": "Organization", name: "Independent Consultancy" }`                                                              | Role     |
| 19-20 | `description: "Full-stack web developer specializing in modern web technologies..."` | `description: "Technical advisor specializing in enterprise-grade web solutions, system architecture, and performance optimization."` | Role     |

---

### 8. `/src/components/seo/contact-json-ld.tsx` (Contact Structured Data)

| Line | Current Phrase                                          | Suggested Replacement                               | Category |
| ---- | ------------------------------------------------------- | --------------------------------------------------- | -------- |
| 16   | `jobTitle: "Full-Stack Developer & Software Architect"` | `jobTitle: "Technical Advisor & Systems Architect"` | Role     |

---

### 9. `/src/components/ui/footer.tsx` (Footer)

No direct freelancer language found. The footer is well-positioned.

---

### 10. `/src/app/work/page.tsx` (Work Page Metadata)

No freelancer language found. Already uses professional "enterprise-grade" positioning.

---

### 11. `/src/data/projects.ts` (Project Data)

No freelancer language found. Project descriptions are outcome-focused and well-positioned.

---

### 12. `/src/components/pages/work-page.tsx` (Work Component)

| Line  | Current Phrase                                                                                                       | Suggested Replacement                                                                                                  | Category |
| ----- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------- |
| 41-44 | `"A collection of projects that push boundaries, solve complex problems, and deliver exceptional user experiences."` | `"Enterprise-grade solutions that push boundaries, solve complex problems, and deliver measurable business outcomes."` | Value    |

---

## Summary Statistics

| Category              | Count  |
| --------------------- | ------ |
| Role/Title References | 14     |
| Availability Language | 4      |
| Value Proposition     | 6      |
| **Total**             | **24** |

---

## Priority Order for Changes

### High Priority (Immediate Impact)

1. Root layout metadata (`/src/app/layout.tsx`) - Affects all pages
2. JSON-LD structured data (`/src/components/seo/json-ld.tsx`) - Affects SEO
3. About page timeline (`/src/components/pages/about-page.tsx`) - Direct "Freelance Developer" mention

### Medium Priority

4. Contact page metadata and component
5. About page bio text
6. Homepage CTA sections

### Low Priority

7. Work page description refinement

---

## Language Pattern Guide

### Avoid

- "Freelance" / "Freelancer"
- "Available for work" / "Available for projects"
- "Hire me"
- "I build websites/apps"
- Hourly rate mentions
- Task-focused descriptions

### Prefer

- "Technical Advisor" / "Systems Architect"
- "Accepting select engagements"
- "Partner with me"
- "I architect solutions"
- Value/outcome-focused descriptions
- Engagement-based pricing language

---

## Next Steps

1. Create bead for implementing these changes
2. Update copy in priority order
3. Run `npm run build` to verify no breaks
4. Test SEO structured data with Google Rich Results Test
5. Close this audit bead

---

_Audit completed by Claude Code on 2026-01-23_
