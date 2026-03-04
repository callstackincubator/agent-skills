---
title: Expo Brownfield Quick Start
impact: CRITICAL
tags: react-native, brownfield, expo, app.json, plugin, setup
---

# Skill: Expo Brownfield Quick Start

Configure Expo project for brownfield packaging before iOS/Android host integration.

## Quick Command

```bash
npm install @callstack/react-native-brownfield
```

## When to Use

- Expo managed or prebuild project needs brownfield packaging
- Continuing after [expo-create-app.md](./expo-create-app.md)

## Prerequisites

- Expo project with `app.json`
- Expo path selected in router

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Install package
- [ ] Configure plugin
- [ ] Continue to platform integration
```

1. Install package in the Expo project.
2. Add plugin to `app.json`:

```json
{
  "plugins": ["@callstack/react-native-brownfield"]
}
```

3. Optionally add package scripts for packaging/publish commands used by your team.
4. Continue to exactly one platform file:
   - [expo-ios-integration.md](./expo-ios-integration.md)
   - [expo-android-integration.md](./expo-android-integration.md)

## Canonical Docs

- [Expo Integration](https://oss.callstack.com/react-native-brownfield/docs/getting-started/expo.md)
- [Brownfield CLI](https://oss.callstack.com/react-native-brownfield/docs/cli/brownfield.md)

## Common Pitfalls

- Missing plugin entry in `app.json`
- Mixing Expo flow with bare packaging files

## Related Skills

- [quick-start.md](./quick-start.md) - Path-selection gate
- [expo-ios-integration.md](./expo-ios-integration.md) - Expo iOS integration
- [expo-android-integration.md](./expo-android-integration.md) - Expo Android integration
