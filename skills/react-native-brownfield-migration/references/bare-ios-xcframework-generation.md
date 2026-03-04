---
title: Bare iOS XCFramework Generation
impact: CRITICAL
tags: react-native, brownfield, bare, ios, xcframework, xcode
---

# Skill: Bare iOS XCFramework Generation

Package a bare React Native app into XCFramework artifacts for native iOS host consumption.

## Quick Command

```bash
npx brownfield package:ios --scheme <framework_target_name> --configuration Release
```

## When to Use

- Building iOS artifacts from a bare RN app
- Rebuilding XCFramework after RN/native dependency updates

## Prerequisites

- [bare-quick-start.md](./bare-quick-start.md) completed
- Framework target exists in `ios/*.xcworkspace`
- Podfile includes framework target with `inherit! :complete`
- If running `pod install` directly, static linking is configured as recommended in iOS integration docs
- Framework target build settings:
  - Build Libraries for Distribution = `YES`
  - User Script Sandboxing = `NO`
  - Skip Install = `NO`
  - Enable Module Verifier = `NO`

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Framework target + Podfile ready
- [ ] Bundle script present on framework target
- [ ] Public interface file exports ReactBrownfield
- [ ] package:ios succeeds
- [ ] Artifacts validated
```

1. Create or verify framework target in Xcode workspace.
   - If target folders are folder references, convert them to groups (per iOS integration docs).
2. Ensure Podfile has nested framework target and run `pod install`.
3. Ensure framework target includes `Bundle React Native code and images` run script with expected input files (`$(SRCROOT)/.xcode.env.local`, `$(SRCROOT)/.xcode.env`).
4. Add framework interface file:

```swift
@_exported import ReactBrownfield
public let ReactNativeBundle = Bundle(for: InternalClassForBundle.self)
class InternalClassForBundle {}
```

5. Package framework:
   - `npx brownfield package:ios --scheme <framework_target_name> --configuration Release`
6. Validate output directory produced by command (commonly `ios/.brownfield/package` or `.brownfield/ios/package`):
   - `<framework_target_name>.xcframework`
   - `ReactBrownfield.xcframework`
   - `hermesvm.xcframework` (or `hermes.xcframework` for older RN)

## Stop Conditions

Proceed only if:

- package command exits with code `0`
- all required frameworks are present in package output

## If Failed

- Re-run pods and retry package command
- Re-check framework target build settings and run script phase
- Do not proceed to host integration until artifacts are complete

## Canonical Docs

- [iOS Integration](https://oss.callstack.com/react-native-brownfield/docs/getting-started/ios.md)
- [Brownfield CLI](https://oss.callstack.com/react-native-brownfield/docs/cli/brownfield.md)
- [Troubleshooting](https://oss.callstack.com/react-native-brownfield/docs/guides/troubleshooting.md)

## Common Pitfalls

- Packaging app target instead of framework target
- Missing bundle run script on framework target
- Incomplete framework set linked into host app

## Related Skills

- [bare-quick-start.md](./bare-quick-start.md) - Bare setup prerequisites
- [bare-ios-native-integration.md](./bare-ios-native-integration.md) - Bare iOS host integration
