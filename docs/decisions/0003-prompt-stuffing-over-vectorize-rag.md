# ADR-0003: Prompt Stuffing Over Vectorize RAG for Chat Widget

**Status:** Accepted
**Date:** 2026-02-18

## Context

The chat widget (Qwen 2.5-Coder 32B via Cloudflare Workers AI) needs knowledge about the site's blog content to answer questions accurately. Two approaches were evaluated: (1) stuff blog metadata directly into the system prompt, or (2) implement semantic search using Cloudflare Vectorize with bge-base-en-v1.5 embeddings and RAG retrieval.

With ~44 blog posts, concatenating titles and short excerpts adds approximately 3,100 tokens to the system prompt. Vectorize RAG would add 100-200ms latency per query (embed question + vector search) but retrieve the 3-5 most semantically relevant chunks instead of injecting all posts.

## Decision

Use prompt stuffing (v1): inject all blog titles and one-sentence descriptions into the system prompt at request time. No vector database, no embedding pipeline, no chunking strategy.

## Consequences

Simpler architecture with no additional Cloudflare bindings, no build-time indexing script, and no embedding costs. Works identically in local development (no `--remote` flag needed). The "lost in the middle" problem means the model may not properly weight all 44 posts when answering specific questions. This approach cannot scale beyond approximately 50 posts without exceeding reasonable context limits. Vectorize RAG remains the documented upgrade path -- the research and implementation plan exist at `docs/research/cloudflare-vectorize-rag-blog-chat-2026.md` for when content volume warrants it.
