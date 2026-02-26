---
title: Android AAR Generation
impact: CRITICAL
tags: react-native, brownfield, android, aar, gradle, maven
---

# Skill: Android AAR Generation

Package a React Native app into an Android AAR and publish it locally for deterministic native consumption.

## Quick Command

```bash
npx brownfield package:android --variant Release --module-name <android_module_name>
npx brownfield publish:android --module-name <android_module_name>
```

## When to Use

- Building an Android-consumable artifact from React Native for brownfield integration
- Publishing local Maven artifacts for host app testing
- Rebuilding AAR after React Native or native dependency changes

## Prerequisites

- `quick-start` baseline completed successfully
- Android library module created with Kotlin language and Kotlin DSL (for example `reactnativeapp` with `build.gradle.kts`)
- Brownfield Gradle plugin configured in project and module build files
- Module has RN + Hermes dependencies aligned with the React Native version

## Mandatory Execution Contract (Agent)

These rules are non-negotiable and override any optimization shortcuts:

1. MUST create or verify existence of a dedicated Android library module (for example `reactnativeapp`) before running any `brownfield package:android` or `brownfield publish:android` command.
2. MUST NOT use an application module (for example `:app`) as `--module-name`.
3. MUST execute steps sequentially and MUST NOT continue to the next step unless the current step verification passes.
4. MUST provide evidence after each step:
   - changed file path(s)
   - command executed
   - exit code
5. MUST use Kotlin DSL (`build.gradle.kts`) and Kotlin language when scaffolding the Android library module.
6. If any required precondition is missing, STOP and satisfy it first.

## Forbidden Shortcuts

- Reusing an existing `com.android.application` module for AAR packaging/publishing.
- Running package/publish commands before verifying module setup, plugin setup, and dependency alignment.
- Switching module strategy mid-flow unless the checklist explicitly requires it due to failure recovery.

## Step-by-Step Instructions

```text
Progress checklist:
- [ ] Library module exists and assembles
- [ ] Brownfield plugin and autolinking configured
- [ ] BuildConfig fields and publishing configured
- [ ] package:android command succeeds
- [ ] publish:android command succeeds
- [ ] Maven coordinates resolve from host app
```

0. Preflight gate (STOP if not satisfied):

   - Verify a dedicated Android library module exists (for example `:reactnativeapp`).
   - Verify module scaffolding uses Kotlin language and Kotlin DSL (`build.gradle.kts`).
   - Verify target module applies `com.android.library` (not `com.android.application`).
   - Verify target module is the module passed to `--module-name`.

1. Ensure project-level plugin classpath is present:

```groovy
classpath("com.callstack.react:brownfield-gradle-plugin:0.6.3")
```

2. Ensure module-level plugins include:

```kotlin
id("com.android.library")
id("org.jetbrains.kotlin.android")
id("com.facebook.react")
id("com.callstack.react.brownfield")
`maven-publish`
```

3. Ensure React autolinking is configured in module:

```kotlin
react {
    autolinkLibrariesWithApp()
}
```

4. Ensure dependencies are version-aligned with `package.json` React Native version:

```kotlin
api("com.facebook.react:react-android:<rn_version>")
api("com.facebook.hermes:hermes-android:<hermes_or_rn_compatible_version>")
```

5. Add build config fields and variant publishing in the library module:

```kotlin
android {
    defaultConfig {
        minSdk = 24

        buildConfigField("boolean", "IS_EDGE_TO_EDGE_ENABLED", properties["edgeToEdgeEnabled"].toString())
        buildConfigField("boolean", "IS_NEW_ARCHITECTURE_ENABLED", properties["newArchEnabled"].toString())
        buildConfigField("boolean", "IS_HERMES_ENABLED", properties["hermesEnabled"].toString())
    }

    publishing {
        multipleVariants {
            allVariants()
        }
    }
}
```

6. Add publishing configuration in the library module:

```kotlin
import groovy.json.JsonOutput
import groovy.json.JsonSlurper

publishing {
    publications {
        create<MavenPublication>("mavenAar") {
            groupId = "com.yourapp"
            artifactId = "reactnativeapp"
            version = "0.0.1-local"
            afterEvaluate {
                from(components.getByName("default"))
            }

            pom {
                withXml {
                    val dependenciesNode = (asNode().get("dependencies") as groovy.util.NodeList).first() as groovy.util.Node
                    dependenciesNode.children()
                        .filterIsInstance<groovy.util.Node>()
                        .filter { (it.get("groupId") as groovy.util.NodeList).text() == rootProject.name }
                        .forEach { dependenciesNode.remove(it) }
                }
            }
        }
    }

    repositories {
        mavenLocal()
    }
}

val moduleBuildDir: Directory = layout.buildDirectory.get()

tasks.register("removeDependenciesFromModuleFile") {
    doLast {
        file("$moduleBuildDir/publications/mavenAar/module.json").run {
            val json = inputStream().use { JsonSlurper().parse(it) as Map<String, Any> }
            (json["variants"] as? List<MutableMap<String, Any>>)?.forEach { variant ->
                (variant["dependencies"] as? MutableList<Map<String, Any>>)?.removeAll { it["group"] == rootProject.name }
            }
            writer().use { it.write(JsonOutput.prettyPrint(JsonOutput.toJson(json))) }
        }
    }
}

tasks.named("generateMetadataFileForMavenAarPublication") {
   finalizedBy("removeDependenciesFromModuleFile")
}
```

7. Add React Native host bootstrap helper in the library module:

Create `apps/<app_name>/android/<module_name>/src/main/java/com/<module_name>/ReactNativeHostManager.kt`:

```kotlin
package `insert package_name`

import android.app.Application
import com.callstack.reactnativebrownfield.OnJSBundleLoaded
import com.callstack.reactnativebrownfield.ReactNativeBrownfield
import com.facebook.react.PackageList
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative

object ReactNativeHostManager {
    fun initialize(application: Application, onJSBundleLoaded: OnJSBundleLoaded? = null) {
        loadReactNative(application) // Only required for RN >= 0.80.0

        val packageList = PackageList(application).packages
        ReactNativeBrownfield.initialize(application, packageList, onJSBundleLoaded)
    }
}
```

Use `ReactNativeHostManager.initialize(...)` from the host native app startup path (for example `Application.onCreate()`) to initialize the React Native instance before loading RN-powered screens.

8. Build and package AAR:

```bash
npx brownfield package:android --variant Release --module-name <android_module_name>
```

   Verification gate:
   - Exit code is `0`.
   - Output includes successful Gradle assembly for target module.

9. Publish to local Maven:

```bash
npx brownfield publish:android --module-name <android_module_name>
```

   Verification gate:
   - Exit code is `0`.
   - Output indicates publication to local Maven (`~/.m2/repository` or equivalent).

10. Validate:
   - Packaging commands complete without Gradle resolution failures
   - Local Maven contains expected coordinate `<groupId>:<artifactId>:<version>`
   - Host app can resolve the published artifact

## Stop Conditions

Proceed only if all are true:
- `npx brownfield package:android ...` exits with code `0`
- `npx brownfield publish:android ...` exits with code `0`
- Published coordinate is resolvable from a host app with `mavenLocal()`
- Module uses RN/Hermes versions aligned to `package.json`

## If Failed

- If package step fails, validate module name and variant flags, then retry:
  - `npx brownfield package:android --variant Release --module-name <android_module_name>`
- If publish step fails, ensure `maven-publish` is enabled and rerun publish command
- If host app cannot resolve dependency, confirm:
  - `mavenLocal()` is configured in `dependencyResolutionManagement`
  - dependency coordinate matches published `groupId:artifactId:version`
- If native dependency conflicts appear, clean and rebuild:
  - `cd android && ./gradlew clean && cd ..`
- Do not continue to host runtime integration until coordinate resolution passes
- If failure indicates wrong module type (application instead of library), STOP and create/fix the dedicated library module before retrying package/publish

## Common Pitfalls

- RN dependency versions in Gradle do not match `package.json`
- Missing `mavenLocal()` in host app repository configuration
- Omitting publish step and expecting host app dependency resolution to work
- Variant/module-name mismatch between package and publish commands

## Related Skills

- [quick-start.md](./quick-start.md) - Preflight setup and readiness checks
- [android-native-integration.md](./android-native-integration.md) - Consume published AAR in host app
- [ios-xcframework-generation.md](./ios-xcframework-generation.md) - iOS artifact generation equivalent
- [ios-native-integration.md](./ios-native-integration.md) - iOS host consumption equivalent
