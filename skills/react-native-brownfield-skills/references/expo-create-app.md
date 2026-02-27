---
title: Expo Create App for Brownfield
impact: CRITICAL
tags: react-native, brownfield, expo, create-app, ios, setup
---

# Skill: Expo Create App for Brownfield

Scaffold a new Expo app as the starting point for Expo brownfield integration into a native host app.

## Quick Command

```bash
npx create-expo-app@latest my-expo-brownfield
```

## When to Use

- User asks to integrate React Native in a native iOS app by creating a new Expo app
- User says they are creating a new RN app and prefer Expo for native integration
- No existing Expo app is available, but Expo brownfield workflow is requested

## Prerequisites

- Node.js and a package manager are available
- `npx` works in the shell environment
- Target directory name for the new Expo app is chosen

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Scaffold Expo app
- [ ] Install brownfield package
- [ ] Confirm Expo path selection
- [ ] Continue to Expo brownfield setup
```

1. Create a new Expo app:

```bash
npx create-expo-app@latest my-expo-brownfield
```

2. Move into the app directory:

```bash
cd my-expo-brownfield
```

3. Install brownfield package in the new Expo app:

```bash
npm install @callstack/react-native-brownfield
```

4. Continue with Expo path only:
   - Next: `expo-quick-start.md`
   - Then for iOS host integration: `expo-ios-integration.md`

## Stop Conditions

Proceed only if all are true:
- Expo app scaffold command exits with code `0`
- `app.json` exists in project root
- Expo path is explicitly selected (no mixed bare RN steps)

## Common Pitfalls

- Starting iOS integration before initializing the Expo app
- Mixing bare React Native packaging steps into Expo flow
- Forgetting to run Expo brownfield quick start after scaffolding

## Related Skills

- [quick-start.md](./quick-start.md) - Shared setup and path-selection gate
- [expo-quick-start.md](./expo-quick-start.md) - Expo brownfield setup and plugin configuration
- [expo-ios-integration.md](./expo-ios-integration.md) - Expo iOS integration workflow
- [expo-android-integration.md](./expo-android-integration.md) - Expo Android integration workflow
