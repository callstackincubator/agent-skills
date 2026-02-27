---
title: Expo Android Integration
impact: HIGH
tags: react-native, brownfield, expo, android, aar, reactnativehostmanager
---

# Skill: Expo Android Integration

Generate and publish Expo Android brownfield AAR, then wire host app runtime initialization and UI mounting.

## Quick Command

```bash
npx brownfield package:android --module-name brownfieldlib --variant release
npx brownfield publish:android --module-name brownfieldlib
```

## When to Use

- User asks for Expo Android brownfield integration
- Expo Android artifact generation and host wiring are required
- Host app must render Expo-backed React Native UI

## Prerequisites

- `expo-quick-start` completed
- Android host app project available
- Expo path is selected (not bare path)

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Package Android AAR
- [ ] Publish AAR to local Maven
- [ ] Initialize ReactNativeHostManager
- [ ] Add configuration change propagation
- [ ] Mount React Native UI
```

1. Build the AAR:

```bash
npx brownfield package:android --module-name brownfieldlib --variant release
```

2. Publish to local Maven:

```bash
npx brownfield publish:android --module-name brownfieldlib
```

3. Initialize React Native in `Activity` or `Application`:

```kotlin
ReactNativeHostManager.initialize(application) {
  Toast.makeText(
      this,
      "React Native has been loaded",
      Toast.LENGTH_LONG
  ).show()
}
```

4. Propagate configuration updates in your `Activity`:

```kotlin
override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)

    ReactNativeHostManager.onConfigurationChanged(application, newConfig)
}
```

5. Present RN UI using one of the supported options:

First option:

```kotlin
@Composable
fun ReactNativeView(
    modifier: Modifier = Modifier
) {
    AndroidFragment<ReactNativeFragment>(
        modifier = modifier,
        arguments = Bundle().apply {
            putString(
                ReactNativeFragmentArgNames.ARG_MODULE_NAME,
                "main"
            )
        }
    )
}
```

Second option:

```kotlin
val rnAppFragment = ReactNativeFragment.createReactNativeFragment("main")
```

Third option:

```kotlin
val rnView = ReactNativeBrownfield.shared.createView(
    this.applicationContext,
    this,
    "main"
)
```

## Common Pitfalls

- Using `ComponentActivity` for Expo apps; Expo requires `AppCompatActivity`
- Missing `ReactNativeHostManager.initialize(...)` before RN UI creation
- Skipping `onConfigurationChanged(...)` forwarding
- Module name mismatch between host and JS registration

## Related Skills

- [quick-start.md](./quick-start.md) - Shared setup and path gate
- [expo-quick-start.md](./expo-quick-start.md) - Expo setup and plugin wiring
- [expo-ios-integration.md](./expo-ios-integration.md) - Expo iOS equivalent
