---
title: Upgrade Verification
impact: HIGH
tags: verification, regression, android, ios, navigation
---

# Skill: Upgrade Verification

Manual validation checklist for human developers after React Native and/or Expo upgrades.

## Scope

- Focus on behavior and UX regressions that static diffs cannot prove.
- Keep checks small, repeatable, and tied to critical user flows.

## Manual Checks (Required)

1. App launch and core journeys work on both iOS and Android.
2. Navigation behavior is correct (forward/back stack, params, deep links, modal flows).
3. Android edge-to-edge is visually correct (status bar, nav bar, safe area insets, keyboard overlays).
4. Permissions and device APIs work (camera, location, notifications, file/media access).
5. Background/restore paths work (app resume, push open, interrupted flows).

## Build and Test Gates

1. Run unit/integration tests and fix all upgrade-related failures.
2. If `target_version >= 0.81` and tests fail due to missing modules, add proper mocks.
   - Example (`BackHandler` mock removal): https://github.com/facebook/react-native/issues/52667#issuecomment-3094788618
3. Build installable artifacts for both platforms.
4. For Expo apps, run `npx expo-doctor` from [expo-sdk-upgrade.md](expo-sdk-upgrade.md).

## Evidence to Capture

- Screen recordings/screenshots for changed flows.
- List of verified scenarios and pass/fail status.
- Follow-up fixes for any observed regressions.

## Related Skills

- [upgrading-react-native.md](upgrading-react-native.md) - Upgrade workflow router
- [upgrade-helper-core.md](upgrade-helper-core.md) - Core RN diff/merge workflow
- [expo-sdk-upgrade.md](expo-sdk-upgrade.md) - Expo-specific checks and commands
- [react.md](react.md) - React-specific upgrade rules
