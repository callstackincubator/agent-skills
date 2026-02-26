---
title: Brownfield Quick Start
impact: CRITICAL
tags: react-native, brownfield, setup, prerequisites, package-ios, package-android
---

# Skill: Brownfield Quick Start

Set up a React Native app for brownfield packaging and verify baseline readiness before generating native artifacts.

## Quick Command

```bash
npm install @callstack/react-native-brownfield
cd ios && pod install && cd ..
npx brownfield package:ios --scheme <framework_target_name> --configuration Release
npx brownfield package:android --variant Release --module-name <android_module_name>
```

## When to Use

- Starting brownfield enablement in an existing React Native app
- Preparing a project before XCFramework or AAR generation
- Verifying toolchain readiness and package command availability

## Prerequisites

- Node.js, package manager, and React Native project already bootstrapped
- Xcode and CocoaPods available for iOS flows
- Android Studio and Gradle wrapper working for Android flows
- `@callstack/react-native-brownfield` installed in `package.json`

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Install package and dependencies
- [ ] Verify iOS dependency install
- [ ] Verify Android project can build
- [ ] Verify brownfield CLI commands resolve
```

1. Install brownfield package in the React Native app root.

```bash
npm install @callstack/react-native-brownfield
```

2. Install iOS pods.

```bash
cd ios && pod install && cd ..
```

3. Validate Android baseline build.

```bash
cd android && ./gradlew assembleRelease && cd ..
```

4. Confirm expected outcomes before platform-specific packaging:
   - iOS pod install succeeds without unresolved specs.
   - Android release assembly completes.

## Stop Conditions

Proceed only if all are true:
- `npm install` exits with code `0`
- `pod install` exits with code `0`
- `./gradlew assembleRelease` exits with code `0`

## If Failed

- If `pod install` fails, run:
  - `cd ios && pod repo update && pod install && cd ..`
- If Android build fails, run:
  - `cd android && ./gradlew clean assembleRelease && cd ..`
- Do not continue to platform packaging until all stop conditions pass

## Common Pitfalls

- Running packaging commands before `pod install`
- Using mismatched React Native/Hermes dependency versions across Android modules
- Skipping Android release build preflight and discovering failures during packaging

## Related Skills

- [ios-xcframework-generation.md](./ios-xcframework-generation.md) - Generate iOS XCFramework artifact
- [android-aar-generation.md](./android-aar-generation.md) - Generate and publish Android AAR artifact
- [ios-native-integration.md](./ios-native-integration.md) - Integrate XCFramework into host iOS app
- [android-native-integration.md](./android-native-integration.md) - Integrate AAR into host Android app
