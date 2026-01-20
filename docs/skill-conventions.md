# Skill File Conventions

Detailed guidelines for writing and maintaining agent skills.

## File Naming

| Prefix | Category | Example |
|--------|----------|---------|
| `js-` | JavaScript/React | `js-profile-react.md` |
| `native-` | iOS/Android native | `native-turbo-modules.md` |
| `bundle-` | Bundling & app size | `bundle-barrel-exports.md` |

Use lowercase, hyphen-separated names that describe the action or topic.

## YAML Frontmatter

Required fields:

```yaml
---
title: Human-readable title
impact: CRITICAL | HIGH | MEDIUM
tags: comma, separated, searchable, keywords
---
```

## Section Order

1. **Quick Pattern / Quick Command / Quick Config / Quick Reference** — Choose one based on skill type
2. **When to Use** — Conditions that trigger this skill
3. **Prerequisites** — Required tools, versions, setup
4. **Step-by-Step Instructions** — Numbered, actionable steps
5. **Code Examples** — Before/after patterns
6. **Common Pitfalls** — What to avoid
7. **Related Skills** — Links to complementary skills

## Quick Section Types

| Type | Use When | Example |
|------|----------|---------|
| Quick Pattern | Code transformation | Incorrect → Correct code |
| Quick Command | Shell/tool invocation | `npx source-map-explorer` |
| Quick Config | Configuration change | metro.config.js snippet |
| Quick Reference | Conceptual overview | Summary table |

## Writing Style

- **Imperative voice**: "Run this command" not "You should run this command"
- **Scannable**: Bullet points over paragraphs
- **Specific**: Include version numbers, exact commands
- **Testable**: Every instruction should be verifiable

## Images

Store in `references/images/` with descriptive names:

```
devtools-flamegraph.png
bundle-treemap-source-map-explorer.png
```

Reference with relative paths:

```markdown
![React DevTools Flamegraph](images/devtools-flamegraph.png)
```

Add a note for AI limitations:

```markdown
> **Note**: This skill involves interpreting visual profiler output. 
> AI agents cannot yet process screenshots autonomously.
```

## Linking

Use relative paths for internal links:

```markdown
See [bundle analysis](./bundle-analyze-js.md) for verification.
```

Maintain bidirectional links in Related Skills sections.

## Impact Ratings

| Rating | Meaning | User Action |
|--------|---------|-------------|
| CRITICAL | Major performance impact | Fix immediately |
| HIGH | Significant improvement | Prioritize |
| MEDIUM | Worthwhile optimization | Address when possible |

## SKILL.md Structure

The main `SKILL.md` file should contain:

1. **YAML frontmatter** with name, description, license, metadata
2. **Overview** — What the skill covers
3. **Skill Format** — Explain the reference file structure
4. **When to Apply** — Trigger conditions
5. **Priority-Ordered Guidelines** — Table with priority, category, impact, prefix
6. **Quick Reference** — Most common commands/patterns
7. **References** — Tables linking to all reference files
8. **Problem → Skill Mapping** — Symptom to solution lookup
