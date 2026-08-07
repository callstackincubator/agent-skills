---
name: react-native-tv-best-practices
description: Reviews React Native TV apps for focus/D-pad navigation, 10-foot UI layout, TV playback/DRM integration, low-memory TV performance, and TV accessibility. Use when building, debugging, or reviewing react-native-tvos, Expo TV, Amazon Vega/Kepler, or React Native web TV targets where the issue depends on remote input, TV focus, TV packaging, TV hardware, or TV playback constraints.
license: MIT
---

# React Native TV Best Practices

## Overview

TV-specific review guidance for React Native-backed apps on Apple TV, Android TV, Fire TV, Amazon Vega/Kepler, and web-based TV targets such as Tizen or webOS.

Use this skill only for TV deltas: remote input, focus engines, 10-foot layout, platform packaging, playback/DRM, low-memory TV hardware, and TV accessibility. For ordinary React Native performance or architecture issues, use [react-native-best-practices](../react-native-best-practices/SKILL.md).

## Skill Format

Reference files are grouped by topic prefix:

- `focus-*`: focus engines, focus guides, focus event performance
- `nav-*`: D-pad navigation, Back/Menu behavior, keyboard/search input
- `design-*`: 10-foot typography, layout, color, focus visibility
- `perf-*`: startup, memory, lists, animation, and network constraints on TV hardware
- `video-*`: playback architecture, DRM/protocol selection, debugging
- `a11y-*`: TV accessibility implementation and audit checks
- `setup-*`: stack detection, setup, architecture, cross-platform behavior
- `test-*` and `release-*`: test coverage, E2E, and CI/release workflows

## When to Apply

Apply this skill when the app targets a TV platform and the work involves:

- Focus movement, visible focus, focus restoration, or remote/D-pad input
- TV layout readability, overscan/safe areas, or 10-foot UI density
- TV player controls, manifests, DRM, decoder support, or playback errors
- Performance on low-memory TV hardware, especially with video or large carousels
- TV accessibility with screen readers, captions, focus order, or remote-only interaction
- Platform setup for `react-native-tvos`, Expo TV, Amazon Vega/Kepler, Tizen, or webOS

## Before You Start — Identify the TV Stack

This skill covers several TV stacks. **Detect which one the app targets before flagging setup issues** — demanding `react-native-tvos`, a tvOS Podfile, or an Android TV manifest on a Vega/Kepler or web-based TV app produces false positives.

| Stack                                                 | How to detect                                                                                     | Setup expectations                                                                                                             |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **react-native-tvos** (Apple TV, Android TV, Fire TV) | `"react-native": "npm:react-native-tvos@…"` in package.json                                       | tvOS Podfile (`platform :tvos`); Android TV `leanback`/`LEANBACK_LAUNCHER` manifest entries; TV emulator/simulator             |
| **Expo + react-native-tvos**                          | above **plus** `@react-native-tvos/config-tv` in app.json                                         | `EXPO_TV=1` prebuild; `react-native-tvos` version must match the Expo SDK; not all Expo features/libraries are available on TV |
| **Amazon Vega / Kepler**                              | Vega/Kepler SDK & tooling (`@amazon-devices/*` deps, Kepler manifest); **no** `react-native-tvos` | Amazon's Vega/Kepler toolchain — `react-native-tvos`, tvOS Podfile, and Android TV manifest do **not** apply                   |
| **Web-based TV** (Tizen, webOS)                       | web bundler (Rsbuild/webpack) + platform packaging; spatial-nav library                           | Platform SDK packaging; `@noriginmedia/norigin-spatial-navigation` for focus                                                   |

The focus, 10-foot design, performance, accessibility, and player guidance applies across all of these — only the **setup/build** expectations are stack-specific.

## Review Rules

- Resolve the target stack before setup advice.
- Prefer natural focus order and focus guides before imperative focus calls or broad `nextFocus*` maps.
- Treat focus loss, invisible focus, and broken Back/Menu behavior as navigation bugs.
- Check readability, safe areas, and focus states at TV distance before tuning visual details.
- Profile on the weakest supported TV device before reporting performance fixes as complete.
- Separate playback failures by layer: manifest request, DRM license exchange, decoder capability, player state, and React UI controls.

## Priority-Ordered Guidelines

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Focus and D-pad navigation | CRITICAL | `focus-*`, `nav-*` |
| 2 | List, animation, and input performance | CRITICAL | `perf-*` |
| 3 | Playback and DRM failures | HIGH | `video-*` |
| 4 | 10-foot readability and layout | HIGH | `design-*` |
| 5 | TV accessibility | HIGH | `a11y-*` |
| 6 | Stack setup, testing, and release | MEDIUM | `setup-*`, `test-*`, `release-*` |

## Quick Reference

1. Detect the TV stack from package files, manifests, native folders, and platform tooling.
2. Reproduce navigation with the remote or D-pad path, not mouse/touch assumptions.
3. Confirm the focused element is always visible, reachable, and restored after modals/routes.
4. Check playback failures from the network/DRM layer upward before changing React controls.
5. Measure list, animation, memory, and startup work on the weakest supported TV target.

## References

### Focus and Navigation

| File | Impact | Description |
|------|--------|-------------|
| [focus-management.md](references/focus-management.md) | CRITICAL | Focus engines, focus guides, `nextFocus*`, and focus restoration |
| [focus-performance.md](references/focus-performance.md) | CRITICAL | Avoiding frame drops from focus event handling |
| [nav-directional.md](references/nav-directional.md) | CRITICAL | Directional navigation rules across TV platforms |
| [nav-patterns.md](references/nav-patterns.md) | CRITICAL | Global/local navigation, modals, tabs, and Back behavior |
| [nav-keyboard.md](references/nav-keyboard.md) | MEDIUM | Search and text input with remotes |

### Design

| File | Impact | Description |
|------|--------|-------------|
| [design-10foot.md](references/design-10foot.md) | HIGH | 10-foot review heuristics |
| [design-typography.md](references/design-typography.md) | HIGH | TV type sizing and readability |
| [design-layout.md](references/design-layout.md) | HIGH | Safe areas, spacing, carousels, and focus room |
| [design-color.md](references/design-color.md) | MEDIUM | Contrast and TV display color constraints |

### Performance

| File | Impact | Description |
|------|--------|-------------|
| [perf-overview.md](references/perf-overview.md) | HIGH | TV performance targets and profiling order |
| [perf-lists.md](references/perf-lists.md) | CRITICAL | Virtualized rows and poster-heavy lists |
| [perf-animations.md](references/perf-animations.md) | CRITICAL | Focus and transition animation performance |
| [perf-memory.md](references/perf-memory.md) | HIGH | Low-memory TV crashes and image/video pressure |
| [perf-network.md](references/perf-network.md) | HIGH | Remote input, request stalls, and network resilience |

### Video, Accessibility, Setup, Testing

| File | Impact | Description |
|------|--------|-------------|
| [video-streaming.md](references/video-streaming.md) | HIGH | TV platform protocol/DRM selection |
| [video-players.md](references/video-players.md) | HIGH | Player choices and custom controls |
| [video-debugging.md](references/video-debugging.md) | HIGH | Manifest, DRM, codec, and playback debugging |
| [a11y-overview.md](references/a11y-overview.md) | MEDIUM | TV-specific accessibility differences |
| [a11y-implementation.md](references/a11y-implementation.md) | HIGH | Accessible labels, roles, live regions, and focus |
| [a11y-checklist.md](references/a11y-checklist.md) | MEDIUM | Launch accessibility audit checklist |
| [setup-getting-started.md](references/setup-getting-started.md) | MEDIUM | `react-native-tvos` and Expo TV setup |
| [setup-cross-platform.md](references/setup-cross-platform.md) | MEDIUM | Platform detection and cross-platform caveats |
| [setup-architecture.md](references/setup-architecture.md) | MEDIUM | Code sharing and project structure |
| [test-strategy.md](references/test-strategy.md) | MEDIUM | TV testing scope and coverage split |
| [test-javascript.md](references/test-javascript.md) | MEDIUM | JS-level remote/focus test helpers |
| [test-e2e.md](references/test-e2e.md) | MEDIUM | Appium and TV E2E coverage |
| [release-cicd.md](references/release-cicd.md) | MEDIUM | CI, build fingerprinting, and release checks |

## Problem → Skill Mapping

| Symptom                              | Start Here                                                                   |
| ------------------------------------ | ---------------------------------------------------------------------------- |
| "Focus jumps to wrong element"       | [focus-management.md](references/focus-management.md) → Debugging section    |
| "App freezes when scrolling lists"   | [perf-lists.md](references/perf-lists.md) → Virtualization                   |
| "Animations stutter on Fire TV"      | [perf-animations.md](references/perf-animations.md) → Native driver          |
| "Text too small on TV"               | [design-typography.md](references/design-typography.md) → Minimum sizes      |
| "Video won't play / DRM errors"      | [video-streaming.md](references/video-streaming.md) → DRM section            |
| "Screen reader skips elements"       | [a11y-implementation.md](references/a11y-implementation.md) → Roles & labels |
| "Back button doesn't work right"     | [nav-patterns.md](references/nav-patterns.md) → Back navigation              |
| "Keyboard covers content"            | [nav-keyboard.md](references/nav-keyboard.md) → Built-in vs custom           |
| "App takes forever to start"         | [perf-overview.md](references/perf-overview.md) → Startup time               |
| "Images causing memory crashes"      | [perf-memory.md](references/perf-memory.md) → Image optimization             |
| "CI pipeline takes hours"            | [release-cicd.md](references/release-cicd.md) → Fingerprinting               |
| "How to share code across platforms" | [setup-architecture.md](references/setup-architecture.md) → Code sharing     |

## Security (TV-Specific)

General dependency/input hygiene applies as in any RN app; the TV-specific deltas worth calling out:

- Never embed FairPlay/Widevine/PlayReady keys in client code — treat the license server as the trust boundary and keep DRM tokens server-issued.
