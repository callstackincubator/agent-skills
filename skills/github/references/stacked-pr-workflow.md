---
title: Merge PR Chain
---

# Skill: Merge PR Chain

Merge a chain of stacked GitHub PRs into main as individual squash commits. Use when user has multiple PRs where each targets the previous one's branch (e.g., PR #2 → PR #1's branch → main) and wants to squash merge them all to main while preserving separate commits per PR.

## Workflow

### 1. Identify the chain

Fetch PR details to map the chain structure:
```
main
  └── #1 (base: main)
        └── #2 (base: #1's branch)
              └── #3 (base: #2's branch)
```

### 2. Merge sequentially

For each PR in order:

**First PR** (targets main):
```bash
# Squash merge via GitHub MCP or CLI
gh pr merge <N> --squash --title "<PR title> (#N)"
git pull origin main
```

**Subsequent PRs** (target previous branch):
```bash
# Squash merge into its original base branch (not main)
gh pr merge <N> --squash --title "<PR title> (#N)"

# Fetch the base branch (where squash commit landed)
git fetch origin <base-branch>

# Cherry-pick the squash commit to main
git cherry-pick <squash-commit-sha>
git push origin main
```

## Key details

- **Always use PR title as commit title** - GitHub may default to branch name or first commit otherwise. Pass `--title` or `commit_title` parameter.
- **Cherry-pick from base branch** - The squash commit lands on the base branch, not the head branch.
- **Resolve conflicts by accepting incoming** - When cherry-picking, conflicts usually mean accepting theirs: `git checkout --theirs <file> && git add <file> && git cherry-pick --continue`

## Example with GitHub MCP

```python
# PR #176 targets feat/refactor-two-models (PR #175's branch)
mcp__github__merge_pull_request(
    owner="org", repo="repo", pullNumber=176,
    merge_method="squash",
    commit_title="feat: add re-rank (#176)"
)
# Returns: {"sha": "abc123", ...}

# Cherry-pick to main
git fetch origin feat/refactor-two-models
git cherry-pick abc123
git push origin main
```

## Why this works

Each squash merge creates a single commit representing only that PR's changes. Cherry-picking applies just the diff—no history conflicts because main already has prerequisite changes from previous steps.

## Trade-off

PRs show as "merged into `<base-branch>`" rather than "merged into main" in GitHub UI. The commits are correctly on main.
