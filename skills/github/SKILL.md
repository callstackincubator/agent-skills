---
name: github
description: GitHub patterns using gh CLI for pull requests, stacked PRs, code review, branching strategies, and repository automation. Use when working with GitHub PRs, merging strategies, or repository management tasks.
license: MIT
metadata:
  author: Callstack
  tags: github, gh-cli, pull-request, stacked-pr, squash, rebase
---

# GitHub Patterns

## Tools

Use `gh` CLI for all GitHub operations. Prefer CLI over GitHub MCP servers for lower context usage.

## Quick Commands

```bash
# Create a PR from the current branch
gh pr create --title "feat: add feature" --body "Description"

# Squash-merge a PR
gh pr merge <PR_NUMBER> --squash --title "feat: add feature (#<PR_NUMBER>)"

# View PR status and checks
gh pr status
gh pr checks <PR_NUMBER>
```

## Stacked PR Workflow Summary

When merging a chain of stacked PRs (each targeting the previous branch):

1. **Merge the first PR** into main via squash merge
2. **For each subsequent PR**: rebase onto main, update base to main, then squash merge
3. **On conflicts**: stop and ask the user to resolve manually

```bash
# Rebase next PR's branch onto main, excluding already-merged commits
git rebase --onto origin/main <old-base-branch> <next-branch>
git push --force-with-lease origin <next-branch>
gh pr edit <N> --base main
gh pr merge <N> --squash --title "<PR title> (#N)"
```

See [stacked-pr-workflow.md][stacked-pr-workflow] for full step-by-step details.

## Quick Reference

| File                                          | Description                                              |
| --------------------------------------------- | -------------------------------------------------------- |
| [stacked-pr-workflow.md][stacked-pr-workflow] | Merge stacked PRs into main as individual squash commits |

## Problem → Skill Mapping

| Problem                   | Start With                                    |
| ------------------------- | --------------------------------------------- |
| Merge stacked PRs cleanly | [stacked-pr-workflow.md][stacked-pr-workflow] |

[stacked-pr-workflow]: references/stacked-pr-workflow.md
