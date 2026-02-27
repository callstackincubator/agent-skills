---
title: Bare Android Native Integration
impact: HIGH
tags: react-native, brownfield, bare, android, maven, reactnativefragment
---

# Skill: Bare Android Native Integration

Consume published bare RN AAR artifact in a native Android host app and verify runtime rendering.

## Quick Command

```kotlin
dependencyResolutionManagement {
    repositories { mavenLocal() }
}
dependencies {
    implementation("<groupId>:<artifactId>:<version>")
}
```

## When to Use

- Bare RN Android host app must consume local Maven AAR artifact
- Host startup needs explicit React Native initialization
- Fragment or view mounting of RN UI is required

## Prerequisites

- `bare-android-aar-generation` completed
- AAR artifact published to local Maven
- Host app Gradle sync/build is healthy

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Add mavenLocal repository
- [ ] Add AAR dependency coordinate
- [ ] Initialize ReactNativeHostManager before RN UI
- [ ] Mount RN fragment/view and verify render
```

1. Add `mavenLocal()` in host dependency repositories.
2. Add `implementation("<groupId>:<artifactId>:<version>")` in host app module.
3. Initialize `ReactNativeHostManager` in host startup path.
4. Mount RN UI using fragment or view integration APIs.

## Common Pitfalls

- Missing `mavenLocal()` in dependency resolution
- Dependency coordinate mismatch with published artifact
- Initialization happening after RN UI creation

## Related Skills

- [bare-android-aar-generation.md](./bare-android-aar-generation.md) - Bare Android artifact generation
- [bare-quick-start.md](./bare-quick-start.md) - Bare setup prerequisites
- [expo-android-integration.md](./expo-android-integration.md) - Expo Android path
