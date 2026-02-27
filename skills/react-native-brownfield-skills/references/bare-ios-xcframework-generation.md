---
title: Bare iOS XCFramework Generation
impact: CRITICAL
tags: react-native, brownfield, bare, ios, xcframework, xcode
---

# Skill: Bare iOS XCFramework Generation

Package a bare React Native app into XCFramework artifacts for native iOS host consumption, with deterministic steps and validation checkpoints.

## Quick Command

```bash
npx brownfield package:ios --scheme <framework_target_name> --configuration Release
ls -la .brownfield/ios/package
```

## When to Use

- Building an iOS-consumable artifact from bare React Native for brownfield integration
- Producing release bare RN XCFramework outputs for native iOS teams
- Rebuilding after JS/native dependency updates for bare RN

## Prerequisites

- `bare-quick-start` completed successfully
- Framework target exists in `ios/.xcworkspace`, otherwise create it.
- Podfile includes framework target inheritance
- Required framework target build settings configured:
  - Build Libraries for Distribution = `YES`
  - User Script Sandboxing = `NO`
  - Skip Install = `NO`
  - Enable Module Verifier = `NO`

## Mandatory Execution Contract (Agent)

These rules are non-negotiable and override any optimization shortcuts:

1. MUST create or verify existence of a dedicated iOS framework target before running any `brownfield package:ios` command.
2. MUST NOT probe for or rely on undocumented CLI target scaffolding/discovery flows.
3. MUST NOT use the app target as the packaging target when the framework target is missing.
4. MUST execute steps sequentially and MUST NOT continue to the next step unless the current step verification passes.
5. MUST verify and document framework target build settings before packaging:
   - Build Libraries for Distribution = `YES`
   - User Script Sandboxing = `NO`
   - Skip Install = `NO`
   - Enable Module Verifier = `NO`
6. MUST verify `Podfile` contains framework target inheritance (`inherit! :complete`) before running packaging.
7. MUST verify the framework Swift interface file exist on the framework target and not the App Target.
8. MUST provide evidence after each step:
   - changed file path(s)
   - command executed
   - exit code

## Forbidden Shortcuts

- Running `package:ios` before framework target creation/verification and Podfile wiring.
- Running `package:ios` against the app target as a substitute for framework target packaging.
- Attempting undocumented CLI auto-scaffolding instead of manual framework target setup.
- Proceeding to host integration without confirming all expected XCFramework artifacts.
- Do not proceed with adding the framework Swift interface file to the App Target, only proceed if it's added to the framework target.

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Framework target configured in Xcode + Podfile
- [ ] Bundle script added to framework target
- [ ] Public interface file exports ReactBrownfield + bundle handle
- [ ] package:ios command succeeds
- [ ] XCFramework outputs validated
```

1. Open `ios/.xcworkspace` and ensure the framework target exists. If it does not exist, create the framework and a group.

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

4. Add a framework Swift interface file exporting brownfield symbols to the framework target under its group:

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

7. Validate artifact output in `ios/.brownfield/package/build`:
   - `<framework_target_name>.xcframework`
   - `ReactBrownfield.xcframework`
   - `hermesvm.xcframework`

8. Verify the generated framework can be linked in a host app (integration is covered by `ios-native-integration`).

## Stop Conditions

Proceed only if all are true:
- `npx brownfield package:ios ...` exits with code `0`
- `ios/.brownfield/package/build` exists
- All expected artifacts exist:
  - `<framework_target_name>.xcframework`
  - `ReactBrownfield.xcframework`
  - `hermesvm.xcframework`
- Framework target still includes `Bundle React Native code and images` script phase

## If Failed

- If package command fails, rerun with clean state:
  - `rm -rf ios/.brownfield/package/build`
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

- [bare-quick-start.md](./bare-quick-start.md) - Bare setup prerequisites
- [bare-ios-native-integration.md](./bare-ios-native-integration.md) - Bare iOS host integration
- [expo-ios-integration.md](./expo-ios-integration.md) - Expo iOS path
