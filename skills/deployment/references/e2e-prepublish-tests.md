---
title: E2E Pre-Publish Release Gates
impact: HIGH
tags: react-native, e2e, detox, maestro, playwright, release-gates, ci
---

# Skill: E2E Pre-Publish Release Gates

Use this workflow to enforce automated quality gates before store submission.

## Quick Pattern

- Run E2E against release-like builds, not only debug builds.
- Fail deployment jobs when required E2E suite fails.
- Keep a minimal smoke suite for every release candidate.
- Quarantine flaky cases with owner and expiry date.

## When to Use

- Before invoking production Fastlane lanes.
- When stabilizing CI-based release quality gates.
- When selecting tooling for cross-platform pre-publish checks.

## Tool Selection Guide

| Tool | Best For | Notes |
|---|---|---|
| Detox | React Native app-level E2E on simulators/emulators | Strong JS integration, good for CI gating |
| Maestro | Fast authoring of mobile UI flows | Good for smoke and regression flows |
| Playwright | Web or hybrid webview-heavy flows | Not a primary native mobile E2E tool |

## CI Execution Targets

- Android emulator (API level aligned to supported production baseline).
- iOS simulator (latest stable plus one fallback runtime if needed).
- Release-equivalent build config to catch signing/permission/runtime differences.

## Required Release Gates

Define mandatory checks:
1. Lint and unit tests pass.
2. E2E smoke suite passes on Android and iOS.
3. Crash-free launch and critical-path user flow pass.
4. Fastlane release lanes run only if all gates succeed.

## GitHub Actions Gate Example

```yaml
name: Prepublish Gates

on:
  pull_request:
    branches: [main]
  push:
    tags:
      - "v*.*.*"

jobs:
  quality-gates:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Unit tests
        run: npm test -- --ci
      - name: Detox smoke
        run: npm run e2e:detox:smoke
      - name: Maestro smoke
        run: npm run e2e:maestro:smoke

  release:
    needs: quality-gates
    if: startsWith(github.ref, 'refs/tags/v')
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy after gates
        run: bundle exec fastlane ios ios_beta && bundle exec fastlane android android_internal
```

## Smoke Checklist (Minimum)

- First launch and authentication flow.
- Main navigation tabs/routes open successfully.
- One critical transaction path succeeds.
- Foreground/background transition is stable.
- Logout/session renewal works.

## Flaky Test Handling Policy

- Allow at most one automatic rerun for known flaky group.
- Track flaky tests in a quarantine list with ticket owner.
- Set expiry date for quarantine; expired flaky tests become blockers.
- Never bypass smoke-suite failures for production submission.

## Common Pitfalls

- Running E2E only on debug builds.
- Treating quarantined tests as permanently ignored.
- Releasing from branches that skip required checks.
- Missing parity between local and CI simulator/emulator configs.

## Related Skills

- [publish-checklist.md](publish-checklist.md)
- [fastlane-deployment.md](fastlane-deployment.md)
