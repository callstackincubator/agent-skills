---
title: Upgrade Helper Core Workflow
impact: HIGH
tags: react-native, upgrade-helper, rn-diff-purge, ios, android
---

# Skill: Upgrade Helper Core Workflow

Reliable, framework-agnostic workflow for React Native upgrades using Upgrade Helper and rn-diff-purge.

Run shared environment checks first in [upgrading-react-native.md](upgrading-react-native.md) under `Prerequisites (All Upgrade Paths)`.

## Quick Commands

```bash
npm pkg get dependencies.react-native devDependencies.react-native --prefix "$APP_DIR"
npm view react-native dist-tags.latest
curl -L "https://raw.githubusercontent.com/react-native-community/rn-diff-purge/master/RELEASES"
curl -L -o /tmp/rn-diff-<current_version>..<target_version>.diff "https://raw.githubusercontent.com/react-native-community/rn-diff-purge/diffs/diffs/<current_version>..<target_version>.diff"
grep -n "^diff --git" /tmp/rn-diff-<current_version>..<target_version>.diff
```

## Upgrade Helper API (Inline Reference)

- List supported versions:
  - `https://raw.githubusercontent.com/react-native-community/rn-diff-purge/master/RELEASES`
- Fetch raw unified diff:
  - `https://raw.githubusercontent.com/react-native-community/rn-diff-purge/diffs/diffs/<current_version>..<target_version>.diff`
- GitHub compare view:
  - `https://github.com/react-native-community/rn-diff-purge/compare/release/<current_version>..release/<target_version>`
- Upgrade Helper UI:
  - `https://react-native-community.github.io/upgrade-helper/?from=<current_version>&to=<target_version>`
- Path mapping note:
  - Diff paths are prefixed with `RnDiffApp/`; remap to your app paths and package names.

## Inputs

- `APP_DIR`: app package path (`.` for single-package repos)
- `current_version`: current React Native version
- `target_version`: target React Native version (latest by default)

## Reliable Workflow

1. Detect app and versions.
   - Read `react-native` from `APP_DIR/package.json`.
   - Resolve target via `npm view react-native dist-tags.latest` unless user provides one.
2. Validate `target_version` exists.
   - Check `RELEASES` from rn-diff-purge and confirm `target_version` is listed.
   - If missing, stop and ask user to choose one of available versions.
3. Collect canonical sources.
   - Upgrade Helper URL.
   - rn-diff-purge raw diff.
   - React Native blog posts only between `current_version` and `target_version`.
4. Fetch diff with fallback.
   - Try exact raw diff: `<current_version>..<target_version>`.
   - If 404, try nearest available patch versions and report what was attempted.
   - If no available pair works, stop and ask user for target adjustment.
5. Run dependency risk planning.
   - Use [upgrading-dependencies.md](upgrading-dependencies.md).
6. Build a change checklist from diff.
   - Group by JS/TS, iOS, Android, tooling.
   - Skip template-only UI (`App.tsx`) unless explicitly requested.
7. Apply diff safely.
   - Treat `RnDiffApp` as placeholder; remap app/package names.
   - Merge, do not overwrite project-specific customizations.
8. Reinstall and sync native deps.
   - Run package manager install in app context.
   - Run iOS pods in `APP_DIR/ios`.
9. Validate and gate completion.
   - iOS build passes.
   - Android build passes.
   - tests/typecheck/lint pass or failures are documented with next actions.
   - If `target_version >= 0.81` and tests fail due to missing modules, add proper mocks.
     - Example (`BackHandler` mock removal): https://github.com/facebook/react-native/issues/52667#issuecomment-3094788618

## Stop Conditions

- Missing `react-native` dependency in target package.
- Diff source unavailable and no fallback available.
- Unresolved native merge conflicts in iOS/Android entry files.

## Reliability Rules

- Keep operations version-pair scoped (`current_version -> target_version`).
- Prefer official sources over ad-hoc guides.
- Record every manual deviation from Upgrade Helper.
- Do not run Expo-specific commands here.

## Common Pitfalls

- Upgrading an Expo project with only RN CLI steps: apply the Expo layer ([expo-sdk-upgrade.md](expo-sdk-upgrade.md)).
- Skipping the Upgrade Helper: leads to missed native config changes.
- Treating `RnDiffApp` paths as literal project paths.
- Copying the entire template wholesale: use the diff as a guide and merge only needed changes.
- Using the wrong changelog: `0.7x` changes live in `CHANGELOG-0.7x.md`.
- Running the wrong package manager: always match the repo lockfile.
- Forgetting CocoaPods: iOS builds will fail without `pod install`.
- Not updating Android Gradle wrapper binary: update `android/gradle/wrapper/gradle-wrapper.jar` for the target RN version. Source template:
  - `https://raw.githubusercontent.com/react-native-community/rn-diff-purge/release/<target_version>/RnDiffApp/android/gradle/wrapper/gradle-wrapper.jar`
- Flipper artifacts lingering after removal in v0.74: remove `ReactNativeFlipper.kt` and `FLIPPER_VERSION` when the target RN version drops Flipper.
- Skipping platform rebuilds after Pod/Gradle changes.

## Related Skills

- [upgrading-react-native.md](upgrading-react-native.md) - Routing and mode selection
- [upgrading-dependencies.md](upgrading-dependencies.md) - Dependency compatibility and migration plan
- [expo-sdk-upgrade.md](expo-sdk-upgrade.md) - Expo-only layer on top of core workflow
- [monorepo-singlerepo-targeting.md](monorepo-singlerepo-targeting.md) - Repo/app selection and command scoping
