---
title: Bare Android AAR Generation
impact: CRITICAL
tags: react-native, brownfield, bare, android, aar, maven
---

# Skill: Bare Android AAR Generation

Package and publish bare React Native Android artifacts as AAR for host app consumption.

## Quick Command

```bash
npx brownfield package:android --variant Release --module-name <android_module_name>
npx brownfield publish:android --module-name <android_module_name>
```

## When to Use

- Bare RN Android artifact generation is required
- Publishing local Maven artifact for host app integration
- Rebuilding AAR after dependency or native module updates

## Prerequisites

- `bare-quick-start` completed
- Dedicated Android library module exists
- Brownfield plugin and RN/Hermes dependency alignment configured

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Verify dedicated Android library module
- [ ] Package Android AAR
- [ ] Publish artifact to local Maven
- [ ] Confirm coordinate resolution from host app
```

1. Build AAR:

```bash
npx brownfield package:android --variant Release --module-name <android_module_name>
```

2. Publish AAR:

```bash
npx brownfield publish:android --module-name <android_module_name>
```

3. Confirm local Maven coordinate is resolvable:
   - `<groupId>:<artifactId>:<version>`

## Common Pitfalls

- Passing an application module as `--module-name`
- Missing `maven-publish` configuration in library module
- Repository configuration in host app missing `mavenLocal()`

## Related Skills

- [bare-quick-start.md](./bare-quick-start.md) - Bare setup prerequisites
- [bare-android-native-integration.md](./bare-android-native-integration.md) - Bare Android host integration
- [expo-android-integration.md](./expo-android-integration.md) - Expo Android path
