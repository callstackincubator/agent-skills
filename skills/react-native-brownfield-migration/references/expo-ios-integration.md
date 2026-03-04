---
title: Expo iOS Integration
impact: HIGH
tags: react-native, brownfield, expo, ios, xcframework, swiftui, appdelegate
---

# Skill: Expo iOS Integration

Package Expo app as XCFramework artifacts, link them into host iOS app, and initialize Expo-compatible RN runtime.

## Quick Command

```bash
npx brownfield package:ios --scheme <framework_target_name> --configuration Release
```

## When to Use

- User requests Expo iOS brownfield integration
- Host app must render Expo-backed React Native UI

## Prerequisites

- [expo-quick-start.md](./expo-quick-start.md) completed
- iOS host app builds successfully
- Framework scheme name resolved (`BrownfieldLib` by default unless overridden in Expo plugin options)

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Package XCFrameworks
- [ ] Link frameworks in host app
- [ ] Configure startup
- [ ] Render RN module
```

1. Package iOS artifacts:
   - `npx brownfield package:ios --scheme <framework_target_name> --configuration Release`
2. Link artifacts from package output directory (`ios/.brownfield/package` or `.brownfield/ios/package`) into host app project:
   - `<framework_target_name>.xcframework`
   - `ReactBrownfield.xcframework`
   - `hermesvm.xcframework` (or `hermes.xcframework` for older RN)
3. Initialize runtime in app entrypoint:

```swift
ReactNativeBrownfield.shared.bundle = ReactNativeBundle
ReactNativeBrownfield.shared.startReactNative {
    print("React Native has been loaded")
}
ReactNativeBrownfield.shared.ensureExpoModulesProvider()
```

4. Forward `didFinishLaunchingWithOptions` to brownfield handler.
5. Render RN UI using the module registered in JS (`AppRegistry.registerComponent`):
   - `ReactNativeView(moduleName: "<registered_module_name>")`
   - or `ReactNativeBrownfield.shared.view(moduleName: "<registered_module_name>", initialProps: nil)`

## Stop Conditions

Mark complete only if:

- package command exits with code `0`
- host app builds in Debug and Release
- selected module renders successfully

## Canonical Docs

- [Expo Integration](https://oss.callstack.com/react-native-brownfield/docs/getting-started/expo.md)
- [iOS Integration](https://oss.callstack.com/react-native-brownfield/docs/getting-started/ios.md)
- [Swift API](https://oss.callstack.com/react-native-brownfield/docs/api-reference/react-native-brownfield/swift.md)

## Common Pitfalls

- Missing `ensureExpoModulesProvider()` in Expo startup flow
- Not forwarding `didFinishLaunchingWithOptions`
- Using wrong module name instead of JS-registered component name

## Related Skills

- [expo-quick-start.md](./expo-quick-start.md) - Expo setup and plugin wiring
- [expo-android-integration.md](./expo-android-integration.md) - Expo Android equivalent
