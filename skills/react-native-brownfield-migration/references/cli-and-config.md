---
title: Brownfield CLI and Configuration
impact: CRITICAL
tags: react-native, brownfield, cli, configuration, packaging
---

# Skill: Brownfield CLI and Configuration

The command and configuration contract for the `brownfield` CLI. Read this before composing any
packaging or publish command, and before adding flags to a `package.json` script.

## Discover options before trusting this file

Flags move between versions. Run `npx brownfield <command> --help` for the command you are about to
use and reconcile it with the tables below. Where they disagree, **the help output wins** — update
this file rather than working around it.

## Commands

| Command | Purpose |
| ------- | ------- |
| `package:ios` | Build the iOS XCFramework artifacts |
| `package:android` | Build the Android AAR |
| `publish:android` | Publish the AAR to Maven local |
| `codegen` | Generate native Brownie store bindings |
| `navigation:codegen` | Generate Brownfield Navigation native bindings |

`--verbose` is a global option available on every command.

The binary ships inside `@callstack/brownfield-cli`, which is a dependency of
`@callstack/react-native-brownfield` — installing the brownfield package is enough to get `npx brownfield`.

### `package:ios`

| Flag | Notes |
| ---- | ----- |
| `--scheme <name>` | Framework target to build. Required whenever the packaged framework cannot be resolved unambiguously |
| `--configuration <name>` | Case sensitive. Defaults to `Debug` when neither the flag nor the config sets it |
| `--target <name>` | Xcode target |
| `--destination <strings...>` | Slices to build: `simulator`, `device`, or any `xcodebuild -destination` value. Omitted, **both** are built |
| `--use-prebuilt-rn-core [bool]` | Use React Native Apple prebuilt binaries for the packaging build. Omitted, the default is version-aware; the flag without a value means `true` |
| `--use-prebuilt-expo [bool]` | Use prebuilt Expo support XCFrameworks instead of compiling Expo modules. Omitted, the default is version-aware; the flag without a value means `true` |
| `--add-spm-package` | Generate a local Swift package manifest next to the packaged XCFrameworks |
| `--build-folder <path>` | Intermediate build directory. Defaults to `.brownfield/build` |
| `--extra-params <string>` | Extra `xcodebuild` parameters |
| `--export-extra-params <string>` | Extra export parameters |
| `--export-options-plist <path>` | Defaults to `ExportOptions.plist` |
| `--no-install-pods` | Skip the CocoaPods install step |
| `--no-new-arch` | Build without the New Architecture |
| `--verbose` | Verbose logging |

Both boolean-valued flags accept `true`/`1`/`false`/`0`; anything else fails with
`Invalid value for <flag>: expected true or false`.

`--archive` and `--local` are inherited from the underlying build tooling, so they are accepted but
unsupported. **Do not plan a migration step around them** — archive the host app in Xcode against
the packaged frameworks instead.

### `package:android` / `publish:android`

| Flag | Commands | Notes |
| ---- | -------- | ----- |
| `--module-name <name>` | both | The AAR module. Spelling follows the project: a Gradle path such as `:BrownfieldLib` for a bare app whose module is declared in `settings.gradle`, or a plain name such as `brownfieldlib` for the Expo plugin default |
| `--variant <name>` | `package:android` | Build variant from build type plus product flavor, e.g. `release` or `devRelease` |
| `--use-local-maven` | both | Resolve the Brownfield Gradle plugin from the local Maven repository. **Not documented upstream** — confirmed in the CLI source |
| `--verbose` | both | Verbose logging |

### `codegen` and `navigation:codegen`

| Command | Flags |
| ------- | ----- |
| `codegen` | `-p, --platform <swift\|kotlin>`. Omitted, both are generated |
| `navigation:codegen` | `[specPath]` positional (defaults to `brownfield.navigation.ts`), `--dry-run` |

You rarely run these by hand — see [Side effects](#side-effects-codegen-runs-automatically).

## Configuration file

Put stable per-project settings in a config file and keep only per-run flags on the command line.
A project driven this way runs a bare `npx brownfield package:ios`.

Exactly one source is allowed. Two or more raises
`Project has multiple Brownfield configuration files`:

1. `brownfield.config.js` (project root)
2. `brownfield.config.json` (project root)
3. the `brownfield` key in `package.json`

### Shape

```json
{
  "$schema": "https://oss.callstack.com/react-native-brownfield/schema.json",
  "verbose": true,
  "ios": {
    "scheme": "BrownfieldLib",
    "configuration": "Release",
    "expo": {}
  },
  "android": {
    "moduleName": "brownfieldlib",
    "variant": "release",
    "expo": { "useLocalMaven": true }
  },
  "brownie": {
    "kotlin": "./android/brownfieldlib/src/main/java/<package_path>/Generated/",
    "kotlinPackageName": "<kotlin_package_name>"
  }
}
```

- `ios` accepts the `package:ios` options; `android` accepts the `package:android` and
  `publish:android` options. Use the camelCase form of each flag (`--use-prebuilt-expo` ->
  `usePrebuiltExpo`, `--add-spm-package` -> `addSpmPackage`, `--module-name` -> `moduleName`).
- `ios.expo` and `android.expo` are **Expo config plugin** options for the prebuild scaffolding
  (framework name, bundle identifier, deployment target, Android package name, SDK versions,
  Maven coordinates, Proguard rules, missing dimension strategies). They are a different layer from
  the packaging flags above — consult the Expo integration docs for the current key list.
- `brownie` configures Brownie codegen output. A top-level `brownie` key in `package.json` is the
  legacy location and warns; prefer the nested key shown here.
- The config is validated against the published JSON schema. Validation problems are warnings,
  not errors — a typo'd key is silently ignored, so read the warnings.

### Precedence

CLI options override config values for the same key, and the CLI logs a warning naming each
overridden key and both values. Treat those warnings as a signal that a command line and a config
file disagree about the project, and fix one of them.

### Working shapes to copy

Each of the three sources has a working example in the `react-native-brownfield` repo's apps —
see [Reference apps](./runtime-api.md#reference-apps).

## Outputs

iOS artifacts land in `<ios_source_dir>/.brownfield/package/build`, and the intermediate build
directory is `<ios_source_dir>/.brownfield/build`. For a bare app that is `ios/.brownfield/...`;
for an Expo app the same paths apply under the prebuilt `ios/` directory.

What appears there:

- `<framework_target_name>.xcframework`
- `ReactBrownfield.xcframework` (binary stripped — it is interface-only, to avoid duplicate symbols)
- `hermesvm.xcframework` (named `hermes.xcframework` on older React Native; hosts that expect one
  name may need the other renamed)
- `Brownie.xcframework`, when the project uses Brownie
- `BrownfieldNavigation.xcframework`, when the project uses Brownfield Navigation
- React Native and Expo support XCFrameworks emitted alongside, when prebuilts are in use

With `--add-spm-package`, the XCFrameworks are moved into a `spm-artifacts/` subdirectory and
`Package.swift` is written next to them. See
[expo-ios-integration.md](./expo-ios-integration.md#spm-host---add-spm-package) for wiring the
package into the host project — the CLI does not do that part.

Android artifacts are published to Maven local by `publish:android` under the group, artifact and
version configured in the library module's publishing block.

## Side effects: codegen runs automatically

`package:ios`, `package:android` and `publish:android` each run Brownie codegen and Brownfield
Navigation codegen first, when the project uses those packages. Consequences:

- A change to a Brownie store definition or a navigation spec is picked up by the next package run.
  You do not need a separate codegen step before packaging.
- Generated native sources are refreshed under `node_modules` and, for Kotlin, at the configured
  `brownie.kotlin` output path. Do not hand-edit generated files; change the spec and re-package.
- A codegen failure fails the package command before any build work happens — read the first error,
  not the last.

For the store and navigation contracts themselves, use the dedicated `brownie` and
`brownfield-navigation` skills if they are installed. They are distributed separately from this
skill, so invoke them by name rather than by path.

## Canonical Docs

- [Brownfield CLI](https://oss.callstack.com/react-native-brownfield/docs/cli/brownfield.md)
- [Configuration](https://oss.callstack.com/react-native-brownfield/docs/api-reference/configuration.md)
- [Expo Integration](https://oss.callstack.com/react-native-brownfield/docs/getting-started/expo.md)

## Common Pitfalls

- Repeating the same flags on every command instead of writing them once to `brownfield.config.*`
- Two config sources present at once (the CLI refuses to run)
- Assuming a flag exists because it appears in an older reference, instead of running `--help`
- Planning around `--archive` / `--local` on `package:ios`
- Treating the config schema warning as harmless when a key was simply misspelled
- Looking for artifacts under `.brownfield/package` instead of `.brownfield/package/build`

## Related Skills

- [runtime-api.md](./runtime-api.md) - Host <-> RN API surface
- [expo-ios-integration.md](./expo-ios-integration.md) - Expo iOS packaging and host wiring
- [bare-ios-xcframework-generation.md](./bare-ios-xcframework-generation.md) - Bare iOS packaging
