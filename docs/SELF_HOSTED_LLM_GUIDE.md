# Self-Hosted LLM Guide for Content Repurposing

> **Created:** 2026-01-27
> **Updated:** 2026-01-27 (corrected VRAM recommendations)
> **Hardware:** RTX 3080 (10GB VRAM)
> **Purpose:** Replace GPT-4o API costs with free local/cloud alternatives

---

## Executive Summary

You don't need to pay for GPT-4o. Open-source LLMs now deliver **80-90% of GPT-4o quality** for content tasks at zero marginal cost.

**Recommended Setup for RTX 3080 10GB:**

- **Ollama + Gemma 2 9B (Q5_K_M)** for local inference (~7.5GB, leaves room for context)
- **Groq API (free)** for high-volume/speed needs (access to Llama 3.3 70B)
- **n8n** for workflow automation

**Total cost: $0/month**

---

## ⚠️ Critical VRAM Constraint

**Your 10GB VRAM must fit BOTH:**

1. **Model weights** (the LLM itself)
2. **KV cache** (context window memory)

This is why **Llama 3.3 70B at 4-bit won't work** on your hardware:

| Model                | Weights Only | +8K Context | Status   |
| -------------------- | ------------ | ----------- | -------- |
| Gemma 2 9B Q5_K_M    | ~7.5 GB      | ~8.5 GB     | ✅ Works |
| Llama 3.1 8B Q4_K_M  | ~6.5 GB      | ~7.5 GB     | ✅ Works |
| Qwen 2.5 14B Q4_K_M  | ~8.5 GB      | ~10 GB      | ⚠️ Tight |
| Llama 3.3 70B Q4_K_M | ~35 GB       | ~37 GB      | ❌ OOM   |

**If you exceed VRAM:** Generation drops from ~50 tok/s to ~3-5 tok/s (unusable).

---

## Part 1: The 9B Sweet Spot (RTX 3080 10GB)

### Best Local Models for Your Hardware

| Model                      | VRAM (8K ctx) | Quality vs GPT-4o | Best For                           |
| -------------------------- | ------------- | ----------------- | ---------------------------------- |
| **Gemma 2 9B (Q5_K_M)** ⭐ | ~8.5 GB       | 80-85%            | Creative writing, LinkedIn, blogs  |
| **Llama 3.1 8B (Q4_K_M)**  | ~7.5 GB       | 75-80%            | JSON formatting, structured output |
| **DeepSeek-R1-8B**         | ~7 GB         | 75-80%            | Reasoning, root cause analysis     |
| **Mistral 7B v0.3**        | ~6 GB         | 70-75%            | Fast inference, SEO content        |
| **Qwen 2.5 14B (Q4_K_M)**  | ~10 GB        | 80-85%            | Multilingual (if it fits)          |

### Why Gemma 2 9B Wins for Content

From benchmarks comparing creative writing:

> "Gemma 2 knocked it out of the park with delightful prose and beautiful storytelling. Llama 3, on the other hand, seemed dull and robotic."

- **MMLU Score:** Gemma 2 9B (71.3%) vs Llama 3.1 8B (66.7%)
- **Creative output:** More human, less "AI-sounding"
- **Tone matching:** Superior for LinkedIn/Twitter voice

### RTX 3080 Benchmark (Llama 3.1 8B Q4_K_M)

```
Prompt evaluation: 3,557 tokens/s
Generation (512 ctx): 109.57 tokens/s
Generation (8K ctx): 89.90 tokens/s
```

Gemma 2 9B will be slightly slower (~50-70 tok/s) but still interactive.

---

## Part 2: Multi-Model Strategy

### Recommended Role-Based Models

| Role            | Model                  | VRAM  | Use Case                          |
| --------------- | ---------------------- | ----- | --------------------------------- |
| **The Writer**  | Gemma 2 9B (Q5_K_M)    | ~8 GB | LinkedIn posts, Twitter threads   |
| **The Logic**   | Llama 3.1 8B (Q4_K_M)  | ~7 GB | JSON output, categorization       |
| **The Thinker** | DeepSeek-R1-Distill-8B | ~7 GB | Root cause analysis, case studies |

**Workflow:** Use Gemma 2 for creative tasks, switch to Llama 3.1 when you need strict formatting.

---

## Part 3: Cloudflare Workers AI (Already Configured)

You already have Cloudflare Workers AI set up on alexmayhew.dev. This gives you **10,000 free neurons/day**.

### Neuron Costs by Model

| Model                                 | Input (per M tokens) | Output (per M tokens) | ~Free Tasks/Day |
| ------------------------------------- | -------------------- | --------------------- | --------------- |
| **Llama 3.2 1B**                      | 2,457 neurons        | 18,252 neurons        | ~500            |
| **Llama 3.2 3B**                      | 4,625 neurons        | 30,475 neurons        | ~370            |
| **Llama 3.1 8B**                      | 4,119 neurons        | 34,868 neurons        | ~330            |
| **Qwen 2.5-Coder 32B** (current chat) | ~40,000 neurons      | ~60,000 neurons       | ~50-100         |
| **Llama 3.3 70B**                     | 26,668 neurons       | 204,805 neurons       | ~15-20          |
| **QwQ 32B**                           | 60,000 neurons       | 90,909 neurons        | ~10-15          |

_Tasks estimated at ~500 input tokens, ~800 output tokens per repurposing task_

### Best CF Models for Content Repurposing

| Use Case            | Model                                     | Daily Free Capacity |
| ------------------- | ----------------------------------------- | ------------------- |
| **High Volume**     | `@cf/meta/llama-3.2-3b-instruct`          | ~370 tasks          |
| **Quality Balance** | `@cf/meta/llama-3.1-8b-instruct-fp8-fast` | ~330 tasks          |
| **Best Quality**    | `@cf/qwen/qwen2.5-coder-32b-instruct`     | ~50-100 tasks       |

### Using CF AI in n8n

```javascript
// HTTP Request node to your own API or direct CF endpoint
const response = await fetch(
	"https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run/@cf/meta/llama-3.1-8b-instruct-fp8-fast",
	{
		method: "POST",
		headers: {
			Authorization: "Bearer {CF_API_TOKEN}",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			messages: [
				{ role: "system", content: "You are a content repurposing assistant." },
				{ role: "user", content: "Convert this blog post to a Twitter thread: ..." },
			],
			max_tokens: 500,
		}),
	}
);
```

### Advantages of CF AI

- **Already deployed** - Your site has the AI binding configured
- **Edge latency** - Runs on Cloudflare's global network
- **No cold starts** - Unlike self-hosted, always warm
- **Free tier resets daily** - 10,000 neurons every day at UTC midnight

---

## Part 4: External Free APIs

When you need Llama 3.3 70B quality or higher volume, use external free APIs:

### Groq (Best External Free Tier) ⭐

| Feature         | Details                                 |
| --------------- | --------------------------------------- |
| **Models**      | Llama 3.3 70B, Mixtral 8x7B, Gemma 2 9B |
| **Limits**      | 14,400 requests/day, 6,000 tokens/min   |
| **Speed**       | Industry-leading (LPU architecture)     |
| **Credit Card** | Not required                            |
| **API**         | OpenAI-compatible                       |
| **Credential**  | `pass show claude/groq/api-key`         |

**Why Groq for heavy lifting:**

- Access Llama 3.3 70B (too big for your GPU) for free
- 14,400 requests/day handles batch processing
- Fastest inference in the industry

### Together.ai

| Feature          | Details                      |
| ---------------- | ---------------------------- |
| **Models**       | Llama 4 Scout, Qwen, Mistral |
| **Free Credits** | $25 on signup                |
| **Best For**     | Multimodal content           |
| **API**          | Unified access               |

### OpenRouter

| Feature      | Details                                  |
| ------------ | ---------------------------------------- |
| **Models**   | 30+ free models                          |
| **Limits**   | 200 req/day (free), 1,000 req/day ($10+) |
| **Best For** | A/B testing different models             |
| **API**      | OpenAI-compatible                        |

---

## Part 5: Self-Hosting with Ollama

### Installation

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull the recommended model for RTX 3080
ollama pull gemma2:9b

# Or with specific quantization
ollama pull gemma2:9b-instruct-q5_K_M

# Run it
ollama run gemma2:9b

# API runs on http://localhost:11434
```

### Alternative Models

```bash
# For structured output / JSON
ollama pull llama3.1:8b

# For reasoning tasks
ollama pull deepseek-r1:8b

# For fast inference
ollama pull mistral:7b-instruct-v0.3
```

### Verify GPU Usage

```bash
# Check Ollama is using GPU
nvidia-smi

# Should show ollama process using VRAM
```

---

## Part 6: Best Models by Task

### LinkedIn Posts (Professional Tone)

**Recommendation:** Gemma 2 9B

- Superior creative prose
- Better human preference alignment
- Natural, engaging tone

```bash
ollama run gemma2:9b "Write a LinkedIn post about [topic]. Professional but not stiff. Include a hook and CTA."
```

### Twitter Threads (Concise, Punchy)

**Recommendation:** Gemma 2 9B or Mistral 7B

- Gemma for quality, Mistral for speed
- Both handle character limits well

```bash
ollama run gemma2:9b "Convert this blog post into a Twitter thread of 8-10 tweets. First tweet must hook standalone."
```

### Content Rewriting (Cross-Platform)

**Recommendation:** Gemma 2 9B

- Best at maintaining voice while adapting format
- Handles tone shifts (blog → social)

### Summarization

**Recommendation:** Llama 3.1 8B or Mistral 7B

- Faster inference for batch processing
- Good at condensing long → short

### JSON/Structured Output

**Recommendation:** Llama 3.1 8B

- Better at following format instructions
- More predictable output structure

---

## Part 7: Ollama + n8n Integration

### Docker Setup

```bash
# Create Docker network
docker network create llm-network

# Run Ollama with GPU
docker run -d --gpus all \
  --name ollama \
  --network llm-network \
  -p 11434:11434 \
  -v ollama:/root/.ollama \
  ollama/ollama

# Run n8n
docker run -d --name n8n \
  --network llm-network \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n

# Pull model inside container
docker exec ollama ollama pull gemma2:9b
```

### n8n Configuration

1. Add **Ollama Chat Model** node
2. Set **Base URL**: `http://ollama:11434` (Docker) or `http://localhost:11434` (local)
3. Select **Model**: `gemma2:9b`
4. Use **Basic LLM Chain** node for conversations

### Example Workflow

```
Webhook Trigger
    ↓
Sanity/Read Blog Post
    ↓
Ollama (Gemma 2 9B): "Rewrite as LinkedIn carousel (10 slides)"
    ↓
Ollama (Gemma 2 9B): "Rewrite as Twitter thread (8-12 tweets)"
    ↓
Format Output
    ↓
Save to Notion (staging)
    ↓
Notification (Slack/Email)
```

### n8n Prompts for Content Repurposing

**LinkedIn Carousel:**

```
You are a B2B ghostwriter for a Software Architect. Convert this blog post into a LinkedIn carousel with 10 slides:

1. Hook slide (bold statement)
2. Problem slide
3-8. Key insight slides (one point each, max 30 words)
9. Summary slide
10. CTA slide

Blog post:
{{$json.content}}
```

**Twitter Thread:**

```
You are a technical Twitter influencer. Convert this into a thread of 8-12 tweets:

- First tweet: punchy hook that stands alone
- Middle tweets: one insight each, max 240 chars
- Last tweet: link to full article

Keep technical accuracy. No hashtags inline.

Blog post:
{{$json.content}}
```

---

## Part 8: Quality Comparison

| Task               | GPT-4o | Gemma 2 9B | Llama 3.1 8B | Mistral 7B |
| ------------------ | ------ | ---------- | ------------ | ---------- |
| LinkedIn Posts     | 100%   | 80-85%     | 70-75%       | 70-75%     |
| Twitter Threads    | 100%   | 80-85%     | 70-75%       | 75-80%     |
| Summarization      | 100%   | 75-80%     | 75-80%       | 75-80%     |
| Creative Rewriting | 100%   | 85-90%     | 70-75%       | 65-70%     |
| Tone Matching      | 100%   | 80-85%     | 70-75%       | 70-75%     |

**Bottom line:** For content repurposing, Gemma 2 9B delivers 80-85% of GPT-4o quality on your hardware.

---

## Part 9: Recommended Setups

### Option A: Triple-Redundant Free Stack (Recommended) ⭐

```
┌─────────────────────────────────────────────────────────┐
│                   Content Pipeline                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  TIER 1 - Local GPU (Unlimited, Private):               │
│  └── Ollama + Gemma 2 9B                                │
│      └── Bulk processing, private content               │
│      └── ~50 tok/s, no rate limits                      │
│                                                          │
│  TIER 2 - Cloudflare AI (330 tasks/day free):           │
│  └── Llama 3.1 8B via Workers AI                        │
│      └── Quick tasks, edge latency                      │
│      └── Already deployed on alexmayhew.dev             │
│                                                          │
│  TIER 3 - Groq API (14,400 req/day free):               │
│  └── Llama 3.3 70B                                      │
│      └── Quality-critical content                       │
│      └── Fastest inference in industry                  │
│                                                          │
│  Automation:                                             │
│  └── n8n (self-hosted)                                  │
│      └── Routes to appropriate tier based on task       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Cost:** $0/month
**Daily Capacity:** Unlimited local + 330 CF tasks + 14,400 Groq requests
**Best for:** Maximum flexibility and redundancy

### Option B: Fully Local

```
Ollama
├── Gemma 2 9B (creative)
├── Llama 3.1 8B (structured)
└── n8n (automation)
```

**Cost:** $0/month
**Best for:** Maximum privacy, offline capability

### Option C: Cloud-First

```
Groq API (primary) - Llama 3.3 70B
    ↓
OpenRouter (A/B testing)
    ↓
Together.ai (multimodal)
```

**Cost:** $0/month (within free tiers)
**Best for:** Fastest development, no local setup

---

## Part 10: Quick Start

### Step 1: Install Ollama

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Step 2: Pull Gemma 2 9B

```bash
ollama pull gemma2:9b
```

### Step 3: Test It

```bash
ollama run gemma2:9b "Rewrite this LinkedIn post as a 5-tweet thread: [paste content]"
```

### Step 4: Set Up n8n (Optional)

```bash
# Docker
docker run -d --name n8n \
  --network host \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n

# Open http://localhost:5678
```

### Step 5: Connect n8n to Ollama

1. Create new workflow
2. Add Ollama Chat Model node
3. Base URL: `http://localhost:11434`
4. Model: `gemma2:9b`
5. Build your repurposing pipeline

---

## Troubleshooting

### Out of Memory (OOM)

```bash
# Use more aggressive quantization
ollama pull gemma2:9b-instruct-q4_K_M

# Or use smaller model
ollama pull mistral:7b-instruct-v0.3

# Reduce context length in prompts
```

### Slow Generation (RAM Spillover)

If you see ~3-5 tok/s instead of ~50 tok/s:

- Model + context exceeds 10GB VRAM
- Switch to smaller model or lower quantization
- Check with `nvidia-smi` during inference

### n8n Can't Connect to Ollama

```bash
# Check Ollama is running
curl http://localhost:11434/api/tags

# If using Docker, ensure same network
docker network connect llm-network n8n

# Set OLLAMA_HOST for external access
export OLLAMA_HOST=0.0.0.0
```

---

## Technical Deep-Dive: Why 70B Won't Work

### VRAM Math for RTX 3080 (10GB)

**Llama 3.3 70B Q4_K_M:**

- Model weights: ~35 GB (4-bit × 70B params)
- KV cache (8K): ~1.6 GB
- **Total: ~37 GB** → You have 10 GB

**Gemma 2 9B Q5_K_M:**

- Model weights: ~7.5 GB
- KV cache (8K): ~1.0 GB
- **Total: ~8.5 GB** → Fits with headroom

### What Happens When You Exceed VRAM

1. Model tries to load
2. Excess offloads to system RAM
3. Every token requires RAM ↔ GPU transfer
4. Generation drops from ~50 tok/s to ~3-5 tok/s
5. Automation becomes unusable

---

## Resources

- [Ollama Documentation](https://ollama.com/docs)
- [Gemma 2 Model Card](https://ollama.com/library/gemma2)
- [n8n Ollama Integration](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmollama/)
- [Groq Console](https://console.groq.com)
- [VRAM Calculator](https://apxml.com/tools/vram-calculator)
- [KV Cache Explained](https://techtactician.com/llm-gpu-vram-requirements-explained/)

---

## Sources for This Guide

- [Gemma 2 vs Llama 3 Creative Writing Comparison](https://byrayray.medium.com/llama-3-2-vs-llama-3-1-vs-gemma-2-finding-the-best-open-source-llm-for-content-creation-1f6085c9f87a)
- [GPU Benchmarks on LLM Inference](https://github.com/XiongjieDai/GPU-Benchmarks-on-LLM-Inference)
- [Best Local LLMs for 8GB VRAM 2025](https://localllm.in/blog/best-local-llms-8gb-vram-2025)
- [Ollama VRAM Requirements Guide](https://localllm.in/blog/ollama-vram-requirements-for-local-llms)
- [Context Kills VRAM](https://medium.com/@lyx_62906/context-kills-vram-how-to-run-llms-on-consumer-gpus-a785e8035632)

---

_Updated 2026-01-27: Corrected recommendations based on VRAM constraints. Previous version incorrectly recommended Llama 3.3 70B which requires ~35GB VRAM._
