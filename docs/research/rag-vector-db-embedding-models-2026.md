# RAG Architecture, Vector Databases & Embedding Models Research (2026-03-14)

**Status:** CURRENT
**Session:** Fact-checking blog posts on RAG architecture. Verified MTEB scores, pricing, model names, vector DB status, hybrid search claims.

---

## 1. Embedding Model MTEB Scores

### Verified Scores (March 2026)

| Model                         | Claimed Score | Verified?                  | Notes                                                              |
| ----------------------------- | ------------- | -------------------------- | ------------------------------------------------------------------ |
| OpenAI text-embedding-3-large | 64.6          | **CONFIRMED**              | Multiple sources confirm 64.6                                      |
| OpenAI text-embedding-3-small | 62.3          | **CONFIRMED**              | Confirmed by OpenAI launch post                                    |
| Cohere embed-english-v3.0     | 64.5          | **CONFIRMED**              | Zilliz, Pinecone, and Cohere docs confirm                          |
| Voyage AI voyage-3            | 67.1          | **OUTDATED / WRONG MODEL** | voyage-3 (original) ≠ voyage-3-large; see below                    |
| BGE-M3                        | 66.1          | **WRONG**                  | BGE-M3 MTEB score is ~63.0, not 66.1; it is not optimized for MTEB |

### Important Corrections

**voyage-3 vs voyage-3-large:**
The blog likely intends voyage-3-large (released Jan 2025), which holds top-tier scores and beats OpenAI-v3-large by ~9.74% across 100 datasets. The original voyage-3 scores lower. A specific MTEB average number for voyage-3-large was not found in sources, but the score of 67.1 may refer to voyage-3-large's English retrieval performance specifically. Voyage AI's own blog does not quote a single MTEB number; they quote domain-specific benchmarks. If the blog cites 67.1, it should attribute it to voyage-3-large, not voyage-3.

**BGE-M3 score:**
BGE-M3 MTEB score is ~63.0 per the BentoML open-source embedding guide (March 2026). The BAAI team themselves initially did not optimize for MTEB (it is a multi-lingual, multi-functionality model). A score of 66.1 appears to be incorrect. The blog should use ~63.0 or omit the BGE-M3 MTEB score and instead note it excels at multi-vector and sparse retrieval.

### New Top Models (March 2026) — Not in Blog

These models now outperform those in the blog post:

- **Google Gemini Embedding 001** — 68.32 MTEB (English), current #1 API model
- **NV-Embed-v2 (NVIDIA)** — 72.31 MTEB (English)
- **BGE-en-ICL (BAAI)** — 71.24 MTEB
- **Qwen3-Embedding-8B** — 70.58 (multilingual)
- **Cohere Embed 4** — ~65.2 MTEB, multimodal (text + images), 1536-dim — supersedes embed-v3

---

## 2. Embedding Model Pricing (March 2026)

All pricing is standard (non-batch) unless noted.

| Model                  | Claimed Price   | Verified?     | Actual Price                                              |
| ---------------------- | --------------- | ------------- | --------------------------------------------------------- |
| text-embedding-3-large | $0.13/1M tokens | **CONFIRMED** | $0.13/1M (batch: $0.065/1M)                               |
| text-embedding-3-small | $0.02/1M tokens | **CONFIRMED** | $0.02/1M (batch: $0.01/1M)                                |
| Cohere embed-v3        | $0.10/1M tokens | **CONFIRMED** | $0.10/1M (embed-english-v3.0 and embed-multilingual-v3.0) |

Note: Cohere Embed 4 (newer) costs $0.12/1M tokens.

Sources:

- [OpenAI Pricing](https://platform.openai.com/docs/pricing)
- [Cohere Pricing](https://cohere.com/pricing)

---

## 3. Vector Databases

### pgvector

- **Latest version:** 0.8.2 (released early 2026, fixes buffer overflow in parallel HNSW builds — CVE-2026-3172)
- **Prior notable release:** 0.8.0 added iterative index scans (prevents over-filtering), configurable via `hnsw.iterative_scan` and `ivfflat.iterative_scan`
- **Vector types:** `halfvec` (2-byte floats, up to 4,000 dims), `sparsevec` (up to 1,000 nonzero dims), `bit` (binary vectors up to 64,000 dims)
- **Index types:** HNSW (better query speed, slower build), IVFFlat (faster build, lower recall)
- **Distance metrics:** L2/Euclidean, inner product, cosine

### Pinecone Serverless

The blog's claimed pricing ($0.008/1K queries + $0.33/1M vectors) is **NOT HOW PINECONE PRICING WORKS** as of 2026.

**Actual 2026 Pinecone pricing structure:**

- Pinecone uses **Read Units (RUs)** and **Write Units (WUs)**, not per-query + per-vector flat rates
- RUs: $16/million RUs (Standard), $24/million RUs (Enterprise)
- A simple vector search = 1 RU per 1,000 vectors scanned; metadata filtering = 5-10 RUs
- Storage: $0.33/GB/month (the $0.33 figure in the blog is the storage price, not per-million-vectors)
- Minimum commitment: $50/month (Standard), $500/month (Enterprise)

The blog's Pinecone pricing numbers are outdated or incorrect. The $0.33 figure is per GB/month for storage, not per million vectors. The per-query figure needs to be expressed in Read Units.

### Qdrant Cloud

- **Claimed price:** $0.044/hr
- **Actual:** Pricing is usage-based (CPU/memory/disk), billed hourly. Qdrant's Hybrid Cloud plan starts at $0.014/hr. Specific Managed Cloud hourly rates require their pricing calculator at qdrant.tech/pricing — the $0.044/hr figure is likely for a specific cluster tier but cannot be confirmed from search results without using their calculator.
- Status: Production-ready, open-source self-host available, Managed Cloud available.

### Weaviate Cloud

**New pricing model (effective Oct 27, 2025):**

- **Serverless/Shared Cloud:** $25 per 1M vector dimensions/month (Flex pay-as-you-go plan)
- Pricing dimensions: vector dimensions × objects × replication factor; also charges for storage (disk) and backups
- Pricing varies by index type (HNSW vs Flat) and compression method
- Enterprise/Dedicated Cloud: contact sales

The old Weaviate pricing (if the blog cites per-cluster or per-node pricing) is now outdated.

### Turbopuffer

- **Status:** Production GA (not just a new player — actively used by Cursor, Notion, Linear)
- Handles 2.5T+ documents, 10M+ writes/s, 10K+ queries/s in production
- Serverless, built on object storage (S3/GCS/Azure Blob), uses SPFresh centroid-optimized index
- Fully managed cloud service, not self-hosted

### LanceDB

- **Status:** Production, open-source with managed cloud option
- Open-source, AI-native, multimodal lakehouse built on Lance columnar format
- Disk-based, compute-storage separation, up to 100x cost savings vs memory-based solutions
- Supports text, images, video, audio (multimodal)
- Used as embedded DB (in-process) or as a cloud service

---

## 4. GPT Model Naming — Generation Guidance

**GPT-4 Turbo status:** Legacy/deprecated as of early 2026. Pricing: $10/M input, $30/M output tokens.

**GPT-4o status (as of March 2026):** Also legacy, superseded by GPT-4.1 and GPT-5 family. However, GPT-4o is still widely referenced and used in production. Blog posts written for 2025/early-2026 audiences can still reasonably reference GPT-4o as the canonical "current flagship" given the pace of change.

**Current GPT-4o pricing (still live as of March 2026):**

- Input: $2.50/1M tokens
- Output: $10.00/1M tokens
- Cached input: $1.25/1M tokens (50% off)
- Batch API: 50% off input and output

**GPT-4o Mini:**

- Input: $0.15/1M tokens
- Output: $0.60/1M tokens

**Recommendation for blog posts:** If the post says "GPT-4 Turbo" for pricing/generation in a RAG context, update to "GPT-4o" with the $2.50/$10.00 pricing. If it says "GPT-4o" that is still accurate as a reference model (even if superseded by GPT-5 family), but should note it may have changed.

---

## 5. Cohere Rerank

**Claimed model name:** rerank-english-v3.0

**Actual current status (March 2026):**

- rerank-english-v3.0 exists but is **an older model in the Rerank 3.0 generation**
- Current recommended model: **Rerank v3.5** (unified multilingual, available on Cohere, AWS Bedrock, Azure, and Pinecone)
- Newer still: **Rerank 4.0** (available in "fast" and "pro" variants)

**Rerank v3.5 pricing:**

- $2.00 per 1,000 searches
- 1 search = 1 query + up to 100 documents
- Documents >500 tokens (including query) are split into chunks, each chunk = 1 document for billing

If the blog cites rerank-english-v3.0, that model still works but is not the current recommended version. Update to "rerank-v3.5" for accuracy.

---

## 6. Hybrid Search Performance Claim (30-40% improvement)

**Claimed:** 30-40% improvement for hybrid vs pure vector search.

**Verified range (March 2026):** The literature consistently cites **10-30% improvement** in retrieval accuracy across various datasets and domains. The upper bound in the blog (40%) is at the high end — most research supports 10-30%.

**Nuance:** The improvement varies significantly by use case:

- Legal document retrieval: very large gains (72% → 94% accuracy in one study)
- Video recommendation: 21% engagement improvement
- General RAG: 10-30% is the well-supported range

**Recommendation:** Update the claim from "30-40%" to "10-30%" to be consistent with the research consensus, or qualify it with "depending on the use case." The 30-40% claim is defensible only for specific domains.

---

## Summary of Corrections Needed

| Item                | Blog Claim                           | Correct Value                                             | Action                               |
| ------------------- | ------------------------------------ | --------------------------------------------------------- | ------------------------------------ |
| Voyage AI model     | "voyage-3: 67.1"                     | voyage-3-large (not voyage-3); exact MTEB avg unconfirmed | Rename to voyage-3-large             |
| BGE-M3 MTEB         | 66.1                                 | ~63.0                                                     | Correct to 63.0 or remove MTEB score |
| Pinecone pricing    | $0.008/1K queries + $0.33/1M vectors | Read Units model: $16/M RUs; $0.33/GB storage             | Rewrite pricing section              |
| GPT-4 Turbo         | Referenced as current                | Legacy; use GPT-4o ($2.50/$10.00 per 1M)                  | Update to GPT-4o                     |
| Cohere rerank model | rerank-english-v3.0                  | rerank-v3.5 is current ($2.00/1K searches)                | Update model name                    |
| Hybrid search gain  | 30-40%                               | 10-30% (research consensus)                               | Update to 10-30%                     |

### Confirmed Accurate

- text-embedding-3-large: 64.6 MTEB, $0.13/1M
- text-embedding-3-small: 62.3 MTEB, $0.02/1M
- Cohere embed-v3: 64.5 MTEB, $0.10/1M
- pgvector: active, v0.8.2, HNSW + IVFFlat, halfvec/sparsevec types
- Turbopuffer and LanceDB: both in production use, legitimate new players

---

## Sources

- [MTEB Leaderboard March 2026 (Awesome Agents)](https://awesomeagents.ai/leaderboards/embedding-model-leaderboard-mteb-march-2026/)
- [MTEB Leaderboard (Hugging Face)](https://huggingface.co/spaces/mteb/leaderboard)
- [OpenAI Pricing](https://platform.openai.com/docs/pricing)
- [OpenAI text-embedding-3-large model page](https://platform.openai.com/docs/models/text-embedding-3-large)
- [OpenAI text-embedding-3-small model page](https://platform.openai.com/docs/models/text-embedding-3-small)
- [OpenAI New Embedding Models announcement](https://openai.com/index/new-embedding-models-and-api-updates/)
- [Cohere Pricing](https://cohere.com/pricing)
- [Cohere embed-english-v3.0 guide (Zilliz)](https://zilliz.com/ai-models/embed-english-v3.0)
- [Voyage AI voyage-3-large announcement](https://blog.voyageai.com/2025/01/07/voyage-3-large/)
- [BGE-M3 (Hugging Face)](https://huggingface.co/BAAI/bge-m3)
- [Best Open-Source Embedding Models 2026 (BentoML)](https://www.bentoml.com/blog/a-guide-to-open-source-embedding-models)
- [pgvector 0.8.2 release (PostgreSQL.org)](https://www.postgresql.org/about/news/pgvector-082-released-3245/)
- [pgvector GitHub](https://github.com/pgvector/pgvector)
- [Pinecone Understanding Cost](https://docs.pinecone.io/guides/manage-cost/understanding-cost)
- [Pinecone Pricing 2026 (PE Collective)](https://pecollective.com/tools/pinecone-pricing/)
- [Qdrant Pricing](https://qdrant.tech/pricing/)
- [Qdrant Cloud Billing](https://qdrant.tech/documentation/cloud-pricing-payments/)
- [Weaviate Pricing](https://weaviate.io/pricing)
- [Weaviate Cloud Pricing Update blog](https://weaviate.io/blog/weaviate-cloud-pricing-update)
- [Turbopuffer](https://turbopuffer.com/)
- [LanceDB](https://lancedb.com/)
- [Cohere Rerank Overview](https://docs.cohere.com/docs/rerank-overview)
- [Cohere Rerank v3.5 (Microsoft Marketplace)](https://marketplace.microsoft.com/en-us/product/saas/cohere.cohere-rerank-v3-5-offer)
- [GPT-4o pricing (pricepertoken.com)](https://pricepertoken.com/pricing-page/model/openai-gpt-4o)
- [Hybrid Search RAG Guide 2026 (Calmops)](https://calmops.com/ai/hybrid-search-rag-complete-guide-2026/)
- [Hybrid Search vs Pure Vector (dasroot.net)](https://dasroot.net/posts/2026/02/hybrid-search-bm25-vectors-vs-pure-vector-search/)
- [VentureBeat: Google takes MTEB #1](https://venturebeat.com/ai/new-embedding-model-leaderboard-shakeup-google-takes-1-while-alibabas-open-source-alternative-closes-gap)
