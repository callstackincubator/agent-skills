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

## Quick Reference

| File                                          | Description                                              |
| --------------------------------------------- | -------------------------------------------------------- |
| [stacked-pr-workflow.md][stacked-pr-workflow] | Merge stacked PRs into main as individual squash commits |

## Problem → Skill Mapping

| Problem                   | Start With                                    |
| ------------------------- | --------------------------------------------- |
| Merge stacked PRs cleanly | [stacked-pr-workflow.md][stacked-pr-workflow] |

[stacked-pr-workflow]: references/stacked-pr-workflow.md
