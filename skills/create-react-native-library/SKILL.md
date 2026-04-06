---
name: create-react-native-library
description: Scaffolds React Native libraries with create-react-native-library for standalone libraries or local native modules and views. Use when creating or working on React Native libraries or adding native functionality in an existing app.
license: MIT
metadata:
  author: Callstack
  tags: react-native, library, create-react-native-library, react-native-builder-bob, scaffolding, turbo-module, fabric, nitro, publishing
---

# Create React Native Library

## Overview

Use this skill to scaffold a standalone React Native library or a local library inside an existing app, then continue with the correct implementation docs.

Examples:

- JS-only library that may use other React Native libraries
- Native modules that expose native functionality to JavaScript
- Native UI components that render native views in React Native

Choose one flow first:

- Use [scaffold-library.md][scaffold-library] when creating a new library that may be published to npm
- Use [local-library.md][local-library] when exposing native functionality in a React Native app

## When to Apply

Use this skill when:

- Creating or working on a React Native library with `create-react-native-library`
- Creating a native module or view in an existing app
- Wrapping native SDKs and exposing them to React Native

## Quick Reference

```bash
# Inspect current options before scaffolding
npx create-react-native-library@latest --help

# Scaffold a library with turbo modules and the Expo example app
npx create-react-native-library@latest awesome-library \
  --no-interactive \
  --yes \
  --description "A brief description of the library" \
  --type turbo-module \
  --languages kotlin-objc \
  --example expo

# Scaffold a local Turbo Module inside an existing app
cd MyApp
npx create-react-native-library@latest awesome-library \
  --local \
  --no-interactive \
  --yes \
  --description "A brief description of the library" \
  --type turbo-module \
  --languages kotlin-objc
```

## References

| File                                    | Description                                             |
| --------------------------------------- | ------------------------------------------------------- |
| [scaffold-library.md][scaffold-library] | Scaffold a new library and default to the Expo example  |
| [local-library.md][local-library]       | Add a local library to an existing app with autolinking |

## Problem -> Skill Mapping

| Problem                                      | Start With                           |
| -------------------------------------------- | ------------------------------------ |
| Need a new library scaffold                  | [scaffold-library][scaffold-library] |
| Need to add a local native library to an app | [local-library][local-library]       |

[scaffold-library]: references/scaffold-library.md
[local-library]: references/local-library.md
