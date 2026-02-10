---
title: Monorepo vs Single-App Targeting
impact: HIGH
tags: monorepo, workspace, react-native, app-selection
---

# Skill: Monorepo vs Single-App Targeting

Small instruction set for selecting the correct app package and running upgrade commands in the right scope.

## Quick Commands

```bash
APP_DIR=apps/mobile
npm pkg get dependencies.react-native devDependencies.react-native --prefix "$APP_DIR"
cd "$APP_DIR/ios" && bundle exec pod install
```

## Rules

1. Pick one target app package before any upgrade command.
2. Run all app-specific commands with `--prefix "$APP_DIR"` or from `cd "$APP_DIR"`.
3. Use `APP_DIR=.` for single-package repos.
4. Never apply diffs to workspace root when RN app lives in a subpackage.

## Verification

- `react-native` is present in `APP_DIR/package.json`.
- `ios/` and `android/` paths used for build/pods are under `APP_DIR`.

## Related Skills

- [upgrading-react-native.md](upgrading-react-native.md) - Routing and mode selection
- [upgrade-helper-core.md](upgrade-helper-core.md) - Base upgrade workflow
- [expo-sdk-upgrade.md](expo-sdk-upgrade.md) - Expo-specific steps
