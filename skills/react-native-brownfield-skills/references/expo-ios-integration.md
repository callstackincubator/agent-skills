---
title: Expo iOS Integration
impact: HIGH
tags: react-native, brownfield, expo, ios, xcframework, swiftui, appdelegate
---

# Skill: Expo iOS Integration

Generate Expo iOS XCFramework artifacts, link them to a native app, and initialize Expo-compatible React Native startup.

## Quick Command

```bash
npx brownfield package:ios --scheme BrownfieldLib --configuration Release
```

## When to Use

- User asks for Expo iOS brownfield integration
- Expo iOS artifact generation and host app startup wiring are required
- SwiftUI/UIKit app entry must bootstrap React Native runtime

## Prerequisites

- `expo-quick-start` completed
- Expo path is selected (not bare path)
- Native iOS host app is available and builds

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Build XCFramework artifacts
- [ ] Link generated frameworks to host app
- [ ] Configure startup sequence in app entrypoint
- [ ] Forward didFinishLaunchingWithOptions
- [ ] Present React Native UI
```

1. Build XCFramework:

```bash
npx brownfield package:ios --scheme BrownfieldLib --configuration Release
```

2. Locate generated artifacts in:
   - `ios/.brownfield/package/build`
   - Link required XCFramework outputs into host iOS app target.

3. Configure app entrypoint initialization:

```swift
import <framework_target_name>

@main
struct IosApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate

    init() {
        ReactNativeBrownfield.shared.bundle = ReactNativeBundle
        ReactNativeBrownfield.shared.startReactNative {
            print("React Native has been loaded")
        }
        ReactNativeBrownfield.shared.ensureExpoModulesProvider()
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

4. Propagate `didFinishLaunchingWithOptions` via app delegate:

```swift
class AppDelegate: NSObject, UIApplicationDelegate {
    var window: UIWindow?

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
        return ReactNativeBrownfield.shared.application(application, didFinishLaunchingWithOptions: launchOptions)
    }
}
```

5. Present RN UI with either option:

```swift
ReactNativeView(moduleName: "ExpoRNApp")
  .background(Color(UIColor.systemBackground))
```

```swift
ReactNativeBrownfield.shared.view(moduleName, initialProps) // returns UIView
```

## Common Pitfalls

- Forgetting `ensureExpoModulesProvider()` in startup sequence
- Not forwarding `didFinishLaunchingWithOptions` to brownfield shared handler
- Linking wrong or incomplete framework set from package output
- Mixing bare iOS integration steps with Expo iOS flow

## Related Skills

- [quick-start.md](./quick-start.md) - Shared setup and path gate
- [expo-quick-start.md](./expo-quick-start.md) - Expo setup and plugin wiring
- [expo-android-integration.md](./expo-android-integration.md) - Expo Android equivalent
- [bare-ios-xcframework-generation.md](./bare-ios-xcframework-generation.md) - Bare RN iOS generation path
- [bare-ios-native-integration.md](./bare-ios-native-integration.md) - Bare RN iOS host path
