---
title: Expo Create App for Brownfield
impact: CRITICAL
tags: react-native, brownfield, expo, create-app, setup
---

# Skill: Expo Create App for Brownfield

Create a new Expo app as the source project for Expo brownfield packaging and host integration.

## Quick Command

```bash
npx create-expo-app@latest my-expo-brownfield --yes
```

## When to Use

- User wants to add React Native to native apps via Expo path
- No existing Expo/RN project is available for brownfield packaging

## Prerequisites

- Node.js and `npx` available
- New project directory name selected

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Create Expo app
- [ ] Install brownfield package
- [ ] Continue on Expo-only path
```

1. Create a new Expo app in a standalone directory (not inside existing iOS/Android host repo).
2. `cd my-expo-brownfield`
3. Install brownfield package: `npm install @callstack/react-native-brownfield`
4. Continue to [expo-quick-start.md](./expo-quick-start.md).

## Stop Conditions

Proceed only if:

- create command exits with code `0`
- `app.json` exists at project root

## Canonical Docs

- [Expo Integration](https://oss.callstack.com/react-native-brownfield/docs/getting-started/expo.md)
- [Quick Start](https://oss.callstack.com/react-native-brownfield/docs/getting-started/quick-start.md)

## Common Pitfalls

- Creating Expo app inside host native app project
- Jumping to iOS/Android integration before Expo plugin setup

## Related Skills

- [quick-start.md](./quick-start.md) - Path-selection gate
- [expo-quick-start.md](./expo-quick-start.md) - Expo plugin and packaging setup
