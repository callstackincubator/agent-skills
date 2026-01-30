---
title: Upgrading React Native
impact: HIGH
tags: react-native, upgrade, upgrade-helper, npm, changelog, cocoapods, ios, android
---

# Skill: Upgrading React Native

Upgrade a React Native Community CLI project using the Upgrade Helper diff and official changelogs.

## Quick Command

```bash
rg '"react-native"' package.json
npm view react-native dist-tags.latest
rg '"expo"|expo-config|expo-updates' package.json
<package-manager> install
cd ios && bundle exec pod install
```

## When to Use

- Project needs to move to a newer React Native version
- Build tools or dependencies require a newer React Native baseline
- You need the official Upgrade Helper diff for a safe upgrade

## Prerequisites

- Confirm this is not an Expo-managed project (stop and use https://github.com/expo/skills/upgrading-expo instead)
- Ensure the repo is clean or on a dedicated upgrade branch
- Know which package manager the repo uses (npm, yarn, pnpm, bun)
- Use Node.js 20.19.4+ and Java 17, following https://reactnative.dev/docs/set-up-your-environment
- Verify versions are active (`node -v`, `java -version`) before upgrading

## Step-by-Step Instructions

### Phase 1: Scope and sources

1. **Determine the current React Native version (`<current-version>`).**
   - Read `package.json` dependencies for `react-native`.
   - Example: `"react-native": "0.78.2"`.

2. **Confirm this is not an Expo project.**
   - If `expo`, `expo-updates`, or `app.json` with Expo config is present, stop.
   - Use: https://github.com/expo/skills/upgrading-expo

3. **Determine the target React Native version (`<latest-version>`).**
   - Use npm dist-tags: `npm view react-native dist-tags.latest` or a version provided by the user.

4. **Gather upgrade sources.**
   - Upgrade Helper diff: `https://react-native-community.github.io/upgrade-helper/?from=<current-version>&to=<latest-version>`.
   - If the UI fails or is incomplete, fetch rn-diff-purge directly:
     - Compare tags: `https://github.com/react-native-community/rn-diff-purge/compare/release/<current-version>..release/<latest-version>.diff`
     - Optional no-cache hint (may help some proxies): add `?no-cache`
     - Local fetch (preferred for agents):  
       `curl -L -o /tmp/rn-diff-<current-version>..<latest-version>.diff https://github.com/react-native-community/rn-diff-purge/compare/release/<current-version>..release/<latest-version>.diff`
     - Then search the diff for file paths:  
       `rg -n "^diff --git" /tmp/rn-diff-<current-version>..<latest-version>.diff`
     - To extract a specific file hunk, search then print a small range:  
       `rg -n "AppDelegate.swift" /tmp/rn-diff-<current-version>..<latest-version>.diff`  
       `sed -n '<start>,<end>p' /tmp/rn-diff-<current-version>..<latest-version>.diff`
   - Breaking changes: https://reactnative.dev/blog (only posts between your versions).
   - Compatibility signals: https://react-native-community.github.io/nightly-tests/ and https://reactnative.directory/

### Phase 2: Plan changes

5. **Create a checklist from the Upgrade Helper diff.**
   - Group by JS/TS changes, iOS native changes, Android native changes, and tooling changes.
   - Skip `App.tsx` changes.
   - Keep local customizations; plan how to reconcile conflicts.

6. **Apply RN diff path and package remapping rules.**
   - RN diff uses `RnDiffApp` as a placeholder app name. Map paths by replacing `RnDiffApp` with your real app root:
     - Example: `RnDiffApp/ios/RnDiffApp/AppDelegate.swift` → `ios/<YourApp>/AppDelegate.swift`
     - Example: `RnDiffApp/android/app/src/main/java/com/rndiffapp/MainActivity.kt` → your actual package path
     - All files under `RnDiffApp/` correspond to the same relative locations in your repo, just with your app name and package.
     - Example mapping for Android root: `RnDiffApp/android/app/src/main/` → `android/app/src/main/`
   - If the diff shows all files as `new file mode`, treat it as a template reference, not a drop-in copy.
   - Remap Android package names when applying diffs:
     - Example: `com.rndiffapp` → `com.yourcompany.yourapp` across `android/app/src/main/java/...` and `AndroidManifest.xml`.

7. **Check dependency risk and plan migrations.**
   - Nightly tests: https://react-native-community.github.io/nightly-tests/
   - For incompatible libraries, use https://reactnative.directory/packages?newArchitecture=false
   - Common issues:
     - if `react-native-fast-image` is listed, use `@d11/react-native-fast-image` or `expo-image` instead - ask user for confirmation.
     - if `@react-native-cookies/cookies` is listed, use `@preeternal/react-native-cookie-manager` instead - ask user for confirmation.
     - if `react-native-code-push` is listed and actively used, it won't work. Ask user to disable it and continue with the upgrade. Then suggest migration to `@appzung/react-native-code-push`, `@bravemobile/react-native-code-push` or `expo-updates`.
     - if `react-native-image-crop-picker` is listed, and it causes build or runtime errors,plan migration to `expo-image-picker` - ask user for confirmation.
   - Prefer alternatives listed on the directory when a dependency is incompatible.
   - If no alternative is listed, ask user for confirmation to continue with the upgrade.

8. **Read only breaking changes and manual steps from blog posts between your versions.**
   - Note removed APIs, moved modules, and required manual changes across those posts.

### Phase 3: Apply the upgrade

9. **Apply the diff to the codebase.**
   - Update `package.json` and lockfile via the package manager.
   - Apply native file changes (iOS/Android) exactly as shown.
   - Keep local customizations; reconcile conflicts carefully.

### Phase 4: Reinstall and clean

10. **Re-install dependencies.**
    - Use the repo’s package manager (detect by lockfile):
      - `package-lock.json` → npm
      - `yarn.lock` → yarn
      - `pnpm-lock.yaml` → pnpm
      - `bun.lockb` / `bun.lock` → bun
    - Re-install iOS pods: `cd ios && bundle exec pod install` (or `pod install` if no Gemfile).

11. **Check patch files.**
    - Review `patches/` and re-apply or remove only after the app builds and runs.
    - If removing patches, rebuild to confirm correctness.

### Phase 5: Validate

12. **Build and test.**
    - Run iOS and Android build scripts.
    - If builds fail, use `react-native clean-project` (interactive) or `react-native clean-project-auto`.
    - If the CLI plugin is unavailable, run `npx react-native-clean-project` or add it as a dev dependency.
    - Run tests, typecheck, and lint.

13. **Verify New Architecture settings if the release enables it by default.**
    - Check `android/gradle.properties` and `ios/Podfile` toggles.
    - Rebuild iOS and Android to confirm.

## Code Examples

**Example: Update React Native version in `package.json`:**

```json
{
  "dependencies": {
    "react-native": "0.79.1"
  }
}
```

**Example: Use Upgrade Helper to update iOS settings:**

```diff
- platform :ios, '13.0'
+ platform :ios, '14.0'
```

## Upgrading from version lower than 0.79

Check `native-android-16kb-alignment` related skill for Android 16KB page size alignment.

## Common Pitfalls

- **Upgrading an Expo project with RN CLI steps**: Use the Expo upgrade guide.
- **Skipping the Upgrade Helper**: Leads to missed native config changes.
- **Treating `RnDiffApp` as a real folder**: It is a template placeholder; always remap paths to your app.
- **Copying the entire template wholesale**: Use the diff as a guide; keep your existing app structure and merge only needed changes.
- **Using the wrong changelog**: 0.7x changes live in `CHANGELOG-0.7x.md`.
- **Running the wrong package manager**: Always match the repo lockfile.
- **Forgetting CocoaPods**: iOS builds will fail without `pod install`.
- **Not updating the Android gradle wrapper binary file**: You need to update the `./android/gradle/wrapper/gradle-wrapper.jar` file compatible with the new React Native version. You can find it here: https://raw.githubusercontent.com/react-native-community/rn-diff-purge/release/<latest-version>/RnDiffApp/android/gradle/wrapper/gradle-wrapper.jar

## Related Skills

- [native-platform-setup.md](../../react-native-best-practices/references/native-platform-setup.md) - Tooling and native dependency basics
- [native-android-16kb-alignment.md](../../react-native-best-practices/references/native-android-16kb-alignment.md) - Third-party library alignment for Google Play
