---
name: github
description: GitHub patterns using gh CLI and GitHub Actions for pull requests, stacked PRs, repository automation, and React Native CI build artifacts. Use when working with GitHub PR workflows or setting up/downloading GitHub Actions artifacts.
license: MIT
metadata:
  author: Callstack
  tags: github, gh-cli, pull-request, stacked-pr, github-actions, ci, artifacts, react-native
---

# GitHub Patterns

## Tools

- Use `gh` CLI for GitHub operations and artifact retrieval.
- Use GitHub Actions templates in `references/` for CI workflows.

## Quick Commands

```bash
# Create a PR from the current branch
gh pr create --title "feat: add feature" --body "Description"

# Squash-merge a PR
gh pr merge <PR_NUMBER> --squash --title "feat: add feature (#<PR_NUMBER>)"

# View PR status and checks
gh pr status
gh pr checks <PR_NUMBER>

# Download workflow artifacts
gh run list --workflow "RN Cloud Build" --limit 10
gh run download <run-id> -n <artifact-name> -D ./artifacts
```

## Stacked PR Workflow Summary

When merging a chain of stacked PRs (each targeting the previous branch):

1. **Merge the first PR** into main via squash merge.
2. **For each subsequent PR**: rebase onto main, update base to main, then squash merge.
3. **On conflicts**: stop and ask the user to resolve manually.

```bash
# Rebase next PR's branch onto main, excluding already-merged commits
git rebase --onto origin/main <old-base-branch> <next-branch>
git push --force-with-lease origin <next-branch>
gh pr edit <N> --base main
gh pr merge <N> --squash --title "<PR title> (#N)"
```

See [stacked-pr-workflow.md][stacked-pr-workflow] for full step-by-step details.

## Quick Reference

| File | Description |
| --- | --- |
| [stacked-pr-workflow.md][stacked-pr-workflow] | Merge stacked PRs into main as individual squash commits |
| [gha-ios-composite-action.md][gha-ios-composite-action] | iOS simulator composite action template for React Native |
| [gha-android-composite-action.md][gha-android-composite-action] | Android emulator APK composite action template for React Native |
| [gha-workflow-and-downloads.md][gha-workflow-and-downloads] | End-to-end GitHub Actions workflow + artifact download patterns |

## Problem -> Skill Mapping

| Problem | Start With |
| --- | --- |
| Merge stacked PRs cleanly | [stacked-pr-workflow.md][stacked-pr-workflow] |
| Build React Native iOS simulator artifacts in GitHub Actions | [gha-ios-composite-action.md][gha-ios-composite-action] |
| Build React Native Android emulator APKs in GitHub Actions | [gha-android-composite-action.md][gha-android-composite-action] |
| Download artifacts with `gh` or API | [gha-workflow-and-downloads.md][gha-workflow-and-downloads] |

[stacked-pr-workflow]: references/stacked-pr-workflow.md
[gha-ios-composite-action]: references/gha-ios-composite-action.md
[gha-android-composite-action]: references/gha-android-composite-action.md
[gha-workflow-and-downloads]: references/gha-workflow-and-downloads.md
