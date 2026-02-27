---
title: Brownfield Quick Start
impact: CRITICAL
tags: react-native, brownfield, setup, path-selection, expo, bare
---

# Skill: Brownfield Quick Start

Run shared setup, then immediately route to Expo or bare React Native references without mixing paths.

## Quick Command

```bash
npm install @callstack/react-native-brownfield
```

## When to Use

- Starting brownfield enablement and deciding Expo vs bare path
- Preparing project-level prerequisites before path-specific steps
- Verifying `@callstack/react-native-brownfield` install succeeds

## Prerequisites

- Node.js, package manager, and React Native project already bootstrapped
- `@callstack/react-native-brownfield` installed in `package.json`

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Install package and dependencies
- [ ] Determine path intent (Expo or bare RN)
- [ ] Route to one path and stop using the other
```

1. Install brownfield package in the React Native app root.

```bash
npm install @callstack/react-native-brownfield
```

2. Determine path intent from user request:
   - Expo signals: `expo`, `managed workflow`, `prebuild`, `expo modules`
   - Expo from-scratch signals: `create new expo app`, `npx create-expo-app`, `new RN app` + `prefer expo`
   - Bare signals: `react-native init`, direct native folders, `xcframework`, `aar`

3. Route to exactly one path:
   - Expo path:
     - if from-scratch/new-app intent: `expo-create-app.md` then `expo-quick-start.md`
     - otherwise: `expo-quick-start.md`
     - then `expo-ios-integration.md` or `expo-android-integration.md`
   - Bare path:
     - `bare-quick-start.md`
     - then bare platform generation and native integration skills

4. If both/unclear, ask one disambiguation question before proceeding.

## Stop Conditions

Proceed only if all are true:
- `npm install` exits with code `0`
- exactly one path is selected (Expo or bare)

## If Failed

- If install fails, retry package installation and lockfile sync for the project package manager
- If path intent is unclear, stop and ask one path-selection question
- Do not continue until a single path is selected

## Common Pitfalls

- Mixing Expo and bare steps in one response
- Continuing when path intent is ambiguous
- Jumping to platform integration before selecting a path

## Related Skills

- [expo-quick-start.md](./expo-quick-start.md) - Expo-specific setup and plugin configuration
- [expo-create-app.md](./expo-create-app.md) - Expo app scaffolding before Expo brownfield setup
- [expo-ios-integration.md](./expo-ios-integration.md) - Expo iOS integration and startup wiring
- [expo-android-integration.md](./expo-android-integration.md) - Expo Android packaging and host integration
- [bare-quick-start.md](./bare-quick-start.md) - Bare React Native setup
- [bare-ios-xcframework-generation.md](./bare-ios-xcframework-generation.md) - Bare iOS XCFramework generation
- [bare-android-aar-generation.md](./bare-android-aar-generation.md) - Bare Android AAR generation/publish
