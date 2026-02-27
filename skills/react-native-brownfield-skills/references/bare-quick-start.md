---
title: Bare React Native Quick Start
impact: CRITICAL
tags: react-native, brownfield, bare, setup, cocoapods, gradle
---

# Skill: Bare React Native Quick Start

Prepare a bare React Native project for brownfield packaging and host integration workflows.

## Quick Command

```bash
npm install @callstack/react-native-brownfield
cd ios && pod install && cd ..
```

## When to Use

- User explicitly asks for bare React Native brownfield path
- Native iOS/Android folders are directly managed in the app repo
- Preparing for XCFramework or AAR generation steps

## Prerequisites

- Bare React Native app with working `ios` and `android` folders
- CocoaPods available for iOS setup
- Gradle wrapper working for Android setup

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Install brownfield package
- [ ] Install iOS pods
- [ ] Confirm bare path remains selected
```

1. Install package:

```bash
npm install @callstack/react-native-brownfield
```

2. Install iOS dependencies:

```bash
cd ios && pod install && cd ..
```

3. Continue only with bare references:
   - iOS generation: `bare-ios-xcframework-generation.md`
   - Android generation: `bare-android-aar-generation.md`

## Common Pitfalls

- Starting packaging before `pod install`
- Mixing Expo-specific startup APIs into bare path
- Running platform integration before artifact generation

## Related Skills

- [quick-start.md](./quick-start.md) - Shared setup and path gate
- [bare-ios-xcframework-generation.md](./bare-ios-xcframework-generation.md) - Bare iOS artifact generation
- [bare-android-aar-generation.md](./bare-android-aar-generation.md) - Bare Android artifact generation
- [expo-quick-start.md](./expo-quick-start.md) - Expo path entry
