# SRE to AI Infrastructure Engineer: Career Transition Research (March 2026)

**Status:** CURRENT
**Session:** Deep research on SRE-to-AI Infrastructure career transition for blog content or advisory use
**Date:** 2026-03-17

---

## 1. The Market Reality

### How Many Roles Exist

As of Q1 2026, AI/ML engineering roles are in sustained high demand:

- Q1 2025 saw **25.2% year-over-year growth** in AI-related positions, with **35,445 open roles** across the US
- Machine Learning Engineers experienced **41.8% growth**, the fastest-growing job category in tech
- ZipRecruiter lists "AI Infrastructure Engineer" roles at $93k–$350k, reflecting the wide spectrum from enterprise legacy shops to frontier AI labs
- TrueUp.io maintains a live AI infra job board with roles across FAANG, GPU cloud startups, and enterprises

### Which Companies Are Hiring Most

**Frontier AI Labs (highest salaries, fastest hiring)**

- Anthropic: Committed to $50B in US AI infrastructure investment; creating 800 permanent + 2,000 construction roles, first sites 2026
- OpenAI: Aggressively poaching talent; Meta reportedly offered $100M signing bonuses to counter
- Meta: $115–135B capex for 2026 (up from $71B), officially launching "Meta Compute" as a cloud product
- Google DeepMind: 20% of 2025 AI software hires were returning ex-employees (boomerang hires)

**GPU Cloud & Infrastructure Startups (high growth, equity upside)**

- CoreWeave, Lambda Labs, Voltage Park, Crusoe Energy
- Fluidstack (supplies GPU clusters to Meta, Midjourney, Mistral, Anthropic)
- Together.ai, Fireworks.ai, Anyscale, Modal

**Enterprise AI Platform (stable, lower ceiling)**

- Microsoft (Azure AI), AWS (Bedrock/SageMaker), Google Cloud (Vertex)
- Scale AI, Cohere, AI21 Labs
- Fortune 500 companies building internal ML platforms (GM, JPMorgan, Salesforce)

### Salary Ranges by Level (2025–2026, US, Total Compensation)

Source: Levels.fyi End of Year 2025 report, qubit-labs, refontelearning

| Level             | Frontier Labs (OpenAI, Anthropic) | FAANG (Google, Meta, Amazon) | GPU Cloud Startups | Enterprise  |
| ----------------- | --------------------------------- | ---------------------------- | ------------------ | ----------- |
| Junior / L3-L4    | $200k–$350k                       | $160k–$240k                  | $130k–$200k        | $100k–$150k |
| Mid / L5          | $350k–$550k                       | $240k–$350k                  | $180k–$280k        | $140k–$200k |
| Senior / L6       | $500k–$800k                       | $300k–$500k                  | $250k–$400k        | $180k–$260k |
| Staff / Principal | $700k–$1.2M+                      | $450k–$800k                  | $350k–$600k        | $220k–$350k |

**Specific data points (Levels.fyi 2025):**

- OpenAI median software engineer TC: $556k
- Meta ML engineer median TC: $405k
- NVIDIA ML engineer range: $205k–$331k
- Amazon ML engineer range: $176k–$401k
- Intel ML engineer range: $165k–$317k

**The AI premium:** AI specialists earn 6.2% more than non-AI peers at entry level, rising to 18.7% more at Staff level. The premium grows with seniority.

### Demand Trajectory: 2024 vs 2026

- **2024:** "AI engineer" was a generic title; most hiring was for prompt engineers and fine-tuning specialists
- **2025:** Shift to infrastructure: companies discovered that model quality matters less than serving cost and reliability. "Efficiency engineers" emerged as direct cost savers.
- **2026:** The infra layer is now the primary bottleneck. GPU utilization, inference cost per token, and multi-tenant serving are board-level concerns.
- **Key shift:** In 2025, a poorly configured LLM deployment could cost millions/year. AI infra engineers are now directly tied to P&L.

### What Percentage Come from SRE/DevOps?

Direct statistics are sparse, but strong signals:

- ~37% of IT leaders say they can't hire enough people who know how to operate AI systems "in the wild"
- The consensus among practitioners (blog posts, DevOps Institute) is that the DevOps-to-AI-infra gap is **smaller than commonly assumed**
- Infrastructure knowledge (containerization, orchestration, scaling, resource management) "forms the backbone of successful AI system integration"
- SREs transitioning are rated as strong hires for **operational reliability** — a gap many pure-ML engineers lack

### Are Dedicated AI Infra Roles Growing or Being Absorbed?

**Answer: Both, at different company sizes.**

- At frontier labs and GPU cloud companies: dedicated "AI Infrastructure Engineer," "LLM Platform Engineer," and "Inference Engineer" roles are growing rapidly and distinct from platform engineering
- At enterprises (Fortune 500): **convergence is happening** — platform teams are absorbing AI infra responsibilities
- The New Stack (2026): "In 2026, AI is merging with Platform Engineering." By end of 2026, mature platforms aim for a single delivery pipeline serving app developers, ML engineers, and data scientists
- platformengineering.org 2026 predictions: "Platform teams extending infrastructure to support GPU/TPU clusters with observability, governance, and resource quotas"

**Implication for job seekers:** At frontier companies, specialize into AI infra. At enterprises, a platform engineer who adds GPU/ML skills commands a premium without needing a full title change.

---

## 2. Technical Skills Deep Dive

### GPU Orchestration: Kubernetes + NVIDIA GPU Operator

**The production standard stack:**

- NVIDIA GPU Operator: Manages driver installation (`nvidia-driver-daemonset`), container toolkit, device plugin (resource exposure), DCGM (monitoring), GPU Feature Discovery (node labeling), MIG Manager, and vGPU Manager — all deployed as DaemonSets via a `ClusterPolicy` CRD
- Kueue or Volcano: Batch admission control and gang scheduling semantics
- Device Plugin vs GPU Operator: Device Plugin is lower-level (just exposes GPUs to k8s); GPU Operator is the full lifecycle manager. In 2025, GPU Operator is the default for production.

**GPU Sharing Strategies (when to use which):**

| Strategy                        | Mechanism                                                                               | Isolation                     | Best For                                                                |
| ------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------- |
| **MIG (Multi-Instance GPU)**    | Hardware partitioning (A100, H100, H200). Up to 7 isolated instances per GPU            | Full memory + fault isolation | Multi-tenant inference, SLA-bound workloads, unpredictable neighbors    |
| **MPS (Multi-Process Service)** | Software sharing via unified server process; interleaves work without context switching | No memory or fault isolation  | Throughput-optimized inference, latency-tolerant, cooperative tenants   |
| **Time-Slicing**                | Admin-defined replicas of a GPU; k8s sees N virtual GPUs                                | No isolation (memory shared)  | Dev/test, small workloads, cost reduction when isolation isn't required |

**2025 best practice decision tree:**

- SLO-bound inference or noisy neighbor risk → **MIG**
- Raw throughput, resilient to interference → **MPS**
- Dev/test or cost-constrained with cooperative workloads → **Time-Slicing**
- Large-scale batch training → No sharing; dedicated GPUs per job

### Model Serving: vLLM vs TGI vs Triton vs TorchServe

**Current market position (early 2026):**

| Framework                   | Language | Sweet Spot                                                                                                       | Avoid When                                                              |
| --------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **vLLM**                    | Python   | High-throughput multi-tenant LLM inference (default choice)                                                      | Single-user latency-sensitive apps                                      |
| **TGI (HuggingFace TGI)**   | Rust     | Low-latency single/low-concurrency; HF ecosystem; long prompts with prefix caching                               | Need maximum throughput at high concurrency                             |
| **Triton Inference Server** | C++      | Multi-model enterprise environments; non-LLM models (CV, tabular); multi-framework (PyTorch, TF, ONNX, TensorRT) | Rapid LLM prototyping (complex setup)                                   |
| **TorchServe**              | Python   | PyTorch-native, simpler deployments, REST/gRPC                                                                   | Large-scale, high-concurrency LLM serving                               |
| **TensorRT-LLM**            | C++/CUDA | Maximum throughput on NVIDIA hardware (H100/B200)                                                                | Non-NVIDIA hardware; when compilation time (30min–hours) is prohibitive |
| **SGLang**                  | Python   | Complex multi-turn agents, structured generation, RadixAttention for prompt sharing                              | General-purpose serving                                                 |

**Performance facts (2025 benchmarks):**

- vLLM: 14–24x higher throughput than vanilla HuggingFace Transformers; 2.2–3.5x higher than early TGI
- TGI v3: ~3x more tokens and up to 13x faster than vLLM on long prompts with prefix caching under specific high-history conditions
- TensorRT-LLM: 20–40% throughput improvement over vLLM and TGI on H100 standard benchmarks, but requires model compilation

**The 2026 winner for most teams:** vLLM v1 (major architectural rewrite, 2025). It remains the default for new LLM serving deployments.

**New entrant (March 2026):** NVIDIA Dynamo 1.0 — a distributed inference OS for AI factories. Key capabilities:

- Disaggregated serving (separates prefill and decode phases onto distinct GPUs)
- 7x request throughput boost on Blackwell vs previous configurations
- Native video generation support (FastVideo, SGLang Diffusion, TensorRT-LLM Diffusion, vLLM-Omni)
- NIXL library: accelerates KV cache transfers between GPUs, adopted by SGLang, TensorRT-LLM, llm-d, and vLLM
- KServe gRPC support built in
- Available: github.com/ai-dynamo/dynamo

### Inference Optimization: The Core Technical Knowledge

**The fundamental insight:** KV cache is the primary bottleneck resource. All modern optimizations treat KV as a first-class data structure to be paged, quantized, reused, and offloaded.

**PagedAttention:**

- Partitions KV caches into fixed-size memory blocks (like OS virtual memory paging)
- Eliminates memory fragmentation from variable-length sequences
- Achieves 90%+ GPU memory utilization across varied workloads
- Enables 24x higher throughput over naive approaches at high concurrency

**Continuous Batching:**

- Evicts completed sequences and inserts new ones mid-batch
- Eliminates head-of-line blocking (the problem with static batching)
- Essential for multi-user serving — this is what makes vLLM practical at scale

**Speculative Decoding:**

- Draft model generates N tokens speculatively; target model verifies in one forward pass
- Speedup: 2–3x on typical text (acceptance rate dependent on alignment between draft and target)
- Best for: Latency-sensitive applications, when draft and target model share vocabulary

**KV Cache Quantization:**

- NVFP4 KV cache: 50% memory reduction vs FP8; enables 2x context length and batch size; <1% accuracy loss
- FP8 KV cache: broadly supported in vLLM and TGI; good balance of compression and quality

**Quantization for Weight Compression:**

- **GPTQ:** Post-training quantization (PTQ), layer-wise approximation, 4-bit weights; minimal accuracy loss
- **AWQ (Activation-aware Weight Quantization):** 4-bit PTQ; protects salient weights identified via activation patterns; generally better accuracy than GPTQ at same bit width
- **GGUF:** CPU-friendly format (llama.cpp ecosystem); used for local/edge inference
- **FP8:** Native hardware support on H100/H200/B200; preferred for production at scale over INT4 quantization
- **Rule of thumb:** AWQ for quality-sensitive deployments; FP8 for maximum hardware throughput; GGUF for edge/local

**Prefix Caching / RadixAttention:**

- Cache and reuse KV states for shared prompt prefixes across requests
- High-impact for: system prompts, RAG contexts, multi-turn conversations with shared history
- SGLang's RadixAttention is the most advanced implementation (tree-structured cache)

### Distributed Training

| Framework                | Parallelism Type                           | Best For                                                                             | Avoid When                                       |
| ------------------------ | ------------------------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------ |
| **PyTorch FSDP (FSDP2)** | Data parallel + ZeRO-style weight sharding | Most fine-tuning and moderately sized model training; native PyTorch 2.x integration | Model too large for tensor parallelism alone     |
| **DeepSpeed ZeRO**       | ZeRO stages 1/2/3 + CPU/NVMe offload       | Memory-constrained scenarios; heterogeneous hardware; extreme memory savings         | Simplicity is required; FSDP handles it natively |
| **Megatron-LM**          | Tensor parallelism + pipeline parallelism  | Pre-training frontier models on pure NVIDIA clusters; maximum performance            | Non-NVIDIA hardware; smaller models              |

**In practice (2025):** These are composable. For 70B+ models:

- Megatron tensor parallelism (TP) × FSDP/ZeRO data parallelism = 3D parallelism
- No single framework is sufficient above a certain scale; you stack them

**FSDP vs DeepSpeed tradeoffs:**

- FSDP: Simpler, native PyTorch, 60%+ GPU memory reduction, but 6x training time increase vs DDP; all-or-nothing offload
- DeepSpeed: More granular offload control (parameters and optimizer separately), CPU/NVMe offload support, better for extreme memory constraints
- **2025 consensus:** FSDP is the winner for most use cases; DeepSpeed remains preferable when extreme memory optimization dominates

**NCCL:**

- NCCL (NVIDIA Collective Communications Library) underpins all major frameworks (PyTorch, TensorFlow, Horovod, DeepSpeed)
- All-reduce is the core operation for gradient synchronization
- Key diagnosis skill: NCCL errors/hangs are a common production failure mode in multi-node training; understanding NCCL timeout tuning, NCCL_DEBUG=INFO logging, and network topology debugging is an SRE-transferable skill

**Gradient Checkpointing:**

- Trades compute for memory: stores only a subset of intermediate activations during forward pass; recomputes the rest during backward pass
- Enables training models 2–10x larger than would fit in GPU memory without it
- SRE mental model: like checkpoint/restore in distributed systems, but for computation

### GPU Monitoring: Production Observability

**The DCGM Stack:**

DCGM (Data Center GPU Manager) is the production standard. Architecture:

1. DCGM daemon runs on each GPU node
2. `dcgm-exporter` container exposes Prometheus metrics on port 9400
3. ~5% overhead; supports all NVIDIA datacenter GPUs
4. NVIDIA GPU Operator deploys DCGM automatically

**Key metrics to know:**

| Metric                               | What It Tells You                                                          |
| ------------------------------------ | -------------------------------------------------------------------------- |
| `DCGM_FI_DEV_GPU_UTIL`               | SM (Streaming Multiprocessor) utilization — is the GPU actually computing? |
| `DCGM_FI_DEV_MEM_COPY_UTIL`          | Memory copy utilization — memory bandwidth bottleneck                      |
| `DCGM_FI_DEV_FB_USED`                | GPU framebuffer memory in use                                              |
| `DCGM_FI_DEV_FB_FREE`                | Free GPU memory                                                            |
| `DCGM_FI_DEV_POWER_USAGE`            | Power draw — thermal throttling diagnosis                                  |
| `DCGM_FI_DEV_GPU_TEMP`               | Temperature — throttle risk                                                |
| `DCGM_FI_DEV_NVLINK_BANDWIDTH_TOTAL` | NVLink bandwidth — communication bottleneck for multi-GPU                  |
| `DCGM_FI_DEV_XID_ERRORS`             | XID error count — hardware faults                                          |

**The distinction interviewers test:** GPU utilization (SM occupancy) vs GPU memory utilization are independent metrics. High memory utilization with low SM utilization = memory-bound, not compute-bound. This is the difference between "GPU looks busy" and "GPU is actually efficient."

**2025 production shift:** Focus on memory pressure (not just usage). `DCGM_FI_DEV_MEM_COPY_UTIL` combined with `DCGM_FI_DEV_GPU_UTIL` tells the real story. Pure memory usage without bandwidth context is misleading.

**"Lemon node" detection (Meta's contribution):** Track node failure frequency, not just individual failures. A node that fails repeatedly is drained from the pool and flagged for replacement. This proactive pattern improves large job completion rates by 30%+. This is pure SRE thinking applied to GPU clusters.

### Cost Optimization

**GPU Cloud Pricing (2025–2026):**

- H100 SXM: ~$2.99–4.50/hour (cloud), vs A100 at $1.29–2.29/hour
- H200 and B200: Higher cost but Dynamo 1.0 reports 7x request throughput improvement on Blackwell, changing the cost/token math
- Cheapest cloud GPU providers (2026): Vast.ai, Lambda, RunPod, Hyperbolic, Sfcompute (for spot/preemptible)

**The five highest-impact cost optimizations:**

1. **Spot instances for training with aggressive checkpointing** — saves 70–80% on compute; checkpoint every 15–30 minutes; NCCL state must be saved and restored; this is the single highest-ROI optimization for training
2. **Right-sizing instances** — many inference workloads run fine on L4 or A10 instead of H100; A100 40GB is often the price-performance sweet spot for mid-traffic services; only use H100 when context length or batch size demands it
3. **Quantization for smaller memory footprint** — AWQ/GPTQ 4-bit models: 60–75% memory reduction; fit larger models on smaller GPUs; or batch more requests on the same GPU
4. **Autoscaling inference replicas** — save 40–50% vs static provisioning; requires queue-depth-based scaling, not just CPU/memory metrics (GPU utilization is the right signal)
5. **Monitoring idle GPUs** — 30–50% waste is common at startups with no GPU utilization dashboards; DCGM + Grafana + idle-GPU alerting is table stakes

---

## 3. Interview Questions for AI Infra Roles

### What Companies Actually Ask

**System Design (the most important round for senior roles):**

Common prompts:

- "Design a high-QPS LLM inference service"
- "Design an ML training platform for 100 researchers sharing a GPU cluster"
- "Design a feature store for real-time ML serving"
- "How would you scale a model serving system from 1 RPS to 10,000 RPS?"
- "Design a fault-tolerant distributed training system for a 70B parameter model"
- "You have H100 GPUs at 15% average utilization. How do you fix this?"

**What a strong answer looks like:**

- Treats **tokens, not users**, as the scaling unit for LLM serving
- Explains why each layer exists and what breaks without it (no hand-waving)
- Explicitly mentions: token limits, KV cache strategy, batching approach, cost monitoring, failover behavior
- Addresses failure modes: GPU OOM, node failure mid-training, NCCL hangs, KV cache eviction under load
- Quantifies tradeoffs: latency vs throughput, cost vs quality, memory vs compute

**Technical depth questions:**

- "Walk me through PagedAttention — how is it different from a naive approach?"
- "When would you choose MIG over time-slicing? What are the tradeoffs?"
- "Your NCCL training run is hanging. How do you debug it?"
- "Explain speculative decoding. When does it degrade performance?"
- "Your GPU memory is at 95% and you're seeing OOM errors under burst traffic. What do you do?"
- "How do you implement KV cache sharing across requests with the same system prompt?"
- "Compare GPTQ and AWQ quantization — which would you deploy and why?"

**Operational / SRE-flavored questions:**

- "How do you monitor whether an LLM serving cluster is healthy?"
- "What metrics would you alert on for a GPU training job?"
- "A training job has been running for 18 hours and is 40% slower than expected. How do you diagnose?"
- "How do you handle node failures in a distributed training job without losing 18 hours of work?"
- "Design your cost attribution system for a shared GPU cluster"

### What Distinguishes "Hire" from "No-Hire"

**Strong signals (hire):**

- Demonstrates production experience, not just theoretical knowledge — "we did this and it broke when..."
- Understands the cost/token dimension and can speak to business impact
- Talks about failure modes unprompted — knows where things break in real deployments
- Has experience building zero-to-one ML infrastructure platforms
- Can quantify improvements: "we reduced inference cost 60% by switching to AWQ + batching"
- Asks clarifying questions about scale, latency requirements, and cost constraints before designing
- For senior roles: evidence of building organizational capability, not just shipping models

**Weak signals (no-hire):**

- Knows framework names but can't explain the underlying mechanism
- Designs systems without considering failure modes or cost
- Can't distinguish GPU memory utilization from SM utilization
- No production experience — all research/notebook work
- Generic DevOps answers without AI-specific adaptations (e.g., "just use Kubernetes" without knowing GPU scheduling)
- Doesn't know which inference framework to use for which scenario

**The SRE advantage in interviews:**

- Production mindset: SREs naturally think about failure modes, SLOs, and observability — exactly what AI infra interviews test at senior levels
- NCCL debugging and distributed systems debugging translate directly
- Cost consciousness: SREs understand resource efficiency; this is now a core AI infra competency
- On-call experience: GPU cluster OOM responses, training job monitoring, and lemon node detection all map to SRE muscle memory

---

## 4. Learning Path for SRE → AI Infrastructure

### Conceptual Foundation (Week 1–4)

What you need to understand that SRE training doesn't cover:

- How transformer inference works at a compute level (attention mechanism, KV cache, token generation)
- GPU memory hierarchy: HBM (high bandwidth memory) → L2 cache → shared memory → registers
- The compute bottleneck vs memory bottleneck distinction
- What "tokens per second" means and how batching affects it

**Best starting resources:**

- Chip Huyen's "Designing Machine Learning Systems" (O'Reilly) — the practitioner bible; covers MLOps from an engineering perspective, not a research perspective
- Chip Huyen's MLOps guide: huyenchip.com/mlops — free, regularly updated
- "The Full Stack LLM Bootcamp" (fullstackdeeplearning.com) — practical LLM engineering
- ML Systems Textbook: mlsysbook.ai — open source, covers distributed training and systems

### Hands-On Projects That Signal Credibility

**Tier 1 (must-have for career change):**

1. Deploy vLLM on a GPU instance (Lambda/RunPod are cheap); serve a 7B model; benchmark throughput and latency; document findings
2. Build a GPU monitoring stack: DCGM exporter + Prometheus + Grafana on a k8s cluster with GPU nodes
3. Run a distributed training job: Fine-tune a 7B model with FSDP across 2+ GPUs; implement checkpoint/restore

**Tier 2 (differentiating):** 4. Implement KV cache quantization comparison: baseline vs FP8 vs AWQ; measure quality/cost tradeoff 5. Build an autoscaling inference service: vLLM + Kubernetes + custom GPU-utilization-based HPA 6. Reproduce a lemon-node detection system: track GPU XID errors over time, auto-drain nodes above failure threshold

**Tier 3 (exceptional, lab-level):** 7. Contribute to vLLM, Ray, or NVIDIA Dynamo open source repos 8. Implement speculative decoding from scratch to understand the mechanism

### Open Source Projects to Contribute To

| Project                                             | Why It Matters                                                      | Contribution Starting Points                                               |
| --------------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **vLLM** (github.com/vllm-project/vllm)             | Default LLM serving framework; 39k+ stars; UC Berkeley origin       | Documentation, benchmarking scripts, integration tests, CI/CD improvements |
| **Ray** (github.com/ray-project/ray)                | PyTorch Foundation; 39k+ stars; used by OpenAI for ChatGPT training | RayServe improvements, cluster autoscaler, monitoring                      |
| **NVIDIA Dynamo** (github.com/ai-dynamo/dynamo)     | New (2026), NVIDIA-backed distributed inference OS                  | Very early project; high impact contributions available                    |
| **KServe** (github.com/kserve/kserve)               | Kubernetes-native model serving; inference protocol standard        | Integration tests, Kubernetes operator improvements                        |
| **DCGM Exporter** (github.com/NVIDIA/dcgm-exporter) | GPU monitoring standard; directly relevant to SRE background        | Prometheus metric additions, alert rule sets                               |
| **MLflow** (github.com/mlflow/mlflow)               | Model registry and experiment tracking standard                     | Infrastructure integrations, k8s deployment guides                         |

**SRE-specific contribution angle:** DCGM Exporter and Ray cluster reliability improvements are areas where operational expertise is genuinely valuable. Most contributors are ML researchers — an SRE who understands failure modes is rare.

### Certifications

**Worth pursuing:**

- **NVIDIA DLI: Fundamentals of Accelerated Computing with CUDA** — demonstrates GPU architecture understanding; recognized by NVIDIA teams; approximately $30–90
- **NVIDIA DLI: Building Transformer-Based NLP Applications** — practical LLM engineering knowledge
- **CKA (Certified Kubernetes Administrator)** — if you don't already have it; table stakes for AI infra at most companies
- **AWS/GCP ML Specialty** — useful for cloud-focused roles; demonstrates cloud AI platform knowledge

**Not worth the time:**

- Generic "AI certification" from Coursera/Udemy providers — signal value is low; projects and contributions matter far more
- Any certification that doesn't involve hands-on GPU or distributed systems work

### Recommended Course

**The Complete Guide to AI Infrastructure: Zero to Hero** (Udemy) — 52-week structured curriculum covering Linux, cloud computing, GPUs, distributed training, Kubernetes orchestration, MLOps, observability, and edge AI deployment. The only comprehensive program that follows the actual career path.

**GitHub learning tracks (free):**

- `ai-infra-curriculum/ai-infra-engineer-learning` — production ML infrastructure curriculum for 2–4 year experience level
- `ai-infra-curriculum/ai-infra-mlops-learning` — MLOps pipeline and CI/CD for ML focus

---

## 5. What Changed in 2025–2026

**New paradigms:**

- **Disaggregated inference:** Separating prefill (prompt processing) and decode (token generation) phases onto distinct GPUs. Prefill is compute-bound; decode is memory-bandwidth-bound. Running them on separate hardware improves utilization significantly. NVIDIA Dynamo is built around this.
- **KV cache as a first-class resource:** The industry converged on treating KV cache like a distributed cache (Redis/Memcached analogy). Paging, quantization, offloading, and sharing across requests are all active areas.
- **Reasoning models and long context:** Models like o1, o3, DeepSeek R1 produce very long CoT sequences. This broke many existing serving assumptions (KV cache size, batching strategies). FP4/FP8 KV quantization became critical.
- **Multi-modal serving:** Video, audio, and image modalities added to inference pipelines in 2025; requires different batching strategies (non-text tokens are expensive).
- **B200/Blackwell architecture:** NVIDIA's Blackwell GPUs (B100, B200, GB200) changed the economics. NVLink 5 and HBM3e deliver significantly higher bandwidth. Dynamo's 7x throughput claim is Blackwell-specific.
- **vLLM v1 rewrite (2025):** Major architectural overhaul; improved scheduler, better prefix caching, cleaner plugin interface. Broke some compatibility but significantly improved performance.
- **SGLang matured:** Emerged as a strong competitor to vLLM for agentic workloads and structured generation; RadixAttention for prefix caching is superior to vLLM's implementation for specific workloads.

**What didn't change:**

- Kubernetes is still the orchestration layer; no credible alternative emerged
- NCCL is still the communication fabric for distributed training
- The DCGM → Prometheus → Grafana observability stack is unchanged and standardized
- Spot instances + checkpointing for training cost optimization remains the highest ROI technique

---

## Sources

- [AI Infrastructure Jobs (TrueUp.io)](https://www.trueup.io/ai-infra)
- [AI Engineer Compensation Trends Q3 2025 (Levels.fyi)](https://www.levels.fyi/blog/ai-engineer-compensation-trends-q3-2025.html)
- [Levels.fyi End of Year Pay Report 2025](https://www.levels.fyi/2025/)
- [Global Salary Outlook for AI Infrastructure Engineers in 2025 (Refonte Learning)](https://www.refontelearning.com/blog/global-salary-outlook-for-ai-infrastructure-engineers-in-2025)
- [ZipRecruiter AI Infrastructure Engineer Jobs](https://www.ziprecruiter.com/Jobs/Ai-Infrastructure-Engineer)
- [Breaking Into AI in 2026: What Anthropic, OpenAI, and Meta Actually Hire For](https://dataexec.io/p/breaking-into-ai-in-2026-what-anthropic-openai-and-meta-actually-hire-for)
- [Anthropic to spend $50B on US AI infrastructure (CNBC)](https://www.cnbc.com/2025/11/12/anthropic-ai-data-centers-texas-new-york.html)
- [Meta has quietly become an AI infrastructure giant (Fortune)](https://fortune.com/2026/01/24/meta-compute-zuckerberg-ai-infrastructure-giant-data-center/)
- [Google boomerang year: 20% AI hires were ex-employees (CNBC)](https://www.cnbc.com/2025/12/19/google-boomerang-year-20percent-ai-software-devs-hired-2025-ex-employees.html)
- [vLLM vs TGI vs Triton: Choosing the Right LLM Serving Framework (Clarifai)](https://www.clarifai.com/blog/model-serving-framework/)
- [Comparing Top 6 Inference Runtimes for LLM Serving in 2025 (MarkTechPost)](https://www.marktechpost.com/2025/11/07/comparing-the-top-6-inference-runtimes-for-llm-serving-in-2025/)
- [vLLM vs TensorRT-LLM vs HF TGI vs LMDeploy Deep Technical Comparison (MarkTechPost)](https://www.marktechpost.com/2025/11/19/vllm-vs-tensorrt-llm-vs-hf-tgi-vs-lmdeploy-a-deep-technical-comparison-for-production-llm-inference/)
- [NVIDIA Dynamo 1.0 Production Ready (NVIDIA Technical Blog)](https://developer.nvidia.com/blog/nvidia-dynamo-1-production-ready/)
- [NVIDIA Dynamo Open Source (GitHub)](https://github.com/ai-dynamo/dynamo)
- [Kubernetes GPU Scheduling in 2025: Kueue, Volcano, MIG (Debugg.ai)](https://debugg.ai/resources/kubernetes-gpu-scheduling-2025-kueue-volcano-mig)
- [Fractional GPUs in Kubernetes: MIG, Time Slicing & Custom Scheduling (Rafay)](https://rafay.co/ai-and-cloud-native-blog/demystifying-fractional-gpus-in-kubernetes-mig-time-slicing-and-custom-schedulers)
- [Time-Slicing GPUs in Kubernetes (NVIDIA GPU Operator Docs)](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/gpu-sharing.html)
- [FSDP vs DeepSpeed (HuggingFace Accelerate)](https://huggingface.co/docs/accelerate/en/concept_guides/fsdp_and_deepspeed)
- [GPU Monitoring for ML: nvidia-smi, DCGM, and Production Observability (Spheron)](https://www.spheron.network/blog/gpu-monitoring-for-ml/)
- [NVIDIA DCGM Exporter (GitHub)](https://github.com/NVIDIA/dcgm-exporter)
- [GPU Cost Optimization Playbook: Cut AI Compute Bill by 60% (Spheron)](https://www.spheron.network/blog/gpu-cost-optimization-playbook/)
- [GPU Cloud Pricing 2025 Report — A100 & H100 Cost (Cast.ai)](https://cast.ai/reports/gpu-price/)
- [In 2026, AI Is Merging With Platform Engineering (The New Stack)](https://thenewstack.io/in-2026-ai-is-merging-with-platform-engineering-are-you-ready/)
- [Being a platform engineer in 2026: Career reality check (platformengineering.org)](https://platformengineering.org/blog/being-a-platform-engineer-in-2026)
- [AI/ML Engineering Jobs in 2026: Analyzing 10,000+ Posts (AxialSearch)](https://axialsearch.com/insights/ai-ml-engineering-jobs/)
- [Year-in-Review: Top 15 ML & AI Roles That Hired the Most in 2025 (InterviewNode)](https://www.interviewnode.com/post/year-in-review-top-15-ml-ai-roles-that-hired-the-most-in-2025)
- [DevOps to AI Engineer: How I Leveraged Infrastructure Skills (Zen Van Riel)](https://zenvanriel.com/ai-engineer-blog/devops-to-ai-engineer-transition/)
- [PyTorch Foundation Welcomes Ray (PyTorch.org)](https://pytorch.org/blog/pytorch-foundation-welcomes-ray-to-deliver-a-unified-open-source-ai-compute-stack/)
- [Open Source AI Compute Tech Stack: K8s + Ray + PyTorch + vLLM (Anyscale)](https://www.anyscale.com/blog/ai-compute-open-source-stack-kubernetes-ray-pytorch-vllm)
- [Chip Huyen MLOps Guide](https://huyenchip.com/mlops/)
- [ML Systems Textbook (mlsysbook.ai)](https://mlsysbook.ai/)
- [LLM System Design Interview Questions (Medium/skphd)](https://skphd.medium.com/llm-system-design-interview-questions-and-answers-2a7a16212492)
- [AI System Design Interview Questions 2026 (systemdesignhandbook.com)](https://www.systemdesignhandbook.com/blog/ai-system-design-interview-questions/)
- [Top 10 AI/ML Infrastructure Engineer Interview Questions (interviews.chat)](https://www.interviews.chat/questions/aiml-infrastructure-engineer)
- [NVIDIA H100 Price Guide 2026 (Jarvislabs)](https://docs.jarvislabs.ai/h100-price)
- [Optimizing Inference with NVFP4 KV Cache (NVIDIA Technical Blog)](https://developer.nvidia.com/blog/optimizing-inference-for-long-context-and-large-batch-sizes-with-nvfp4-kv-cache/)
