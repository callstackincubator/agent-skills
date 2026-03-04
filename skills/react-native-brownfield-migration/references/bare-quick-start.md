---
title: Bare React Native Quick Start
impact: CRITICAL
tags: react-native, brownfield, bare, setup, cocoapods, gradle
---

# Skill: Bare React Native Quick Start

Prepare a bare React Native project for brownfield packaging and host integration.

## Quick Command

```bash
npm install @callstack/react-native-brownfield
cd ios && pod install && cd ..
```

## When to Use

- User explicitly chooses bare React Native path
- Project directly manages native iOS/Android folders

## Prerequisites

- Bare RN app with working `ios/` and `android/`
- CocoaPods and Gradle working

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Install package
- [ ] Install pods
- [ ] Continue to bare platform packaging
```

1. Install package in RN app root.
2. Run `pod install` for iOS.
3. Continue with one platform packaging file:
   - [bare-ios-xcframework-generation.md](./bare-ios-xcframework-generation.md)
   - [bare-android-aar-generation.md](./bare-android-aar-generation.md)

## Canonical Docs

- [Quick Start](https://oss.callstack.com/react-native-brownfield/docs/getting-started/quick-start.md)
- [iOS Integration](https://oss.callstack.com/react-native-brownfield/docs/getting-started/ios.md)
- [Android Integration](https://oss.callstack.com/react-native-brownfield/docs/getting-started/android.md)

## Common Pitfalls

- Starting packaging before `pod install`
- Mixing Expo-only startup APIs into bare flow

## Related Skills

- [quick-start.md](./quick-start.md) - Shared path-selection gate
- [bare-ios-xcframework-generation.md](./bare-ios-xcframework-generation.md) - Bare iOS artifact generation
- [bare-android-aar-generation.md](./bare-android-aar-generation.md) - Bare Android artifact generation
