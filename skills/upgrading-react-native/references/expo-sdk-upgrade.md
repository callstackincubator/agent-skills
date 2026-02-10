---
title: Expo SDK Upgrade Layer
impact: HIGH
tags: expo, sdk, react-native, dependencies, react-19
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

## Workflow Additions

1. Run Expo compatibility alignment.
   - `npx expo install --fix` (source of truth for SDK-compatible versions).
   - Treat `expo-modules` package versions as SDK-coupled; align them with Expo recommendations.
2. Run health checks.
   - `npx expo-doctor`; resolve blocking issues first.
3. If native folders are part of workflow, reconcile prebuild output.
   - `npx expo prebuild --clean` (when applicable).
4. Handle React 19 pairing.
   - Apply React 19 compatibility pass.
   - Upgrade `@testing-library/react-native` to `v13+`.
   - References:
     - [Expo React 19 Reference][expo-react-19-reference]
     - [RNTL LLM Docs][rntl-llm-docs]

## Notes

- Use `npx expo ...`; do not require global `expo-cli`.
- Some package bumps may be optional if not SDK-bound; validate before deferring.

## Related Skills

- [upgrading-react-native.md](upgrading-react-native.md) - Routing and mode selection
- [upgrade-helper-core.md](upgrade-helper-core.md) - Base upgrade workflow
- [monorepo-singlerepo-targeting.md](monorepo-singlerepo-targeting.md) - Repo/app selection and command scoping

[expo-upgrading-expo-skill]: https://github.com/expo/skills/blob/main/plugins/upgrading-expo/skills/upgrading-expo/SKILL.md
[expo-react-19-reference]: https://github.com/expo/skills/blob/main/plugins/upgrading-expo/skills/upgrading-expo/references/react-19.md
[rntl-llm-docs]: https://oss.callstack.com/react-native-testing-library/llms.txt
[expo-sdk-55-beta]: https://expo.dev/changelog/sdk-55-beta?utm_source=chatgpt.com
[expo-sdk-54]: https://expo.dev/changelog/sdk-54?utm_source=chatgpt.com
[expo-sdk-53]: https://expo.dev/changelog/sdk-53?utm_source=chatgpt.com
[expo-sdk-52]: https://expo.dev/changelog/2024-11-12-sdk-52?utm_source=chatgpt.com
[expo-sdk-51]: https://expo.dev/changelog/2024-05-07-sdk-51?utm_source=chatgpt.com
[expo-sdk-50]: https://expo.dev/changelog/2024-01-18-sdk-50?utm_source=chatgpt.com
[expo-sdk-49]: https://blog.expo.dev/expo-sdk-49-c6d398cdf740
[expo-sdk-49-patch]: https://expo.dev/changelog/2023-09-28-new-xcode-ios?utm_source=chatgpt.com
[expo-sdk-48]: https://blog.expo.dev/expo-sdk-48-ccb8302e231
