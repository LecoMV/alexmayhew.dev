# Claude Sonnet 4.6 Subagent Strategy Research (2026-02-15)

**Status:** CURRENT
**Session:** Evaluate whether Sonnet 4.6 should replace Opus 4.6 for research/exploration agents in Claude Code workflow

## Key Findings

- Sonnet 4.6 performs within 1-2% of Opus 4.6 on coding benchmarks at **1/5 the cost**
- Research, code review, and debugging tasks are ideal Sonnet workloads
- Opus remains superior for architecture planning, sustained agentic tasks, and long-context precision
- Our custom subagent configuration was already optimal — no changes needed

## Benchmark Comparison

| Capability                   | Opus 4.6           | Sonnet 4.6             | Winner                  |
| ---------------------------- | ------------------ | ---------------------- | ----------------------- |
| SWE-bench (coding)           | 80.8%              | 79.6%                  | Opus (marginal)         |
| OSWorld (agentic desktop)    | 72.7%              | 72.5%                  | Opus (marginal)         |
| Financial analysis           | 60.1%              | 63.3%                  | **Sonnet**              |
| Long-context retrieval       | Better, less drift | Good but drifts more   | Opus                    |
| Sustained agentic tasks      | Better endurance   | Good for shorter tasks | Opus                    |
| Code review/debugging        | Superior           | Good                   | Opus                    |
| **Cost (input/output MTok)** | $15/$75            | $3/$15                 | **Sonnet (5x cheaper)** |
| Max output tokens            | 128K               | 64K                    | Opus                    |
| Context window               | 200K               | 200K (1M beta)         | Sonnet (beta)           |

## Sonnet 4.6 Strengths

- **Near-Opus coding**: SWE-bench 79.6% vs 80.8% — negligible gap for non-greenfield tasks
- **Financial/analytical reasoning**: Beats Opus at 63.3% vs 60.1% on TAU-bench finance
- **1M context window (beta)**: Useful for large document synthesis in research tasks
- **Adaptive thinking**: Supports effort parameter; `medium` effort recommended for Sonnet
- **Cost efficiency**: At 1/5 the price, research-heavy workflows see massive savings

## Opus 4.6 Advantages (Where It Justifies 5x Cost)

- **Sustained agentic endurance**: Plans more carefully over long multi-step tasks
- **Long-context precision**: Less drift when working with large codebases
- **Deeper debugging**: Better at complex root cause analysis in unfamiliar code
- **Code review depth**: Catches subtle architectural issues that Sonnet may miss
- **128K max output**: Double Sonnet's limit for large code generation

## Current Custom Subagent Configuration

Location: `~/.claude/agents/`

| Agent           | Model  | Role                             | Assessment |
| --------------- | ------ | -------------------------------- | ---------- |
| `researcher`    | sonnet | Research, web search, synthesis  | Optimal    |
| `code-reviewer` | sonnet | Code review (read-only)          | Optimal    |
| `debugger`      | sonnet | Root cause analysis, fixes       | Optimal    |
| `planner`       | opus   | Architecture, trade-off analysis | Optimal    |

## Built-in Subagent Defaults

| Agent             | Default Model   | Role                         | Assessment |
| ----------------- | --------------- | ---------------------------- | ---------- |
| Explore           | Haiku           | Fast file/codebase searching | Optimal    |
| Plan              | Inherits (Opus) | Implementation planning      | Optimal    |
| general-purpose   | Inherits (Opus) | Complex multi-step coding    | Optimal    |
| Bash              | Inherits (Opus) | Command execution            | Optimal    |
| Claude Code Guide | Haiku           | Documentation lookup         | Optimal    |

## Model Selection Framework

### Use Opus for:

- Main coding model (complex multi-file edits, architecture)
- Planning agents (system design, trade-off analysis)
- Long agentic chains (10+ tool calls)
- Tasks requiring 128K output

### Use Sonnet for:

- Research agents (web search, doc synthesis)
- Code review agents (read-only checklist review)
- Debugging agents (structured reproduce-isolate-fix)
- Any agent where task is well-defined and structured

### Use Haiku for:

- File exploration (glob, grep, quick reads)
- Documentation lookup
- Simple, fast queries

## Task Tool Model Parameter

When spawning ad-hoc agents via the `Task` tool, use the `model` parameter:

```
model: "sonnet"  — research, review, debugging
model: "opus"    — complex coding, architecture
model: "haiku"   — fast exploration, simple lookups
```

## Recommendations

**No changes needed.** Current configuration already follows the optimal pattern:

- Opus for planning and complex coding (main model + planner)
- Sonnet for research, review, and debugging (3 custom agents)
- Haiku for fast exploration (built-in Explore)

## Cost Impact

Assuming 60% of subagent usage is research/review/debug (Sonnet) and 40% is planning/coding (Opus):

- Without optimization: 100% Opus = 100% cost
- Current setup: 60% at Sonnet (60% \* 0.2 = 12%) + 40% at Opus (40%) = **52% of full-Opus cost**
- Net savings: ~48% on subagent spend

## Sources

- Anthropic model comparison: https://docs.anthropic.com/en/docs/about-claude/models
- Claude Code subagent docs: https://code.claude.com/docs/en/sub-agents
- Claude 4.6 release notes: https://www.anthropic.com/news/claude-4-6
- SWE-bench leaderboard: https://www.swebench.com/
