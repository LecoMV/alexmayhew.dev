# GPU Inference Infrastructure & Production AI Serving (March 2026)

**Status:** CURRENT
**Session:** Deep research on model serving frameworks, GPU hardware landscape, inference optimization, production patterns, and observability as of March 2026.

---

## 1. Model Serving Frameworks — Current State

### 1.1 vLLM (current: v0.11.x, V1 engine)

**What it is:** The dominant open-source LLM inference engine. Originally from UC Berkeley. Now a Linux Foundation project with broad industry backing (Google, Meta, Microsoft, Anyscale, NVIDIA, and others).

**Core innovations:**

- **PagedAttention:** Manages KV cache like an OS manages virtual memory — splits KV tensors into fixed-size blocks (16 tokens/block default), uses a lookup table to map logical to physical blocks. Eliminates 60–80% of memory fragmentation vs. contiguous allocation. Enables near-zero waste and much larger batch sizes.
- **Continuous batching:** Requests are dynamically added/removed from a batch at every decoding step (not waiting for the whole batch to finish). Maximizes GPU utilization on heterogeneous workload mixes.
- **Prefix (automatic) caching:** KV blocks are hashed; if a new request shares a prefix with a cached one, those blocks are reused. Massive savings for RAG, multi-turn chat, long system prompts.
- **Chunked prefill:** Long prompts are split into smaller chunks per scheduling step, preventing a single long request from starving short-latency requests. Reduces TTFT by up to 30%.

**V1 engine (GA as of v0.11.0, late 2025):**
The V1 engine is a complete architectural rewrite. Key changes:

- Scheduler and EngineCore run in an isolated process; input preparation, detokenization, and server logic run in separate non-blocking processes.
- Worker-side request state caching — only incremental diffs transmitted per step, not full state.
- Result: up to 1.7x higher throughput vs. V0 on generation-heavy workloads.
- Optimized prefix caching with near-zero overhead even at 0% hit rate.
- FlashAttention 3 integrated natively.
- v0.11.0 removed all V0 code — V1 is now the only engine.

**Speculative decoding (native support):** Draft model proposes 5–8 tokens; target model verifies in parallel. EAGLE and similar methods achieve ~80% acceptance rates. Delivers 2–3x speedup on latency-sensitive workloads at low batch sizes.

**Quantization support:** GPTQ, AWQ, FP8 (H100 native via NVIDIA Transformer Engine), GGUF via llama.cpp integration, Marlin kernels.

**Deployment:** OpenAI-compatible REST API. Helm charts, Prometheus metrics endpoint, Kubernetes-native. Supports tensor parallelism (TP), pipeline parallelism (PP), data parallelism (DP), expert parallelism (EP) for MoE models.

**Large-scale benchmark (public):** DeepSeek R1 on H200 GPUs with wide Expert Parallelism: 2,200 tok/s/H200, reported by the vLLM team in early 2026.

**Who uses it:** Anyscale, Together AI, Fireworks AI, Hugging Face (as TGI backend), Red Hat OpenShift AI, AWS (SageMaker), GCP AI Platform. Effectively the industry default for open-model serving.

**Limitations:**

- Python-heavy scheduling layer (V1 improves but does not eliminate this).
- Multi-node PP adds latency via inter-node communication.
- Cold-start for large models can take 60–120+ seconds.
- Dynamic shapes require careful CUDA Graph management.

---

### 1.2 SGLang

**What it is:** Structured Generation Language for LLMs. Originally a research framework from the Lmsys group (UC Berkeley / UCSD). Now a production-grade alternative to vLLM, especially for structured outputs and multi-step reasoning.

**Core innovations:**

- **RadixAttention:** KV cache stored in a radix tree. Enables efficient prefix sharing for complex branching workloads (tree-of-thought, beam search, multi-turn with shared prefixes). Up to 5x faster than PagedAttention for high-prefix-reuse workloads.
- **SGLang runtime:** The graph captures the full generation program (including conditional branches, tool calls, structured outputs), allowing the runtime to plan and optimize across steps.
- **FlashInfer integration:** SGLang adopted FlashInfer (a high-performance attention kernel library) earlier than vLLM. This is the main reason for its throughput lead.

**Benchmarks vs. vLLM (2025–2026, H100 GPUs):**

- Multi-turn/shared-prefix workloads: SGLang 16,215 tok/s vs. vLLM 12,553 tok/s (~29% advantage).
- Single-shot prompts: vLLM 1.1x faster than SGLang.
- The gap is not in attention kernels (both can use FlashInfer) — it is in scheduling/orchestration overhead.
- DeepSeek R1, dual H100, multi-turn: SGLang 10–20% higher than vLLM.

**Best for:** Agentic workloads, multi-step reasoning, tree-of-thought, structured JSON generation, tool-calling pipelines, high-prefix-reuse serving.

**OpenAI-compatible API:** Yes. Supports similar deployment patterns to vLLM.

**Limitations:** Smaller ecosystem and community than vLLM. Fewer hardware backends (NVIDIA-primary). Less mature Kubernetes integration as of early 2026.

---

### 1.3 TGI — Text Generation Inference (HuggingFace)

**Status as of December 2025: Maintenance mode.** HuggingFace announced TGI entered maintenance mode on 2025-12-11. Only minor bug fixes and documentation will be accepted. New development has stopped.

**Why:** HuggingFace pivoted to supporting vLLM and TensorRT-LLM as backend engines under a TGI frontend. TGI v3+ can use vLLM as its backend, letting users benefit from TGI's simpler API while running vLLM under the hood.

**Historic strengths:**

- First-class HuggingFace model hub integration.
- Zero-config deployment for HF models.
- TGI v3.0 (December 2024): 13x faster than vLLM on long prompts; triple the token capacity per L4 GPU on Llama 3.1-8B via chunked prefill.

**Conclusion:** Do not choose TGI as a primary inference framework for new deployments. Use it only if you are already on it and migrating to vLLM. The HuggingFace Inference Endpoints product still uses it but is transitioning.

---

### 1.4 NVIDIA Triton Inference Server (now: Dynamo-Triton)

**What it is:** NVIDIA's production-grade multi-model, multi-framework serving platform. Supports TensorRT, PyTorch (TorchScript), ONNX, OpenVINO, Python backends, RAPIDS FIL (tree models), and now TensorRT-LLM and vLLM backends.

**Key enterprise features (2025–2026):**

- Multi-model serving in one server instance (not LLM-specific).
- Dynamic batching (not continuous batching — this is the key difference vs. vLLM).
- Concurrent execution of multiple model instances.
- OpenAI-compatible API frontend (graduated from beta to stable in late 2025 releases).
- Multi-LoRA support in TensorRT-LLM backend.
- TRITONBACKEND_ModelInstanceReady API for accurate readiness reporting.
- Prometheus metrics, Grafana integration.
- Kubernetes + Helm charts, autoscaling with KEDA.

**NVIDIA NIM (NVIDIA Inference Microservices):** Pre-packaged containers combining Triton + TensorRT-LLM + model weights + optimal configuration. One-command deployment. Enterprise support from NVIDIA AI Enterprise ($4,500/GPU/year). Rapidly becoming the preferred path for enterprise on-premises deployment.

**NVIDIA Dynamo (announced GTC 2025, v1.0 production-ready late 2025):**
A new distributed inference framework layered on top of Triton/vLLM/SGLang/TensorRT-LLM. Key innovations:

- **Disaggregated prefill/decode:** Prefill phase (compute-bound) and decode phase (memory-bound) run on separate GPU pools. Each pool can be independently scaled and optimized.
- **KV-aware router:** Routes incoming requests to minimize KV cache re-computation by directing requests with shared prefixes to the replica that already has that prefix cached.
- **NIXL library:** Low-latency point-to-point GPU-to-GPU data transfer for KV cache migration across nodes.
- **KV Block Manager:** Cost-aware KV cache engine that moves blocks across memory hierarchy (GPU HBM → CPU DRAM → NVMe).
- **SLO Planner:** Planning engine for multi-node scheduling that respects latency SLOs.
- **Performance:** Up to 30x throughput increase over baseline for DeepSeek R1 on Blackwell GPUs.
- Compatible with vLLM, SGLang, TensorRT-LLM as backend engines.
- Available on AWS EKS, AKS, Google Cloud GKE.

**When Triton wins over vLLM/TGI:**

- You need to serve diverse model types in one server (CNNs, tree models, embedding models, LLMs together).
- You need enterprise SLA + NVIDIA support contract.
- You have TensorRT-optimized models and want maximum TensorRT-LLM performance.
- You are deploying NIM containers (enterprise, on-prem).

**Who uses it:** NVIDIA's own products, enterprise customers on NVIDIA AI Enterprise, Dell AI Factory customers, large banks and healthcare enterprises with on-premises GPU fleets.

---

### 1.5 TorchServe

**Status:** Active and maintained (AWS + Meta PyTorch team). Still relevant for non-LLM PyTorch model serving.

**Best for:**

- Computer vision models, recommendation systems, smaller PyTorch models.
- Teams already on SageMaker (native integration).
- Complex model DAGs (TorchServe Workflows).
- Multi-model endpoints on SageMaker (75% cost savings cited in case studies).

**Not competitive for LLMs:** No PagedAttention, no continuous batching, no speculative decoding. For LLMs, use vLLM or SGLang behind a SageMaker endpoint instead.

**Recent usage:** Apache Camel 4.10 LTS (Feb 2025) added TorchServe integration. SageMaker large model inference guide still recommends TorchServe for PyTorch LLM deployment (using DeepSpeed / HuggingFace Accelerate behind it).

---

### 1.6 Ollama

**Role:** Developer-first, zero-config local model runner. Bundles llama.cpp + model management + a REST API. One-command setup.

**Production limitations:**

- No continuous batching (request queuing only — one request at a time per model instance).
- No PagedAttention.
- GGUF quantized models only (no native FP16/BF16 serving).
- No tensor parallelism across GPUs (single-GPU only).
- No production observability built in.

**Appropriate use:** Local development, demos, small teams with low concurrency (<5 concurrent users). Not suitable for production LLM serving at any meaningful scale.

---

### 1.7 New Frameworks (2025–2026)

**LMDeploy (by Shanghai AI Lab / InternLM team):**

- Competitive throughput: 16,132 tok/s on H100 (within 0.6% of SGLang).
- Specialized strength: quantized model serving, especially W4A16 and W8A8.
- TurboMind backend: custom CUDA kernels highly optimized for quantized inference.
- Used by InternLM, CASIA teams; growing adoption in Asia-Pacific.

**llm-d (by Red Hat, announced 2025):**

- Open-source distributed inference framework built on vLLM + Kubernetes Inference Gateway.
- v0.4: 40% reduction in per-output-token latency for DeepSeek V3.1 on H200.
- Brings KV-aware routing and disaggregated prefill/decode to the open-source Kubernetes ecosystem.
- Targets enterprise Kubernetes users as the open alternative to NVIDIA Dynamo.

**MAX (by Modular/Mojo team):**

- Alternative inference engine focusing on CPU+GPU unified serving, written in Mojo.
- Benchmarks show competitive throughput to vLLM on some workloads.
- Still emerging; smaller community.

**TensorRT-LLM:**

- NVIDIA's optimized inference library (not a serving framework — used inside Triton/Dynamo).
- Provides optimized CUDA kernels, FP8 support, in-flight batching, speculative decoding for NVIDIA GPUs.
- State-of-the-art throughput for NVIDIA hardware when correctly tuned.
- Requires model compilation step (unlike vLLM which loads directly).

---

## 2. GPU Hardware Landscape (March 2026)

### 2.1 NVIDIA Lineup

| GPU            | Memory          | Bandwidth        | Peak FP16        | TDP     | Status                       | Buy Price       |
| -------------- | --------------- | ---------------- | ---------------- | ------- | ---------------------------- | --------------- |
| A100 80GB SXM  | 80 GB HBM2e     | 2 TB/s           | 312 TFLOPS       | 400 W   | Widely deployed, aging       | ~$10–15K used   |
| H100 SXM 80GB  | 80 GB HBM3      | 3.35 TB/s        | 989 TFLOPS FP16  | 700 W   | Current production workhorse | $27–40K new     |
| H200 SXM 141GB | 141 GB HBM3e    | 4.8 TB/s         | ~989 TFLOPS FP16 | 700 W   | Production, ramping          | $30–40K new     |
| B200 SXM       | 192 GB HBM3e    | 8 TB/s           | 20 PFLOPS FP4    | 1,000 W | Sold out through mid-2026    | $45–55K         |
| GB200 NVL72    | 72x B200 (rack) | 1.8 TB/s per GPU | —                | —       | Backlog 3.6M units           | No public price |

**H100 details:**

- Two variants: SXM5 (server, NVLink) and PCIe.
- SXM5 has significantly higher memory bandwidth and NVLink interconnect (600 GB/s bidirectional per GPU).
- Supports FlashAttention 3, FP8 native (NVIDIA Transformer Engine), MIG (7 instances), MPS.
- CUDA 12.0+ required for full feature set.

**H200 vs H100:**

- Same compute as H100 (same Hopper architecture, same SM count).
- Larger, faster memory: 141 GB HBM3e vs. 80 GB HBM3, ~4.8 TB/s vs. 3.35 TB/s.
- Critical for inference: large models or long contexts that didn't fit on H100 now fit on H200.
- Cloud pricing: $3.72–10.60/GPU-hr depending on provider and preemptibility.

**B200 (Blackwell):**

- 192 GB HBM3e per GPU, 8 TB/s bandwidth — most memory-dense single GPU available.
- 20 petaFLOPS FP4 — 5x faster than H100 for inference workloads.
- 1,000 W TDP.
- Supports FP4 natively (halves memory vs. FP8 for inference).
- NVLink 5: 1.8 TB/s bandwidth per GPU in NVL72 rack configs.
- Sold out through mid-2026; backlog approximately 3.6 million units.

**GB200 NVL72:**

- Rack-scale system: 72 B200 GPUs + 36 Grace CPUs connected via NVLink 5.
- Total rack: ~13,824 GB HBM3e, ~129.6 TB/s aggregate bandwidth.
- Eliminates PCIe/NVSwitch bottlenecks for model parallelism.
- Perplexity running on dedicated GB200 NVL72 clusters via CoreWeave.

**Blackwell Ultra (B300, announced GTC 2025, H2 2025):**

- 15 PFLOPS FP4, 288 GB HBM3e (12-high stacks), 8 TB/s bandwidth, 1,400 W TDP.

**Vera Rubin (announced, H2 2026):**

- TSMC 3nm, HBM4, 288 GB/GPU, 13 TB/s bandwidth.

---

### 2.2 AMD Instinct

| GPU          | Memory       | Bandwidth | Status               |
| ------------ | ------------ | --------- | -------------------- |
| MI300X       | 192 GB HBM3  | 5.3 TB/s  | Production, shipping |
| MI325X       | 288 GB HBM3e | 6 TB/s    | Production, shipping |
| MI350/MI355X | TBD (CDNA 4) | TBD       | Announced 2025       |

**Real-world inference performance:**

MI300X strengths:

- 192 GB VRAM vs H100's 80 GB — fits 70B models in a single GPU without quantization, or much longer KV caches.
- 5.3 TB/s bandwidth (1.58x H100) — LLaMA2-70B shows ~40% latency advantage over H100 due to faster weight fetching.
- Competitive on memory-bandwidth-bound inference (small batch, long generation).

MI300X weaknesses:

- Worse than H200 on absolute throughput at high batch sizes (SemiAnalysis benchmark).
- "CUDA moat" still applies: vLLM, FlashAttention, custom CUDA kernels are NVIDIA-first. ROCm support lags 3–6 months behind CUDA for most libraries.
- Ecosystem maturity: CUDA-optimized kernels (FlashInfer, Marlin, etc.) require significant porting effort.

MI325X benchmarks (AMD-published, H200 comparison):

- 40% higher throughput on Mixtral and Llama 3.1.
- 20–40% lower latency vs H200.
- **Note:** These are AMD's own benchmarks. Independent verification is mixed. SemiAnalysis found MI300X worse than H200 in most inference scenarios.

**Who uses AMD GPUs:**

- Microsoft Azure: ND MI300X instances in production.
- Oracle Cloud Infrastructure.
- Large hyperscalers running cost-optimized inference where ROCm support is acceptable.
- Mostly used by orgs with AMD relationships or who want cost leverage against NVIDIA.

**MI350/MI355X (CDNA 4, announced 2025):**

- FP4 and FP6 support (halves memory vs. FP8).
- 2.7x tokens/second improvement vs. MI325X claimed.
- Not yet in broad production as of March 2026.

---

### 2.3 Intel Gaudi 3

**Status:** Not dead — in limited production. Available on IBM Cloud (eu-de, us-east) as of early 2025. OEM availability: Dell, Supermicro, HPE. Rack-scale design shown at OCP Summit 2025.

**Software support:** vLLM backend, TGI backend. PyTorch-native via Intel's Habana libraries.

**Reality check:** Market share is very small. Intel has not demonstrated competitive benchmark results vs. NVIDIA H100/H200 in third-party testing. Primarily adopted by customers with Intel relationships or cost/geopolitical diversification motives. The Gaudi 3 product continues; Intel's next chip ("Crescent Island") targets inference specifically. Not a primary choice for most teams.

---

### 2.4 Cloud GPU Pricing Comparison (March 2026)

**H100 SXM 80GB — On-demand per GPU-hour:**

| Provider               | Price/hr    | Notes                    |
| ---------------------- | ----------- | ------------------------ |
| Hyperbolic             | $1.49       | Current market low       |
| Vast.ai                | ~$1.87      | Marketplace, varies      |
| RunPod                 | ~$1.99      | Community cloud          |
| Lambda Labs            | $2.49–2.99  | On-demand                |
| Together AI            | ~$2.00–2.50 | API + raw compute        |
| Google Cloud (A3 High) | $3.00       | On-demand                |
| AWS p4d/p5             | ~$3.90      | On-demand                |
| CoreWeave              | $6.16       | Premium, dedicated infra |
| Azure ND H100          | ~$6.50–8.00 | On-demand                |

**H200 SXM — On-demand per GPU-hour:**

| Provider          | Price/hr | Notes       |
| ----------------- | -------- | ----------- |
| Google Cloud Spot | $3.72    | Preemptible |
| Jarvislabs        | $3.80    | On-demand   |
| AWS/Azure         | ~$10.60  | On-demand   |

**B200 — early availability:**

- DataCrunch: $3.99/hr (early 2026 promotional pricing).
- CoreWeave: available in NVL72 configs for enterprise contracts.

**Self-hosted economics:**

- At 50%+ GPU utilization: self-hosted H100 (amortized hardware cost) costs ~$1.00–1.50/hr all-in vs $2.99–6/hr cloud.
- Breakeven vs cloud: typically under 6 months at high utilization.
- A 1,000-GPU self-hosted cluster is financially viable at scale; 8–16 GPUs is marginal (management overhead too high).
- Self-hosted cost per million tokens (Llama 3 70B, H100): ~$0.013–0.038/million tokens depending on utilization.
- Lenovo white paper (2026): self-hosted 8x advantage over cloud IaaS, 18x vs. frontier API pricing at peak utilization.

---

## 3. Inference Optimization Techniques

### 3.1 Quantization

**Decision matrix:**

| Format    | Bit Width | Memory Saving vs FP16 | Quality Retention       | Hardware Req          | Best For                                  |
| --------- | --------- | --------------------- | ----------------------- | --------------------- | ----------------------------------------- |
| BF16/FP16 | 16-bit    | baseline              | 100%                    | Any modern GPU        | Training, reference inference             |
| GPTQ      | 4-bit     | ~4x                   | ~90%                    | Any CUDA GPU          | Budget inference, consumer GPUs           |
| AWQ       | 4-bit     | ~4x                   | ~95%                    | Any CUDA GPU          | Production INT4, better quality than GPTQ |
| GGUF      | 2–8 bit   | variable              | ~92%                    | CPU + GPU (llama.cpp) | Local/CPU inference, Ollama               |
| FP8       | 8-bit     | ~2x                   | ~98–99%                 | H100/H200/B200 only   | Production FP8 on Hopper/Blackwell        |
| INT8      | 8-bit     | ~2x                   | ~97–98%                 | Ampere+               | General production                        |
| FP4       | 4-bit     | ~4x                   | ~96% (with calibration) | B200/Blackwell only   | Next-gen Blackwell inference              |

**GPTQ details:**

- Post-training quantization. Processes weights in batches, uses second-order info (Hessian) to minimize MSE.
- 3.25–4.5x speed improvement on NVIDIA.
- Marlin kernel (optimized GPTQ kernel): 712 tok/s vs. vanilla GPTQ's 276 tok/s (2.6x speedup on top of quantization benefit).

**AWQ (Activation-aware Weight Quantization):**

- Key insight: ~1% of weight channels are "salient" (high activation magnitude). Scale these up before quantizing, preserve precision where it matters.
- Result: better accuracy than GPTQ at same bit width.
- Marlin-AWQ: 741 tok/s vs. 68 tok/s for vanilla AWQ (10.9x speedup via better kernel).
- Now the recommended choice for INT4 production inference.

**FP8 (H100/H200 native):**

- NVIDIA Transformer Engine handles FP8 calibration and dynamic rescaling.
- vLLM native FP8 support: use `--dtype fp8` or `--quantization fp8`.
- Nearly lossless (~98–99% quality retention).
- ~2x memory reduction vs FP16, significant throughput improvement.
- Standard for production H100/H200 serving in 2025–2026.

**GGUF:**

- llama.cpp quantization format. Multiple sub-types (Q4_K_M, Q5_K_M, Q6_K, Q8_0, etc.).
- CPU-runnable (unique advantage for edge/local).
- `_K_M` variants use mixed precision (some layers stay higher precision).
- ~92% quality retention at Q4_K_M; ~98% at Q8_0.
- Not optimal for GPU throughput (llama.cpp is not a high-throughput serving engine).

**Hybrid quantization (emerging):**

- Mix FP8 for attention layers (more sensitive) with INT4 for MLP layers (less sensitive).
- Approach used in production at several frontier labs.

---

### 3.2 KV Cache Optimization

**PagedAttention (vLLM):**

- Fixed 16-token blocks as the allocation unit.
- Physical block table maps logical blocks to GPU memory pages.
- Enables copy-on-write for beam search (share prefixes, fork on divergence).
- Reduces memory fragmentation from ~70% waste (contiguous) to near zero.

**Prefix caching / Automatic Prefix Caching:**

- KV blocks hashed by content.
- Global hash table maps hash → physical block.
- All requests sharing the same prefix share the same physical blocks.
- Savings: RAG with a 4,000-token system prompt — the first request caches it, all subsequent requests skip its prefill.
- vLLM V1: near-zero overhead even at 0% cache hit rate (V0 had measurable cost).

**Chunked prefill:**

- Splits long prompt prefill across multiple scheduling steps.
- Prevents a single long request from blocking short requests.
- Reduces TTFT by up to 30% under mixed workloads.
- Required for good latency SLOs when mixing long-context and short-context requests.

**Disaggregated prefill/decode (emerging production pattern):**

- Prefill phase is compute-bound; decode phase is memory-bandwidth-bound.
- Route prefill to compute-dense GPUs (or more GPUs in tensor parallel), decode to fewer GPUs.
- Implemented in NVIDIA Dynamo, llm-d, and DistServe (academic).
- Can reduce TTFT significantly while maintaining decode throughput.
- KV cache transfer across prefill/decode nodes via NIXL or RDMA.

**LMCache (2025):**

- External KV cache store backed by Ceph object storage.
- Enables cross-request, cross-pod KV sharing at fleet scale.
- Useful for RAG systems where the same documents are embedded in many requests.

---

### 3.3 Batching Strategies

**Static batching (naive):**

- Batch filled, all requests run to completion together.
- GPU waits for the slowest request. Severe underutilization.
- Not used in modern production serving.

**Continuous batching (iteration-level scheduling):**

- New requests inserted at every decode step as GPU capacity allows.
- Requests removed from batch as they finish.
- vLLM, TGI v2+, SGLang, TensorRT-LLM all use this.
- Result: GPU is nearly always at maximum batch capacity; 3–10x throughput improvement vs. static.

**Dynamic batching (Triton, TorchServe):**

- Requests accumulated over a short window, batched together.
- Not as efficient as continuous batching for LLMs (no per-token flexibility).
- Suitable for vision/embedding models with predictable compute.

---

### 3.4 Speculative Decoding

**How it works:**

1. A small "draft" model (e.g., 1.5B parameters) generates K tokens speculatively.
2. The target model (e.g., 70B) verifies all K tokens in a single forward pass.
3. All accepted tokens are kept; first rejected token is replaced with target model's sample.
4. Net effect: multiple tokens per target model invocation when the draft model is accurate.

**Performance in production (2025–2026):**

- 2–3x speedup at α (acceptance rate) ≥ 0.6 and γ (speculation length) ≥ 5.
- EAGLE and EAGLE-2 methods: achieve ~80% acceptance rates on chat workloads; 3.6x throughput on H200 (NVIDIA demonstrated).
- Speedup is highest at low batch sizes (latency-sensitive, interactive use cases).
- At high batch sizes (throughput-optimized), benefits diminish because the GPU is already compute-bound on the target model.
- Native support in: vLLM, TensorRT-LLM, SGLang.

**Fragility in production:**

- Effectiveness varies dramatically with workload. Code generation workloads: high acceptance (predictable). Creative writing: lower acceptance (high entropy).
- Requires maintaining draft model in memory (additional GPU RAM cost).
- Best practice: monitor acceptance rate in production and adjust γ dynamically.

---

### 3.5 Parallelism for Multi-GPU Serving

**Tensor Parallelism (TP):**

- Splits individual layers across GPUs (e.g., attention heads, FFN rows/columns).
- AllReduce communication required at each layer — adds 20–30% latency overhead on PCIe; much lower on NVLink.
- Use TP within a node (NVLink); avoid TP across nodes (too much latency).
- Rule of thumb: `tensor_parallel_size = number of GPUs per node`.

**Pipeline Parallelism (PP):**

- Different transformer layers run on different GPUs/nodes.
- Reduces per-GPU memory requirement.
- Introduces pipeline bubble (idle time) — use microbatching to fill.
- Adds P2P communication latency proportional to number of stages.
- Rule of thumb: `pipeline_parallel_size = number of nodes`.
- Used for very large models (405B+) that don't fit on a single node with TP alone.

**Data Parallelism (DP):**

- Multiple identical replicas each handle different requests.
- No inter-GPU communication during inference.
- Maximizes throughput; doesn't help per-request latency.
- Use when throughput > latency is the goal.

**Expert Parallelism (EP — MoE models only):**

- Different experts in a MoE model placed on different GPUs.
- All-to-All communication to route tokens to the right GPU.
- DeepSeek R1/V3 inference: wide EP (EP=32 or higher) used to spread experts across many GPUs.
- vLLM V1 supports EP for MoE models.

**Recommended configuration (H100 8-GPU node, 70B model):**

- TP=8 (use all 8 GPUs in the node via NVLink).
- No PP within a node (TP already covers it).
- If multi-node: TP=8 within node, PP=N_nodes across nodes.

---

### 3.6 CUDA Graphs

**What they are:** A mechanism to capture a sequence of CUDA kernel launches and GPU memory operations as a graph, then replay the entire graph with a single CPU call. Eliminates kernel launch overhead (5–15 μs per kernel).

**Impact on LLM inference:**

- Decode step (autoregressive generation) executes hundreds of small kernels per token.
- Without CUDA Graphs: LLaMA-7B at ~30 tok/s. With CUDA Graphs: ~69 tok/s (2.3x).
- vLLM V1 uses CUDA Graphs for the decode step. Prefix caching and prefill still use eager mode (dynamic shapes are harder to graph).
- TensorRT-LLM uses CUDA Graphs extensively throughout.

**Limitations:**

- Requires static shapes: batch size, sequence length must be fixed at graph capture time.
- Cannot handle dynamic control flow or CPU-GPU synchronization within the graph.
- Solution: capture multiple graphs for different batch sizes (e.g., batch sizes 1, 2, 4, 8, 16, 32, 64, 128); padding used to fit into the nearest captured shape.
- TensorRT for RTX provides adaptive graph capture API (single line of code, handles dynamic shapes).

**When CUDA Graphs provide the most benefit:**

- Models with many small kernels (compact attention, elementwise ops).
- Latency-sensitive deployments at small batch sizes.
- CPU-side overhead is the bottleneck (check nvidia-smi: low GPU utilization but high CPU usage is the signal).

---

### 3.7 FlashAttention 2 and 3

**FlashAttention 2 (production standard for Ampere and earlier):**

- Fused attention kernel: computes Q×K^T, softmax, and ×V in a single pass over HBM.
- Reduces HBM reads/writes from O(N²) to O(N). Eliminates the N×N attention matrix materialization.
- 3–6x faster than standard attention; enables context lengths up to 128K+ without OOM.
- Supported on all CUDA GPUs with SM 80+ (A100, RTX 3090/4090, H100).

**FlashAttention 3 (H100/Hopper-specific):**

- Paper: July 2024. PyPI: stable as of late 2024. CUDA 12.3+ required, CUDA 12.8 recommended.
- Uses Hopper-specific hardware: TMA (Tensor Memory Accelerator) for async SMEM loads, warp specialization (producer/consumer split), FP8 native attention.
- Performance: up to 840 TFLOPs/s BF16 (85% H100 utilization); up to 1.3 PFLOPs/s FP8.
- 1.5–2.0x speedup over FA2 on H100s.
- Integrated in: vLLM V1, TensorRT-LLM, PyTorch nightly.
- Not available on A100/Ampere (uses Hopper-only hardware units).

---

## 4. Production Patterns

### 4.1 How Frontier Labs Serve at Scale

**Anthropic:**

- Multi-cloud: Google TPUs (up to 1M chips), AWS Trainium2 (500K chips in Project Rainier), NVIDIA GPUs.
- Each platform assigned to specialized workloads (training on TPUs/Trainium, inference on NVIDIA GPUs for most products).
- $50B data center commitment with Fluidstack (Texas, New York) for additional capacity.
- Most diversified compute architecture of the frontier labs — maximizes negotiating leverage and fault tolerance.

**OpenAI:**

- Primarily Azure-hosted (Microsoft partnership).
- ~100,000–200,000 active H100/H200 GPUs estimated in production fleet.
- Stargate project: $500B JV targeting 10 GW of capacity by 2029. Currently 7 GW planned across 6 sites.
- Custom silicon in development but not yet in production serving.

**Google:**

- Serves Gemini models entirely on own TPUs.
- TPU Ironwood (7th gen, 2025): 42.5 exaflops per pod, 9,000+ chips/pod.
- +/-400V DC power delivery, up to 1 MW per rack.
- Published TPU architecture papers; no third-party benchmarks available.

**Key inference patterns at scale:**

- Disaggregated prefill/decode (all major labs use variants of this).
- Global KV cache sharing across fleet (prefix caching at fleet scale).
- Model sharding across hundreds/thousands of accelerators using hybrid parallelism.
- Continuous batching with priority queues (paying customers get lower latency SLOs).
- Multi-tenancy with isolation (logically separate but physically co-located).

---

### 4.2 Load Balancing for GPU Inference

**Why standard load balancing (round-robin, least-connections) fails:**

- Variable request length: a 100-token request and a 10,000-token request look identical to a CPU load balancer but have wildly different GPU costs.
- KV cache state: routing the same conversation to different replicas wastes KV cache.
- GPU memory is the bottleneck, not CPU or network.

**What to balance on:**

- KV cache utilization per replica (primary metric).
- Queue depth (number of tokens waiting in the scheduler).
- Tokens per second throughput headroom.
- Request prefix similarity (for prefix cache hit rate optimization).

**Production load balancing tools:**

- **GKE Inference Gateway (Google, 2025):** Kubernetes-native gateway with LLM-aware routing. Routes on `inference_pool_average_kv_cache_utilization`. Integrates with HPA.
- **llm-d routing layer:** KV-aware router that directs prefill-heavy requests to prefill-optimized replicas and decode-heavy traffic to decode replicas.
- **NVIDIA Dynamo KV-aware Router:** Routes requests to minimize KV cache re-computation by preferring replicas that already hold the relevant prefix.
- **Custom Envoy/Nginx:** With vLLM Prometheus metrics as upstream health signals. Common in simpler self-hosted setups.

---

### 4.3 Health Checking for GPU Services

**GPU-specific failure modes (not seen in CPU services):**

- Out-of-memory (CUDA OOM): service crashes or hangs, appears healthy to HTTP health check.
- GPU thermal throttling: throughput degrades with no obvious error.
- NCCL hangs: multi-GPU communication deadlocks silently.
- Driver/CUDA version mismatch after kernel update.
- ECC errors accumulating toward hardware failure.

**Health check layers:**

1. **HTTP liveness probe:** `/health` returns 200. Detects process crash only.
2. **HTTP readiness probe:** `/health/ready` — vLLM reports not-ready during model load (can take 60–120s). Critical to get right in Kubernetes or you'll route traffic to a loading pod.
3. **GPU health:** `nvidia-smi --query-gpu=health --format=csv` — checks ECC errors, power, temperature.
4. **Inference-level health:** Send a known prompt and verify expected output (smoke test). Catches model corruption, quantization errors.
5. **DCGM health monitor:** `dcgmi health -g <group_id> -c` for low-level hardware diagnostics.

**Alert thresholds:**

- TTFT > 2x P99 baseline → page.
- GPU memory utilization > 95% sustained → scale out warning.
- KV cache utilization > 85% → begin queuing/backpressure.
- GPU temperature > 85°C → alert (throttle imminent).
- ECC double-bit errors > 0 → immediate alert (hardware fault).
- nvidia-smi shows power draw < expected → check throttling.

---

### 4.4 Auto-Scaling GPU Workloads

**Why CPU auto-scaling patterns fail for GPU inference:**

- GPU pods take 2–4 minutes to start (image pull + model load), vs. ~30 seconds for CPU services.
- Standard HPA on CPU/memory metrics is useless (GPU pods sit at 2–5% CPU while fully loaded).
- Model weights must be loaded from storage before the pod can serve.
- Kubernetes scheduler doesn't understand GPU memory fragmentation.

**KEDA (Kubernetes Event-Driven Autoscaler) for GPU inference:**

- Scale on queue depth, tokens/s, or KV cache utilization — not CPU.
- Example scaler: custom metric `vllm:num_requests_waiting` from Prometheus.
- Cost circuit breakers: cap maximum replicas or total GPU-hours to prevent runaway bills ($12K cloud bill incident documented in 2025).

**Mitigation strategies for cold start:**

- **Warm pool:** Maintain minimum N replicas always running (cost: idle GPU-hours).
- **Model caching on node storage:** Pre-pull model weights to NVMe on all nodes; pod startup from disk is 30–60s instead of 10–20 minutes from S3.
- **Spot + on-demand hybrid:** Spot instances for throughput bursts, on-demand for baseline.
- **Predictive scaling:** Scale up before expected traffic peaks based on historical patterns.

**Scale-to-zero:** Possible with KEDA for batch/offline workloads. Not appropriate for interactive inference with latency SLOs.

**Autoscaling at disaggregated prefill/decode level:**

- HeteroScale (2025 research): separate HPA for prefill pool and decode pool, with a coordination layer maintaining the prefill/decode ratio as traffic patterns shift. Demonstrated better SLO attainment than monolithic autoscaling.

---

### 4.5 Blue-Green and Canary Deployments for Model Updates

**The core challenge:** Model weights are large (7B = ~14 GB FP16, 70B = ~140 GB FP16). Loading a new model takes minutes. In-place updates are not feasible.

**Blue-green deployment:**

- Run two identical serving stacks (Blue = current, Green = new model/version).
- Load Green fully, run smoke tests and benchmarks against it.
- Shift traffic: 0% → 100% in one step (or gradually via canary).
- Rollback: shift traffic back to Blue instantly.
- Kubernetes: use a Service selector update or an Ingress rule change.
- Cost: requires 2x GPU capacity during the transition window.

**Canary deployment:**

- Start Green at 1–5% traffic. Monitor TTFT, quality metrics, error rate.
- Ramp up over hours: 5% → 25% → 50% → 100%.
- Requires A/B-aware routing (Istio, Envoy, nginx split). Not trivial with stateful GPU backends.
- Works well with: LLM evaluation frameworks that score output quality automatically.

**Tooling:**

- GuideLLM (Red Hat, open source 2025): benchmarks LLM deployments against real-world traffic patterns before promoting to production.
- Argilla / LangSmith: eval pipelines for comparing Blue vs Green output quality.
- Azure ML Managed Online Endpoints: native blue-green with traffic split configuration.

---

### 4.6 Cost per Token Economics

**Market rates (March 2026):**

| Model / Provider                            | Input ($/M tokens) | Output ($/M tokens) |
| ------------------------------------------- | ------------------ | ------------------- |
| Claude 3.5 Sonnet                           | $3.00              | $15.00              |
| GPT-4o                                      | $2.50              | $10.00              |
| GPT-4.1 (OpenAI)                            | $2.00              | $8.00               |
| DeepSeek V3 (API)                           | ~$0.27             | ~$1.10              |
| Gemini Flash 1.5                            | $0.075             | $0.30               |
| Llama 3.1 70B (self-hosted H100, 50% util.) | ~$0.13             | ~$0.13              |
| Llama 3.1 70B (cloud API, Together AI)      | ~$0.54             | ~$0.54              |

**Key economics:**

- LLM inference pricing has fallen ~10x annually since 2022. GPT-4 equivalent: $20/M tokens in 2022 → $0.40–0.80/M in 2026.
- Quantization reduces serving cost 60–70% (fewer GPUs needed for same throughput).
- Speculative decoding reduces latency 2–3x (serves more requests with same GPU fleet).
- Self-hosting breakeven vs. cloud API: typically under 4 months at 50%+ GPU utilization.
- Realistic self-hosted cost range: $0.013–0.038/M tokens (7B–70B models, 10–30% utilization).

---

## 5. Observability for AI/GPU Systems

### 5.1 Metrics That Matter

**LLM-specific latency metrics:**

| Metric        | Definition                                                            | Target (interactive)                       |
| ------------- | --------------------------------------------------------------------- | ------------------------------------------ |
| TTFT          | Time To First Token: from request received to first output token      | < 500ms P99                                |
| TPOT          | Time Per Output Token: average time to generate each subsequent token | < 30ms P50                                 |
| TBT           | Time Between Tokens: inter-token latency including jitter             | < 50ms P99                                 |
| E2E Latency   | Total request time                                                    | Varies (output length \* TPOT + TTFT)      |
| Normalization | TTFT + (output_tokens \* TPOT)                                        | For fair comparison across request lengths |

Note: TBT tail metrics can be significantly worse than TPOT-average due to scheduling jitter and batching stalls. Monitor tail TBT separately.

**GPU infrastructure metrics:**

| Metric                         | Tool              | Alert Threshold                |
| ------------------------------ | ----------------- | ------------------------------ |
| GPU utilization %              | nvidia-smi / DCGM | > 95% sustained                |
| GPU memory used (GB)           | nvidia-smi / DCGM | > 90% of VRAM                  |
| KV cache utilization           | vLLM Prometheus   | > 85%                          |
| Requests waiting (queue depth) | vLLM Prometheus   | > N × batch_size               |
| Token throughput (tok/s)       | vLLM Prometheus   | < baseline by 20%              |
| GPU temperature (°C)           | DCGM              | > 85°C                         |
| Power draw (W)                 | DCGM              | < expected (throttling signal) |
| ECC double-bit errors          | DCGM              | > 0 (hardware fault)           |
| NVLink bandwidth utilization   | DCGM              | < expected (parallelism issue) |
| GPU PCIe bandwidth             | DCGM              | < expected (bottleneck)        |

**vLLM native Prometheus metrics (v0.8.5+):**

- `vllm:num_requests_running` — active requests in the engine.
- `vllm:num_requests_waiting` — queue depth.
- `vllm:gpu_cache_usage_perc` — KV cache utilization.
- `vllm:num_generation_tokens_total` — total tokens generated.
- `vllm:time_to_first_token_seconds` (histogram).
- `vllm:time_per_output_token_seconds` (histogram).
- `vllm:e2e_request_latency_seconds` (histogram).

---

### 5.2 GPU Monitoring Stack

**DCGM Exporter (NVIDIA Data Center GPU Manager):**

- Exposes 100+ GPU hardware metrics at a Prometheus `/metrics` endpoint.
- Runs as a DaemonSet in Kubernetes (one pod per node).
- Key metrics: GPU utilization, memory, temperature, power, PCIe/NVLink bandwidth, ECC errors, SM active/occupancy.
- Grafana dashboards: NVIDIA publishes official Grafana dashboard IDs for DCGM metrics.

**nvidia-smi:**

- Built-in tool for spot checks. Less suitable for continuous monitoring (polling overhead).
- `nvidia-smi dmon`: streaming stats at 1s intervals.
- Use DCGM for production monitoring; nvidia-smi for debugging.

**Production stack recommendation:**

```
DCGM Exporter (GPU hardware) + vLLM /metrics (LLM-level)
  → Prometheus (scrape + TSDB)
  → Grafana (dashboards)
  → Alertmanager (PagerDuty/Slack)
```

---

### 5.3 LLM Tracing and Observability

**What LLM tracing captures:**

- Prompt text + metadata.
- Output text + token count.
- TTFT, total latency, tokens/s per request.
- Tool calls (for agentic workloads).
- Model version, temperature, sampling params.
- Cost attribution per request/user/tenant.

**OpenTelemetry for LLMs:**

- GenAI semantic conventions standardized TTFT, TPOT as OTel spans.
- Both LangSmith and Langfuse support OTLP endpoints as of 2025.
- Industry converging on OTel as the standard for LLM telemetry collection.

**Tooling comparison:**

| Tool            | Model                            | Strengths                                            | Weaknesses                  |
| --------------- | -------------------------------- | ---------------------------------------------------- | --------------------------- |
| Langfuse        | Open-source (MIT), self-hostable | Privacy, cost, self-hosted in regulated industries   | Smaller team than LangSmith |
| LangSmith       | Commercial (LangChain)           | Deep LangChain/LangGraph integration, eval pipelines | Vendor lock-in              |
| Helicone        | Commercial                       | Simple proxy-based setup                             | Limited eval capability     |
| Phoenix (Arize) | Open-source                      | Eval + observability combined, OTel-native           | Newer, smaller community    |
| Weave (W&B)     | Commercial                       | W&B ecosystem, good for teams already on W&B         | Cost at scale               |

**What should trigger a page (AI-specific):**

- TTFT P99 > 2x baseline for 5 minutes.
- Error rate > 1% (model returning errors, context length exceeded, OOM).
- KV cache utilization > 90% (backpressure imminent).
- Queue depth > 100 requests waiting.
- GPU memory > 95% (OOM risk).
- Zero tokens generated for 60s on a healthy-appearing pod (NCCL hang suspect).
- Model drift alert (quality degradation) — requires eval pipeline, not just latency.

---

## 6. Self-Hosted vs. Cloud Decision Framework

| Factor                | Self-Hosted Wins                              | Cloud Wins                    |
| --------------------- | --------------------------------------------- | ----------------------------- |
| Scale                 | > 8 GPUs, >50% utilization                    | < 8 GPUs or spiky traffic     |
| Time to value         | You have 4+ weeks to set up                   | Need to ship in days          |
| Data privacy          | Sensitive PII/PHI that can't leave your infra | Less sensitive workloads      |
| Hardware availability | You can get GPUs (hard in 2026 for B200)      | Cloud has inventory           |
| Ops team              | Have ML infra engineers                       | No GPU ops experience         |
| Workload pattern      | Steady-state, predictable load                | Spiky, unpredictable          |
| Breakeven             | Confident of 6+ month run time                | Need flexibility to shut down |

---

## 7. Key Numbers to Know

| Fact                                        | Value                      |
| ------------------------------------------- | -------------------------- |
| H100 SXM memory bandwidth                   | 3.35 TB/s                  |
| H200 SXM memory bandwidth                   | 4.8 TB/s                   |
| B200 memory bandwidth                       | 8 TB/s                     |
| vLLM V1 throughput gain vs V0               | up to 1.7x                 |
| SGLang throughput on H100                   | ~16,215 tok/s              |
| vLLM throughput on H100 (shared FlashInfer) | ~12,553 tok/s              |
| Speculative decoding speedup range          | 2–3x (low-batch)           |
| FP8 memory savings vs FP16                  | ~2x                        |
| AWQ quality retention at INT4               | ~95%                       |
| GPTQ quality retention at INT4              | ~90%                       |
| CUDA Graph speedup on decode                | 2–3x (kernel-heavy models) |
| FlashAttention 3 speedup vs FA2 on H100     | 1.5–2.0x                   |
| vLLM prefix caching overhead in V1          | near-zero                  |
| H100 on-demand cloud low (Hyperbolic)       | $1.49/hr                   |
| Self-hosted H100 TCO all-in (50% util.)     | ~$1.00–1.50/hr             |
| LLM inference pricing decline               | ~10x per year              |
| KEDA GPU pod cold start (cached model)      | 30–60s                     |
| KEDA GPU pod cold start (no cache)          | 10–20 min                  |

---

## Sources

- [vLLM V1 Architecture Release](https://blog.vllm.ai/2025/01/27/v1-alpha-release.html)
- [vLLM V1 Performance on 0.8.1](https://developers.redhat.com/articles/2025/04/28/performance-boosts-vllm-081-switching-v1-engine)
- [vLLM Metrics Documentation (v0.8.5)](https://docs.vllm.ai/en/v0.8.5/design/v1/metrics.html)
- [SGLang vs vLLM 2026 Benchmark — PremAI](https://blog.premai.io/vllm-vs-sglang-vs-lmdeploy-fastest-llm-inference-engine-in-2026/)
- [SGLang vs vLLM 2026 — Kanerika](https://kanerika.com/blogs/sglang-vs-vllm/)
- [TGI Maintenance Mode Announcement](https://huggingface.co/blog/tgi-multi-backend)
- [TGI v3.0 — 13x faster on long prompts — MarkTechPost](https://www.marktechpost.com/2024/12/10/hugging-face-releases-text-generation-inference-tgi-v3-0-13x-faster-than-vllm-on-long-prompts/)
- [NVIDIA Dynamo Announcement — GTC 2025](https://developer.nvidia.com/blog/introducing-nvidia-dynamo-a-low-latency-distributed-inference-framework-for-scaling-reasoning-ai-models/)
- [NVIDIA Dynamo 1.0 Production Ready](https://developer.nvidia.com/blog/nvidia-dynamo-1-production-ready/)
- [Dynamo on AKS](https://blog.aks.azure.com/2025/10/24/dynamo-on-aks)
- [llm-d GitHub](https://github.com/llm-d/llm-d)
- [NVIDIA B200 Buyer's Guide 2026](https://www.gpu.fm/blog/nvidia-b200-complete-buyers-guide-2026)
- [NVIDIA GB200 NVL72 — Official](https://www.nvidia.com/en-us/data-center/gb200-nvl72/)
- [NVIDIA Data Center GPU Specs Comparison — IntuitionLabs](https://intuitionlabs.ai/articles/nvidia-data-center-gpu-specs)
- [H100 Rental Prices — IntuitionLabs (2026)](https://intuitionlabs.ai/articles/h100-rental-prices-cloud-comparison)
- [H200 Pricing — Jarvislabs](https://docs.jarvislabs.ai/blog/h200-price)
- [B200 Pricing — Modal](https://modal.com/blog/nvidia-b200-pricing)
- [AMD MI300X vs H100 — Clarifai](https://www.clarifai.com/blog/mi300x-vs-h100)
- [AMD vs NVIDIA Inference — SemiAnalysis](https://newsletter.semianalysis.com/p/amd-vs-nvidia-inference-benchmark-who-wins-performance-cost-per-million-tokens)
- [MI300X vs H100 Training — SemiAnalysis](https://newsletter.semianalysis.com/p/mi300x-vs-h100-vs-h200-benchmark-part-1-training)
- [Intel Gaudi 3 IBM Cloud](https://newsroom.ibm.com/blog-intel-and-ibm-announce-the-availability-of-intel-gaudi-3-ai-accelerators-on-ibm-cloud)
- [CoreWeave Pricing](https://www.coreweave.com/pricing)
- [CoreWeave + Perplexity GB200 Partnership](https://investors.coreweave.com/news/news-details/2026/CoreWeave-Announces-Agreement-to-Power-Perplexitys-AI-Inference-Workloads/default.aspx)
- [LLM Quantization — Jarvislabs Complete Guide](https://docs.jarvislabs.ai/blog/vllm-quantization-complete-guide-benchmarks)
- [GGUF vs GPTQ vs AWQ — LocalAIMaster 2026](https://localaimaster.com/blog/quantization-explained)
- [Speculative Decoding — BentoML](https://bentoml.com/llm/inference-optimization/speculative-decoding)
- [Speculative Decoding Speedup Guide — Introl](https://introl.com/blog/speculative-decoding-llm-inference-speedup-guide-2025)
- [FlashAttention-3 Paper](https://arxiv.org/abs/2407.08608)
- [FlashAttention-3 PyTorch Blog](https://pytorch.org/blog/flashattention-3/)
- [FlashAttention GitHub](https://github.com/Dao-AILab/flash-attention)
- [vLLM Parallelism and Scaling Docs](https://docs.vllm.ai/en/stable/serving/parallelism_scaling/)
- [Meta — Scaling LLM Inference: TP, CP, EP](https://engineering.fb.com/2025/10/17/ai-research/scaling-llm-inference-innovations-tensor-parallelism-context-parallelism-expert-parallelism/)
- [GKE Inference Gateway for LLM Serving](https://cloud.google.com/blog/topics/developers-practitioners/implementing-high-performance-llm-serving-on-gke-an-inference-gateway-walkthrough)
- [LLM Load Balancing — TrueFoundry](https://www.truefoundry.com/blog/llm-load-balancing)
- [Autoscaling GPU Pods with KEDA — Markaicode](https://markaicode.com/auto-scaling-gpu-inference-kubernetes/)
- [GPU Cold Start breaks K8s Autoscaling — DEV](https://dev.to/namratha_3/the-ai-cold-start-that-breaks-kubernetes-autoscaling-280n)
- [KEDA + HPA for GPU Workloads — dasroot.net](https://dasroot.net/posts/2026/02/autoscaling-gpu-workloads-keda-hpa/)
- [LLM Inference Metrics — Hivenet](https://compute.hivenet.com/post/llm-inference-metrics-ttft-tps)
- [LLM Observability Stack — GitHub](https://github.com/deepaksatna/LLM-Observability-Stack)
- [GPU Monitoring with DCGM + Prometheus — Spheron](https://www.spheron.network/blog/gpu-monitoring-for-ml/)
- [Langfuse OpenTelemetry Integration](https://langfuse.com/integrations/native/opentelemetry)
- [LangSmith OTel Support Announcement](https://blog.langchain.com/end-to-end-opentelemetry-langsmith/)
- [Top LLM Observability Platforms 2026 — Maxim](https://www.getmaxim.ai/articles/top-5-llm-observability-platforms-in-2026-2/)
- [CUDA Graphs for LLM Inference — Fireworks AI](https://fireworks.ai/blog/speed-python-pick-two-how-cuda-graphs-enable-fast-python-code-for-deep-learning)
- [CUDA Graph Best Practices — NVIDIA](https://docs.nvidia.com/dl-cuda-graph/torch-cuda-graph/best-practices.html)
- [Inference Unit Economics — Introl](https://introl.com/blog/inference-unit-economics-true-cost-per-million-tokens-guide)
- [On-Premise vs Cloud GenAI TCO 2026 — Lenovo](https://lenovopress.lenovo.com/lp2368-on-premise-vs-cloud-generative-ai-total-cost-of-ownership-2026-edition)
- [LLMflation: Inference Costs Going Down — a16z](https://a16z.com/llmflation-llm-inference-cost/)
- [Anthropic $50B Data Center Plan — Introl](https://introl.com/blog/anthropic-50-billion-data-center-plan-december-2025)
- [Anthropic + Google TPU Deal — CNBC](https://www.cnbc.com/2025/10/23/anthropic-google-cloud-deal-tpu.html)
- [MIG — NVIDIA Official](https://www.nvidia.com/en-us/technologies/multi-instance-gpu/)
- [MIG vs MPS Multi-Tenant — Introl](https://introl.com/blog/gpu-memory-pooling-sharing-multi-tenant-kubernetes-2025)
- [vLLM Prefix Caching Docs](https://docs.vllm.ai/en/stable/design/prefix_caching/)
- [KV Caching with vLLM + LMCache + Ceph — Ceph.io](https://ceph.io/en/news/blog/2025/vllm-kv-caching/)
- [Blue-Green Deployment for LLM Inference — apxml](https://apxml.com/courses/langchain-production-llm/chapter-7-deployment-strategies-production/blue-green-canary-deployments)
- [GuideLLM — Red Hat](https://developers.redhat.com/articles/2025/06/20/guidellm-evaluate-llm-deployments-real-world-inference)
- [What 1,200 Production Deployments Reveal — ZenML](https://www.zenml.io/blog/what-1200-production-deployments-reveal-about-llmops-in-2025)
