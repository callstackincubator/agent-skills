---
title: Bare Android Native Integration
impact: HIGH
tags: react-native, brownfield, bare, android, aar
---

# Skill: Bare Android Native Integration

Consume published bare RN AAR artifact in a native Android host app and verify runtime rendering.

## Quick Command

```kotlin
// settings.gradle.kts
dependencyResolutionManagement {
    repositories { mavenLocal() }
}

// app/build.gradle.kts
dependencies {
    implementation("<groupId>:<artifactId>:<version>")
}
```

## When to Use

- Consuming locally published AAR from bare RN in a host Android app
- Wiring host app initialization and rendering with `ReactNativeBrownfield` for bare RN

## Prerequisites

- `bare-android-aar-generation` completed successfully
- AAR published to local Maven
- Host app Gradle sync/build is healthy

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Add mavenLocal repository to host dependency resolution
- [ ] Add implementation dependency for published AAR
- [ ] Initialize ReactNativeHostManager in host startup path
- [ ] Render ReactNativeFragment or ReactNativeBrownfield view
- [ ] Verify startup and bundle load callbacks
```

1. Add `mavenLocal()` to host `settings.gradle.kts`:

```kotlin
dependencyResolutionManagement {
    repositories {
        mavenLocal()
        google()
        mavenCentral()
    }
}
```

2. Add dependency in host app module:

```kotlin
dependencies {
    implementation("<groupId>:<artifactId>:<version>")
}
```

3. Initialize in host `MainActivity`:

```kotlin
ReactNativeHostManager.initialize(this.application) {
    println("JS bundle loaded")
}
```

4. Render RN UI:
   - Fragment path: `ReactNativeFragment.createReactNativeFragment("<registered_module_name>")`
   - View path: `ReactNativeBrownfield.shared.createView(...)`

5. Build and run host app:
   - Confirm Gradle resolves AAR from local Maven.
   - Confirm RN surface mounts and renders expected module.

6. Smoke-test lifecycle transitions (foreground/background, configuration change, back navigation).

## Stop Conditions

Mark Android integration complete only if all are true:
- Host app Gradle sync succeeds with `mavenLocal()` enabled
- Host app builds and runs with published AAR dependency
- `ReactNativeHostManager.initialize(...)` executes before RN UI creation
- RN fragment/view renders expected module and bundle load callback is observed

## If Failed

- If dependency cannot be resolved, re-check coordinate and repository order:
  - `mavenLocal()`, `google()`, `mavenCentral()`
  - exact `implementation("<groupId>:<artifactId>:<version>")`
- If app crashes before render, ensure initialization runs before fragment/view creation
- If module does not render, verify registered JS module name
- If artifact may be stale, rebuild and republish AAR:
  - `npx brownfield package:android --variant Release --module-name <android_module_name>`
  - `npx brownfield publish:android --module-name <android_module_name>`
- Do not accept integration as complete until dependency resolution and runtime render both pass

## Common Pitfalls

- Missing `mavenLocal()` in dependency resolution repositories
- Dependency coordinate mismatch with published artifact version
- Not initializing host manager before creating RN fragment/view
- Module name mismatch vs JS registration name

## Related Skills

- [bare-android-aar-generation.md](./bare-android-aar-generation.md) - Bare Android artifact generation
- [bare-quick-start.md](./bare-quick-start.md) - Bare setup prerequisites
