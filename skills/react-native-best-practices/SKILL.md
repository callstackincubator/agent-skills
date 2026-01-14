---
name: react-native-best-practices
description: React Native performance optimization guidelines from Callstack's Ultimate Guide. Use this skill when writing, reviewing, or debugging React Native code for performance issues. Triggers on tasks involving FPS optimization, TTI improvement, bundle size reduction, native module development, memory leaks, or animation performance.
---

# React Native Best Practices

## Overview

Performance optimization guide for React Native applications, covering JavaScript/React, Native (iOS/Android), and bundling optimizations. Based on Callstack's "Ultimate Guide to React Native Optimization".

## When to Apply

Reference these guidelines when:
- Debugging slow/janky UI or animations
- Investigating memory leaks (JS or native)
- Optimizing app startup time (TTI)
- Reducing bundle or app size
- Writing native modules (Turbo Modules)
- Profiling React Native performance
- Reviewing React Native code for performance

## Priority-Ordered Guidelines

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | FPS & Re-renders | CRITICAL | `js-*` |
| 2 | Bundle Size | CRITICAL | `bundle-*` |
| 3 | TTI Optimization | HIGH | `native-*`, `bundle-*` |
| 4 | Native Performance | HIGH | `native-*` |
| 5 | Memory Management | MEDIUM-HIGH | `js-*`, `native-*` |
| 6 | Animations | MEDIUM | `js-*` |

## Quick Reference

### Critical: FPS & Re-renders

**Profile first:**
```bash
# Open React Native DevTools
# Press 'j' in Metro, or shake device → "Open DevTools"
```

**Common fixes:**
- Replace ScrollView with FlatList/FlashList for lists
- Use React Compiler for automatic memoization
- Use atomic state (Jotai/Zustand) to reduce re-renders
- Use `useDeferredValue` for expensive computations

### Critical: Bundle Size

**Analyze bundle:**
```bash
npx react-native bundle \
  --entry-file index.js \
  --bundle-output output.js \
  --platform ios \
  --sourcemap-output output.js.map \
  --dev false --minify true

npx source-map-explorer output.js --no-border-checks
```

**Common fixes:**
- Avoid barrel imports (import directly from source)
- Remove unnecessary Intl polyfills (Hermes has native support)
- Enable tree shaking (Expo SDK 52+ or Re.Pack)
- Enable R8 for Android native code shrinking

### High: TTI Optimization

**Measure TTI:**
- Use `react-native-performance` for markers
- Only measure cold starts (exclude warm/hot/prewarm)

**Common fixes:**
- Disable JS bundle compression on Android (enables Hermes mmap)
- Use native navigation (react-native-screens)
- Defer non-critical work with `InteractionManager`

### High: Native Performance

**Profile native:**
- iOS: Xcode Instruments → Time Profiler
- Android: Android Studio → CPU Profiler

**Common fixes:**
- Use background threads for heavy native work
- Prefer async over sync Turbo Module methods
- Use C++ for cross-platform performance-critical code

## References

Full documentation with code examples in `references/`:

### JavaScript/React (`js-*`)
- `js-profile-react.md` - React DevTools profiling
- `js-measure-fps.md` - FPS monitoring
- `js-memory-leaks.md` - JS memory leak hunting
- `js-lists-flatlist-flashlist.md` - List performance
- `js-atomic-state.md` - Jotai/Zustand patterns
- `js-concurrent-react.md` - useDeferredValue, useTransition
- `js-react-compiler.md` - Automatic memoization
- `js-animations-reanimated.md` - Reanimated worklets
- `js-uncontrolled-components.md` - TextInput optimization

### Native (`native-*`)
- `native-platform-setup.md` - iOS/Android tooling guide
- `native-profiling.md` - Xcode/Android Studio profiling
- `native-measure-tti.md` - TTI measurement setup
- `native-memory-patterns.md` - C++/Swift/Kotlin memory
- `native-threading-model.md` - Turbo Module threads
- `native-view-flattening.md` - View hierarchy debugging
- `native-sdks-over-polyfills.md` - Native vs JS libraries
- `native-turbo-modules.md` - Building fast native modules
- `native-memory-leaks.md` - Native memory leak hunting

### Bundling (`bundle-*`)
- `bundle-analyze-js.md` - JS bundle visualization
- `bundle-analyze-app.md` - App size analysis
- `bundle-library-size.md` - Evaluate dependencies
- `bundle-barrel-exports.md` - Avoid barrel imports
- `bundle-tree-shaking.md` - Dead code elimination
- `bundle-code-splitting.md` - Re.Pack code splitting
- `bundle-r8-android.md` - Android code shrinking
- `bundle-native-assets.md` - Asset catalog setup
- `bundle-hermes-mmap.md` - Disable bundle compression

## Searching References

```bash
# Find patterns by keyword
grep -l "reanimated" references/
grep -l "flatlist" references/
grep -l "memory" references/
grep -l "profil" references/
grep -l "tti" references/
grep -l "bundle" references/
```

## Problem → Skill Mapping

| Problem | Start With |
|---------|------------|
| App feels slow/janky | `js-measure-fps.md` → `js-profile-react.md` |
| Too many re-renders | `js-profile-react.md` → `js-react-compiler.md` |
| Slow startup (TTI) | `native-measure-tti.md` → `bundle-analyze-js.md` |
| Large app size | `bundle-analyze-app.md` → `bundle-r8-android.md` |
| Memory growing | `js-memory-leaks.md` or `native-memory-leaks.md` |
| Animation drops frames | `js-animations-reanimated.md` |
| List scroll jank | `js-lists-flatlist-flashlist.md` |
| TextInput lag | `js-uncontrolled-components.md` |
| Native module slow | `native-turbo-modules.md` → `native-threading-model.md` |

## Attribution

Based on "The Ultimate Guide to React Native Optimization" by Callstack.
