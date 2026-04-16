---
name: deployment
description: React Native mobile release and publishing workflows using Fastlane, GitHub Actions, and pre-publish quality gates. Use when preparing App Store or Play Store releases, automating mobile deployment pipelines, or validating pre-release readiness.
license: MIT
metadata:
  author: Callstack
  tags: react-native, deployment, fastlane, app-store, play-store, ci-cd, github-actions, release, e2e
---

# React Native Deployment

## Overview

Covers release-readiness checks, Fastlane automation for Android/iOS, and E2E quality gates before App Store and Play Store submission.

## When to Apply

Use this skill when:
- Preparing a production React Native release.
- Setting up Fastlane for App Store Connect and Google Play deployment.
- Designing GitHub Actions release pipelines triggered by tags or release branches.
- Enforcing E2E pre-publish checks that block failing releases.

## Typical Deployment Sequence

1. (Android prerequisite) Verify Android 16KB page-size alignment locally for the release build. If the local zipalign verification fails, stop before any Android deployment.
2. Configure GitHub Actions repository secrets for store uploads from [fastlane-deployment.md][fastlane-deployment] (do not commit raw keys to the repo).
3. Run release readiness checks from [publish-checklist.md][publish-checklist].
4. Configure lanes and CI automation from [fastlane-deployment.md][fastlane-deployment].
5. Enforce release gates with [e2e-prepublish-tests.md][e2e-prepublish-tests].

## Quick Reference

| File | Description |
|------|-------------|
| [publish-checklist.md][publish-checklist] | Android/iOS/shared release readiness and store submission checks |
| [fastlane-deployment.md][fastlane-deployment] | Fastlane + GitHub Actions deployment automation for both stores |
| [e2e-prepublish-tests.md][e2e-prepublish-tests] | E2E gate design, flaky handling, and pre-publish smoke checks |

## Problem -> Skill Mapping

| Problem | Start With |
|---------|------------|
| Need a go/no-go checklist before submission | [publish-checklist.md][publish-checklist] |
| Need Fastlane lanes for TestFlight and Play tracks | [fastlane-deployment.md][fastlane-deployment] |
| Need release to fail when E2E tests fail | [e2e-prepublish-tests.md][e2e-prepublish-tests] |
| Need secret naming and CI handling conventions | [fastlane-deployment.md][fastlane-deployment] |

[publish-checklist]: references/publish-checklist.md
[fastlane-deployment]: references/fastlane-deployment.md
[e2e-prepublish-tests]: references/e2e-prepublish-tests.md
