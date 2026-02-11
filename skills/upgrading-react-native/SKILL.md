---
name: upgrading-react-native
description: React Native upgrade workflow covering updated templates, dependencies, and common pitfalls. Use when migrating a React Native app to a newer release.
license: MIT
metadata:
  author: Callstack
  tags: react-native, upgrade, upgrade-helper, npm, changelog, cocoapods, ios, android
---

# Upgrading React Native

## Overview

Covers the full React Native upgrade workflow: template diffs via Upgrade Helper, dependency updates, Expo SDK steps, and common pitfalls.

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
