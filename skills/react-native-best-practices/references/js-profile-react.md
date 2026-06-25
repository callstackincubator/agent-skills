---
title: Profile React Performance
impact: MEDIUM
tags: profiling, devtools, re-renders, flamegraph
---

# Skill: Profile React Performance

Identify unnecessary re-renders and performance bottlenecks in React Native apps using React Native DevTools.

## Quick Command

```bash
# Open React Native DevTools (press 'j' in Metro terminal)
# Or shake device → "Open DevTools"
# Go to Profiler tab → Start profiling → Perform actions → Stop
```

For targeted audits, profile the exact flow under review. Baseline output should include commit timeline, re-render counts, slow components, and a breakdown of the heaviest commit.

## When to Use

- App feels sluggish or janky during interactions
- Need to identify which components re-render unnecessarily
- Investigating slow list scrolling or form inputs
- Before applying memoization or state management changes

## Prerequisites

- React Native DevTools accessible (press `j` in Metro or use Dev Menu)
- App running in development mode
- React DevTools version compatible with the app's React and React Native versions

> **Note**: This skill involves visual profiler output (flame graphs, component highlighting). Use `agent-device` for runnable scenario evidence; install it through the environment's approved/trusted path or ask the user if verification needs it and it is missing. Profiler analysis may still require the DevTools UI, exported data, or human review. Record concrete commit times, render counts, and component names in text when asking an agent to reason about them.

## Step-by-Step Instructions

### 1. Open React Native DevTools

```bash
# Option A: Press 'j' in Metro terminal (works with both RN CLI and Expo)
# Option B: Shake device / Cmd+D (iOS) / Cmd+M (Android) → "Open DevTools"
# Expo: Also accessible via Expo DevTools in browser
```

### 2. Configure Profiler Settings

1. Go to **Profiler** tab
2. Click gear icon (⚙️) for settings
3. Enable:
   - "Highlight updates when components render"
   - "Record why each component rendered while profiling"

### 3. Record a Profiling Session

```
1. Click "Start profiling" (blue circle) or "Reload and start profiling"
2. Perform the exact interaction or navigation flow you want to analyze
3. Click "Stop profiling"
```

**Use "Reload and start profiling"** for startup performance analysis.

For AI-agent workflows, treat this as a required sequence:

1. Start profiling.
2. Drive the audited flow, not just app startup or idle state.
3. Stop profiling.
4. Inspect commit timeline, re-renders, slow components, and the heaviest commit before proposing fixes.

### 4. Analyze the Flame Graph

![React DevTools Flamegraph](images/devtools-flamegraph.png)

The flame graph shows component render hierarchy with timing:

**Color indicators:**
- **Yellow components**: Most time spent rendering (focus here)
- **Green components**: Fast/memoized
- **Gray components**: Did not render

**Right panel shows "Why did this render?":**
- Props changed (shows which prop, e.g., `children`, `onPress`)
- Rendered at timestamps with duration (e.g., "3.7s for 0.9ms")

**Click on a component to see:**
- Why it rendered (hook change, props change, parent re-render)
- Render duration
- Child components affected

### 5. Use Ranked View for Bottom-Up Analysis

Click "Ranked" tab to see components sorted by render time (slowest first).

### 6. Profile JavaScript CPU

For non-React performance issues:

1. Go to **JavaScript Profiler** tab (enable in settings if hidden)
2. Click "Start" to record
3. Perform actions
4. Click "Stop"
5. Use **Heavy (Bottom Up)** view to find slowest functions

## Interpreting Results

| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| Many yellow components | Cascading re-renders | Add memoization or use React Compiler |
| "Props changed" on callbacks | Inline functions recreated | Use `useCallback` |
| "Parent component rendered" | State too high in tree | Move state down or use atomic state |
| Long JS thread block | Heavy computation | Move to background or use `useDeferredValue` |

Only propose callback or dependency-array changes when the profiler or a reproducible bug shows they matter. Do not infer stale closures from a snippet alone.

## Common Pitfalls

- **Using one build type for every question**: Use React Native DevTools in development to identify render causes, commit patterns, and expensive components. Validate timing-sensitive FPS/CPU improvements in production or release-like builds.
- **Not using production builds**: Some issues only appear with minified code
- **Ignoring "Why did this render?"**: This tells you exactly what to fix
- **Using component tree depth or count as the main baseline**: These are secondary context, not the core performance signal

## Related Skills

- [js-react-compiler.md](./js-react-compiler.md) - Automatic memoization
- [js-atomic-state.md](./js-atomic-state.md) - Reduce re-renders with Jotai/Zustand
- [js-bottomsheet.md](./js-bottomsheet.md) - Profile bottom sheet callback-driven re-renders
- [js-measure-fps.md](./js-measure-fps.md) - Quantify frame rate impact
