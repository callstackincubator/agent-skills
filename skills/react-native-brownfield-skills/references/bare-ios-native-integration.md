---
title: Bare iOS Native Integration
impact: HIGH
tags: react-native, brownfield, bare, ios, swiftui, appdelegate
---

# Skill: Bare iOS Native Integration

Integrate generated bare RN XCFramework artifacts into a native iOS host app and verify runtime initialization.

## Quick Command

```text
Import <framework_target_name>, set ReactNativeBrownfield.shared.bundle,
call startReactNative(...), then present ReactNativeView/ReactNativeViewController.
```

## When to Use

- Bare RN iOS host app must consume generated XCFramework artifacts
- App startup sequence needs React Native bootstrap wiring
- Verifying Debug and Release host behavior

## Prerequisites

- `bare-ios-xcframework-generation` completed
- Host app opens and builds in Xcode
- Required XCFramework artifacts available in package output

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Link generated XCFramework artifacts
- [ ] Configure startup initialization order
- [ ] Render RN module in host app
- [ ] Validate Debug and Release behavior
```

1. Link `<framework_target_name>.xcframework`, `ReactBrownfield.xcframework`, and `hermesvm.xcframework`.
2. In app startup:
   - set `ReactNativeBrownfield.shared.bundle = ReactNativeBundle`
   - call `ReactNativeBrownfield.shared.startReactNative(...)`
3. Present RN UI with `ReactNativeViewController` or `ReactNativeView`.
4. Validate Debug with Metro and Release without Metro.

## Common Pitfalls

- Rendering RN UI before startup initialization completes
- Wrong `moduleName` compared with JS registration
- Missing one of required framework artifacts

## Related Skills

- [bare-ios-xcframework-generation.md](./bare-ios-xcframework-generation.md) - Bare iOS artifact generation
- [bare-quick-start.md](./bare-quick-start.md) - Bare setup prerequisites
- [expo-ios-integration.md](./expo-ios-integration.md) - Expo iOS path
