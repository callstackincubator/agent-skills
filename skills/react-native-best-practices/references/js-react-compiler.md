# Skill: React Compiler

Set up React Compiler to automatically memoize components and eliminate unnecessary re-renders.

## When to Use

- Want automatic performance optimization without manual `memo`/`useMemo`/`useCallback`
- Codebase follows Rules of React
- React Native 0.76+ or willing to add runtime package for older versions
- Ready to adopt beta tooling (as of January 2025)

## Prerequisites

- React 17+ (React 19 recommended)
- Babel-based build system
- Code follows [Rules of React](https://react.dev/reference/rules)

## Step-by-Step Instructions

### Step 1: Install ESLint Plugin (Recommended First)

Prepare your codebase by finding violations before enabling the compiler:

```bash
npm install -D eslint-plugin-react-compiler@beta
```

Configure ESLint (flat config):

```javascript
// eslint.config.js
import reactCompiler from 'eslint-plugin-react-compiler';

export default [
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },
];
```

Fix any violations the linter reports before proceeding.

### Step 2: Install Babel Plugin

```bash
npm install -D babel-plugin-react-compiler@beta
```

For React Native < 0.78 (React < 19):

```bash
npm install react-compiler-runtime@beta
```

### Step 3: Configure Babel

```javascript
// babel.config.js
const ReactCompilerConfig = {
  target: '19',  // Use '18' for React Native < 0.78
};

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig],  // Must be first!
      // ... other plugins
    ],
  };
};
```

### Step 4: Incremental Adoption (Optional)

If compiler fails on some files, use `sources` config to enable incrementally:

```javascript
const ReactCompilerConfig = {
  target: '19',
  sources: (filename) => {
    // Only compile files in src/components/
    return filename.includes('src/components/');
  },
};
```

### Step 5: Verify Optimizations

Open React DevTools. Optimized components show `Memo ✨` badge.

**Note**: React Native DevTools version 6.0.1+ required. Override in `package.json` if needed:

```json
{
  "overrides": {
    "react-devtools-core": "^6.0.1"
  }
}
```

## How It Works

The compiler transforms your code to automatically cache values:

**Before (your code):**

```jsx
export default function MyApp() {
  const [value, setValue] = useState('');
  return (
    <TextInput
      onChangeText={() => setValue(value)}>
      Hello World
    </TextInput>
  );
}
```

**After (compiled output):**

```jsx
import { c as _c } from 'react/compiler-runtime';

export default function MyApp() {
  const $ = _c(2);  // Cache with 2 slots
  const [value, setValue] = useState('');
  
  let t0;
  if ($[0] !== value) {
    t0 = <TextInput onChangeText={() => setValue(value)}>Hello World</TextInput>;
    $[0] = value;
    $[1] = t0;
  } else {
    t0 = $[1];  // Return cached JSX
  }
  return t0;
}
```

## Code Examples

### React Compiler Playground

Test transformations at [playground.react.dev](https://playground.react.dev/).

### What Gets Optimized

```jsx
// Components - auto-memoized
const Button = ({ onPress, label }) => (
  <Pressable onPress={onPress}>
    <Text>{label}</Text>
  </Pressable>
);

// Callbacks - auto-cached (no useCallback needed)
const handlePress = () => {
  console.log('pressed');
};

// Expensive computations - auto-cached (no useMemo needed)
const filtered = items.filter(item => item.active);
```

### What Breaks Compilation

```jsx
// BAD: Mutating props
const BadComponent = ({ items }) => {
  items.push('new item');  // Mutation!
  return <List data={items} />;
};

// BAD: Mutating during render
const BadMutation = () => {
  const [items, setItems] = useState([]);
  items.push('new');  // Mutation during render!
  return <List data={items} />;
};

// BAD: Non-idempotent render
let counter = 0;
const BadRender = () => {
  counter++;  // Side effect during render!
  return <Text>{counter}</Text>;
};
```

## Should You Remove Manual Memoization?

**Not yet.** Keep existing `memo`, `useMemo`, `useCallback` until:
- Compiler reaches stable release
- Official React team guidance confirms it's safe
- ESLint plugin indicates which optimizations are redundant

## Expected Performance Improvements

Testing on Expensify app showed:
- **4.3% improvement** in Chat Finder TTI
- Significant reduction in cascading re-renders
- Most impact on apps without existing manual optimization

Already heavily optimized apps may see marginal gains.

## Common Pitfalls

- **Not fixing ESLint errors first**: Compiler fails silently on rule violations
- **Expecting it to fix bad patterns**: Compiler optimizes good code, doesn't fix bad code
- **Forgetting shallow comparison**: Like `memo`, compiler uses shallow comparison for objects/arrays

## Related Skills

- [js-profile-react.md](./js-profile-react.md) - Verify optimization impact
- [js-atomic-state.md](./js-atomic-state.md) - Alternative for state-related re-renders
