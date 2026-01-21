---
name: react-native-best-practices
description: Provides React Native performance optimization guidelines for FPS, TTI, bundle size, memory leaks, re-renders, and animations. Applies to tasks involving Hermes optimization, JS thread blocking, bridge overhead, FlashList, native modules, or debugging jank and frame drops.
license: MIT
metadata:
  author: Callstack
  tags: react-native, expo, performance, optimization, profiling
---

# React Native Best Practices

## Overview

Performance optimization guide for React Native applications, covering JavaScript/React, Native (iOS/Android), and bundling optimizations. Based on Callstack's "Ultimate Guide to React Native Optimization".

## Skill Format

Each reference file follows a hybrid format for fast lookup and deep understanding:

- **Quick Pattern**: Incorrect/Correct code snippets for immediate pattern matching
- **Quick Command**: Shell commands for process/measurement skills
- **Quick Config**: Configuration snippets for setup-focused skills
- **Quick Reference**: Summary tables for conceptual skills
- **Deep Dive**: Full context with When to Use, Prerequisites, Step-by-Step, Common Pitfalls

**Impact ratings**: CRITICAL (fix immediately), HIGH (significant improvement), MEDIUM (worthwhile optimization)

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

| File | Impact | Description |
|------|--------|-------------|
| `js-lists-flatlist-flashlist.md` | CRITICAL | Replace ScrollView with virtualized lists |
| `js-profile-react.md` | MEDIUM | React DevTools profiling |
| `js-measure-fps.md` | HIGH | FPS monitoring and measurement |
| `js-memory-leaks.md` | MEDIUM | JS memory leak hunting |
| `js-atomic-state.md` | HIGH | Jotai/Zustand patterns |
| `js-concurrent-react.md` | HIGH | useDeferredValue, useTransition |
| `js-react-compiler.md` | HIGH | Automatic memoization |
| `js-animations-reanimated.md` | MEDIUM | Reanimated worklets |
| `js-uncontrolled-components.md` | HIGH | TextInput optimization |

### Native (`native-*`)

| File | Impact | Description |
|------|--------|-------------|
| `native-turbo-modules.md` | HIGH | Building fast native modules |
| `native-sdks-over-polyfills.md` | HIGH | Native vs JS libraries |
| `native-measure-tti.md` | HIGH | TTI measurement setup |
| `native-threading-model.md` | HIGH | Turbo Module threads |
| `native-profiling.md` | MEDIUM | Xcode/Android Studio profiling |
| `native-platform-setup.md` | MEDIUM | iOS/Android tooling guide |
| `native-view-flattening.md` | MEDIUM | View hierarchy debugging |
| `native-memory-patterns.md` | MEDIUM | C++/Swift/Kotlin memory |
| `native-memory-leaks.md` | MEDIUM | Native memory leak hunting |
| `native-android-16kb-alignment.md` | CRITICAL | Third-party library alignment for Google Play |

### Bundling (`bundle-*`)

| File | Impact | Description |
|------|--------|-------------|
| `bundle-barrel-exports.md` | CRITICAL | Avoid barrel imports |
| `bundle-analyze-js.md` | CRITICAL | JS bundle visualization |
| `bundle-tree-shaking.md` | HIGH | Dead code elimination |
| `bundle-analyze-app.md` | HIGH | App size analysis |
| `bundle-r8-android.md` | HIGH | Android code shrinking |
| `bundle-hermes-mmap.md` | HIGH | Disable bundle compression |
| `bundle-native-assets.md` | HIGH | Asset catalog setup |
| `bundle-library-size.md` | MEDIUM | Evaluate dependencies |
| `bundle-code-splitting.md` | MEDIUM | Re.Pack code splitting |

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
| Native library alignment issue | `native-android-16kb-alignment.md` |

## Attribution

Based on "The Ultimate Guide to React Native Optimization" by Callstack.
