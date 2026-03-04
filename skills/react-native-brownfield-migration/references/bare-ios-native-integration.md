---
title: Bare iOS Native Integration
impact: HIGH
tags: react-native, brownfield, bare, ios, swiftui, appdelegate
---

# Skill: Bare iOS Native Integration

Integrate bare RN XCFramework artifacts into native iOS host app and verify startup/runtime behavior.

## Quick Command

```swift
ReactNativeBrownfield.shared.bundle = ReactNativeBundle
ReactNativeBrownfield.shared.startReactNative { print("React Native bundle loaded") }
```

## When to Use

- Consuming generated bare RN XCFrameworks in host iOS app
- Wiring runtime initialization for UIKit or SwiftUI entrypoints

## Prerequisites

- [bare-ios-xcframework-generation.md](./bare-ios-xcframework-generation.md) completed
- Artifacts available in package output (`ios/.brownfield/package` or `.brownfield/ios/package`)
- Host app builds in Xcode

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Link generated frameworks
- [ ] Initialize RN startup
- [ ] Render registered module
- [ ] Verify Debug and Release behavior
```

1. Link these frameworks into host app:
   - `<framework_target_name>.xcframework`
   - `ReactBrownfield.xcframework`
   - `hermesvm.xcframework` (or `hermes.xcframework` for older RN)
2. In app startup:

```swift
import <framework_target_name>

ReactNativeBrownfield.shared.bundle = ReactNativeBundle
ReactNativeBrownfield.shared.startReactNative(onBundleLoaded: {
    print("React Native bundle loaded")
}, launchOptions: launchOptions)
```

3. Render RN UI with JS-registered module name:
   - UIKit: `ReactNativeViewController(moduleName: "<registered_module_name>")`
   - SwiftUI: `ReactNativeView(moduleName: "<registered_module_name>")`
4. Validate:
   - Debug with Metro (`npx react-native start`)
   - Release without Metro

## Stop Conditions

Mark complete only if:

- host app builds in Debug and Release
- RN module renders in both configurations

## If Failed

- Re-check startup order: set bundle -> start runtime -> create RN view/controller
- Re-check `moduleName` matches `AppRegistry.registerComponent`
- Re-link all required frameworks if Release cannot load JS

## Canonical Docs

- [iOS Integration](https://oss.callstack.com/react-native-brownfield/docs/getting-started/ios.md)
- [Swift API](https://oss.callstack.com/react-native-brownfield/docs/api-reference/react-native-brownfield/swift.md)
- [Troubleshooting](https://oss.callstack.com/react-native-brownfield/docs/guides/troubleshooting.md)

## Common Pitfalls

- Missing `ReactNativeBrownfield.shared.bundle = ReactNativeBundle`
- Wrong module name compared to JS registration
- Linking only app XCFramework without brownfield/hermes frameworks

## Related Skills

- [bare-ios-xcframework-generation.md](./bare-ios-xcframework-generation.md) - Bare iOS artifact generation
- [bare-quick-start.md](./bare-quick-start.md) - Bare setup prerequisites
