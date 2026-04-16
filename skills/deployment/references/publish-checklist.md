---
title: React Native Publish Checklist
impact: CRITICAL
tags: react-native, release, play-store, app-store, checklist, signing, metadata
---

# Skill: React Native Publish Checklist

Use this checklist to decide go/no-go for App Store and Play Store submission.

## Quick Reference

- Treat missing signing or provisioning as blockers.
- Treat missing production analytics and crash reporting as blockers.
- Treat incomplete store metadata as blockers for production rollout.
- Do not publish if E2E smoke fails on release builds.

## When to Use

- Releasing to Play internal/closed/open/production tracks.
- Releasing to TestFlight or App Store production.
- Auditing release readiness before invoking Fastlane lanes.

## Blockers vs Warnings

| Type | Rule | Action |
|------|------|--------|
| Blocker | Missing keystore or invalid Play service account auth | Stop release |
| Blocker | Missing iOS provisioning/profile or signing mismatch | Stop release |
| Blocker | Production API endpoint or env is not validated | Stop release |
| Blocker | Crash reporter or analytics disabled in release build | Stop release |
| Blocker | Android 16KB alignment verification fails for release build | Stop release |
| Blocker | Version/build values unchanged from last release | Stop release |
| Warning | Optional marketing metadata refinement | Continue with owner approval |

## Android Readiness

- Confirm `applicationId` matches Play Console package.
- Verify Android 16KB page-size alignment for the release build locally before Play submission (zipalign check). See [native-android-16kb-alignment.md](../../react-native-best-practices/references/native-android-16kb-alignment.md).
- Confirm signing config resolves to valid upload key.
- Confirm `versionCode` increments and `versionName` is semver-aligned.
- Confirm R8/ProGuard rules preserve required SDK classes.
- Confirm release permission set is minimal and justified.
- Confirm Play listing assets and privacy policy URL are complete.

## iOS Readiness

- Confirm bundle identifier matches App Store Connect app.
- Confirm certificate and provisioning profile map to release target.
- Confirm marketing version and build number increment.
- Confirm entitlements align with enabled capabilities.
- Confirm privacy manifest/privacy labels are complete.
- Confirm App Store metadata, screenshots, and review info are complete.

## Shared Readiness

- Confirm `.env.production` values resolve in release builds.
- Confirm API base URL points to production backend only.
- Confirm feature flags and remote config defaults are production-safe.
- Confirm Sentry/Crashlytics release upload is enabled.
- Confirm release notes/changelog are prepared.
- Confirm rollback owner and communication channel are assigned.
- Confirm store upload credentials are available via GitHub Actions Secrets (and never committed to the repo). See [fastlane-deployment.md](fastlane-deployment.md) for expected secret names and decoding steps.

## Pre-Submit Smoke Checklist

Run release smoke on real device or store-like build:
- App launch and login.
- Primary navigation flow.
- Purchase/subscription flow (if applicable).
- Push notification registration and open handling.
- Crash-free startup and no redboxes.

## Rollback Readiness

- Keep previous production binary and metadata references.
- Keep hotfix branch naming convention (`hotfix/x.y.z+1`).
- Define rollback lane owner and response SLA.

## Related Skills

- [fastlane-deployment.md](fastlane-deployment.md)
- [e2e-prepublish-tests.md](e2e-prepublish-tests.md)
