---
title: Bare iOS Native Integration
impact: HIGH
tags: react-native, brownfield, bare, ios, swiftui, appdelegate
---

# Skill: Bare iOS Native Integration

Integrate generated bare RN XCFramework artifacts into a native iOS host app and verify runtime initialization.

## Quick Command

```text
Import <framework_target_name> in AppDelegate/SwiftUI app entry,
set ReactNativeBrownfield.shared.bundle = ReactNativeBundle,
then call startReactNative(...) before rendering RN view/controller.
```

## When to Use

- Consuming generated bare RN XCFramework outputs in a host iOS app
- Wiring bare React Native initialization in UIKit or SwiftUI app entrypoints
- Validating Debug and Release runtime behavior

## Prerequisites

- `bare-ios-xcframework-generation` completed successfully
- Access to `ios/.brownfield/package/build` artifacts
- Host app opens and builds in Xcode

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Import/Link generated frameworks into host app target
- [ ] Configure AppDelegate or SwiftUI init boot sequence
- [ ] Create RN screen entrypoint with correct moduleName
- [ ] Validate Debug behavior with Metro
- [ ] Validate Release behavior without Metro
```

1. Add these artifacts from `.brownfield/ios/package/` into the host app project:
   - `<framework_target_name>.xcframework`
   - `ReactBrownfield.xcframework`
   - `hermesvm.xcframework`

2. In app startup, import your generated framework and initialize:

```swift
import <framework_target_name>

ReactNativeBrownfield.shared.bundle = ReactNativeBundle
ReactNativeBrownfield.shared.startReactNative(onBundleLoaded: {
    print("React Native bundle loaded")
}, launchOptions: launchOptions)
```

3. Ensure `AppDelegate` contains:

final class AppDelegate: NSObject, UIApplicationDelegate {
    var window: UIWindow?
    // ...
}

4. Present React Native UI:
   - UIKit path: `ReactNativeViewController(moduleName: "<registered_module_name>")`
   - SwiftUI path: `ReactNativeView(moduleName: "<registered_module_name>")`

5. Validate Debug configuration:

```bash
npx react-native start
```

6. Validate Release configuration:
   - Build and run without Metro.
   - Confirm JS bundle loads from XCFramework.

7. Smoke-test navigation and component rendering for the registered module.

## Stop Conditions

Mark iOS integration complete only if all are true:
- Host app builds successfully in Debug and Release
- Debug run loads RN with Metro active
- Release run loads RN without Metro
- `onBundleLoaded` callback fires and RN screen renders with expected module name
- AppDelegate contains var window: UIWindow? (when AppDelegate is used)

## If Failed

- If app fails at launch, verify startup order:
  - set `ReactNativeBrownfield.shared.bundle = ReactNativeBundle`
  - call `startReactNative(...)`
  - only then create RN view controller/view
- If module does not render, verify `moduleName` equals `AppRegistry.registerComponent` name
- If Release cannot load JS, re-check XCFramework artifacts in `ios/.brownfield/package/build` and relink all three frameworks
- If Debug cannot load, start Metro and rerun:
  - `npx react-native start`
- Do not accept integration as complete until both Debug and Release checks pass

## Common Pitfalls

- Failing to initialize `ReactNativeBrownfield.shared.bundle` before rendering RN view
- Using wrong `moduleName` that does not match `AppRegistry.registerComponent`
- Adding only app XCFramework and forgetting `ReactBrownfield` or `hermesvm`
- Assuming Debug and Release load JS from the same source

## Related Skills

- [bare-ios-xcframework-generation.md](./bare-ios-xcframework-generation.md) - Bare iOS artifact generation
- [bare-quick-start.md](./bare-quick-start.md) - Bare setup prerequisites
- [expo-ios-integration.md](./expo-ios-integration.md) - Expo iOS path
