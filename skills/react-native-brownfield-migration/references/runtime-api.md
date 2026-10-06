---
title: Brownfield Runtime API
impact: HIGH
tags: react-native, brownfield, api, swift, kotlin, javascript, host-boundary
---

# Skill: Brownfield Runtime API

The host <-> React Native boundary surface: what JavaScript can call, what the native host sets up,
and which mechanism to pick for a given task. Read this before hand-rolling a bridge.

## Choosing a boundary mechanism

| Need | Use |
| ---- | --- |
| Leave the RN surface and return to the native stack | `popToNative()` |
| Hand the back gesture / hardware back button to native | `setNativeBackGestureAndButtonEnabled()` |
| Call a **typed, named** native screen or action from RN (navigate to a native screen, ask the host for a confirmation) | Brownfield Navigation — `brownfield-navigation` skill (if installed) |
| Share **state** between host and RN (session, user, theme) with a single source of truth | Brownie — `brownie` skill (if installed) |
| One-off, untyped signal in either direction | `postMessage()` / `onMessage()` |

Prefer the typed options. `postMessage` is the escape hatch: it is a JSON string with no contract,
so it does not survive refactoring the way a generated navigation or store binding does.

## JavaScript

`@callstack/react-native-brownfield` default-exports exactly four methods.

```ts
import ReactNativeBrownfield from '@callstack/react-native-brownfield';
import type { MessageEvent } from '@callstack/react-native-brownfield';

ReactNativeBrownfield.popToNative(true);                        // `animated` is iOS-only
ReactNativeBrownfield.setNativeBackGestureAndButtonEnabled(true);
ReactNativeBrownfield.postMessage({ text: 'hello', id: 2 });    // must be JSON-serializable

const subscription = ReactNativeBrownfield.onMessage((event: MessageEvent) => {
  console.log(event.data);
});
subscription.remove();
```

Notes:

- `popToNative(animated)` ignores `animated` on Android.
- `postMessage` calls `JSON.stringify` without catching — serialization errors are the caller's.
- `onMessage` parses the incoming payload as JSON and falls back to the raw string on failure.
- `BrownfieldConfig` is re-exported as a type, for annotating `brownfield.config.js`.

## Swift

Module name is `ReactBrownfield`. Entry point is `ReactNativeBrownfield.shared`.

Properties set **before** `startReactNative`:

| Property | Notes |
| -------- | ----- |
| `bundle: Bundle` | Where the JS bundle is looked up. Defaults to `.main`, which is wrong for a brownfield host — see below |
| `preferEmbeddedBundleInDebug: Bool` | Default `false`. Set `true` to run a Debug framework without Metro |
| `entryFile: String` | Defaults to `index`, or the Expo virtual metro entry in an Expo project |
| `bundlePath: String` | Defaults to `main.jsbundle` |
| `bundleURLOverride: (() -> URL?)?` | Full control over bundle resolution |

Lifecycle and rendering:

```swift
// three overloads
ReactNativeBrownfield.shared.startReactNative()
ReactNativeBrownfield.shared.startReactNative(onBundleLoaded: { })
ReactNativeBrownfield.shared.startReactNative(
  launchOptions: launchOptions,
  preloadBundle: true,       // loads and evaluates the bundle now; first RN screen appears faster
  onBundleLoaded: { }
)

ReactNativeBrownfield.shared.stopReactNative()

// rendering
ReactNativeView(moduleName: "<registered_module_name>")                       // SwiftUI, iOS 15+
ReactNativeViewController(moduleName: "<registered_module_name>",
                          initialProperties: nil)                            // UIKit
ReactNativeBrownfield.shared.view(moduleName: "<registered_module_name>",
                                  initialProps: nil)                          // raw UIView

// messaging
ReactNativeBrownfield.shared.postMessage("<json string>")
let token = ReactNativeBrownfield.shared.onMessage { message in }
```

There is **no** `startReactNative(onBundleLoaded:launchOptions:)` overload. Pass `launchOptions`
through the three-argument form, or forward the app delegate callbacks below.

App delegate forwarding — forward every callback the host actually implements:

```swift
func application(_ application: UIApplication,
                 didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool
func application(_ application: UIApplication,
                 willFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool
func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool
func application(_ application: UIApplication, continue userActivity: NSUserActivity,
                 restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool
```

Deep links into the RN surface need the `open url` and `continue userActivity` forwards, not just
`didFinishLaunchingWithOptions`.

### Two symbols that are not library exports

`ReactNativeBundle` and `ensureExpoModulesProvider()` are **generated into the packaged framework**
(`FrameworkInterface.swift`) — by the Expo config plugin for Expo projects, or written by hand for a
bare framework target. They come from `import <framework_target_name>`, not from `ReactBrownfield`.
Omitting `shared.bundle = ReactNativeBundle` leaves the host without a bundle URL and the RN surface
renders blank with no crash.

## Kotlin

Package `com.callstack.reactnativebrownfield`. Hosts should call a project-owned
`ReactNativeHostManager` facade rather than these APIs directly.

```kotlin
// recommended: the factory lambda runs after native libs are loaded
ReactNativeBrownfield.initialize(application, onJSBundleLoaded) { reactHost }

// also supported
ReactNativeBrownfield.initialize(application, packages: List<ReactPackage>, onJSBundleLoaded)
ReactNativeBrownfield.initialize(application, options: HashMap<String, Any>, onJSBundleLoaded)
//   option keys: packages, mainModuleName, bundleAssetPath, bundleFilePath, useDeveloperSupport

// DEPRECATED: the reactHost argument is evaluated before native libs load, which breaks
// ExpoReactHostFactory. Use the factory-lambda overload instead.
ReactNativeBrownfield.initialize(application, reactHost, onJSBundleLoaded)
```

Rendering and messaging:

```kotlin
ReactNativeFragment.createReactNativeFragment("<registered_module_name>", initialProps)

ReactNativeBrownfield.shared.createView(
    activity,                 // FragmentActivity?
    "<registered_module_name>",
    reactDelegate = null,
    launchOptions = null,
)                             // -> FrameLayout
// five-argument overload adds `lifecycleOwner` for a container shorter-lived than the activity

ReactNativeBrownfield.shared.postMessage("<json string>")
ReactNativeBrownfield.shared.addMessageListener(listener)
ReactNativeBrownfield.shared.removeMessageListener(listener)
```

In Compose, mount the fragment with `AndroidFragment<ReactNativeFragment>` and pass arguments using
the `ReactNativeFragmentArgNames` constants (`ARG_MODULE_NAME`, `ARG_LAUNCH_OPTIONS`) rather than
raw strings.

`OnJSBundleLoaded` and `OnMessageListener` are `fun interface`s, so a lambda works for both.

## Reference apps

The `react-native-brownfield` repo carries working producers and hosts. Read the one matching your
path before writing integration code — they are more current than any snippet.

| App | Role |
| --- | ---- |
| `apps/RNApp` | Bare RN producer: framework target, `Podfile` nesting, Gradle library module, `ReactNativeHostManager` |
| `apps/ExpoApp57` | Expo producer driven entirely by `brownfield.config.json` |
| `apps/ExpoApp58` | Expo producer with config in `package.json`, prebuilt RN core and Expo flags on the scripts |
| `apps/AppleApp` | iOS host: linked XCFrameworks, SwiftUI `@main` startup, app delegate forwarding, navigation delegate |
| `apps/AndroidApp` | Android host: `mavenLocal()`, per-producer flavors, Compose `AndroidFragment<ReactNativeFragment>` |

## Canonical Docs

- [Swift API](https://oss.callstack.com/react-native-brownfield/docs/api-reference/react-native-brownfield/swift.md)
- [Kotlin API](https://oss.callstack.com/react-native-brownfield/docs/api-reference/react-native-brownfield/kotlin.md)
- [JavaScript API](https://oss.callstack.com/react-native-brownfield/docs/api-reference/react-native-brownfield/javascript.md)

## Common Pitfalls

- Expecting `ReactNativeBundle` or `ensureExpoModulesProvider()` from `import ReactBrownfield`
- Calling a `startReactNative` overload that does not exist (`onBundleLoaded:launchOptions:`)
- Using the deprecated `initialize(application, reactHost, ...)` in an Expo host
- Forwarding only `didFinishLaunchingWithOptions` and then wondering why deep links do not reach RN
- Reaching for `postMessage` where a typed navigation call or a Brownie store belongs
- Building a second navigation stack in RN instead of calling `popToNative` back into the host's
- **`preferEmbeddedBundleInDebug` does not protect against a reachable-but-wrong Metro server.** It only
  changes resolution when no Metro URL is configured at all (`bundleURL() == metroURL() ?? embeddedBundleURL`).
  If *any* Metro instance — including one started for an unrelated project — already holds the configured
  port (default `8081`), a Debug-configured framework silently fetches and runs *that* bundle, then crashes
  with an `AppRegistry` / `Invariant Violation` "has not been registered" error. This follows the RN
  framework's own `#if DEBUG`, which comes from `ios.configuration` in the brownfield config (see
  [cli-and-config.md](./cli-and-config.md)), not from the host app's Xcode configuration. On an unexplained
  "module has not been registered" crash, check `lsof -i :8081` (or the configured port) for a stray Metro
  before suspecting the integration. To force the embedded bundle regardless, package the framework as
  `Release` — that changes the framework's build mode only, not the host project's.
- **Mutating a `UINavigationController`'s `viewControllers` to present a brownfield view controller can
  silently fail to attach to the window** when that navigation controller is itself hosted inside a SwiftUI
  `UIViewControllerRepresentable`. The RN view mounts with a correct, full-screen frame and live content yet
  never appears (`view.window == nil`), because the mutation conflicts with SwiftUI's own diffing of the
  representable. In that case prefer `present(rnViewController, animated: true)` (with
  `modalPresentationStyle = .fullScreen` if it must replace, not stack on, the current screen) over
  `setViewControllers(...)` — modal presentation does not depend on how the presenter is hosted. If a
  presented RN view appears blank, confirm `view.window != nil` before blaming the bundle or registration.

## Related Skills

- [cli-and-config.md](./cli-and-config.md) - CLI commands, config file, artifacts
- `brownie` skill (if installed) - Shared host <-> RN state
- `brownfield-navigation` skill (if installed) - Typed RN -> native navigation
