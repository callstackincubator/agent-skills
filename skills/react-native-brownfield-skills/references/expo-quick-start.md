---
title: Expo Brownfield Quick Start
impact: CRITICAL
tags: react-native, brownfield, expo, app.json, plugin, setup
---

# Skill: Expo Brownfield Quick Start

Set up an Expo app for brownfield integration and enable the required plugin before platform integration.

## Quick Command

```bash
npm install @callstack/react-native-brownfield
```

## When to Use

- User explicitly asks for Expo brownfield integration
- Expo-managed or Expo prebuild project needs brownfield setup
- Preparing Expo project before iOS/Android integration steps
- Continuing after creating a new Expo app for brownfield workflows

## Prerequisites

- Expo project is available (existing project or newly scaffolded via `expo-create-app.md`)
- `app.json` present in project root
- Package manager available in project

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Install brownfield package
- [ ] Configure Expo plugin in app.json
- [ ] Confirm Expo path is selected
```

1. Install the package:

```bash
npm install @callstack/react-native-brownfield
```

2. Add plugin in `app.json`:

```json
{
  "plugins": ["@callstack/react-native-brownfield"]
}
```

3. Continue only with Expo references:
   - `expo-ios-integration.md`
   - `expo-android-integration.md`

## Common Pitfalls

- Forgetting to add plugin in `app.json`
- Mixing Expo steps with bare RN-only packaging flow
- Continuing without explicit Expo path selection

## Related Skills

- [quick-start.md](./quick-start.md) - Shared setup and path gate
- [expo-create-app.md](./expo-create-app.md) - Scaffold new Expo app before brownfield setup
- [expo-ios-integration.md](./expo-ios-integration.md) - Expo iOS integration workflow
- [expo-android-integration.md](./expo-android-integration.md) - Expo Android integration workflow
- [bare-quick-start.md](./bare-quick-start.md) - Bare React Native path entry
