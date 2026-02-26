---
name: react-native-brownfield-skills
description: Provides a prescriptive React Native brownfield workflow for packaging React Native apps into XCFramework and AAR artifacts and integrating them into native iOS and Android apps. Use when setting up brownfield projects, generating XCFramework/AAR outputs, or wiring those artifacts into host native apps.
license: MIT
metadata:
  author: Callstack
  tags: react-native, brownfield, ios, android, xcframework, aar, native-integration
---

# React Native Brownfield Skills

## Overview

Prescriptive workflow for taking a React Native app and producing native-consumable artifacts:
- iOS: XCFramework
- Android: AAR

This package is optimized for agent execution with explicit command sequences, validation gates, and integration smoke tests.

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
- Creating brownfield integration pipelines for existing native apps
- Generating an iOS XCFramework from a React Native app
- Generating and publishing an Android AAR from a React Native app
- Integrating produced artifacts into iOS/Android host applications
- Running release-grade validation before handing artifacts to native teams

## Priority-Ordered Guidelines

| Priority | Category | Impact | Start File |
|----------|----------|--------|------------|
| 1 | Baseline setup and tooling sanity | CRITICAL | `quick-start` |
| 2 | iOS artifact generation | CRITICAL | `ios-xcframework-generation` |
| 3 | Android artifact generation | CRITICAL | `android-aar-generation` |
| 4 | iOS native host integration | HIGH | `ios-native-integration` |
| 5 | Android native host integration | HIGH | `android-native-integration` |

## Quick Reference

```bash
# Install and prepare
npm install @callstack/react-native-brownfield
cd ios && pod install

# Build artifacts
npx brownfield package:ios --scheme <framework_target_name> --configuration Release
npx brownfield package:android --variant Release --module-name <android_module_name>
npx brownfield publish:android --module-name <android_module_name>
```

Expected artifact locations:
- iOS package output: `.brownfield/ios/package/`
- Android local Maven coordinates: `<groupId>:<artifactId>:<version>`

## References

| File | Impact | Description |
|------|--------|-------------|
| [quick-start.md][quick-start] | CRITICAL | Baseline installation, prerequisites, and preflight checks before platform packaging |
| [ios-xcframework-generation.md][ios-xcframework-generation] | CRITICAL | Deterministic command flow for creating XCFramework artifacts from RN code |
| [android-aar-generation.md][android-aar-generation] | CRITICAL | Deterministic command flow for creating and publishing AAR artifacts |
| [ios-native-integration.md][ios-native-integration] | HIGH | Native iOS host integration of generated XCFramework artifacts |
| [android-native-integration.md][android-native-integration] | HIGH | Native Android host integration of generated AAR artifacts |

## Problem → Skill Mapping

| Problem | Start With |
|---------|------------|
| Need initial brownfield setup and installation | [quick-start.md][quick-start] |
| Need to generate XCFramework from RN app | [ios-xcframework-generation.md][ios-xcframework-generation] |
| Need to generate/publish AAR for Android | [android-aar-generation.md][android-aar-generation] |
| Need to consume XCFramework in iOS host | [ios-native-integration.md][ios-native-integration] |
| Need to consume AAR in Android host | [android-native-integration.md][android-native-integration] |
| Need full end-to-end iOS path | [quick-start.md][quick-start] -> [ios-xcframework-generation.md][ios-xcframework-generation] -> [ios-native-integration.md][ios-native-integration] |
| Need full end-to-end Android path | [quick-start.md][quick-start] -> [android-aar-generation.md][android-aar-generation] -> [android-native-integration.md][android-native-integration] |

[quick-start]: references/quick-start.md
[ios-xcframework-generation]: references/ios-xcframework-generation.md
[android-aar-generation]: references/android-aar-generation.md
[ios-native-integration]: references/ios-native-integration.md
[android-native-integration]: references/android-native-integration.md
