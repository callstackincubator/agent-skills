---
title: Expo Brownfield Quick Start
impact: CRITICAL
tags: react-native, brownfield, expo, app.json, plugin, setup
---

# Skill: Expo Brownfield Quick Start

Configure Expo project for brownfield packaging before iOS/Android host integration.

## Quick Command

```bash
npm install @callstack/react-native-brownfield
```

## When to Use

- Expo managed or prebuild project needs brownfield packaging
- Continuing after [expo-create-app.md](./expo-create-app.md)

## Prerequisites

- Expo project with `app.json`
- Expo path selected in router

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Install package
- [ ] Configure plugin
- [ ] Create brownfield config
- [ ] Continue to platform integration
```

1. Install package in the Expo project.
2. Add plugin to `app.json`:

```json
{
  "plugins": ["@callstack/react-native-brownfield"]
}
```

3. Create the brownfield configuration — the iOS scheme, the Android module name and variant, and
   any `ios.expo` / `android.expo` plugin options — so packaging commands stay short. See
   [cli-and-config.md](./cli-and-config.md); exactly one config source is allowed.
4. Optionally add package scripts for packaging/publish commands used by your team.
5. If the app uses `expo-router`, set up the brownfield entry point (see [Expo Router entry point](#expo-router-entry-point)).
6. Continue to exactly one platform file:
   - [expo-ios-integration.md](./expo-ios-integration.md)
   - [expo-android-integration.md](./expo-android-integration.md)

## Expo Router entry point

Apply this only when the app uses `expo-router` and the native host must mount a named module. Do not change `package.json.main` for bare React Native apps, Expo apps without `expo-router`, or projects that already have a working brownfield entry point.

`expo-router/entry` registers only Expo's default `main` component, so the native host cannot look up its own module name. If `package.json` has `"main": "expo-router/entry"`, change it to `"index.tsx"` and create `index.tsx` at the project root:

```tsx
import { registerRootComponent } from 'expo';
import { AppRegistry } from 'react-native';

import { App as ExpoRouterApp } from 'expo-router/build/qualified-entry';

export const BROWNFIELD_MODULE_NAME = 'MyBrownfieldModule';

// Keeps Expo's default "main" registration (expo start, expo run:ios, fast refresh).
registerRootComponent(ExpoRouterApp);

// Registers the same root under the name the native host mounts:
//   ReactNativeBrownfield.shared.view(moduleName: "MyBrownfieldModule")
AppRegistry.registerComponent(BROWNFIELD_MODULE_NAME, () => ExpoRouterApp);
```

Notes:

- Import `App` from `expo-router/build/qualified-entry`. It resolves `expo-router/_ctx` against the auto-detected router root (for example `src/app`), so do not hand-roll `require.context('./app')` with a hardcoded path.
- Adapt `BROWNFIELD_MODULE_NAME` to the module name the host uses; it must equal the string passed to `ReactNativeView(moduleName:)` / `view(moduleName:)`.
- To expose additional feature modules, add more `AppRegistry.registerComponent('<Name>', () => <Component>)` lines. Import local files without a `.tsx` extension.

## Canonical Docs

- [Expo Integration](https://oss.callstack.com/react-native-brownfield/docs/getting-started/expo.md)
- [Brownfield CLI](https://oss.callstack.com/react-native-brownfield/docs/cli/brownfield.md)

## Common Pitfalls

- Missing plugin entry in `app.json`
- `package.json.main` still `expo-router/entry`, so the native module name is never registered
- Mixing Expo flow with bare packaging files

## Related Skills

- [cli-and-config.md](./cli-and-config.md) - CLI commands, config file, artifacts
- [quick-start.md](./quick-start.md) - Path-selection gate
- [expo-ios-integration.md](./expo-ios-integration.md) - Expo iOS integration
- [expo-android-integration.md](./expo-android-integration.md) - Expo Android integration
