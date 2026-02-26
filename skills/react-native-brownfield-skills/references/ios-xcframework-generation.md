---
title: iOS XCFramework Generation
impact: CRITICAL
tags: react-native, brownfield, ios, xcframework, xcode, cocoapods
---

# Skill: iOS XCFramework Generation

Package a React Native app into an XCFramework artifact with deterministic steps and validation checkpoints.

## Quick Command

```bash
npx brownfield package:ios --scheme <framework_target_name> --configuration Release
ls -la .brownfield/ios/package
```

## When to Use

- Building an iOS-consumable artifact from React Native for brownfield integration
- Producing release XCFramework outputs for native iOS teams
- Rebuilding after JS/native dependency updates

## Prerequisites

- `quick-start` baseline completed successfully
- Framework target exists in `ios/.xcworkspace`, otherwise create it.
- Podfile includes framework target inheritance
- Required framework target build settings configured:
  - Build Libraries for Distribution = `YES`
  - User Script Sandboxing = `NO`
  - Skip Install = `NO`
  - Enable Module Verifier = `NO`

## Mandatory Execution Contract (Agent)

These rules are non-negotiable and override any optimization shortcuts:

1. MUST manually create or verify existence of a dedicated iOS framework target before running any `brownfield package:ios` command.
2. MUST NOT probe for or rely on undocumented CLI target scaffolding/discovery flows.
3. MUST NOT use the app target as the packaging target when the framework target is missing.
4. MUST execute steps sequentially and MUST NOT continue to the next step unless the current step verification passes.
5. MUST verify and document framework target build settings before packaging:
   - Build Libraries for Distribution = `YES`
   - User Script Sandboxing = `NO`
   - Skip Install = `NO`
   - Enable Module Verifier = `NO`
6. MUST verify `Podfile` contains framework target inheritance (`inherit! :complete`) before running packaging.
7. MUST verify the .swift file containing `ReactNativeBundle` must exist on the framework target and not the App Target.
8. MUST provide evidence after each step:
   - changed file path(s)
   - command executed
   - exit code

## Forbidden Shortcuts

- Running `package:ios` before framework target creation/verification and Podfile wiring.
- Running `package:ios` against the app target as a substitute for framework target packaging.
- Attempting undocumented CLI auto-scaffolding instead of manual framework target setup.
- Proceeding to host integration without confirming all expected XCFramework artifacts.
- Do not proceed with adding the .swift files containing the `ReactNativeBundle` to the App Target, only proceed if it's added to the framework target.

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Framework target configured in Xcode + Podfile
- [ ] Bundle script added to framework target
- [ ] Public interface file exports ReactBrownfield + bundle handle
- [ ] package:ios command succeeds
- [ ] XCFramework outputs validated
```

1. Open `ios/.xcworkspace` and ensure the framework target exists.

2. Confirm Podfile framework target inheritance:

```ruby
target '<app_target>' do
  target '<framework_target_name>' do
    inherit! :complete
  end
end
```

3. Run pods again after Podfile changes.

```bash
cd ios && pod install && cd ..
```

4. Add a framework Swift interface file exporting brownfield symbols to the framework target:

```swift
@_exported import ReactBrownfield
public let ReactNativeBundle = Bundle(for: InternalClassForBundle.self)
class InternalClassForBundle {}
```

5. Ensure the framework target has a `Bundle React Native code and images` run script phase.

6. Build the XCFramework:

```bash
npx brownfield package:ios --scheme <framework_target_name> --configuration Release
```

7. Validate artifact output in `.brownfield/ios/package/`:
   - `<framework_target_name>.xcframework`
   - `ReactBrownfield.xcframework`
   - `hermesvm.xcframework`

8. Verify the generated framework can be linked in a host app (integration is covered by `ios-native-integration`).

## Stop Conditions

Proceed only if all are true:
- `npx brownfield package:ios ...` exits with code `0`
- `.brownfield/ios/package/` exists
- All expected artifacts exist:
  - `<framework_target_name>.xcframework`
  - `ReactBrownfield.xcframework`
  - `hermesvm.xcframework`
- Framework target still includes `Bundle React Native code and images` script phase

## If Failed

- If package command fails, rerun with clean state:
  - `rm -rf .brownfield/ios/package`
  - `cd ios && pod install && cd ..`
  - retry `npx brownfield package:ios --scheme <framework_target_name> --configuration Release`
- If artifacts are incomplete, re-check target build settings:
  - Build Libraries for Distribution = `YES`
  - User Script Sandboxing = `NO`
  - Skip Install = `NO`
- If JS bundle is missing in Release, re-check bundle run script phase on framework target
- Do not proceed to host integration until all expected artifacts are present

## Common Pitfalls

- Missing framework target in Podfile causes incomplete dependency resolution
- Not adding the bundle run script phase causes missing JS bundle in Release
- Incorrect `Skip Install` or distribution settings prevents proper framework output
- Expecting Debug runtime behavior in Release without understanding dev server differences

## Related Skills

- [quick-start.md](./quick-start.md) - Preflight setup and readiness checks
- [ios-native-integration.md](./ios-native-integration.md) - Consume generated XCFramework in host app
- [android-aar-generation.md](./android-aar-generation.md) - Android artifact generation equivalent
- [android-native-integration.md](./android-native-integration.md) - Android host consumption equivalent
