---
sequence: 5
title: "A Real One: Fitting 14 AI Models on One GPU"
subject: "A real one: fitting 14 AI models on a single GPU"
delay: "21 days"
status: "draft"
---

Subject: A real one: fitting 14 AI models on a single GPU

Hey {first_name},

The last few emails were frameworks. This one is a real problem I hit building one of my own products, because the same decision-at-the-right-stage thinking applies to code, not just org charts.

I built a photo-restoration platform (PhotoKeep Pro) on top of 14+ deep learning models... SUPIR, HAT, Real-ESRGAN, CodeFormer, GFPGAN, and more. The naive version chained paid cloud APIs: one service for upscaling, another for face restoration, another for colorization. It was expensive, slow, and the quality wandered between runs because nothing coordinated the stages.

---

## The Actual Constraint

The models range from ~2GB (CodeFormer, for faces) to ~12GB (SUPIR, for general restoration). Load them all naively and you exhaust even a 49GB GPU. Load them one at a time on demand and every job eats a 15-30 second model-loading penalty.

The fix was to stop treating VRAM as "load what you need" and start treating it as a managed memory pool:

- An **LRU eviction system** keeps a working set of 3-4 hot models resident in GPU memory and swaps cold models out to CPU RAM.
- Each restoration job is a **dependency graph** ... analyze, denoise, upscale, face-restore, colorize ... so a failed stage retries independently instead of reprocessing the whole pipeline.
- **Celery + Redis** for distributed task queuing, so it scales horizontally across GPU nodes.

## The Result

A 12MP image now restores in ~45 seconds, down from 3-5 minutes with the API-chaining approach, at ~73% lower GPU cost than the fragmented multi-API setup. Quality landed at 28.5dB PSNR on my benchmark suite, ahead of Magnific AI and Topaz on blind tests, running at 99.95% uptime with automatic failover between nodes.

---

The lesson is the same one from the architecture emails: the expensive version was the "obvious" one (just call more APIs). The right version came from finding the simplest system that actually met the constraint.

That's the kind of thing I write about here every Tuesday. If you're building something with a gnarly constraint like this, hit reply... I like these problems.

– Alex

P.S. The full write-up is on the site: [PhotoKeep Pro case study](https://alexmayhew.dev/work/photokeep-pro).
