---
title: Expo iOS Integration
impact: HIGH
tags: react-native, brownfield, expo, ios, xcframework, spm, swiftui, appdelegate
---

# Skill: Expo iOS Integration

Package Expo app as XCFramework artifacts, link them into host iOS app, and initialize Expo-compatible RN runtime.

## Quick Command

```bash
npx brownfield package:ios --scheme <framework_target_name> --configuration Release --destination simulator
```

Add `--add-spm-package` for a Swift Package Manager host, and `--use-prebuilt-expo false` when Expo prebuilts are unavailable (see [Packaging flags](#packaging-flags)).

## When to Use

- User requests Expo iOS brownfield integration
- Host app must render Expo-backed React Native UI

## Prerequisites

- [expo-quick-start.md](./expo-quick-start.md) completed
- iOS host app builds successfully
- Framework scheme name resolved (`BrownfieldLib` by default unless overridden in Expo plugin options)
- Shell locale is UTF-8 (`LANG`/`LC_ALL`); CocoaPods raises `Encoding::CompatibilityError` otherwise. Recent CLI versions default this, older ones need `LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8`.

## Host App Inventory (before packaging)

Inspect the host once; it decides which steps below apply:

1. **Dependency manager**: CocoaPods (`Podfile`), Swift Package Manager (`Package.swift` or `XCLocalSwiftPackageReference` in the `.xcodeproj`), or Tuist (`Project.swift`).
2. **Xcode 16+ synchronized groups**: search `project.pbxproj` for `PBXFileSystemSynchronizedRootGroup`. If the host target uses one, new Swift files dropped in that folder are picked up without pbxproj edits; otherwise new files must be added to the target explicitly.
3. **Startup entry point**: SwiftUI `@main App` or a UIKit `AppDelegate`/`SceneDelegate`.

## Packaging flags

The full option set, the config file, and the artifact layout live in
[cli-and-config.md](./cli-and-config.md). Two flags need Expo-specific judgment.

### `--destination simulator`

Omitting the flag builds both slices, and the device slice is dead weight when QA runs on a simulator. Pass `--destination simulator` unless:

- QA for this task runs on a **physical device**
- the task produces an **archive / TestFlight build** (archived from the host app in Xcode against the packaged frameworks)
- the host app goes to someone who will run it on hardware

### `--use-prebuilt-expo` and `usePrecompiledModules`

Prebuilt Expo XCFrameworks only exist when `expo-build-properties` does **not** set `ios.usePrecompiledModules: false` in `app.json` / `app.config.*`. If that property is `false`:

- the CLI now reports it up front and treats the version-inferred default as off;
- an explicit `--use-prebuilt-expo true` fails, because the artifacts can never be produced.

Choose one exit, respecting the user's preference: pass `--use-prebuilt-expo false` (Expo modules are built from source), or enable `usePrecompiledModules`, run `pod install`, and package again.

Older CLI versions do not check this: they build for several minutes, print `Success`, and then fail because the prebuilt XCFrameworks are missing. If that happens, re-run with `--use-prebuilt-expo false`.

## Agent-Assisted Verification

Use `agent-device` after the host build succeeds. Read the `agent-device` skill before exact commands. If it is missing and verification needs it, install it through the environment's approved/trusted path or ask the user to install or enable it. Then open the host app, navigate to the Expo-backed RN surface, capture snapshots/screenshots, and collect logs for Debug and Release behavior.

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Inventory host app
- [ ] Package XCFrameworks
- [ ] Link frameworks in host app (CocoaPods/Xcode or local SPM package)
- [ ] Configure startup
- [ ] Render RN module
- [ ] Verify on simulator
```

1. Package iOS artifacts:
   - `npx brownfield package:ios --scheme <framework_target_name> --configuration Release --destination simulator`
2. Link every XCFramework from the package output directory (`ios/.brownfield/package/build`) into the host app project — see [cli-and-config.md](./cli-and-config.md#outputs) for what lands there.
3. Initialize runtime in app entrypoint. Set `bundle` and `ensureExpoModulesProvider()` **before** `startReactNative`; `startReactNative` must be the last operation:

```swift
@main
struct IosApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate

    init() {
        ReactNativeBrownfield.shared.bundle = ReactNativeBundle
        ReactNativeBrownfield.shared.ensureExpoModulesProvider()

        // `preloadBundle` pays the bundle evaluation cost at startup so the first
        // RN screen appears faster. See runtime-api.md for the other overloads.
        ReactNativeBrownfield.shared.startReactNative(
            launchOptions: nil,
            preloadBundle: true
        ) {
            print("React Native has been loaded")
        }
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

4. Forward the app delegate callbacks the host implements — `didFinishLaunchingWithOptions` at minimum, plus `open url` / `continue userActivity` for deep links (see [runtime-api.md](./runtime-api.md#swift)):

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

5. Render RN UI using the module registered in JS (`AppRegistry.registerComponent`):
   - `ReactNativeView(moduleName: "<registered_module_name>")`
   - or `ReactNativeBrownfield.shared.view(moduleName: "<registered_module_name>", initialProps: nil)`

## Debug frameworks and `preferEmbeddedBundleInDebug`

A framework packaged in **Debug** looks for Metro on `localhost:8081`. With no Metro running, the app launches, shows nothing where the RN surface should be, and logs no obvious crash. To run a Debug framework without Metro, opt in to the embedded bundle before `startReactNative` (default `false`):

```swift
ReactNativeBrownfield.shared.bundle = ReactNativeBundle
ReactNativeBrownfield.shared.preferEmbeddedBundleInDebug = true
ReactNativeBrownfield.shared.startReactNative()
```

This only helps when no Metro is reachable at all — see the pitfall in [runtime-api.md](./runtime-api.md#common-pitfalls).

## SPM host (`--add-spm-package`)

The flag moves the XCFrameworks into `spm-artifacts/` and writes `Package.swift` plus a README next to them. The manifest lists the XCFrameworks that were actually emitted; do not hand-edit it to add prebuilt Expo frameworks that were not produced.

**Wiring the package into the host `.xcodeproj` is a separate step; the CLI does not write `XCLocalSwiftPackageReference`.** With Xcode open: File > Add Package Dependencies... > Add Local... and select the package output directory, then add the package products to the host target.

### Linking the local package headlessly

Agent environments have no Xcode GUI, so script the "Add Local..." step with the `xcodeproj` Ruby gem against the host project — the same three objects Xcode would write:

```ruby
# gem install xcodeproj
require 'xcodeproj'

project  = Xcodeproj::Project.open('<host>.xcodeproj')
target   = project.targets.find { |t| t.name == '<host_target>' }
pkg_path = '<relative/path/to/package/output/dir>' # e.g. ../rn-app/ios/.brownfield/package/build

# 1. XCLocalSwiftPackageReference — the local package itself
ref = project.new(Xcodeproj::Project::Object::XCLocalSwiftPackageReference)
ref.relative_path = pkg_path
project.root_object.package_references << ref

# 2. XCSwiftPackageProductDependency — the product to consume
dep = project.new(Xcodeproj::Project::Object::XCSwiftPackageProductDependency)
dep.product_name = '<product_name>' # e.g. BrownfieldLib
target.package_product_dependencies << dep

# 3. PBXBuildFile with productRef — link it into Frameworks
build_file = project.new(Xcodeproj::Project::Object::PBXBuildFile)
build_file.product_ref = dep
target.frameworks_build_phase.files << build_file

project.save
```

Then verify the file is still well formed: `plutil -lint <host>.xcodeproj/project.pbxproj`.

Notes:

- `relative_path` is resolved from the `.xcodeproj` directory. Point it at the directory containing `Package.swift`, not at the manifest.
- If the gem is unavailable and cannot be installed, stop and report that as the blocker. Do not hand-edit `project.pbxproj` as text, and do not fall back to CocoaPods in an SPM-only host without the user agreeing to it.

## Verification recipe

1. List simulators: `xcrun simctl list devices available`, and pick a UDID.
2. Build with the UDID, not the device name: `xcodebuild -scheme <host_scheme> -destination id=<UDID> ... build`.
3. Install and launch, then verify with `agent-device`.
4. Simulator screenshot pixels are not device points: on modern iPhones the scale is 3x. Convert before tapping by coordinate.

**Do not decide pass/fail from `xcodebuild -quiet`.** It suppresses `** BUILD SUCCEEDED **` while still printing `error: the following command failed with exit code 0 but produced no further output` around whole-module-optimization batches on a successful build. Pipe through `xcbeautify` when installed, and judge the outcome on exit status first, then `** BUILD SUCCEEDED **` / `** BUILD FAILED **`, then a fresh `.app`.

## Stop Conditions

Mark complete only if:

- package command exits with code `0` and its final completion line appears (the dependency prints `Success` before post-build steps finish)
- host app builds in Debug; also in Release for any feature slice, visual-parity work, or release candidate, where the module must be verified rendering in Release too. Debug alone is enough for a first infra/plumbing pass, but say so in the handoff.
- selected module renders successfully
- device evidence is captured with `agent-device` when possible

## Canonical Docs

- [Expo Integration](https://oss.callstack.com/react-native-brownfield/docs/getting-started/expo.md)
- [iOS Integration](https://oss.callstack.com/react-native-brownfield/docs/getting-started/ios.md)
- [Swift API](https://oss.callstack.com/react-native-brownfield/docs/api-reference/react-native-brownfield/swift.md)

## Common Pitfalls

- Calling `ensureExpoModulesProvider()` after `startReactNative`, or missing it entirely
- Omitting `shared.bundle = ReactNativeBundle` (blank screen)
- Debug framework without `preferEmbeddedBundleInDebug` and without Metro (blank screen)
- Forcing `--use-prebuilt-expo true` while `ios.usePrecompiledModules` is `false`
- Assuming `--add-spm-package` links the package into the host project
- Packaging without `--destination simulator` and paying for a device slice nothing loads
- Trusting `xcodebuild -quiet` to report success
- Not forwarding `didFinishLaunchingWithOptions`
- Using wrong module name instead of JS-registered component name
- Running under a non-UTF-8 locale (CocoaPods encoding error)

## Related Skills

- [cli-and-config.md](./cli-and-config.md) - Full CLI option set, config file, artifact layout
- [runtime-api.md](./runtime-api.md) - Host <-> RN API surface
- [expo-quick-start.md](./expo-quick-start.md) - Expo setup and plugin wiring
- [expo-android-integration.md](./expo-android-integration.md) - Expo Android equivalent
