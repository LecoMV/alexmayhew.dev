# CUDA GEMM Optimization, GPU Profiling Restrictions, and Affordable GPU Providers (2026)

**Status:** CURRENT
**Session:** LinkedIn comment response research — Nsight Compute cloud blocking, GEMM kernel progression, GPU provider pricing, student programs

---

## 1. Why Nsight Compute Is Blocked on Cloud GPUs

### The Root Cause: CVE-2018-6260

The restriction is NOT about --privileged mode or perf_event_paranoid. Those are Linux CPU-profiling knobs. The GPU performance counter lockdown traces to a specific security vulnerability:

**CVE-2018-6260** (disclosed November 2018, patched in driver 418.43+ Linux / 419.17+ Windows):

- NVIDIA graphics driver allowed any local user to access GPU performance counters
- A malicious co-tenant could monitor another user's GPU workload via timing/counter side channels
- Academic paper that triggered it: "Rendered Insecure: GPU Side Channel Attacks are Practical" (CCS 2018, UC Riverside)
- The attack allowed inferring: what application is running, approximate data contents, model architecture hints

NVIDIA's response: add a kernel module parameter `NVreg_RestrictProfilingToAdminUsers` (default: 1, admin-only). This is set permanently in `/etc/modprobe.d/` on most machines.

### Why Cloud Providers Can't Just Turn It Off

On a shared multi-tenant cloud GPU node, setting `NVreg_RestrictProfilingToAdminUsers=0` would allow ANY tenant container to read performance counters from GPU processes belonging to OTHER tenants. This is a direct side-channel risk. Cloud providers running shared GPU infrastructure (AWS p3/p4, GCP A100, Azure ND) cannot enable it.

### What Nsight Compute Actually Needs

To collect kernel-level hardware counters (SM utilization, L1/L2 cache hit rates, DRAM bandwidth, warp efficiency, instruction mix), `ncu` requires ONE of:

1. **Root access or CAP_SYS_ADMIN capability** — Linux only, requires being the host admin
2. **NVreg_RestrictProfilingToAdminUsers=0** — kernel module param, requires root to set, host-level change
3. **--cap-add=SYS_ADMIN on Docker** — only works if the HOST has profiling unlocked
4. **--privileged Docker flag** — only works if host allows it

The `perf_event_paranoid` parameter governs CPU instruction-pointer sampling (Nsight Systems, not Nsight Compute). They are separate concerns. Nsight Compute is purely about GPU hardware performance counters (PMU).

### Does It Work on Consumer GPUs (RTX 30/40 series)?

Yes — consumer GPUs (RTX 3090, 4090, etc.) have the SAME restriction, but on a machine YOU own (local workstation), you can set `NVreg_RestrictProfilingToAdminUsers=0` permanently. Full profiling works fine. The restriction is about multi-tenant security, not GPU architecture. All NVIDIA GPUs from Kepler onward support Nsight Compute profiling when the permission is granted.

Data center GPUs (A100, H100) have the same driver-level restriction. The difference is architecture-specific metrics: some L2 eviction policy metrics only exist on GA100+ (A100 and newer).

### Source

- [NVIDIA ERR_NVGPUCTRPERM Official Page](https://developer.nvidia.com/nvidia-development-tools-solutions-err_nvgpuctrperm-permission-issue-performance-counters)
- [CVE-2018-6260 NVD](https://nvd.nist.gov/vuln/detail/CVE-2018-6260)
- ["Rendered Insecure: GPU Side Channel Attacks are Practical" (CCS 2018 PDF)](https://www.cs.ucr.edu/~nael/pubs/ccs18.pdf)

---

## 2. GPU Providers with Profiling Access

### Providers That DO Allow Nsight Compute (bare metal / root access)

| Provider              | Access Model                   | Profiling Status   | Notes                                                                         |
| --------------------- | ------------------------------ | ------------------ | ----------------------------------------------------------------------------- |
| **Vast.ai**           | Marketplace, root in container | Varies by host     | Bare metal hosts: yes. Container-only: limited. Request bare metal instances. |
| **RunPod**            | Containerized, root in pod     | Limited by default | Bare metal pods available — need root on host, not just container             |
| **Lambda Labs**       | Dedicated instances            | Generally yes      | Persistent instances (not shared) — you're the only tenant                    |
| **Genesis Cloud**     | Dedicated VMs                  | Generally yes      | Dedicated GPU VMs, root access                                                |
| **Your own hardware** | Local workstation              | Full access        | Best option for development profiling work                                    |

### Providers That Block Profiling

- AWS (p3, p4d, p5) — shared Nitro hypervisor, no CAP_SYS_ADMIN
- GCP (A100, H100 instances) — KVM virtualization, blocked
- Azure (ND A100) — Hyper-V, blocked
- Most containerized/serverless GPU offerings

### Key Insight

The real question is whether you have root on the HOST, not just in the container. Vast.ai bare metal listings (filter for "bare metal" in the UI) and Lambda Labs persistent instances are the most accessible paths for researchers.

---

## 3. Affordable GPU Providers: Current Pricing (2026)

### RTX 3090 (24GB VRAM, Ampere)

| Provider         | Price/hr    | Notes                               |
| ---------------- | ----------- | ----------------------------------- |
| Vast.ai          | ~$0.16-0.30 | Marketplace, varies by host         |
| Genesis Cloud    | ~$0.08-0.20 | Dedicated VM, European data centers |
| RunPod community | ~$0.20-0.35 | Community cloud                     |

### RTX 4090 (24GB VRAM, Ada Lovelace)

| Provider         | Price/hr    | Notes           |
| ---------------- | ----------- | --------------- |
| Vast.ai          | ~$0.24-0.44 | Marketplace     |
| RunPod community | ~$0.34-0.50 | Community cloud |
| FluidStack       | ~$0.40-0.65 | P2P marketplace |

### A100 40GB / 80GB

| Provider         | Price/hr    | Notes                          |
| ---------------- | ----------- | ------------------------------ |
| Vast.ai          | ~$0.66-1.50 | Open market, fluctuates        |
| Lambda Labs      | ~$1.10-2.06 | 40GB ~$1.10/hr, 80GB ~$2.06/hr |
| RunPod community | ~$1.27      | Community cloud                |
| Fluence          | ~$0.80      | 80GB                           |
| ThunderCompute   | Varies      | Lambda Labs alternative        |

### H100 (80GB SXM/PCIe)

| Provider         | Price/hr | Notes           |
| ---------------- | -------- | --------------- |
| Vast.ai          | ~$1.87   | Marketplace     |
| RunPod community | ~$1.99   | Community cloud |
| Lambda Labs      | ~$2.99   | On-demand       |

### Note on "Bare Metal" vs Containerized

- Vast.ai and RunPod primarily offer containerized GPU access (Docker)
- Lambda Labs persistent instances are closest to dedicated access on shared infrastructure
- True bare metal (one tenant per physical machine) is rare and expensive; check Vast.ai filters

---

## 4. Student / Academic GPU Programs

### NVIDIA Academic Hardware Grant Program

- **URL:** https://academicgrants.nvidia.com/
- **What:** Physical hardware grants to academic researchers. Recent grants include RTX PRO 6000 GPUs, Jetson AGX Orin units
- **Scale:** Up to 30,000 H100 80GB compute hours OR up to 8 physical RTX PRO 6000 GPUs
- **Eligibility:** Researchers at accredited academic institutions with active research projects
- **Application:** Rolling — visit the portal and submit a project proposal
- **Also:** NVIDIA Graduate Fellowship Program — up to $60,000 for PhD students in accelerated computing

### Google TPU Research Cloud (TRC)

- **URL:** https://sites.research.google/trc/
- **What:** Free Cloud TPU access for academic research
- **Note:** TPUs, not GPUs. Excellent for JAX/PyTorch workloads. No cost to accepted researchers.
- **Apply:** Research proposal required

### AWS Educate

- **URL:** https://aws.amazon.com/education/awseducate/
- **What:** $35-$100 in AWS credits for students (no credit card required for starter accounts)
- **Note:** Minimal for serious GPU work. Enough for small experiments on g4dn.xlarge (T4).

### Nebius Research Credits

- **URL:** https://nebius.com/nebius-research-credits-program
- **What:** GPU compute credits for researchers. Offers H100 access.

### NVIDIA Inception (Startups)

- Early-stage startups can get cloud credits and NVIDIA hardware discounts

### Google Colab / Kaggle (Free Tier)

- Free T4 (15GB) on Colab, A100 (40GB) on Colab Pro+
- Kaggle: free T4 / P100
- **No Nsight Compute access** (containerized, no perf counters)
- Best for: algorithm development, not low-level profiling

---

## 5. CUDA GEMM Kernel Optimization Progression

### Is the Progression Correct?

The standard progression described (naive -> tiled -> register-blocked -> vectorized -> double-buffered) is accurate and well-documented. Here is the precise benchmark data from Simon Boehm's canonical worklog, measured on an A100:

### Siboehm Benchmark Data (A6000 / A100, FP32 SGEMM)

| Kernel             | GFLOPs/s | % of cuBLAS | Key Technique                                           |
| ------------------ | -------- | ----------- | ------------------------------------------------------- |
| 1: Naive           | 309      | 1.3%        | One thread per output element, uncoalesced              |
| 2: GMEM Coalescing | 1,987    | 8.5%        | Reorder thread indexing for coalesced global reads      |
| 3: SMEM Caching    | 2,980    | 12.8%       | Load tiles into shared memory to reduce global reads    |
| 4: 1D Blocktiling  | 8,475    | 36.5%       | Each thread computes a column strip (register reuse)    |
| 5: 2D Blocktiling  | 15,972   | 68.7%       | Each thread computes a TM x TN tile in registers        |
| 6: Vectorized Mem  | 18,237   | 78.4%       | float4 loads (LDS.128), vectorized SMEM/GMEM access     |
| 9: Autotuning      | 19,721   | 84.8%       | Tune BM/BN/BK/TM/TN tile sizes                          |
| 10: Warptiling     | 21,779   | 93.7%       | Warp-level tiling for tensor core preparation           |
| cuBLAS             | 23,250   | 100%        | NVIDIA's library (uses tensor cores in TF32 by default) |

Source: https://siboehm.com/articles/22/CUDA-MMM

### What Each Step Does

**Naive (309 GFLOPS, 1.3% cuBLAS)**
Each thread computes one C[i,j] by doing a dot product of row i of A and column j of B. Each thread independently loads K elements from A and K from B = O(K) global reads per thread, all uncoalesced. Catastrophic memory bandwidth waste.

**GMEM Coalescing (1987 GFLOPS, 8.5%)**
Reorder thread assignment so adjacent threads in a warp access adjacent memory addresses. Warp of 32 threads now loads a contiguous 128-byte cache line in one transaction instead of 32 scattered loads. 6x improvement from just fixing memory access pattern.

**SMEM Caching / Tiling (2980 GFLOPS, 12.8%)**
Divide A and B into BK-wide tiles. A tile of threads cooperatively loads a block of A and a block of B into shared memory (32x faster than global), then compute the partial dot products from SMEM. Reduces global memory traffic by a factor of BK (tile width). Modest gain here because register pressure is still high.

**1D Blocktiling (8475 GFLOPS, 36.5%)**
Each thread now computes TM output elements (a vertical strip of C) instead of 1. Inner loop accumulates into TM registers. Reuses the loaded B row across all TM accumulations — increases arithmetic intensity. 2.8x over SMEM tiling.

**2D Blocktiling (15972 GFLOPS, 68.7%)**
Each thread computes a TM x TN submatrix of C. Inner loop accumulates into TM\*TN registers (typically 8x8=64 registers). Both the A strip and B strip are reused. This is the register-blocking step — the core GEMM optimization. 1.9x over 1D tiling.

**Vectorized Memory Access (18237 GFLOPS, 78.4%)**
Use float4 (128-bit) loads for both GMEM and SMEM. Transposes B in SMEM to enable vectorized column reads. Changes from individual 32-bit memory transactions to 128-bit transactions — halves memory instruction count. ~14% over 2D tiling.

**Warptiling (21779 GFLOPS, 93.7%)**
Add a warp-level tile between the block tile and thread tile. Threads within a warp are grouped to share register file fragments and minimize bank conflicts. This step also sets the stage for tensor core (WMMA/MMA) operations. Achieves 93.7% of cuBLAS.

### What cuBLAS Does That Custom Kernels Don't (Yet)

cuBLAS at its reported 23,249 GFLOPS uses FP32 TensorFloat-32 (TF32) — not pure FP32. TF32 tensor cores execute at 10x the throughput of FP32 CUDA cores. An apples-to-apples FP32 comparison would have cuBLAS at a much lower number. Custom hand-written SGEMM kernels at 93% of cuBLAS is legitimately excellent.

### State of the Art (2024-2025)

The modern progression beyond the above adds:

1. **Tensor cores (WMMA / inline PTX mma.sync)** — Mandatory for competitive GEMM on Volta+. Use 16x16x16 matrix fragments.
2. **Async copy (cp.async, Ampere A100+)** — Overlaps GMEM->SMEM transfer with computation, software pipelining without threads blocking on loads.
3. **Double/multi-buffering** — Two or more SMEM buffers: while one tile's MMA is executing, the next tile is being loaded. Hides memory latency. On A100: 2-stage pipeline typical, 3+ stages for peak.
4. **TMA (Tensor Memory Accelerator, H100/Hopper)** — Hardware unit that transfers entire tensors asynchronously to SMEM with a single thread issuing the command (others keep computing). Eliminates the entire cooperative loading pattern.
5. **Warp specialization (H100)** — Split warps into "producer" (TMA load) and "consumer" (MMA compute) warps. Maximizes utilization.
6. **CUTLASS 3.x / CuTe** — NVIDIA's template library encodes all of the above with compile-time tile descriptors. Best open-source GEMM reference.

On H100, top CUTLASS SGEMM delivers ~280 TFLOPS vs cuBLAS ~215 TFLOPS (cuBLAS is not always the ceiling).

---

## Sources

- [NVIDIA ERR_NVGPUCTRPERM Official Documentation](https://developer.nvidia.com/nvidia-development-tools-solutions-err_nvgpuctrperm-permission-issue-performance-counters)
- [CVE-2018-6260 — NVD](https://nvd.nist.gov/vuln/detail/CVE-2018-6260)
- ["Rendered Insecure: GPU Side Channel Attacks are Practical" CCS 2018](https://www.cs.ucr.edu/~nael/pubs/ccs18.pdf)
- [siboehm — How to Optimize a CUDA Matmul Kernel for cuBLAS-like Performance](https://siboehm.com/articles/22/CUDA-MMM)
- [salykova — Advanced Matrix Multiplication Optimization on NVIDIA GPUs](https://salykova.github.io/sgemm-gpu)
- [NVIDIA CUTLASS Documentation — Efficient GEMM](https://docs.nvidia.com/cutlass/media/docs/cpp/efficient_gemm.html)
- [Vast.ai GPU Pricing](https://vast.ai/pricing)
- [Lambda Labs GPU Pricing](https://lambda.ai/pricing)
- [RunPod Pricing](https://www.runpod.io/pricing)
- [Genesis Cloud RTX GPU Pricing](https://www.genesiscloud.com/products/nvidia-rtx-gpus)
- [NVIDIA Academic Grant Program](https://www.nvidia.com/en-us/industries/higher-education-research/academic-grant-program/)
- [Google TPU Research Cloud](https://sites.research.google/trc/about/)
- [AWS Educate](https://aws.amazon.com/education/awseducate/)
- [H100 Rental Price Comparison 2026 — IntuitionLabs](https://intuitionlabs.ai/articles/h100-rental-prices-cloud-comparison)
- [Northflank — 7 Cheapest Cloud GPU Providers 2026](https://northflank.com/blog/cheapest-cloud-gpu-providers)
- [ThunderCompute — A100 Pricing 2026](https://www.thundercompute.com/blog/a100-gpu-pricing-showdown-2025-who-s-the-cheapest-for-deep-learning-workloads)
