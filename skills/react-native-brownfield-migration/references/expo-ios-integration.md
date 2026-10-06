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

`--destination simulator` is the default for migration work; omitting it roughly doubles packaging time for a device slice nothing in the loop consumes. Drop it only for the cases under [Choosing `--destination`](#choosing---destination).

## When to Use

- User requests Expo iOS brownfield integration
- Host app must render Expo-backed React Native UI

## Prerequisites

- [expo-quick-start.md](./expo-quick-start.md) completed
- iOS host app builds successfully
- Framework scheme name resolved (`BrownfieldLib` by default unless overridden in Expo plugin options)
- Shell locale is UTF-8 (`LANG`/`LC_ALL`); CocoaPods raises `Encoding::CompatibilityError` otherwise. Recent CLI versions default this, older ones need `LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8`.

## Host App Inventory (before packaging)

Inspect the host once and record the result in `project.md` (Environment section), because it decides which steps below apply:

1. **Dependency manager**: CocoaPods (`Podfile`), Swift Package Manager (`Package.swift` or `XCLocalSwiftPackageReference` in the `.xcodeproj`), or Tuist (`Project.swift`).
2. **Xcode 16+ synchronized groups**: search `project.pbxproj` for `PBXFileSystemSynchronizedRootGroup`. If the host target uses one, new Swift files dropped in that folder are picked up without pbxproj edits; otherwise new files must be added to the target explicitly.
3. **Startup entry point**: SwiftUI `@main App` or a UIKit `AppDelegate`/`SceneDelegate`.

## Packaging flags

| Flag | Effect |
| ---- | ------ |
| `--scheme <name>` | Framework target to build (`BrownfieldLib` by default) |
| `--configuration Debug\|Release` | Build configuration; a Debug framework tries Metro unless told otherwise (see [Bundle resolution](#bundle-resolution)) |
| `--use-prebuilt-expo [bool]` | Reuse Expo's precompiled XCFrameworks instead of compiling Expo modules. Omitted, the default is version-aware for the project's Expo SDK; `--help` states the current rule and the CLI logs which way it resolved |
| `--add-spm-package` | Generate a local Swift package next to the XCFrameworks |
| `--use-prebuilt-rn-core [bool]` | Reuse React Native Apple prebuilt binaries for the packaging build. Omitted, the default is version-aware |
| `--destination <strings...>` | Slices to build: `simulator`, `device`, or any `xcodebuild -destination` value. Omitted, **both** are built |

This is the subset that matters for migration work. For the full option set, the config file, and
the artifact layout, see [cli-and-config.md](./cli-and-config.md) — and run
`npx brownfield package:ios --help` before relying on any flag table.

### Choosing `--destination`

Omitting the flag builds both slices. The device slice is dead weight for most migration passes — QA runs on a simulator, so it is compiled and never loaded. Pass `--destination simulator` unless:

- QA for this task runs on a **physical device**
- the task produces an **archive / TestFlight build** (archived from the host app in Xcode against the packaged frameworks)
- the host app goes to someone who will run it on hardware

Record the chosen destination in `project.md` (Environment) alongside the other packaging flags, so a re-package does not silently widen back to both slices.

### `--use-prebuilt-expo` and `usePrecompiledModules`

Prebuilt Expo XCFrameworks only exist when `expo-build-properties` does **not** set `ios.usePrecompiledModules: false` in `app.json` / `app.config.*`. If that property is `false`:

- the CLI now reports it up front and treats the version-inferred default as off;
- an explicit `--use-prebuilt-expo true` fails, because the artifacts can never be produced.

Choose one exit: pass `--use-prebuilt-expo false` (Expo modules are built from source), or enable `usePrecompiledModules`, run `pod install`, and package again. Record the chosen flags in `project.md` so the next run does not rediscover them.

Note: Respect user's preference for the flags.

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
2. Link artifacts from the package output directory (`ios/.brownfield/package/build`) into the host app project:
   - `<framework_target_name>.xcframework`
   - `ReactBrownfield.xcframework`
   - `hermesvm.xcframework` (named `hermes.xcframework` on older RN)
   - `Brownie.xcframework` and `BrownfieldNavigation.xcframework`, when the project uses them
   - the React Native and Expo support XCFrameworks emitted next to them (for example `ExpoModulesJSI.xcframework`)
3. Initialize runtime in app entrypoint. Set `bundle` and `ensureExpoModulesProvider()` **before** `startReactNative`; `startReactNative` must be the last operation:

```swift
@main
struct IosApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate

    init() {
        ReactNativeBrownfield.shared.bundle = ReactNativeBundle
        ReactNativeBrownfield.shared.ensureExpoModulesProvider()

        // `startReactNative(launchOptions:preloadBundle:onBundleLoaded:)` pays the bundle
        // evaluation cost at startup so the first RN screen appears faster. The no-argument
        // and `onBundleLoaded:`-only overloads are also available.
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

4. Forward the app delegate callbacks the host implements. `didFinishLaunchingWithOptions` is the
   minimum; forward `willFinishLaunchingWithOptions` too when the host implements it, and
   `open url` / `continue userActivity` when deep links must reach the RN surface
   (see [runtime-api.md](./runtime-api.md#swift)):

```swift
class AppDelegate: NSObject, UIApplicationDelegate {
    var window: UIWindow?

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
        return ReactNativeBrownfield.shared.application(application, didFinishLaunchingWithOptions: launchOptions)
    }

    func application(
        _ application: UIApplication,
        willFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
        return ReactNativeBrownfield.shared.application(application, willFinishLaunchingWithOptions: launchOptions)
    }
}
```

5. Render RN UI using the module registered in JS (`AppRegistry.registerComponent`):
   - `ReactNativeView(moduleName: "<registered_module_name>")`
   - or `ReactNativeBrownfield.shared.view(moduleName: "<registered_module_name>", initialProps: nil)`

## Bundle resolution

`ReactNativeBundle` is not exported by the `@callstack/react-native-brownfield` library. The Expo config plugin generates it into the packaged framework (`FrameworkInterface.swift`). That is why `ReactNativeBrownfield.shared.bundle = ReactNativeBundle` is mandatory: dropping it leaves the host without a bundle URL and the RN surface renders blank.

### Debug frameworks and `preferEmbeddedBundleInDebug`

A framework packaged in **Debug** looks for Metro on `localhost:8081`. With no Metro running, the app launches, shows nothing where the RN surface should be, and logs no obvious crash. To run a Debug framework without Metro, opt in to the embedded bundle before `startReactNative` (default `false`):

```swift
ReactNativeBrownfield.shared.bundle = ReactNativeBundle
ReactNativeBrownfield.shared.preferEmbeddedBundleInDebug = true
ReactNativeBrownfield.shared.startReactNative()
```

## SPM host (`--add-spm-package`)

`npx brownfield package:ios --scheme <framework_target_name> --configuration Release --destination simulator --add-spm-package`

- The XCFrameworks are moved into `spm-artifacts/` inside the package output directory.
- `Package.swift` and a README are written next to them.
- **Wiring the package into the host `.xcodeproj` is a separate step; the CLI does not write `XCLocalSwiftPackageReference`.** With Xcode open: File > Add Package Dependencies... > Add Local... and select the package output directory, then add the package products to the host target. Headless, use the recipe below.
- The generated `Package.swift` lists the XCFrameworks that were actually emitted. Do not hand-edit it to add prebuilt Expo frameworks that were not produced.

Do not write a custom script to edit the SPM manifest; the flag already covers it. The recipe below edits the **host** `project.pbxproj`, which is a different file and is not covered by the flag.

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

Then verify the file is still well formed before building:

```bash
plutil -lint <host>.xcodeproj/project.pbxproj
```

Notes:

- `relative_path` is resolved from the `.xcodeproj` directory. Point it at the directory containing `Package.swift`, not at the manifest.
- If the gem is unavailable and cannot be installed, stop and route back to the planner with that as the blocker. Do not hand-edit `project.pbxproj` as text, and do not fall back to CocoaPods in an SPM-only host without the user agreeing to it.
- Record in `project.md` (Environment) that the package was linked this way, so a later run does not try to re-add a reference that already exists.

## Verification recipe

1. List simulators: `xcrun simctl list devices available`, and pick a UDID.
2. Build with the UDID, not the device name (name matching is unreliable):
   `xcodebuild -scheme <host_scheme> -destination id=<UDID> ... build`
3. Install and launch, then verify with `agent-device`.
4. Simulator screenshot pixels are not device points: on modern iPhones the scale is 3x. Convert before tapping by coordinate.

Run long builds with the output convention from `migration-brownfield-developer` (log to a file, grep for failures) instead of paging the whole log into context.

### Reading the build result

**Do not decide pass/fail from `xcodebuild -quiet`.** It suppresses `** BUILD SUCCEEDED **` while still emitting

```text
error: the following command failed with exit code 0 but produced no further output
```

around whole-module-optimization `SwiftCompile` batches on a fully successful build — no success line plus spurious `error:` lines, which reads as a failure that is not one.

Use `xcbeautify` when installed (`set -o pipefail; xcodebuild ... | xcbeautify | tee .logs/<name>.log`), plain `xcodebuild` otherwise.

Judge the outcome on, in order: the command's **exit status**, then `** BUILD SUCCEEDED **` / `** BUILD FAILED **`, then whether the `.app` exists with a fresh mtime. A bare `error:` line is not a failure signal on its own.

## Stop Conditions

Mark complete only if:

- package command exits with code `0` and its final completion line appears (the dependency prints `Success` before post-build steps finish)
- host app builds in the configurations required by [Which configurations must build](#which-configurations-must-build)
- selected module renders successfully
- device evidence is captured with `agent-device` when possible

### Which configurations must build

Scope decides this. Read the task's scope before choosing, and record the choice in `tasks/{task}.md`.

| Task scope | Required |
| ---------- | -------- |
| Infrastructure / plumbing pass — first wiring of the RN surface, template or placeholder UI, no product behavior | **Debug only** |
| Any feature slice, product behavior, visual-parity work, or a release candidate | **Debug and Release** |

A Release build costs minutes and, on an infra pass, buys a signal nothing downstream consumes; a Debug build that renders the module proves the integration is wired.

Debug-and-Release remains **hard** for the second row. It may be waived only when the user explicitly says so in chat for this task; record the waiver, who gave it, and the configuration that was not built in `tasks/{task}.md`. A developer footnote is not a waiver.

Two rules apply to both rows:

- When Release is required, also **verify the module renders in Release**, not just that it compiled.
- When only Debug is built, say so in the QA handoff so the tester does not assume Release coverage exists.

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
- Trusting `xcodebuild -quiet` to report success (it hides `BUILD SUCCEEDED` and prints benign `error:` lines)
- Building Release on an infra/plumbing pass that only needs Debug
- Not forwarding `didFinishLaunchingWithOptions`
- Using wrong module name instead of JS-registered component name
- Running under a non-UTF-8 locale (CocoaPods encoding error)

## Related Skills

- [cli-and-config.md](./cli-and-config.md) - Full CLI option set, config file, artifact layout
- [runtime-api.md](./runtime-api.md) - Host <-> RN API surface
- [expo-quick-start.md](./expo-quick-start.md) - Expo setup and plugin wiring
- [expo-android-integration.md](./expo-android-integration.md) - Expo Android equivalent
