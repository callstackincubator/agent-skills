---
name: upgrading-react-native
description: Upgrades React Native apps to newer versions by applying rn-diff-purge template diffs, updating package.json dependencies, migrating native iOS and Android configuration, resolving CocoaPods and Gradle changes, and handling breaking API updates. Use when upgrading React Native, bumping RN version, updating from RN 0.x to 0.y, or migrating Expo SDK alongside a React Native upgrade.
license: MIT
metadata:
  author: Callstack
  tags: react-native, upgrade, upgrade-helper, npm, changelog, cocoapods, ios, android
---

# Upgrading React Native

## Overview

Covers the full React Native upgrade workflow: template diffs via Upgrade Helper, dependency updates, Expo SDK steps, and common pitfalls.

## Typical Upgrade Sequence

1. **Route**: Choose the right upgrade path via [upgrading-react-native.md][upgrading-react-native]
2. **Diff**: Fetch the canonical template diff using Upgrade Helper via [upgrade-helper-core.md][upgrade-helper-core]
3. **Dependencies**: Assess and update third-party packages via [upgrading-dependencies.md][upgrading-dependencies]
4. **React**: Align React version if upgraded via [react.md][react]
5. **Expo** (if applicable): Apply Expo SDK layer via [expo-sdk-upgrade.md][expo-sdk-upgrade]
6. **Verify**: Run post-upgrade checks via [upgrade-verification.md][upgrade-verification]

```bash
# Quick start: detect current version and fetch diff
npm pkg get dependencies.react-native --prefix "$APP_DIR"
npm view react-native dist-tags.latest

# Example: upgrading from 0.76.9 to 0.78.2
# 1. Fetch the template diff
curl -L -f -o /tmp/rn-diff.diff \
  "https://raw.githubusercontent.com/react-native-community/rn-diff-purge/diffs/diffs/0.76.9..0.78.2.diff" \
  && echo "Diff downloaded OK" || echo "ERROR: diff not found, check versions"
# 2. Review changed files
grep -n "^diff --git" /tmp/rn-diff.diff
# 3. Update package.json, apply native changes, then install + rebuild
npm install --prefix "$APP_DIR"
cd "$APP_DIR/ios" && pod install
# 4. Validate: both platforms must build successfully
npx react-native build-android --mode debug --no-packager
xcodebuild -workspace "$APP_DIR/ios/App.xcworkspace" -scheme App -sdk iphonesimulator build
```

## When to Apply

Reference these guidelines when:
- Moving a React Native app to a newer version
- Reconciling native config changes from Upgrade Helper
- Validating release notes for breaking changes

## Quick Reference

| File | Description |
|------|-------------|
| [upgrading-react-native.md][upgrading-react-native] | Router: choose the right upgrade path |
| [upgrade-helper-core.md][upgrade-helper-core] | Core Upgrade Helper workflow and reliability gates |
| [upgrading-dependencies.md][upgrading-dependencies] | Dependency compatibility checks and migration planning |
| [react.md][react] | React and React 19 upgrade alignment rules |
| [expo-sdk-upgrade.md][expo-sdk-upgrade] | Expo SDK-specific upgrade layer (conditional) |
| [upgrade-verification.md][upgrade-verification] | Manual post-upgrade verification checklist |
| [monorepo-singlerepo-targeting.md][monorepo-singlerepo-targeting] | Monorepo and single-repo app targeting and command scoping |

## Problem → Skill Mapping

| Problem | Start With |
|---------|------------|
| Need to upgrade React Native | [upgrade-helper-core.md][upgrade-helper-core] |
| Need dependency risk triage and migration options | [upgrading-dependencies.md][upgrading-dependencies] |
| Need React/React 19 package alignment | [react.md][react] |
| Need workflow routing first | [upgrading-react-native.md][upgrading-react-native] |
| Need Expo SDK-specific steps | [expo-sdk-upgrade.md][expo-sdk-upgrade] |
| Need manual regression validation | [upgrade-verification.md][upgrade-verification] |
| Need repo/app command scoping | [monorepo-singlerepo-targeting.md][monorepo-singlerepo-targeting] |

[upgrading-react-native]: references/upgrading-react-native.md
[upgrade-helper-core]: references/upgrade-helper-core.md
[upgrading-dependencies]: references/upgrading-dependencies.md
[react]: references/react.md
[expo-sdk-upgrade]: references/expo-sdk-upgrade.md
[upgrade-verification]: references/upgrade-verification.md
[monorepo-singlerepo-targeting]: references/monorepo-singlerepo-targeting.md
