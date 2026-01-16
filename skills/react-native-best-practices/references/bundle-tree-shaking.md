---
title: Tree Shaking
impact: HIGH
tags: bundle, tree-shaking, dead-code, metro, repack
---

# Skill: Tree Shaking

Enable dead code elimination to remove unused exports from your JavaScript bundle.

## Quick Config

```bash
# .env (Expo SDK 52+)
EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH=1
EXPO_UNSTABLE_TREE_SHAKING=1
```

```javascript
// metro.config.js
config.transformer.getTransformOptions = async () => ({
  transform: { experimentalImportSupport: true },
});
```

## When to Use

- Bundle includes unused library code
- Want automatic barrel export optimization
- Using Expo SDK 52+ (recommended approach)
- Project already uses Re.Pack (`@callstack/repack`)

## What is Tree Shaking?

Removes code that's exported but never imported:

```tsx
// math.js
export const add = (a, b) => a + b;      // Used
export const subtract = (a, b) => a - b;  // Unused

// app.js
import { add } from './math';
// After tree shaking: subtract removed from bundle
```

## Platform Support

| Bundler | Tree Shaking | Notes |
|---------|--------------|-------|
| Metro | ❌ No | Use metro-serializer-esbuild |
| Expo (SDK 52+) | ✅ Experimental | Requires config |
| Re.Pack | ✅ Yes | Built-in via Webpack/Rspack |

## Setup: Expo SDK 52+

### 1. Enable Import Support

```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: true,
  },
});

module.exports = config;
```

### 2. Enable Tree Shaking

Create/edit `.env`:

```bash
EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH=1
EXPO_UNSTABLE_TREE_SHAKING=1
```

**Note**: Only applies in production builds.

## Setup: Metro with ESBuild

```bash
npm install @rnx-kit/metro-serializer-esbuild
```

Configure in metro.config.js.

## Setup: Re.Pack (Only If Already Installed)

> **Important**: Re.Pack (`@callstack/repack`) is a custom bundler using Rspack/Webpack. Only apply these instructions if the project already has Re.Pack configured. Do not suggest migrating a codebase to Re.Pack—it's rarely necessary and requires significant setup. For most projects, use Expo SDK 52+ tree shaking or manual barrel export fixes instead.

**If project has `@callstack/repack` in dependencies:**

Tree shaking is enabled by default with Rspack. Verify in config:

```javascript
// rspack.config.js or webpack.config.js
module.exports = {
  optimization: {
    usedExports: true,   // Mark unused exports
    minimize: true,       // Remove during minification
  },
};
```

## Platform Shaking (Bonus)

Code inside `Platform.OS` checks is removed for other platforms:

```tsx
import { Platform } from 'react-native';

if (Platform.OS === 'ios') {
  // Removed from Android bundle
}

if (Platform.OS === 'android') {
  // Removed from iOS bundle
}
```

**Important**: Must import `Platform` from `react-native` directly.

## Benchmark Results (Expensify App)

| Bundle Type | Metro (MB) | Re.Pack (MB) | Change |
|-------------|------------|--------------|--------|
| Production | 35.63 | 38.48 | +8% |
| Prod Minified | 15.54 | 13.36 | **-14%** |
| Prod HBC | 21.79 | 19.35 | **-11%** |
| Prod Minified HBC | 21.62 | 19.05 | **-12%** |

**Key insight**: Tree shaking marks code, minification removes it. HBC includes minification.

Expected improvement: **10-15%** bundle size reduction.

## How It Works

1. **Used Exports Check**: Identify which exports are imported
2. **Side Effects Analysis**: Check if removal is safe
3. **Export Tracking**: Map module dependencies
4. **Dead Code Removal**: Remove during minification

## Side Effects Consideration

Libraries must declare side-effect-free:

```json
// package.json
{
  "sideEffects": false
}
```

Or specify files with side effects:

```json
{
  "sideEffects": ["*.css", "./src/polyfills.js"]
}
```

## ESM vs CommonJS

Tree shaking works best with ESM (ES Modules):

```tsx
// ESM - Tree shakeable
export const foo = () => {};
import { foo } from './module';

// CommonJS - Not tree shakeable
module.exports = { foo: () => {} };
const { foo } = require('./module');
```

React Native's Babel preset transforms ESM → CommonJS by default. Experimental support in Expo/Re.Pack preserves ESM.

## Verification

### Check Bundle Contains Only Used Code

1. Build production bundle
2. Analyze with source-map-explorer
3. Search for functions you know are unused
4. If found → tree shaking not working

### Example Test

```tsx
// test-treeshake.js
export const usedFunction = () => 'used';
export const unusedFunction = () => 'unused';  // Should be removed

// app.js
import { usedFunction } from './test-treeshake';
```

After building, search bundle for `unusedFunction`. Should not exist.

## Common Pitfalls

- **Not using production build**: Tree shaking only in prod
- **CommonJS modules**: Need ESM for full effectiveness
- **Side effects not declared**: Library may not be shakeable
- **Dynamic imports**: `require(variable)` prevents analysis

## Related Skills

- [bundle-analyze-js.md](./bundle-analyze-js.md) - Verify tree shaking effect
- [bundle-barrel-exports.md](./bundle-barrel-exports.md) - Manual alternative
- [bundle-code-splitting.md](./bundle-code-splitting.md) - Re.Pack code splitting
