---
title: Add a Local Library to an Existing App
impact: HIGH
tags: react-native, library, create-react-native-library, local, autolinking, monorepo, expo
---

# Skill: Add a Local Library to an Existing App

Scaffold a local library inside an existing React Native app with `create-react-native-library`.

## When to Use

- Adding native functionality or UI components to an existing React Native app

## Prerequisites

- An existing React Native app with `package.json` at the root

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Create local library with CLI
- [ ] Verify symlink setup in node_modules
- [ ] Install dependencies to create symlink
- [ ] Import and use the library in the app
```

- Run `npx create-react-native-library@latest --help` to check the latest available options.
- Choose the appropriate `--type` based on user's requirements:
  - Use `turbo-module` or `nitro-module` for exposing native APIs.
  - Use `fabric-view` or `nitro-view` for rendering native UI components.
- Choose the appropriate `--languages` based on the `--type`:
  - Use `kotlin-objc` for Turbo Modules or Fabric Components.
  - Use `kotlin-swift` for Nitro Modules or Nitro Views.
- Run the `npx create-react-native-library@latest` command with the `--local` flag from the root of the existing app to scaffold a local library under the `modules/` folder:

  ```bash
  cd MyApp

  # Scaffold a local Turbo Module inside the app repo
  npx create-react-native-library@latest awesome-library \
    --local \
    --no-interactive \
    --yes \
    --description "A brief description of the library" \
    --type turbo-module \
    --languages kotlin-objc
  ```

- Verify the local library is linked correctly in the app's `dependencies` in `package.json`:
  - If the app uses Yarn, the generated dependency entry in `package.json` should use `link:` (`"react-native-awesome-library": "link:./modules/awesome-library"`)
  - If the app uses npm, the generated dependency entry in `package.json` should use `file:` (`"react-native-awesome-library": "file:./modules/awesome-library"`)
  - For other package manager setups, refer to the package manager documentation on how to create symlink under `node_modules` that points to the local library.
- Run `yarn install` or `npm install` from the app root to create the symlink under `node_modules` that points to the local library.
- For nitro modules or views, ensure `react-native-nitro-modules` dependency is added to the app's `package.json`.
- Import the library with its package name (e.g. `import { multiply } from 'react-native-awesome-library'`) in the app to use it.

## Generated Project Structure

Typical generated layout:

```text
MyApp/
  package.json
  modules/
    awesome-library/
      src/            TypeScript entry points
      android/        Android native implementation
      ios/            iOS native implementation
      package.json    Local package metadata
```

The local library is self contained under the `modules/` folder and is symlinked into the app's `node_modules/` for autolinking.

## Common Pitfalls

- **Not running the command from an app directory**: Run from a React Native app directory that already contains `package.json`.
- **Using incorrect combination of `--type` and `--languages`**: Use `kotlin-objc` for turbo modules and fabric views, and use `kotlin-swift` for nitro modules and nitro views.

## Canonical Docs

- [Local library](https://oss.callstack.com/react-native-builder-bob/create#local-library)
- [React Native Turbo Modules](https://reactnative.dev/docs/turbo-native-modules-introduction)
- [React Native Fabric Native Components](https://reactnative.dev/docs/fabric-native-components-introduction)
- [Nitro Modules Getting Started](https://nitro.margelo.com/docs/getting-started/what-is-nitro)
