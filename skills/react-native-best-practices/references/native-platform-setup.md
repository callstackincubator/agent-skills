---
title: Platform Differences
impact: MEDIUM
tags: ios, android, xcode, gradle, cocoapods
---

# Skill: Platform Differences

Navigate iOS and Android tooling, dependency management, and build systems in React Native.

## Quick Reference

| Platform | IDE | Package Manager | Build System |
|----------|-----|-----------------|--------------|
| JavaScript | VS Code | npm/yarn | Metro |
| iOS | Xcode | CocoaPods | xcodebuild |
| Android | Android Studio | Gradle | Gradle |

```bash
# Common commands
cd ios && bundle exec pod install   # Install iOS deps
cd android && ./gradlew clean       # Clean Android build
xed ios/                            # Open Xcode
```

## When to Use

- Setting up native development environment
- Adding native dependencies
- Debugging platform-specific issues
- Understanding build processes

## IDEs Overview

| Platform | IDE | Key Features |
|----------|-----|--------------|
| JavaScript | VS Code, WebStorm | TypeScript, ESLint, Prettier |
| iOS | Xcode | View Hierarchy, Instruments, Signing |
| Android | Android Studio | Layout Inspector, Profiler, Logcat |

## Dependency Management

### JavaScript (npm/yarn)

```bash
# Install a React Native library
npm install react-native-bottom-tabs

# Key files
package.json          # Dependencies and scripts
node_modules/         # Installed packages
package-lock.json     # Version lock
```

### iOS (CocoaPods)

```bash
# Install pods after npm install
cd ios && bundle exec pod install

# Key files
ios/Podfile           # Pod dependencies
ios/Pods/             # Installed pods (gitignored)
ios/*.xcworkspace     # Open this in Xcode (not .xcodeproj)
Gemfile               # Ruby/CocoaPods version
```

**Adding a native iOS dependency:**

```ruby
# ios/Podfile
target 'MyApp' do
  pod 'SDWebImage', '~> 5.0'
end
```

Version operators:
- `~> 5.0` = ≥5.0, <6.0 (minor updates)
- `~> 5.0.1` = ≥5.0.1, <5.1 (patch only)

### Android (Gradle)

```bash
# Sync after adding dependencies
cd android && ./gradlew clean

# Key files
android/build.gradle           # Project-level config
android/app/build.gradle       # App dependencies
android/gradle.properties      # Build flags
android/gradlew                # Gradle wrapper
```

**Adding a native Android dependency:**

```groovy
// android/app/build.gradle
dependencies {
    implementation 'com.github.bumptech.glide:glide:4.12.0'
}
```

## Building Projects

### JavaScript (Metro)

Metro handles JS transpilation via Babel:
- Transforms modern JS to engine-compatible code
- Handles module resolution
- Creates JS bundle

### iOS Build Pipeline

1. **Source Compilation**: Swift/Obj-C → machine code (Clang/LLVM)
2. **Linking**: Code + frameworks + CocoaPods
3. **Signing**: Certificates and provisioning profiles
4. **Packaging**: `.ipa` file

### Android Build Pipeline

1. **Compilation**: Java/Kotlin → `.class` files
2. **DEX Conversion**: `.class` → `.dex` (Android Runtime)
3. **Resource Processing**: XML, images, assets
4. **Signing**: Keystore signing
5. **Packaging**: `.apk` or `.aab` file

## Running on Devices

### iOS Simulator

```bash
# List simulators
xcrun simctl list

# Boot simulator
xcrun simctl boot "iPhone 15"

# Shutdown all
xcrun simctl shutdown all

# Quick launch Xcode
xed ios/
```

### Android Emulator

```bash
# List available devices
emulator -list-avds

# Launch specific device
emulator @Pixel_6_API_34

# List connected devices
adb devices
```

### Helpful Tools

- **MiniSim**: Manage simulators from menu bar
- **Expo Orbit**: Simulator management
- **Android iOS Emulator (VS Code)**: IDE integration

## Common Commands

```bash
# iOS
cd ios && bundle exec pod install     # Install pods
xed .                                  # Open Xcode
xcrun simctl list                      # List simulators

# Android  
cd android && ./gradlew clean          # Clean build
./gradlew tasks                        # List available tasks
./gradlew assembleRelease              # Build release APK

# React Native CLI
npx react-native start                 # Start Metro
npx react-native run-ios               # Run on iOS
npx react-native run-android           # Run on Android

# Expo
npx expo start                         # Start Metro (Expo)
npx expo run:ios                       # Run on iOS (dev client)
npx expo run:android                   # Run on Android (dev client)
npx expo prebuild                      # Generate native projects
```

### Expo Notes

- **Expo Go**: Limited native module support; use for JS-only development
- **Dev Client**: Full native access; required for custom native code
- **Prebuild**: Generates `ios/` and `android/` folders for native customization

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Pod install fails | `bundle exec pod install --repo-update` |
| Xcode build fails | Clean build folder (Cmd+Shift+K) |
| Android Gradle sync fails | `./gradlew clean` then sync |
| Can't find simulator | `xcrun simctl list` to verify name |
| Metro cache issues | `npx react-native start --reset-cache` |

## Related Skills

- [native-profiling.md](./native-profiling.md) - Use IDE profilers
- [native-turbo-modules.md](./native-turbo-modules.md) - Build native modules
