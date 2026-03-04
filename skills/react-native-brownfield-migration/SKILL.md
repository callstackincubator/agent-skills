---
name: react-native-brownfield-migration
description: Provides an incremental adoption strategy to migrate native iOS or Android apps to React Native or Expo using @callstack/react-native-brownfield for initial setup. Use when planning migration steps, packaging XCFramework/AAR artifacts, and integrating them into host apps.
license: MIT
metadata:
  author: Callstack
  tags: react-native, brownfield, expo, bare, ios, android, xcframework, aar, native-integration
---

# Migrating to React Native

## Overview

Prescriptive workflow for incremental adoption of React Native in existing native apps using `@callstack/react-native-brownfield`, from initial setup through phased host integration.

- Expo track
- Bare React Native track

Use one track per task unless the user explicitly asks for migration or comparison.

## Migration Strategy

Use this strategy for brownfield migration planning and execution:

1. Assess app state and select Expo or bare path.
2. Perform initial setup with `@callstack/react-native-brownfield`.
3. Package RN artifacts (`XCFramework`/`AAR`) from the RN source app.
4. Integrate one RN surface into the host app and validate startup/runtime.
5. Repeat integration by feature/screen for incremental rollout.

## Agent Guardrails (Global)

Apply these rules across all reference files:

1. Select one path first (Expo or bare) and do not mix steps.
2. Use placeholders from the docs (`<framework_target_name>`, `<android_module_name>`, `<registered_module_name>`) and resolve from project files.
3. Validate each packaging command before moving to host integration.
4. Prefer official docs for long platform snippets and CLI option details.
5. Keep host apps isolated from direct React Native APIs when possible (facade approach).

## Canonical Docs

- [Quick Start](https://oss.callstack.com/react-native-brownfield/docs/getting-started/quick-start.md)
- [Expo Integration](https://oss.callstack.com/react-native-brownfield/docs/getting-started/expo.md)
- [iOS Integration](https://oss.callstack.com/react-native-brownfield/docs/getting-started/ios.md)
- [Android Integration](https://oss.callstack.com/react-native-brownfield/docs/getting-started/android.md)
- [Brownfield CLI](https://oss.callstack.com/react-native-brownfield/docs/cli/brownfield.md)
- [Guidelines](https://oss.callstack.com/react-native-brownfield/docs/guides/guidelines.md)
- [Troubleshooting](https://oss.callstack.com/react-native-brownfield/docs/guides/troubleshooting.md)

## Path Selection Gate (Must Run First)

Before selecting any reference file, classify the project:

1. If no React Native app exists yet, use Expo creation path:
   - [expo-create-app.md][expo-create-app] -> [expo-quick-start.md][expo-quick-start]
2. If React Native app exists, inspect `package.json` and `app.json`:
   - Expo if `expo` is present or Expo plugin workflow is requested.
   - Bare RN if native folders and direct RN CLI workflow are used without Expo path requirements.
3. If still unclear, ask one disambiguation question.
4. Continue with exactly one path.

## When to Apply

Reference this package when:

- Planning incremental migration from native-only apps to React Native or Expo
- Creating brownfield integration flows for Expo or bare React Native projects
- Performing initial setup with `@callstack/react-native-brownfield`
- Generating iOS XCFramework artifacts from a React Native app
- Generating and publishing Android AAR artifacts from a React Native app
- Integrating generated artifacts into host iOS/Android apps

## Quick Reference

| File | Description |
|------|-------------|
| [quick-start.md][quick-start] | Shared preflight and mandatory path-selection gate |
| [expo-create-app.md][expo-create-app] | Scaffold a new Expo app before Expo brownfield setup |
| [expo-quick-start.md][expo-quick-start] | Expo plugin setup and packaging readiness |
| [expo-ios-integration.md][expo-ios-integration] | Expo iOS packaging and host startup integration |
| [expo-android-integration.md][expo-android-integration] | Expo Android packaging, publish, and host integration |
| [bare-quick-start.md][bare-quick-start] | Bare React Native baseline setup |
| [bare-ios-xcframework-generation.md][bare-ios-xcframework-generation] | Bare iOS XCFramework generation |
| [bare-android-aar-generation.md][bare-android-aar-generation] | Bare Android AAR generation and publish |
| [bare-ios-native-integration.md][bare-ios-native-integration] | Bare iOS host integration |
| [bare-android-native-integration.md][bare-android-native-integration] | Bare Android host integration |

## Problem -> Skill Mapping

| Problem | Start With |
|---------|------------|
| Need path decision first | [quick-start.md][quick-start] |
| Need to create a new Expo app for brownfield | [expo-create-app.md][expo-create-app] |
| Need Expo brownfield setup and plugin wiring | [expo-quick-start.md][expo-quick-start] |
| Need Expo iOS brownfield integration | [expo-ios-integration.md][expo-ios-integration] |
| Need Expo Android brownfield integration | [expo-android-integration.md][expo-android-integration] |
| Need bare RN baseline setup | [bare-quick-start.md][bare-quick-start] |
| Need bare RN iOS XCFramework generation | [bare-ios-xcframework-generation.md][bare-ios-xcframework-generation] |
| Need bare RN Android AAR generation/publish | [bare-android-aar-generation.md][bare-android-aar-generation] |
| Need bare RN iOS host integration | [bare-ios-native-integration.md][bare-ios-native-integration] |
| Need bare RN Android host integration | [bare-android-native-integration.md][bare-android-native-integration] |

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
