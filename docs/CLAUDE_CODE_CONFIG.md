# Claude Code Configuration Best Practices

> This document explains the Claude Code configuration structure for this project based on Anthropic's official best practices.

## File Hierarchy

```
~/.claude/CLAUDE.md                    # Global defaults (all projects)
    └── project/CLAUDE.md              # Project-specific (this file)
            └── project/.claude/rules/ # Modular, path-scoped rules
```

Higher levels override lower levels. Rules with `paths:` frontmatter only load for matching files.

## Key Principles

### 1. Keep It Concise

From [Anthropic's Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices):

> "Research indicates that frontier LLMs can follow ~150-200 instructions with reasonable consistency. As instruction count increases, instruction-following quality decreases uniformly."

**Rule:** For each line, ask "Would removing this cause Claude to make mistakes?" If not, cut it.

### 2. Progressive Disclosure

Don't put everything in CLAUDE.md. Use `@path/to/file` imports:

```markdown
See @docs/DEPLOYMENT.md for full deployment guide.
```

This keeps the main file small while making detailed docs discoverable.

### 3. Use Modular Rules

Place topic-specific rules in `.claude/rules/` with YAML frontmatter:

```markdown
---
paths:
  - "src/components/**/*.tsx"
---

# Component Rules

Only apply to component files...
```

### 4. What NOT to Include

From [HumanLayer's Guide](https://www.humanlayer.dev/blog/writing-a-good-claude-md):

- **Code style details** - Use linters/formatters instead (much faster)
- **Code snippets** - They become stale; reference existing code
- **Session-specific info** - Don't track changing state
- **Things Claude already knows** - Standard language conventions
- **Exhaustive documentation** - Link to docs instead

### 5. What TO Include

- Commands Claude can't guess
- Project-specific quirks and gotchas
- Critical rules that prevent mistakes
- Architecture decisions and key paths
- References to detailed documentation

## This Project's Structure

```
CLAUDE.md                              # ~80 lines - identity, commands, basics
.claude/
├── rules/
│   ├── deployment.md                  # CI/CD rules
│   ├── design-system.md               # UI patterns (scoped to components)
│   ├── opennext.md                    # Cloudflare requirements (scoped)
│   └── pseo.md                        # pSEO rules (scoped to data/pages)
├── commands/
│   ├── build-check.md                 # /build-check command
│   ├── new-component.md               # /new-component command
│   └── new-page.md                    # /new-page command
├── mcp.json                           # MCP server config (beads)
└── settings.json                      # Project settings
```

## Iterating on Rules

Treat CLAUDE.md like code:

1. **Observe** - Did Claude follow the rule?
2. **Measure** - How often does Claude make this mistake?
3. **Prune** - Delete rules Claude follows naturally
4. **Emphasize** - Add "CRITICAL", "NEVER", "MUST" for important rules

## References

- [Anthropic Engineering Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Official Claude Code Docs](https://code.claude.com/docs/en/best-practices)
- [Claude Blog: Using CLAUDE.md Files](https://claude.com/blog/using-claude-md-files)
- [HumanLayer: Writing a Good CLAUDE.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md)
- [Builder.io: Complete CLAUDE.md Guide](https://www.builder.io/blog/claude-md-guide)
