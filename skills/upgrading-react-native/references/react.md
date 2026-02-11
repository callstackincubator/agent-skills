---
title: React Upgrade Layer
impact: HIGH
tags: react, react-19, rntl, types
---

# Skill: React Upgrade Layer

React-specific upgrade rules to run when `react` changes during a React Native or Expo upgrade.

## When to Apply

- `react` version changes (major, minor, or patch).
- React Native target implies a newer React pairing.
- Tests/types break after React upgrade.

## React Pairing Rules

1. Keep companion packages aligned with installed React version:
   - `react-test-renderer`
   - `@types/react`
   - `react-dom` (if used by the app)
2. Prefer matching React major and minor exactly; patch should also match when available.
3. Do not leave these packages on older `x.y` after upgrading `react`.

## React 19 Rules

1. Upgrade `@testing-library/react-native` to `v13+`.
2. Follow:
   - [Expo React 19 Reference][expo-react-19-reference]
   - [RNTL LLM Docs][rntl-llm-docs]
3. Expect type-level breakages from deprecated API removals; fix code and mocks accordingly.

## Related Skills

- [upgrade-helper-core.md](upgrade-helper-core.md) - Core RN upgrade workflow
- [upgrading-dependencies.md](upgrading-dependencies.md) - Dependency compatibility triage
- [expo-sdk-upgrade.md](expo-sdk-upgrade.md) - Expo-specific upgrade layer
- [upgrade-verification.md](upgrade-verification.md) - Post-upgrade manual validation

[expo-react-19-reference]: https://github.com/expo/skills/blob/main/plugins/upgrading-expo/skills/upgrading-expo/references/react-19.md
[rntl-llm-docs]: https://oss.callstack.com/react-native-testing-library/llms.txt
