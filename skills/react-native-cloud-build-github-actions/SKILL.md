---
name: react-native-cloud-build-github-actions
description: Establishes GitHub Actions workflows for React Native iOS and Android cloud builds using react-native-community/cli and uploads downloadable artifacts. Use when setting up CI build pipelines, PR installables, or artifact download automation via gh CLI and GitHub REST API.
license: MIT
metadata:
  author: Callstack
  tags: react-native, github-actions, ci, ios, android, artifacts, gh-cli
---

# React Native Cloud Build (GitHub Actions)

## Overview

Reusable GitHub Actions patterns to build React Native apps in the cloud and publish artifacts that can be fetched via `gh` CLI or GitHub API.

This skill recreates the architecture of Rock iOS/Android cloud actions, but replaces `rock` commands with `react-native-community/cli`-compatible steps (`npx react-native config`, `xcodebuild`, and `./gradlew`).

## When to Apply

Use this skill when:
- Creating CI workflows that build both iOS and Android React Native apps.
- Uploading installable artifacts from PRs or manual dispatch runs.
- Replacing local-only mobile builds with downloadable CI artifacts.
- Needing stable artifact IDs/names for scripted retrieval with `gh` or REST API.

## Quick Reference

1. Add composite actions from [gha-ios-composite-action.md][gha-ios-composite-action] and [gha-android-composite-action.md][gha-android-composite-action].
2. Wire them into `.github/workflows/rn-cloud-build.yml` from [gha-workflow-and-downloads.md][gha-workflow-and-downloads].
3. Upload with `actions/upload-artifact@v4` and capture `artifact-id` output.
4. Download with `gh run download` or `GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}`.

## References

| File | Description |
|------|-------------|
| [gha-ios-composite-action.md][gha-ios-composite-action] | Composite `action.yml` for iOS simulator/device builds and artifact upload |
| [gha-android-composite-action.md][gha-android-composite-action] | Composite `action.yml` for Android APK/AAB builds and artifact upload |
| [gha-workflow-and-downloads.md][gha-workflow-and-downloads] | End-to-end workflow wiring plus `gh` and REST download commands |

## Problem → Skill Mapping

| Problem | Start With |
|---------|------------|
| Need CI `.app`/`.ipa` from React Native iOS | [gha-ios-composite-action.md][gha-ios-composite-action] |
| Need CI `.apk`/`.aab` from React Native Android | [gha-android-composite-action.md][gha-android-composite-action] |
| Need one workflow to trigger both platforms | [gha-workflow-and-downloads.md][gha-workflow-and-downloads] |
| Need scripted artifact download | [gha-workflow-and-downloads.md][gha-workflow-and-downloads] |

## Source Inspiration

- [callstackincubator/ios/action.yml](https://github.com/callstackincubator/ios/blob/main/action.yml)
- [callstackincubator/android/action.yml](https://github.com/callstackincubator/android/blob/main/action.yml)

[gha-ios-composite-action]: references/gha-ios-composite-action.md
[gha-android-composite-action]: references/gha-android-composite-action.md
[gha-workflow-and-downloads]: references/gha-workflow-and-downloads.md
