---
title: Bare Android AAR Generation
impact: CRITICAL
tags: react-native, brownfield, bare, android, aar
---

# Skill: Bare Android AAR Generation

Package a bare React Native app into an Android AAR and publish it for native host consumption.

## Quick Command

```bash
npx brownfield package:android --variant release --module-name <android_module_name>
npx brownfield publish:android --module-name <android_module_name>
```

## When to Use

- Building Android artifact from bare RN app
- Publishing AAR for host app dependency resolution

## Prerequisites

- [bare-quick-start.md](./bare-quick-start.md) completed
- Dedicated Android library module exists (`com.android.library`)
- Brownfield Gradle plugin configured
- RN and Hermes dependency versions aligned with `package.json`

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Library module verified
- [ ] Plugin + autolinking configured
- [ ] Publishing configured
- [ ] package:android succeeds
- [ ] publish:android succeeds
- [ ] Host app resolves Maven coordinate
```

1. Verify target module is a library module and will be passed as `--module-name`.
2. Ensure module plugins include:
   - `com.android.library`
   - `org.jetbrains.kotlin.android`
   - `com.facebook.react`
   - `com.callstack.react.brownfield`
   - `maven-publish`
3. Ensure autolinking is enabled in module:

```kotlin
react {
    autolinkLibrariesWithApp()
}
```

4. Add/verify facade bootstrap class in artifact module (host app should call only this facade):

```kotlin
object ReactNativeHostManager {
    fun initialize(application: Application, onJSBundleLoaded: OnJSBundleLoaded? = null) {
        loadReactNative(application)
        val packageList = PackageList(application).packages
        ReactNativeBrownfield.initialize(application, packageList, onJSBundleLoaded)
    }
}
```

5. Package AAR:
   - `npx brownfield package:android --variant release --module-name <android_module_name>`
6. Publish to Maven local:
   - `npx brownfield publish:android --module-name <android_module_name>`
7. Validate host app resolves `groupId:artifactId:version` with `mavenLocal()` enabled.

## Stop Conditions

Proceed only if:

- package and publish commands exit with code `0`
- host app resolves published coordinate

## If Failed

- Re-check module type (`com.android.library`) and module-name flag
- Re-check plugin configuration and `maven-publish`
- Clean/rebuild Android project and retry package/publish
- Do not proceed to runtime integration until coordinate resolution passes

## Canonical Docs

- [Android Integration](https://oss.callstack.com/react-native-brownfield/docs/getting-started/android.md)
- [Brownfield CLI](https://oss.callstack.com/react-native-brownfield/docs/cli/brownfield.md)
- [Guidelines](https://oss.callstack.com/react-native-brownfield/docs/guides/guidelines.md)
- [Troubleshooting](https://oss.callstack.com/react-native-brownfield/docs/guides/troubleshooting.md)

## Common Pitfalls

- Using app module instead of library module for packaging
- RN/Hermes dependency mismatch vs `package.json`
- Missing `mavenLocal()` in host dependency resolution

## Related Skills

- [bare-quick-start.md](./bare-quick-start.md) - Bare setup prerequisites
- [bare-android-native-integration.md](./bare-android-native-integration.md) - Bare Android host integration
