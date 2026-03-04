---
title: Bare Android Native Integration
impact: HIGH
tags: react-native, brownfield, bare, android, aar
---

# Skill: Bare Android Native Integration

Consume published bare RN AAR in host Android app and verify runtime rendering.

## Quick Command

```kotlin
// settings.gradle.kts
repositories { mavenLocal() }

// app/build.gradle.kts
dependencies { implementation("<groupId>:<artifactId>:<version>") }
```

## When to Use

- Consuming locally published AAR from bare RN artifact module
- Wiring host startup and rendering for RN-powered screens

## Prerequisites

- [bare-android-aar-generation.md](./bare-android-aar-generation.md) completed
- AAR published to local Maven
- Host app Gradle sync is healthy

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Add mavenLocal in host repositories
- [ ] Add dependency coordinate
- [ ] Initialize host runtime
- [ ] Render RN module
```

1. Add `mavenLocal()` in host `dependencyResolutionManagement` repositories.
2. Add published dependency coordinate in app module.
3. Initialize runtime before RN UI creation:

```kotlin
ReactNativeHostManager.initialize(this.application) {
    println("JS bundle loaded")
}
```

4. Render RN UI:
   - `ReactNativeFragment.createReactNativeFragment("<registered_module_name>")`
   - or `ReactNativeBrownfield.shared.createView(...)`
5. Verify host app resolves dependency and RN module renders.

## Stop Conditions

Mark complete only if:

- Gradle sync/build succeeds with published coordinate
- runtime initializes before UI creation
- RN module renders expected screen

## If Failed

- Re-check coordinate and repository order
- Re-package and re-publish if artifact is stale
- Re-check module name registration in JS

## Canonical Docs

- [Android Integration](https://oss.callstack.com/react-native-brownfield/docs/getting-started/android.md)
- [Guidelines](https://oss.callstack.com/react-native-brownfield/docs/guides/guidelines.md)
- [Troubleshooting](https://oss.callstack.com/react-native-brownfield/docs/guides/troubleshooting.md)

## Common Pitfalls

- Missing `mavenLocal()`
- Dependency coordinate mismatch
- Creating RN UI before host manager initialization

## Related Skills

- [bare-android-aar-generation.md](./bare-android-aar-generation.md) - Bare Android artifact generation
- [bare-quick-start.md](./bare-quick-start.md) - Bare setup prerequisites
