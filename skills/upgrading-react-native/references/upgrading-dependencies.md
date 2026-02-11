---
title: Upgrading Dependencies
impact: HIGH
tags: react-native, dependencies, compatibility, migration
---

# Skill: Upgrading Dependencies

Common dependency issues and mitigations when upgrading React Native.

## Quick Checks

```bash
npm ls --depth=0
```

## Dependency Risk and Migration Plan

1. Review compatibility signals:
   - [RN nightly tests](https://react-native-community.github.io/nightly-tests/)
   - [React Native Directory](https://reactnative.directory/packages?newArchitecture=false)
2. If `react` is upgraded, run [react.md](react.md) for companion package alignment and React 19 rules.
3. Handle known risky packages:
   - `react-native-fast-image` -> prefer `@d11/react-native-fast-image` or `expo-image` (confirm with user)
   - `@react-native-cookies/cookies` -> prefer `@preeternal/react-native-cookie-manager` (confirm with user)
   - `react-native-code-push` -> treat as incompatible; disable for upgrade and consider `@appzung/react-native-code-push`, `@bravemobile/react-native-code-push`, or `expo-updates`
   - `react-native-image-crop-picker` -> upgrade to `>=0.51.1`; if unstable, plan migration to `expo-image-picker` (confirm with user)
   - `react-native-network-logger` - lists `react` and `react-native` in peer deps as `*` which can be misleading. Upgrade to v2 if `target_version >= 0.79`.
   - `react-native-permissions` - upgrade to v5 if possible (requires RN 0.74+)
4. Apply additional cleanup rules:
   - If `@rnx-kit/metro-resolver-symlinks` is present, remove it from deps and `metro.config.js` (Metro supports symlinks since 0.72)
   - If app uses `react-native-localize` timezone APIs and `@callstack/timezone-hermes-fix` is missing, ask whether to add it
5. If no safe alternative is found for a critical dependency, ask for explicit user confirmation before continuing.
6. Read only breaking/manual steps from RN blog posts between `current_version` and `target_version`.

## Related Skills

- [upgrade-helper-core.md](upgrade-helper-core.md) - Core upgrade workflow
- [react.md](react.md) - React and React 19 alignment
- [expo-sdk-upgrade.md](expo-sdk-upgrade.md) - Expo-specific dependency alignment
- [upgrading-react-native.md](upgrading-react-native.md) - Routing and mode selection
