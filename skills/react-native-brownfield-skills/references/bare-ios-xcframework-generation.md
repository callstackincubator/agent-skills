---
title: Bare iOS XCFramework Generation
impact: CRITICAL
tags: react-native, brownfield, bare, ios, xcframework, xcode
---

# Skill: Bare iOS XCFramework Generation

Package a bare React Native app into XCFramework artifacts for native iOS host consumption.

## Quick Command

```bash
npx brownfield package:ios --scheme <framework_target_name> --configuration Release
ls -la .brownfield/ios/package
```

## When to Use

- Bare RN iOS artifact generation is required
- Rebuilding iOS artifacts after JS/native dependency changes
- Preparing outputs for native iOS host integration

## Prerequisites

- `bare-quick-start` completed
- Framework target exists in `ios/.xcworkspace`
- Podfile framework target inheritance configured

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Verify framework target and Podfile wiring
- [ ] Verify bundle run script in framework target
- [ ] Package iOS framework
- [ ] Validate expected XCFramework outputs
```

1. Confirm framework target setup and Podfile inheritance.
2. Install pods after any Podfile updates:

```bash
cd ios && pod install && cd ..
```

3. Build XCFramework:

```bash
npx brownfield package:ios --scheme <framework_target_name> --configuration Release
```

4. Validate artifacts in `.brownfield/ios/package/`:
   - `<framework_target_name>.xcframework`
   - `ReactBrownfield.xcframework`
   - `hermesvm.xcframework`

## Common Pitfalls

- Using app target as package scheme instead of dedicated framework target
- Missing bundle script phase on framework target
- Skipping Podfile inheritance for framework target

## Related Skills

- [bare-quick-start.md](./bare-quick-start.md) - Bare setup prerequisites
- [bare-ios-native-integration.md](./bare-ios-native-integration.md) - Bare iOS host integration
- [expo-ios-integration.md](./expo-ios-integration.md) - Expo iOS path
