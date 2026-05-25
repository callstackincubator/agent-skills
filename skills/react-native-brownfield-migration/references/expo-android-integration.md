---
title: Expo Android Integration
impact: HIGH
tags: react-native, brownfield, expo, android, aar, reactnativehostmanager
---

# Skill: Expo Android Integration

Package and publish Expo Android AAR, then initialize host runtime and mount RN UI.

## Quick Command

```bash
npx brownfield package:android --module-name <android_module_name> --variant release
npx brownfield publish:android --module-name <android_module_name>
```

## When to Use

- User requests Expo Android brownfield integration
- Host app must consume Expo-backed RN AAR

## Prerequisites

- [expo-quick-start.md](./expo-quick-start.md) completed
- Android host app builds and syncs
- Android module name resolved (`brownfieldlib` by default unless overridden in Expo plugin options)

## Agent-Assisted Verification

Use `agent-device` after the host build succeeds. Read the `agent-device` skill or CLI help when available before exact commands. If it is missing and verification needs it, install it through the environment's approved/trusted path or ask the user to install or enable it. Then open the host app, navigate to the Expo-backed RN surface, capture snapshots/screenshots, and collect logs for runtime behavior.

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Package AAR
- [ ] Publish to Maven local
- [ ] Initialize host runtime
- [ ] Render RN module
```

1. Build AAR:
   - `npx brownfield package:android --module-name <android_module_name> --variant release`
2. Publish to Maven local:
   - `npx brownfield publish:android --module-name <android_module_name>`
3. Initialize runtime in `Activity` or `Application`:

```kotlin
ReactNativeHostManager.initialize(application) {
  Toast.makeText(this, "React Native has been loaded", Toast.LENGTH_LONG).show()
}
```

4. Forward configuration changes:

```kotlin
override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)
    ReactNativeHostManager.onConfigurationChanged(application, newConfig)
}
```

5. Render RN UI with JS-registered module name:
   - `ReactNativeFragment.createReactNativeFragment("<registered_module_name>")`
   - or `ReactNativeBrownfield.shared.createView(context, activity, "<registered_module_name>")`

## Stop Conditions

Mark complete only if:

- package and publish commands both exit with code `0`
- host app resolves published dependency and renders module
- device evidence is captured with `agent-device` when possible

## Canonical Docs

- [Expo Integration](https://oss.callstack.com/react-native-brownfield/docs/getting-started/expo.md)
- [Android Integration](https://oss.callstack.com/react-native-brownfield/docs/getting-started/android.md)
- [Brownfield CLI](https://oss.callstack.com/react-native-brownfield/docs/cli/brownfield.md)

## Common Pitfalls

- Using `ComponentActivity` with Expo (use `AppCompatActivity`)
- Missing `ReactNativeHostManager.initialize(...)` before UI creation
- Module name mismatch with `AppRegistry.registerComponent`

## Related Skills

- [expo-quick-start.md](./expo-quick-start.md) - Expo setup and plugin wiring
- [expo-ios-integration.md](./expo-ios-integration.md) - Expo iOS equivalent
