---
title: Create a React Native Library
impact: HIGH
tags: react-native, library, create-react-native-library, expo, builder-bob, scaffolding
---

# Skill: Create a React Native Library

Scaffold a new library with `create-react-native-library`.

## When to Use

- Starting a new React Native library that may be published to npm
- Working on an existing React Native library scaffolded with `create-react-native-library`

## Prerequisites

- Node.js version should match one of the following:
  - 20.19.0 or higher (LTS)
  - 22.12.0 or higher (LTS)
  - 23.4.0 or higher

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Scaffold library with CLI
- [ ] Read generated CONTRIBUTING.md for next steps
- [ ] Run yarn install to set up dependencies
- [ ] Run post install tasks (e.g. prebuild, pod-install, nitrogen)
- [ ] Run example app to test the library
```

- Run `npx create-react-native-library@latest --help` to check the latest available options.
- Choose the appropriate `--type` based on user's requirements:
  - Use `turbo-module` or `nitro-module` for exposing native APIs.
  - Use `fabric-view` or `nitro-view` for rendering native UI components.
  - Use `library` for a JS-only package.
- Choose the appropriate `--languages` based on the `--type`:
  - Use `kotlin-objc` for Turbo Modules or Fabric Components.
  - Use `kotlin-swift` for Nitro Modules or Nitro Views.
  - Use `js` for a JS-only library.
- Choose the appropriate `--example`:
  - Use `expo` for a managed Expo example app. This is recommended for smoother upgrades unless the user explicitly requests a different example.
  - Use `vanilla` for an app with React Native Community CLI.
  - Use `test-app` for a Microsoft's React Native Test App example.
- Run the `npx create-react-native-library@latest` command with the appropriate flags to scaffold the library:

  ```bash
  # Scaffold a library with turbo modules and the Expo example app
  npx create-react-native-library@latest awesome-library \
    --no-interactive \
    --yes \
    --description "A brief description of the library" \
    --type turbo-module \
    --languages kotlin-objc \
    --example expo
  ```

- Read the generated `CONTRIBUTING.md` for project-specific install, build, lint, test, and release instructions.
- Run `yarn install` after scaffolding to set up dependencies.
- When using expo example for native modules and views, run `yarn example expo prebuild` to generate native code for the example app.
- For native modules and views, run `cd example && npx pod-install` to install CocoaPod dependencies.
- For nitro modules and views, run `yarn nitrogen` to generate required native code before building the example app.
- Use `yarn example start` to start the metro bundler for the example app.
- Use `yarn example ios` or `yarn example android` to run the example app on a simulator or device.
- Use `yarn example web` to run the example app in a web browser if the library should work on web.

## Generated Project Structure

Typical generated layout:

```text
awesome-library/
  src/              TypeScript entry points
  example/          Example app to test the library during development
  android/          Android native implementation when applicable
  ios/              iOS native implementation when applicable
  package.json      Package metadata, scripts and config
  CONTRIBUTING.md   Development workflow for the generated project
```

The exact files vary by `--type`, `--languages`, and selected tools.

## Common Pitfalls

- **Not using Yarn**: The generated project uses a monorepo based on Yarn workspaces. Only use `yarn` and do not use other package managers.
- **Using incompatible Node.js version**: Ensure the Node.js version matches the required versions mentioned in the prerequisites.
- **Incorrectly adding native dependencies**: Any React Native libraries that contain native code and are used in the library must be added as `peerDependencies` and `devDependencies` in the library's root `package.json`, then `dependencies` of the example app's `package.json`.

## Canonical Docs

- [Scaffold a React Native library](https://oss.callstack.com/react-native-builder-bob/create)
- [React Native Turbo Modules](https://reactnative.dev/docs/turbo-native-modules-introduction)
- [React Native Fabric Native Components](https://reactnative.dev/docs/fabric-native-components-introduction)
- [Nitro Modules - Getting Started](https://nitro.margelo.com/docs/getting-started/what-is-nitro)
