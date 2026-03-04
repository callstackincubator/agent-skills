---
title: Brownfield Quick Start
impact: CRITICAL
tags: react-native, brownfield, setup, path-selection, expo, bare
---

# Skill: Brownfield Quick Start

Run shared setup, select one path (Expo or bare), and route immediately to path-specific instructions.

## Quick Command

```bash
npm install @callstack/react-native-brownfield
```

## When to Use

- Starting brownfield setup and deciding between Expo and bare RN
- Preparing project prerequisites before platform-specific packaging

## Prerequisites

- React Native project root identified
- Node.js and package manager available

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Install package
- [ ] Select Expo or bare path
- [ ] Continue only on selected path
```

1. Install package in the React Native app root.
2. Classify request/project intent:
   - Expo signals: `expo`, `prebuild`, Expo plugin workflow
   - Bare signals: direct RN CLI workflow, explicit XCFramework/AAR-only path
3. Route to exactly one path:
   - Expo path: [expo-create-app.md](./expo-create-app.md) (if no RN app yet) -> [expo-quick-start.md](./expo-quick-start.md)
   - Bare path: [bare-quick-start.md](./bare-quick-start.md)
4. If unclear, ask one disambiguation question and stop.

## Stop Conditions

Proceed only if:

- package install exits with code `0`
- exactly one path is selected

## If Failed

- If install fails, retry with the active package manager and lockfile sync
- If path intent is ambiguous, stop and ask one Expo vs bare question

## Canonical Docs

- [Quick Start](https://oss.callstack.com/react-native-brownfield/docs/getting-started/quick-start.md)
- [Expo Integration](https://oss.callstack.com/react-native-brownfield/docs/getting-started/expo.md)

## Common Pitfalls

- Mixing Expo and bare steps in one flow
- Starting platform integration before path selection

## Related Skills

- [expo-create-app.md](./expo-create-app.md) - Create new Expo app for brownfield
- [expo-quick-start.md](./expo-quick-start.md) - Expo setup and plugin wiring
- [bare-quick-start.md](./bare-quick-start.md) - Bare RN baseline setup
