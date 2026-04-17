# SRE to AI Infrastructure Transition: Deep Research (March 2026)

**Status:** CURRENT
**Session:** Conversation prep for Boston SRE engineer meeting — AI infrastructure transition, speaking topics, Boston scene

---

## Topic 1: SRE Skills That Map Directly to AI Infrastructure

### Kubernetes Pod Scheduling → GPU Scheduling

**What SREs know:** Pod resource requests/limits (CPU, memory), node selectors, affinity rules, the default kube-scheduler, horizontal pod autoscaler.

**What AI infra requires — exact equivalents and where it diverges:**

- GPUs are exposed as extended resources via the NVIDIA device plugin: `nvidia.com/gpu: 4`. This looks familiar, but the scheduling problem is fundamentally different.
- The default scheduler is pod-centric. AI workloads are **gang-centric**: a 16-GPU distributed training job needs all 16 GPUs admitted atomically or the job deadlocks with partial allocation.
- Two gang scheduling approaches in production:
  - **Kueue** (CNCF, 2025 standard): queue-based admission control layer above kube-scheduler. Jobs enter LocalQueues, ClusterQueues hold GPU quotas per ResourceFlavor (H100 vs A100 class). Admits the entire workload or holds it. Multi-tenant cohort borrowing. Works with default scheduler — no replacement needed.
  - **Volcano**: replaces kube-scheduler for targeted workloads. PodGroup CRD gives hard gang semantics. Richer preemption/rescheduling plugins. HPC-style. More mature but requires running an alternative scheduler.
- **Topology-aware scheduling** is non-negotiable for training. GPUs scattered across racks without NVLink connectivity make NCCL collective ops 30-50% slower or infeasible. Node Feature Discovery (NFD) labels nodes with GPU model, NVLink/NVSwitch presence, NUMA topology. Topology Manager in kubelet aligns CPU/device NUMA locality.
- **MIG (Multi-Instance GPU)**: A100/H100 can be hardware-partitioned into isolated instances (e.g., 7x 1g.10gb, or 3x 3g.40gb). Each instance has dedicated VRAM, cache, compute slices. Exposed as separate extended resources (`nvidia.com/mig-1g.10gb`). Requires draining nodes to change layouts — plan change windows.
- **MPS (Multi-Process Service)** and time-slicing: multiple CUDA contexts share a GPU via software. Up to 4 pods per GPU with time-slicing (`replicas: 4` in device plugin ConfigMap). Higher throughput for latency-tolerant inference; no hard isolation between tenants.
- **KAI Scheduler**: NVIDIA open-sourced the Run:ai Kubernetes scheduler at KubeCon NA 2025 (Apache 2.0). GPU-aware, topology-aware, designed for AI/ML workflows.
- **Key 2026 development**: KEP-4671 (Gang Scheduling) is actively being developed for native Kubernetes. Dynamic Resource Allocation (DRA) in Kubernetes 1.34 enables fractional GPU requests (`nvidia.com/gpu: 0.25`) and topology-aware allocation.

**The SRE mental model shift:** Stop thinking "schedule pods that happen to need GPUs." Start thinking "admit entire job workloads atomically with topology and quota constraints."

---

### Prometheus/Grafana Monitoring → GPU Monitoring

**What SREs know:** node_exporter (CPU, memory, disk, network), kube-state-metrics, service-level dashboards.

**What AI infra requires:**

**The core tool:** NVIDIA DCGM (Data Center GPU Manager) + dcgm-exporter. Deploys as part of GPU Operator. Scrapes on port 9400. Grafana dashboard ID 12239 is the official NVIDIA DCGM dashboard.

**Key GPU metrics SREs don't monitor today:**

| Metric                               | Why It Matters                                                                                                                                                                            |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DCGM_FI_DEV_GPU_UTIL`               | SM (shader core) utilization %. Target 65-85%. Below 50% = fragmentation or workload mismatch.                                                                                            |
| `DCGM_FI_DEV_MEM_COPY_UTIL`          | Memory bandwidth utilization. The real bottleneck for inference (memory-bound workloads).                                                                                                 |
| `DCGM_FI_DEV_FB_USED`                | VRAM used (framebuffer). This is the primary capacity metric, equivalent to RAM for CPUs.                                                                                                 |
| `DCGM_FI_DEV_POWER_USAGE`            | Power draw in watts. H100 TDP is 700W. Critical for data center power planning.                                                                                                           |
| `DCGM_FI_DEV_GPU_TEMP`               | GPU temperature. Sustained >83°C triggers throttling.                                                                                                                                     |
| `DCGM_FI_DEV_NVLINK_BANDWIDTH_TOTAL` | NVLink throughput between GPUs. Bottleneck for distributed training collectives.                                                                                                          |
| `DCGM_FI_DEV_XID_ERRORS`             | GPU Xid error codes. These are the GPU equivalent of kernel panics. Xid 63 = row remapping (failing VRAM). Xid 79 = NVLINK failure. Xid 94 = uncontained ECC error (requires node drain). |
| `DCGM_FI_DEV_ECC_SBE_VOL_TOTAL`      | Single-bit ECC errors (correctable, accumulating).                                                                                                                                        |
| `DCGM_FI_DEV_ECC_DBE_VOL_TOTAL`      | Double-bit ECC errors (uncorrectable). Requires evacuation.                                                                                                                               |

**AI-specific SLO dashboards add:**

- Queue wait time by Kueue ClusterQueue (p50/p95)
- VRAM headroom per node pool
- KV cache hit rate (for LLM inference with disaggregated serving)
- TTFT (Time to First Token) and TBT (Time Between Tokens) p95 per model deployment
- GPU fragmentation: % of GPUs available only as MIG shards vs full units

**Stack:** GPU Operator deploys DCGM exporter automatically. Stack: DCGM exporter → Prometheus → Grafana. Same operational pattern as node_exporter — just new metrics namespaces to learn.

---

### SLOs/SLIs/Error Budgets → AI Serving SLOs

**What SREs know:** Availability (uptime %), latency (p99 response time), error rate. Google SRE book framework.

**What AI infra requires — the new SLI vocabulary:**

**For LLM/generative AI inference:**

| SLI                                                      | Typical Production Target                           | Notes                                                                              |
| -------------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------- |
| TTFT (Time to First Token)                               | p95 < 200-500ms (interactive), < 800ms (acceptable) | Most user-visible metric. Dominated by prefill phase compute.                      |
| TBT / TPOT (Time Between Tokens / Time Per Output Token) | p95 < 50-100ms                                      | Controls perceived generation speed. ~100ms = comfortable reading pace.            |
| E2E Latency                                              | p95 < 5-10s (short responses)                       | Depends heavily on output length.                                                  |
| Throughput                                               | tokens/sec per GPU                                  | Scales with batching. An H100 doing vLLM can serve ~3-5k tokens/sec on 7B models.  |
| TTLT (Total Latency for non-interactive)                 | Negotiated per batch job                            | Offline workloads (data synthesis, embeddings). Single SLO: total completion time. |

**Example production SLO from Microsoft Research (Niyama paper):**

> "TTFT p95 ≤ 800ms and TBT p95 ≤ 50ms and error rate ≤ 1% over 28 days"

**Error budget complications unique to AI:**

- What counts as an "error"? Deterministic services return errors. LLMs return wrong answers.
- Silent failures: model drift, hallucination rate increase, output quality degradation — none of these trigger HTTP 5xx.
- AI SLOs need a "quality dimension" that has no equivalent in web service SRE: accuracy metrics, embedding drift thresholds, toxicity rate.

**Prefill vs. Decode disaggregation impact on SLOs:**

- NVIDIA Dynamo and llm-d disaggregate prefill (compute-intensive) onto dedicated GPUs and decode (memory-bandwidth-bound) onto separate GPUs.
- KV cache aware routing (llm-d v0.5) directs requests to decode pods that already hold relevant context, reducing TTFT on cache hits by 30-60%.
- This changes capacity planning: you size prefill fleet for prompt throughput (FLOPs) and decode fleet for KV cache capacity (VRAM) separately.

---

### Incident Response → AI-Specific Incidents

**What SREs know:** Service down, high latency, elevated error rate. Runbook: check logs, check metrics, rollback, escalate.

**What AI infra incidents look like — and how they're different:**

**Category 1: Hardware incidents (new territory)**

| Incident                       | Symptom                                                                               | Response                                                                                                                                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CUDA OOM (Out of Memory)       | Process killed with exit code 137 or CUDA error 2. Logs: `CUDA error: out of memory`. | Check VRAM usage. KV cache too large? Batch size too large? Reduce `--max-model-len` or `--gpu-memory-utilization`.                                                                                |
| Xid 94 (Uncontained ECC Error) | GPU enters bad state. DCGM alert fires. Jobs fail.                                    | Cordon node immediately. Drain gracefully. File hardware support ticket. Do NOT restart — the GPU is physically damaged.                                                                           |
| NVLink failure (Xid 79)        | NCCL collective ops hang. Distributed training job stalls.                            | Identify failing link via `nvidia-smi nvlink --status`. Cordon node. Training job will need restart.                                                                                               |
| GPU thermal throttling         | SM clock drops mid-job. Throughput degrades 15-40%.                                   | Check `DCGM_FI_DEV_GPU_TEMP`. Check data center cooling. Check if `nvidia-persistenced` is enabled (GPU Persistence Mode — keeps GPU initialized between jobs, prevents cold-start thermal shock). |
| NCCL timeout                   | All-reduce hangs. Job appears running but makes no progress.                          | Slow NVLink or network fabric. Check NVLink bandwidth metrics. Check if pods are on different NVSwitch domains.                                                                                    |

**Category 2: Model/serving incidents (no CPU equivalent)**

| Incident                  | Symptom                                                                                 | Response                                                                                                                                                |
| ------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Model drift               | Accuracy degrades over days/weeks. No HTTP errors. User complaints.                     | Compare current vs. baseline output distributions. Trigger retraining pipeline. Rollback to previous model checkpoint.                                  |
| NaN loss / loss explosion | Training job suddenly produces NaN loss.                                                | Gradient exploding. Check learning rate, gradient clipping. May need to restart from last checkpoint. Check for data corruption in batch.               |
| KV cache fragmentation    | TTFT increases progressively under load. No OOM yet.                                    | vLLM PagedAttention manages this automatically. Check `gpu_cache_usage_perc` metric. Reduce concurrent requests or increase `--gpu-memory-utilization`. |
| Cold start latency spike  | First inference after deployment is 30-120s.                                            | Model loading time. Use model warming (fire synthetic request on startup). Keep GPU in persistence mode. Consider pre-loading model in init container.  |
| Feedback loop explosion   | Recommendation/ranking model starts amplifying one type of content. No technical error. | Feature distribution shift. Output feeding back as input. Add distribution monitoring on input features.                                                |

**AI-specific runbook additions:**

- Every AI incident runbook needs a "current model version" field (not just software version)
- Rollback = swap model weights pointer, not code deployment
- "Safe mode" = revert to rule-based fallback, not just restart the service
- Training incident runbooks need checkpoint strategy: "resume from last checkpoint at step N"

---

### Capacity Planning → GPU Capacity Planning

**What SREs know:** CPU/memory utilization targets, headroom calculations, request rate \* average latency = concurrency (Little's Law). Scale horizontally when CPU > 70%.

**What AI infra capacity planning looks like — and where it breaks:**

**The fundamental shift: VRAM is the constraint, not CPU.**

For LLM inference capacity planning:

1. **Model memory footprint**: Parameters × bytes per weight. Llama 3 70B in FP16 = 70B × 2 bytes = 140GB. Requires 2× H100 80GB minimum.
2. **KV cache memory**: `2 × layers × kv_heads × head_dim × seq_len × bytes_per_element` per concurrent request. For Llama 2 70B at FP16, 4K context = ~0.4GB per request. At 100 concurrent requests = 40GB additional.
3. **Total VRAM budget**: Model weights + KV cache at target concurrency + 10% headroom.
4. **Quantization lever**: INT4 quantization reduces model footprint by 75% with ~2-5% quality loss. INT8 reduces by ~50%.

**What SREs overestimate:**

- GPU utilization as a primary signal. Unlike CPU, GPU SM utilization at 80% doesn't mean "saturated." The real bottleneck is memory bandwidth. A workload can be memory-bandwidth-saturated at 30% SM utilization.
- That scaling horizontally is as simple as adding pods. You can't split a 70B model across GPUs without tensor parallelism setup.

**What SREs underestimate:**

- Model loading time. A 70B model = 140GB to load from disk to VRAM. At NVMe speeds (~7GB/s), that's 20 seconds minimum per replica startup. This makes auto-scaling far slower than for stateless web services.
- VRAM as a hard ceiling. CPU can swap to disk (slowly). GPU VRAM cannot. OOM = process death, not slowdown.
- The difference between training and inference GPU profiles. Training requires maximum VRAM + tensor core throughput (H100 SXM). Inference often prefers high memory bandwidth + many smaller GPUs (multiple A10G 24GB can outperform single A100 for inference on 7B models).
- Power and cooling. An H100 pod of 8 GPUs draws ~6kW. Capacity planning must include data center power capacity, not just GPU count.

**GPU utilization targets:**

- Training: 80-95% SM utilization is healthy
- Inference serving: 65-85% SM utilization target. Below 50% = fragmentation or oversized allocation. Above 90% = latency instability.
- Memory bandwidth: 80-90% of peak is typical ceiling before latency degrades.

---

### Load Balancing → GPU Load Balancing

**What SREs know:** Round-robin, least-connections, L7 routing by path/header. Stateless services — any instance handles any request.

**What AI infra load balancing requires:**

**AI inference is NOT stateless.** Two critical state problems:

1. **KV cache state**: In LLM serving, each request generates key-value cache blocks representing conversation context. If a follow-up request routes to a different pod, it must recompute the KV cache from scratch (latency cost). Cache-aware routing (llm-d's KV Block Manager, NVIDIA Dynamo's router) tracks which pod holds which KV cache blocks and routes accordingly. Cache hit = 30-60% TTFT reduction.

2. **Prefill vs. Decode disaggregation**: Modern LLM serving separates:
   - **Prefill GPUs**: Process the input prompt. Compute-intensive (attention over full context). Route all first-turn requests here.
   - **Decode GPUs**: Generate tokens one at a time. Memory-bandwidth bound. Route continuation tokens here.
   - The router must understand which phase a request is in and route accordingly — something a standard L7 load balancer cannot do.

**Practical implications:**

- Do NOT use standard Kubernetes service round-robin for LLM inference at scale.
- llm-d (Red Hat/CNCF project, 2025) provides Kubernetes-native KV cache aware routing.
- NVIDIA Dynamo provides the LLM-aware router as an open-source component.
- For simpler deployments, vLLM's built-in prefix caching provides per-pod cache benefits without cross-pod routing.

---

### Chaos Engineering → AI Chaos Engineering

**Does it exist?** Yes, but it's newer and less standardized than traditional chaos (Chaos Monkey, LitmusChaos).

**GPU/AI-specific chaos experiments:**

| Experiment              | Tool/Approach                                                | What It Tests                                                  |
| ----------------------- | ------------------------------------------------------------ | -------------------------------------------------------------- |
| GPU node failure        | Drain GPU node mid-training                                  | Checkpoint recovery. Does the job resume or lose all progress? |
| KV cache pressure       | Inject requests with very long prompts simultaneously        | Does the system gracefully degrade TTFT or OOM?                |
| Model weight corruption | Inject bit flips in model weights (research, not production) | Robustness of inference service                                |
| Data drift injection    | Feed synthetic out-of-distribution data to production model  | Does monitoring catch it? Does automated retraining trigger?   |
| Feature corruption      | Drop or corrupt specific input features                      | Does the model fail silently or raise an error?                |
| Slow NVLink             | Throttle NVLink bandwidth via network emulation              | Distributed training sensitivity to interconnect degradation   |
| Rollback test           | Switch model version mid-traffic                             | Does traffic split work? Does rollback take < 30s?             |

**Tooling:**

- LitmusChaos has GPU-specific experiments (GPU stress, GPU hog)
- Chaos Mesh supports node-level GPU failure injection
- Most teams implement custom chaos via kubectl drain + cordon on GPU nodes
- Model-level chaos (drift injection, feature corruption) is typically custom Python scripts

**Key insight for SREs:** AI chaos engineering has a unique challenge — you can't always tell if the "chaos" worked at the model level without evaluating model outputs, which requires ground truth labels or human evaluation. Infrastructure chaos (node failure, OOM) behaves predictably. Model quality chaos (drift, corruption) does not.

---

### IaC (Terraform/Pulumi) → GPU Infrastructure as Code

**What SREs know:** Terraform for cloud resources (VMs, load balancers, databases, VPCs). Helm for Kubernetes applications.

**What AI infra IaC looks like:**

**Cloud GPU clusters (AWS, GCP, Azure):**

- Terraform resources: `aws_instance` with `p4d.24xlarge` (8x A100), `aws_placement_group` for cluster placement (NVLink topology), EFA network interface for high-bandwidth collective communications.
- Key difference: GPU instance types are capacity-constrained. You often need reserved instances (1-3 year) or on-demand quotas pre-approved. IaC must handle "no capacity available" gracefully.
- GCP: `google_container_node_pool` with `machine_type = "a3-highgpu-8g"` (H100).

**On-premises GPU clusters:**

- Slurm (HPC tradition): `sbatch` scripts, partitions, QOS policies. The on-prem equivalent of Kueue. Many HPC-era ML teams still use it.
- NVIDIA Base Command Platform: HPC-oriented cluster management.
- Helm charts: `nvidia/gpu-operator`, `volcano-sh/volcano`, `kueue`.

**Key IaC patterns for AI infra:**

- Node pool per GPU family (H100 full, H100 MIG, A100, spot)
- Taints on GPU nodes: `nvidia.com/gpu:NoSchedule` to prevent non-GPU workloads from landing there
- Pre-baked AMIs/images with CUDA drivers (slow to install at boot; bake into image)
- Persistent Volume Claims for model weights (large files, need fast attach)
- `nvidia-persistenced` systemd unit (GPU Persistence Mode — critical for production, prevents 30s+ cold start between jobs)

---

### On-Call Runbooks → AI-Specific Runbooks

**Traditional runbook fields:** service name, alert threshold, check commands, escalation path.

**AI runbook additions:**

```
# AI Inference Runbook Template (additions to standard SRE runbook)

## Model Context
- Model name + version: llama-3-70b-instruct v2.1
- Serving framework: vLLM v0.4.x
- Hardware: 2x H100 80GB SXM (tensor parallel = 2)
- Current checkpoint: s3://models/llama3-70b/checkpoint-step-10000

## AI-Specific Checks (run before standard checks)
1. VRAM headroom: `nvidia-smi` — if FB_USED > 90%, reduce batch size
2. Xid errors: `journalctl -u dcgm-exporter | grep Xid` — Xid 94 = cordon immediately
3. TTFT trend: check Grafana panel "p95 TTFT last 1h" — if > 2x baseline, suspect KV cache fragmentation
4. Output quality: check model quality dashboard — any anomaly in output length distribution?

## Rollback Procedure
- Code rollback: standard kubectl rollout undo
- Model rollback: update MODEL_PATH env var to previous checkpoint, rolling restart
- DO NOT do model rollback + code rollback simultaneously — isolate variables

## Safe Mode
- Rule-based fallback: toggle FALLBACK_ENABLED=true in ConfigMap
- Rate limit to 10% of normal traffic until resolved
- Alert: page ML team lead in addition to standard on-call

## Do Not Do
- Do NOT restart GPU nodes mid-training without saving checkpoint
- Do NOT change --tensor-parallel-size on running deployment (requires full restart + VRAM recalculation)
- Do NOT ignore Xid 94 errors — they indicate hardware failure, not software bugs
```

---

## Topic 2: What SREs Get WRONG When Moving to AI Infra

### Misconception 1: "It's Just Kubernetes With GPUs"

**Reality:** The scheduling model is fundamentally different. Pod-centric scheduling breaks for gang scheduling requirements. Standard HPA (CPU/memory triggers) doesn't make sense for GPU workloads — scaling a model replica takes 20-120 seconds (model load time), not the 2-3 seconds for a stateless service. Custom metrics (GPU utilization, queue depth, TTFT) are needed for meaningful autoscaling.

### Misconception 2: "GPU Utilization = GPU Efficiency"

**Reality:** SM (compute) utilization is misleading. LLM inference is memory-bandwidth-bound, not compute-bound. A GPU running at 30% SM utilization may be saturated at 90% memory bandwidth — adding more requests will blow the latency SLO, not utilize the "idle" compute. The real metrics are memory bandwidth utilization and VRAM headroom.

### Misconception 3: "Scale Horizontally Like Web Services"

**Reality:** Three hard constraints that don't exist in web services:

1. VRAM is a hard ceiling — no swap. OOM = death.
2. Model loading time makes horizontal scaling slow (20-120s cold start per replica for large models).
3. Tensor parallelism requires multiple GPUs to act as a single logical unit — you can't schedule them independently like pods.

### Misconception 4: "Monitoring Is the Same — Just Add GPU Metrics"

**Reality:** AI systems have a unique failure mode: **silent quality degradation**. A web service that starts returning wrong answers throws HTTP 500s. An LLM that starts hallucinating more returns HTTP 200s. Traditional SRE monitoring (availability, latency, error rate) misses the most important AI failures. Need:

- Output distribution monitoring (length, entropy, embedding similarity to baseline)
- Feature drift detection on inputs
- Human evaluation sampling pipelines

### Misconception 5: "VRAM Is Like RAM — Just Need Enough"

**Reality:** VRAM is precious and multidimensional:

- Model weights (static, predictable)
- KV cache (dynamic, grows with concurrent requests × context length)
- Activation memory during prefill (spikes per request)
- A model that fits in VRAM at idle can OOM under load as KV cache fills up. This catches SREs who sized for idle model footprint only.

### Misconception 6: "The Incident Runbook Model Transfers Directly"

**Reality:** Traditional incidents have clear fail signals (errors, timeouts). AI incidents often have ambiguous signals:

- Model drift: gradual quality degradation, no alert fires
- Feedback loops: system works correctly but produces bad outcomes at scale
- NaN loss during training: clear signal, but recovery (checkpoint resume) is unfamiliar
- Xid hardware errors: GPU-specific error taxonomy SREs have never encountered

### Biggest Surprises From Practitioners (based on community reports):

1. **Cold start time is brutal.** Loading a 70B model from disk (even NVMe) takes 20-30 seconds. From S3/object storage, 2-5 minutes. Auto-scaling is far slower than expected.

2. **GPU hardware failure rate is higher than expected.** H100s fail more frequently than CPUs at scale. ECC errors, NVLink failures, and thermal events are routine. Teams need GPU failure runbooks from day one.

3. **GPU topology matters enormously.** A distributed training job that runs in 2 hours on NVLink-connected GPUs might take 6 hours on the same GPUs without NVLink — or time out entirely. SREs accustomed to "compute is fungible" are surprised that GPU placement is a correctness concern, not just a performance optimization.

4. **The blast radius of a bad model deploy is different.** A bad code deploy affects availability. A bad model deploy can affect output quality silently at scale for hours before anyone notices.

5. **VRAM fragmentation is a real operational problem.** Running many small inference jobs alongside one large training job leads to no single GPU having contiguous VRAM for the large job, even though total free VRAM is sufficient. This has no direct CPU equivalent.

---

## Topic 3: Boston AI/Tech Scene (March 2026)

### Research Institutions

**MIT CSAIL:** Active in ML systems research, distributed training, hardware-software co-design. Publications from CSAIL appear regularly at MLSys, OSDI, SOSP. Projects like MOSAICS (model serving), Alpa (distributed training auto-parallelism).

**Harvard SEAS:** ML systems and AI safety research. Less industry-focused than MIT. Zeph Garcia's group does AI reliability work.

**Northeastern Khoury College:** Growing ML engineering focus. Strong co-op pipeline into Boston tech companies.

### Boston Companies Doing Serious AI Infrastructure Work (2026)

**Suno** (Cambridge): AI music generation. Building ML models and inference infrastructure. GPU-intensive serving. Growing rapidly.

**DataRobot** (Boston): Enterprise ML platform. Automated machine learning, model monitoring, MLOps. Battery Ventures led $270M Series F. Heavy AI infrastructure — multi-cloud model serving, drift detection, model governance.

**Wayfair:** Has a significant ML platform team. Recommendation systems, visual search, demand forecasting. Infrastructure for large-scale inference at e-commerce scale.

**HubSpot:** AI features across CRM platform. ML infrastructure for lead scoring, content generation, conversation intelligence.

**Toast:** Restaurant tech. AI infrastructure for dynamic pricing, kitchen automation, predictive ordering. Less public about AI infrastructure investments.

**UKG (Ultimate Kronos Group):** Based in Lowell, MA (Boston area). HCM/workforce management platform. **Significantly AI-first as of 2025-2026:**

- 2,500+ AI models active across suite
- 10M+ employees interact with UKG AI monthly
- Bryte AI platform (proprietary AI engine)
- Partnership with Google (since 2016) for AI/ML
- Workforce Intelligence Hub launching early 2026
- Next-gen Bryte AI globally available early 2026
- **For a conversation with Olivier:** UKG is running serious production AI at scale — 2,500 models is a real AI infrastructure challenge, not AI-washing. This is a relevant context for AI infra conversation.

**Rapid7:** Cybersecurity. AI/ML for threat detection, SIEM analytics. Real-time inference on security event streams.

**Mathworks (MATLAB/Simulink):** Natick, MA (Boston area). Deep ML toolbox integration. Less cutting-edge infrastructure, but significant ML deployment customer base.

**Neurala:** Boston-based, edge AI/computer vision. Lightweight model inference on constrained hardware — different AI infra profile.

**Anthropic** and **xAI** both hiring in Boston as of early 2026.

### Boston AI Community Events (2026)

**Boston AI Week 2026:** Largest AI event in Massachusetts. 300+ events, 30,000+ attendees. Seaport area. Was 125 events/15,000 attendees in 2025 — doubled year-over-year.

**AI Tinkerers Boston:** Technical demos, system trade-offs, vetted AI builders. Monthly/bi-monthly sessions. Jan/Feb 2026 sessions confirmed. Closest to what a technical SRE would attend.

**Boston Generative AI Meetup:** Broader audience, business and technical mix.

**Boston AI Developers Group:** Specifically AI enthusiasts, LLMs, ML engineering, MLOps.

**ODSC East 2026:** Open Data Science Conference, annual Boston event. Technical AI/ML content.

**Leaders In AI Summit Boston 2026:** Enterprise focus, scalable AI infrastructure.

**Transition-AI 2025:** Boston, focused on AI infrastructure specifically (energy, data centers, compute).

**SRE-specific community:** No Boston-specific SRE+AI meetup identified. The AI Tinkerers Boston is the closest match for technically-focused practitioners.

### Is Boston Competitive With SF/NYC for AI Infrastructure Roles?

**Salary comparison (2026 data):**

- Boston ML Engineer: avg $166,674, range $136K-$206K (75th percentile)
- Boston AI Engineer: avg $147,297 (7% above national average)
- California (SF): avg ~$178,000
- New York: avg ~$165,000
- National average: $184,757

**Boston is ~10-15% below SF for base compensation.** However:

- Significantly lower cost of living than SF (roughly 35-40% lower housing costs)
- Strong talent pipeline from MIT, Harvard, Northeastern, Tufts, BU, BC
- Unique density of research labs (CSAIL, SEAS, Broad Institute, MGH AI)
- Biotech AI (Moderna, AstraZeneca, Biogen) creates demand for ML infra that doesn't exist in SF at same scale
- Robotics AI: iRobot (Amazon), Boston Dynamics (Hyundai)

**Conclusion:** Boston is not competing for the same hyperscaler AI infrastructure roles as SF (those tend to stay at Google Brain/DeepMind, OpenAI, Anthropic HQ). But for enterprise AI infrastructure, biotech AI, and robotics AI, Boston is genuinely strong and undervalued. An SRE transitioning to AI infra in Boston has real options — especially at UKG, Wayfair, DataRobot, Suno, and the growing research lab spinouts.

---

## Topic 4: Speaking Topics That Would Resonate

### What's Overdone at SREcon / KubeCon (avoid)

- Generic "AI for SRE" (using LLMs to help write runbooks, summarize incidents). Saturated.
- "Introduction to GPU Kubernetes." Done at every major conf 2024-2025.
- "How we migrated to the GPU Operator." Vendor-adjacent, not practitioner-focused.
- LLM-as-operator (autonomous SRE agents). Everyone is talking about it, few have done it in production.

### What's Underserved (opportunity)

**1. The SLO Problem for Non-Deterministic Systems**
SLOs assume deterministic services. AI systems aren't. What does an error budget mean when "error" isn't binary? How do you write SLOs for hallucination rate? This is a live, unsolved problem that SREs are actually struggling with. No clear industry consensus. A talk that offers a concrete framework (even partial) would be highly valued.

**2. GPU Incident Postmortems — Real Stories**
Practitioners at SREcon want war stories. "We had an Xid 94 at 2am, here's exactly what we did, here's what the DCGM dashboard showed, here's what we got wrong in the runbook." This kind of specificity is rare because teams are reluctant to share failures publicly. But it's what practitioners actually learn from.

**3. The Cold Start Problem for LLM Inference**
Auto-scaling LLM inference is qualitatively different from stateless service scaling. Model load times, VRAM pre-warming, cold start mitigation patterns. Few published practitioner accounts. Highly applicable to anyone running inference at scale.

**4. Capacity Planning When the Constraint Is VRAM, Not CPU**
CPU capacity planning is well-understood. VRAM capacity planning is not — especially with dynamic KV cache growth. A concrete framework (model footprint + KV cache budget + utilization headroom) with real numbers would fill a genuine gap.

**5. Topology-Aware Scheduling in Practice**
KubeCon NA 2025's dominant theme was topology. But most talks are still theoretical. A talk with real benchmark numbers (30-50% performance degradation from poor topology placement), failure stories, and practical Kueue/NFD configurations would be both timely and practically useful.

**6. What SREs Need to Unlearn When Moving to AI Infra**
Direct counterpart to the standard "skills transfer" talk. Specifically: the five mental models from traditional SRE that actively mislead you in AI infra. Contrarian angle, memorable framing, high practitioner value.

### Format Observations From Recent SREcon/KubeCon

- SREcon EMEA 2025 (Dublin, Oct 7-9) explicitly called for submissions on: AI observability, defining SLOs for AI systems, debugging AI incidents, safe rollback of model updates.
- KubeCon NA 2025 (Atlanta, Nov 10-13): topology-aware scheduling was the dominant AI/infra theme.
- AI Infra Summit 2025 existed as a standalone event — indicates demand for AI infra content has outgrown what KubeCon/SREcon can absorb.

### What Would Make Alex's Talk Stand Out

The space is crowded with:

1. Vendors explaining their product in talk form
2. Researchers presenting papers practitioners can't operationalize
3. "Intro" content repeated across conferences

**What's missing:** A practitioner who has operated AI inference at production scale and can speak at the specific intersection of:

- SRE discipline (SLOs, runbooks, incident response, error budgets)
- GPU infrastructure specifics (DCGM metrics, Xid errors, VRAM planning, cold start)
- Honest failure stories

The credibility gap is real: most "AI + SRE" talks are given by people who know one side well. Someone who can speak fluently about both — with the specificity of "here's what the DCGM dashboard looked like at 2am" — has a differentiated position.

**Strongest candidate topic for Alex:** "The Five Things Your SRE Intuition Gets Wrong About AI Infrastructure" — a direct, practitioner-focused list of specific misconceptions with exact details of what actually happens and why, grounded in operational experience.

---

## Sources

- [Kubernetes GPU Scheduling 2025: Kueue, Volcano, MIG — DebuggAI](https://debugg.ai/resources/kubernetes-gpu-scheduling-2025-kueue-volcano-mig)
- [7 Kubernetes Predictions 2026 — Komodor CTO](https://komodor.com/blog/7-kubernetes-predictions-for-2026-ai-will-push-sre-to-its-limit/)
- [GPU Scheduling Pitfalls and Solutions — dasroot.net, Feb 2026](https://dasroot.net/posts/2026/02/gpu-scheduling-kubernetes-pitfalls-solutions/)
- [llm-d: Kubernetes-Native LLM Inference — GitHub/Red Hat](https://github.com/llm-d/llm-d)
- [NVIDIA Dynamo Distributed Inference Framework — NVIDIA Blog](https://developer.nvidia.com/blog/introducing-nvidia-dynamo-a-low-latency-distributed-inference-framework-for-scaling-reasoning-ai-models/)
- [KV Cache Aware Routing with llm-d — Red Hat Developer](https://developers.redhat.com/articles/2025/10/07/master-kv-cache-aware-routing-llm-d-efficient-ai-inference)
- [NVIDIA KAI Scheduler Open Source — KubeCon NA 2025](https://johan.ml/nvidia-runai-scheduler-open-source/)
- [Topology-Aware Scheduling for AI — KubeCon NA 2025](https://pacoxu.wordpress.com/2025/11/28/smarter-scheduling-for-ai-workloads-topology-aware-scheduling/)
- [LLM Inference SLO Metrics — BentoML](https://bentoml.com/llm/inference-optimization/llm-inference-metrics)
- [LLM Inference Metrics TTFT/TBT — Hivenet](https://compute.hivenet.com/post/llm-inference-metrics-ttft-tps)
- [Niyama: Breaking Silos of LLM Inference Serving — Microsoft Research](https://www.microsoft.com/en-us/research/wp-content/uploads/2025/04/niyama.pdf)
- [GPU Capacity Planning: VRAM, Storage, Sizing — ServerMania](https://www.servermania.com/kb/articles/gpu-capacity-planning)
- [What GPU for LLM Inference 2025 — Hivenet](https://compute.hivenet.com/post/best-gpu-for-llm-inference)
- [DCGM Exporter — GitHub/NVIDIA](https://github.com/NVIDIA/dcgm-exporter)
- [Monitoring GPUs in Kubernetes with DCGM — NVIDIA Blog](https://developer.nvidia.com/blog/monitoring-gpus-in-kubernetes-with-dcgm/)
- [SRE in the Age of AI — DevOps.com](https://devops.com/sre-in-the-age-of-ai-what-reliability-looks-like-when-systems-learn/)
- [Chaos Engineering for AI — Conf42 SRE 2025](https://www.conf42.com/Site_Reliability_Engineering_SRE_2025_Rahul_Amte_smarter_failure_testing)
- [SREcon25 EMEA Call for Participation — USENIX](https://www.usenix.org/conference/srecon25emea/call-for-participation)
- [AI Infra Summit 2025](https://www.ai-infra-summit.com/events/ai-infra-summit)
- [Boston AI Week 2026](https://aiweek.boston/)
- [AI Tinkerers Boston](https://boston.aitinkerers.org/)
- [Top Boston AI Companies 2026 — Built In Boston](https://www.builtinboston.com/companies/type/artificial-intelligence-companies)
- [UKG AI-First Future — 3Sixty Insights](https://3sixtyinsights.com/ukgs-ai-first-future/)
- [UKG Bryte AI — BusinessWire](https://www.businesswire.com/news/home/20251104883551/en/UKG-Bryte-AI-Revolutionizes-How-Employees-Find-Help-and-Information)
- [Boston ML Engineer Salary 2026 — Glassdoor](https://www.glassdoor.com/Salaries/boston-ma-machine-learning-engineer-salary-SRCH_IL.0,9_IM109_KO10,35.htm)
- [Inside AI Companies Hiring in Boston — WBUR, Jan 2026](https://www.wbur.org/upnext/2026/01/29/artificial-intelligence-companies-boston-claude-xai-lovable)
- [AI Will Push Kubernetes SRE to its Limit 2026 — VMblog](https://vmblog.com/archive/2025/12/23/ai-will-push-kubernetes-sre-to-its-limit-in-2026.aspx)
