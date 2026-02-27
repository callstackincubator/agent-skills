---
name: react-native-brownfield-skills
description: Provides a prescriptive React Native brownfield workflow with strict path routing for Expo and bare React Native projects. Use when setting up brownfield projects, generating XCFramework/AAR outputs, or wiring those artifacts into host native apps and choose only the Expo or bare path based on user intent.
license: MIT
metadata:
  author: Callstack
  tags: react-native, brownfield, expo, bare, ios, android, xcframework, aar, native-integration
---

# React Native Brownfield Skills

## Overview

Prescriptive workflow for taking a React Native app and producing native-consumable artifacts, with mutually exclusive tracks:
- Expo track
- Bare React Native track

This package is optimized for agent execution with explicit command sequences, validation gates, and integration smoke tests.

## Path Selection Gate (Must Run First)

Before selecting any reference file, classify the user request:

1. Select **Expo path only** if prompt mentions terms like:
   - `expo`, `managed workflow`, `expo prebuild`, `expo modules`
   - `create new expo app`, `npx create-expo-app`, `new expo project`
   - `new RN app` + `native iOS app integration` + `prefer expo`
2. Select **bare React Native path only** if prompt mentions terms like:
   - `react-native init`, direct native folder ownership, `xcframework`, `RN`, `bare, `aar`, native host app integration
3. If intent is ambiguous or contains both paths:
   - ask one disambiguation question first
4. Do not mix steps across Expo and bare paths in one response unless user explicitly asks for migration or comparison.

## Skill Format

Each reference file follows a strict execution format:
- Quick Command
- When to Use
- Prerequisites
- Step-by-Step Instructions
- Common Pitfalls
- Related Skills

Use the checklists exactly as written before moving to the next phase.

## When to Apply

Reference this package when:
- Creating brownfield integration pipelines for Expo or bare React Native apps
- Generating an iOS XCFramework from a React Native app
- Generating and publishing an Android AAR from a React Native app
- Integrating produced artifacts into iOS/Android host applications
- Running release-grade validation before handing artifacts to native teams

## Priority-Ordered Guidelines

| Priority | Category | Impact | Start File |
|----------|----------|--------|------------|
| 1 | Path selection and baseline sanity | CRITICAL | `quick-start` |
| 2 | Expo quick path and integration | CRITICAL | `expo-quick-start` |
| 3 | Bare RN quick path and packaging | CRITICAL | `bare-quick-start` |
| 4 | Expo platform integration | HIGH | `expo-ios-integration` / `expo-android-integration` |
| 5 | Bare RN platform packaging/integration | HIGH | `bare-ios-xcframework-generation` / `bare-android-aar-generation` |

## Quick Reference

```bash
# Shared setup
npm install @callstack/react-native-brownfield
```

Then route by path:
- Expo: start at `expo-quick-start`, then `expo-ios-integration` or `expo-android-integration`
- Bare: start at `bare-quick-start`, then bare platform-specific generation/integration files

## References

| File | Impact | Description |
|------|--------|-------------|
| [quick-start.md][quick-start] | CRITICAL | Shared preflight and mandatory Expo/bare path decision gate |
| [expo-create-app.md][expo-create-app] | CRITICAL | Scaffold a new Expo app for brownfield workflows before Expo integration |
| [expo-quick-start.md][expo-quick-start] | CRITICAL | Expo setup and plugin configuration before platform integration |
| [expo-ios-integration.md][expo-ios-integration] | HIGH | Expo iOS XCFramework packaging and host startup integration |
| [expo-android-integration.md][expo-android-integration] | HIGH | Expo Android AAR packaging, publish, and host integration |
| [bare-quick-start.md][bare-quick-start] | CRITICAL | Bare React Native setup and baseline readiness |
| [bare-ios-xcframework-generation.md][bare-ios-xcframework-generation] | CRITICAL | Bare iOS XCFramework artifact generation |
| [bare-android-aar-generation.md][bare-android-aar-generation] | CRITICAL | Bare Android AAR packaging and publishing |
| [bare-ios-native-integration.md][bare-ios-native-integration] | HIGH | Bare iOS host integration of generated XCFramework artifacts |
| [bare-android-native-integration.md][bare-android-native-integration] | HIGH | Bare Android host integration of generated AAR artifacts |

## Problem → Skill Mapping

| Problem | Start With |
|---------|------------|
| Need path decision first | [quick-start.md][quick-start] |
| Need to create a new Expo app for brownfield | [expo-create-app.md][expo-create-app] |
| Integrate RN in native iOS by creating a new Expo app | [expo-create-app.md][expo-create-app] -> [expo-quick-start.md][expo-quick-start] -> [expo-ios-integration.md][expo-ios-integration] |
| Creating new RN app and prefer Expo for native iOS integration | [expo-create-app.md][expo-create-app] -> [expo-quick-start.md][expo-quick-start] -> [expo-ios-integration.md][expo-ios-integration] |
| Need Expo brownfield setup and plugin wiring | [expo-quick-start.md][expo-quick-start] |
| Need Expo Android brownfield integration | [expo-android-integration.md][expo-android-integration] |
| Need Expo iOS brownfield integration | [expo-ios-integration.md][expo-ios-integration] |
| Need bare RN baseline setup | [bare-quick-start.md][bare-quick-start] |
| Need bare RN iOS XCFramework generation | [bare-ios-xcframework-generation.md][bare-ios-xcframework-generation] |
| Need bare RN Android AAR generation/publish | [bare-android-aar-generation.md][bare-android-aar-generation] |
| Need bare RN iOS host integration | [bare-ios-native-integration.md][bare-ios-native-integration] |
| Need bare RN Android host integration | [bare-android-native-integration.md][bare-android-native-integration] |
| Need full Expo iOS path | [expo-quick-start.md][expo-quick-start] -> [expo-ios-integration.md][expo-ios-integration] |
| Need full Expo Android path | [expo-quick-start.md][expo-quick-start] -> [expo-android-integration.md][expo-android-integration] |
| Need full bare iOS path | [bare-quick-start.md][bare-quick-start] -> [bare-ios-xcframework-generation.md][bare-ios-xcframework-generation] -> [bare-ios-native-integration.md][bare-ios-native-integration] |
| Need full bare Android path | [bare-quick-start.md][bare-quick-start] -> [bare-android-aar-generation.md][bare-android-aar-generation] -> [bare-android-native-integration.md][bare-android-native-integration] |

[quick-start]: references/quick-start.md
[expo-create-app]: references/expo-create-app.md
[expo-quick-start]: references/expo-quick-start.md
[expo-ios-integration]: references/expo-ios-integration.md
[expo-android-integration]: references/expo-android-integration.md
[bare-quick-start]: references/bare-quick-start.md
[bare-ios-xcframework-generation]: references/bare-ios-xcframework-generation.md
[bare-android-aar-generation]: references/bare-android-aar-generation.md
[bare-ios-native-integration]: references/bare-ios-native-integration.md
[bare-android-native-integration]: references/bare-android-native-integration.md
