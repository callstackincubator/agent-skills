---
title: Expo SDK Upgrade Layer
impact: HIGH
tags: expo, sdk, react-native, dependencies
---

# Skill: Expo SDK Upgrade Layer

Expo-specific add-on to the core Upgrade Helper workflow. Use only when `expo` exists in app `package.json`.

## Quick Commands

```bash
npm pkg get dependencies.expo devDependencies.expo --prefix "$APP_DIR"
cd "$APP_DIR" && npx expo install --fix
cd "$APP_DIR" && npx expo-doctor
```

## When to Apply

- `expo` or `expo-updates` is present in the target app package
- RN upgrade is paired with Expo SDK upgrade

## Official Expo Reference

- Follow Expo's official upgrade skill as a primary guide:
  - [Expo Upgrading Expo Skill][expo-upgrading-expo-skill]
- Important for this workflow: skip `app.json` changes, because this is not an Expo Managed project.

## Pre-Upgrade Audit (Required)

- Confirm SDK version and target path.
- Inventory dependencies and native modules.
- Review config plugins and prebuild behavior.
- Review native build setup (Gradle, iOS settings, CI/EAS config).
- Identify critical app flows for regression testing before changes.

## Workflow Additions

1. Run Expo compatibility alignment.
   - `npx expo install --fix` (source of truth for SDK-compatible versions).
   - Treat `expo-modules` package versions as SDK-coupled; align them with Expo recommendations.
2. Run health checks.
   - `npx expo-doctor`; resolve blocking issues first.
3. If native folders are part of workflow, reconcile prebuild output.
   - `npx expo prebuild --clean` (when applicable).
4. Handle React 19 pairing.
   - Run [react.md](react.md).
5. Run [upgrade-verification.md](upgrade-verification.md) for manual regression checks and release gates.

## Notes

- Use `npx expo ...`; do not require global `expo-cli`.
- Some package bumps may be optional if not SDK-bound; validate before deferring.
- Read Expo and React Native release notes deeply before editing code, then map each breaking change to a concrete code/task item.

## Related Skills

- [upgrading-react-native.md](upgrading-react-native.md) - Routing and mode selection
- [upgrade-helper-core.md](upgrade-helper-core.md) - Base upgrade workflow
- [react.md](react.md) - React and React 19 alignment
- [upgrade-verification.md](upgrade-verification.md) - Manual post-upgrade validation
- [monorepo-singlerepo-targeting.md](monorepo-singlerepo-targeting.md) - Repo/app selection and command scoping

[expo-upgrading-expo-skill]: https://github.com/expo/skills/blob/main/plugins/upgrading-expo/skills/upgrading-expo/SKILL.md
