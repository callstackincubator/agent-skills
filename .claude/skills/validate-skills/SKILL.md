---
name: validate-skills
description: Validates skills in this repo against agentskills.io spec and Claude Code best practices. Use via /validate-skills command.
license: MIT
metadata:
  author: Callstack
  tags: validation, linting, skill-authoring
---

# Validate Skills

Validate all skills in `skills/` against the agentskills.io spec and Claude Code best practices.

## Validation Checklist

For each skill directory, verify:

### Spec Compliance (agentskills.io)

| Check | Rule |
|-------|------|
| `name` format | 1-64 chars, lowercase alphanumeric + hyphens, no leading/trailing/consecutive hyphens |
| `name` matches directory | Directory name must equal `name` field |
| `description` length | 1-1024 characters, non-empty |
| Optional fields valid | `license`, `metadata`, `compatibility` if present |

### Best Practices (Claude Code)

| Check | Rule |
|-------|------|
| Description format | Third person, describes what + when to use |
| Body length | Under 500 lines |
| References one-level deep | No nested reference chains |
| Links are markdown | Use `[text](path)` not bare filenames |
| No redundancy | Don't repeat description in body |
| Concise | Only add context Claude doesn't already have |

## How to Run

1. Find all skill directories:
   ```bash
   fd -t d -d 1 . skills/
   ```

2. For each skill, read `SKILL.md` and check against the rules above

3. Report issues in this format:
   ```
   ## Validation Results

   ### skills/example-skill
   - [PASS] name format valid
   - [FAIL] name "example" doesn't match directory "example-skill"
   - [PASS] description length OK (156 chars)
   ```

## References

- [agentskills.io spec](https://agentskills.io/specification)
- [Claude Code best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
