---
title: Upgrading React Native
impact: HIGH
tags: react-native, upgrade, routing
---

# Skill: Upgrading React Native

Router for React Native upgrade workflows. Start with core Upgrade Helper instructions, then apply focused add-ons by project shape.

## Prerequisites (All Upgrade Paths)

- Ensure the repo is clean or on a dedicated upgrade branch.
- Know which package manager the repo uses (`npm`, `yarn`, `pnpm`, `bun`).
- Use Node.js `20.19.4+`, Java `17`, and Xcode `16.4+` (with Command Line Tools), following https://reactnative.dev/docs/set-up-your-environment.
  - Optional: use [Xcodes](https://github.com/XcodesOrg/XcodesApp) to manage Xcode versions.
- Verify active versions before upgrading: `node -v`, `java -version`.
- Verify Android Studio is installed.
- For iOS, verify Xcode CLI toolchain is in sync (common pitfall after Xcode upgrades):
  - Check:
    - `xcode-select --print-path`
    - `xcodebuild -version`
    - `xcrun --sdk iphoneos --show-sdk-version`
  - If mismatch is suspected, re-point and initialize:
    - `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`
    - `sudo xcodebuild -runFirstLaunch`

## Quick Start

0. Run the [Prerequisites (All Upgrade Paths)](#prerequisites-all-upgrade-paths) checklist.
1. Set `APP_DIR` to the app folder (`.` for single-app repos).
2. Use [monorepo-singlerepo-targeting.md](monorepo-singlerepo-targeting.md) if you need help choosing `APP_DIR`.
3. Run [upgrade-helper-core.md](upgrade-helper-core.md).
4. Run [upgrading-dependencies.md](upgrading-dependencies.md) to assess risky packages and migrations.
5. Add [expo-sdk-upgrade.md](expo-sdk-upgrade.md) only if `expo` is present in `APP_DIR/package.json`.

## Decision Map

- Need canonical RN diff/merge workflow: [upgrade-helper-core.md](upgrade-helper-core.md)
- Need to ensure dependencies are compatible: [upgrading-dependencies.md](upgrading-dependencies.md)
- Project contains Expo SDK deps: [expo-sdk-upgrade.md](expo-sdk-upgrade.md)

## Related Skills

- [native-platform-setup.md](../../react-native-best-practices/references/native-platform-setup.md) - Tooling and native dependency basics
- [native-android-16kb-alignment.md](../../react-native-best-practices/references/native-android-16kb-alignment.md) - Third-party library alignment for Google Play
