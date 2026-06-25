---
title: Higher-Order Lists
impact: CRITICAL
tags: lists, flatlist, flashlist, legend-list, scrollview, virtualization
---

# Skill: Higher-Order Lists

Replace ScrollView with FlatList, FlashList, or Legend List for performant large list rendering.

## Quick Pattern

**Incorrect:**

```jsx
<ScrollView>
  {items.map((item) => <Item key={item.id} {...item} />)}
</ScrollView>
```

**Correct:**

```jsx
<FlashList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <Item {...item} />}
/>
```

## When to Use

- Rendering more than 10-20 items in a list
- List scrolling is choppy or laggy
- App freezes when loading list data
- Memory usage spikes with long lists

## Prerequisites

- `@shopify/flash-list` for FlashList on React Native New Architecture
- `@legendapp/list` for a JS/TypeScript list option without native dependencies
- Understanding of list virtualization

## Version Guardrail

- FlashList v1: `estimatedItemSize` is part of the optimization guidance.
- FlashList v2 and newer: `estimatedItemSize`, `estimatedListSize`, and `estimatedFirstItemOffset` are deprecated and no longer used. Do not flag them as missing.
- Before suggesting a FlashList fix, confirm the installed major version and tailor the advice. See [FlashList v2 changes](https://shopify.github.io/flash-list/docs/v2-changes/).

## Step-by-Step Instructions

### 1. Identify the Problem

![FPS Drop Graph](images/fps-drop-graph.png)

The FPS graph shows a severe performance problem during list rendering:
- FPS starts at ~60 (smooth)
- Drops to ~3 FPS during heavy list operation
- Recovers after rendering completes

```jsx
// BAD: ScrollView renders ALL items at once
const BadList = ({ items }) => (
  <ScrollView>
    {items.map((item, index) => (
      <View key={index}>
        <Text>{item}</Text>
      </View>
    ))}
  </ScrollView>
);
```

With 5000 items, this creates 5000 views immediately, causing:
- Multi-second freeze
- FPS drop to 0
- High memory usage

### 2. Replace with FlatList

```jsx
import { FlatList } from 'react-native';

const BetterList = ({ items }) => {
  const renderItem = ({ item }) => (
    <View>
      <Text>{item}</Text>
    </View>
  );
  
  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};
```

FlatList only renders visible items + buffer (windowing).

### 3. Optimize FlatList with getItemLayout

For fixed-height items, skip layout measurement:

```jsx
const ITEM_HEIGHT = 50;

const OptimizedList = ({ items }) => {
  const renderItem = ({ item }) => (
    <View style={{ height: ITEM_HEIGHT }}>
      <Text>{item}</Text>
    </View>
  );
  
  const getItemLayout = (_, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });
  
  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      getItemLayout={getItemLayout}
    />
  );
};
```

### 4. Upgrade to FlashList

```bash
npm install @shopify/flash-list
```

```jsx
import { FlashList } from '@shopify/flash-list';

const BestList = ({ items }) => {
  const renderItem = ({ item }) => (
    <View style={{ height: 50 }}>
      <Text>{item}</Text>
    </View>
  );
  
  return (
    <FlashList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};
```

For FlashList v1, add `estimatedItemSize` with a realistic average item height. FlashList v2 requires React Native New Architecture and no longer needs size estimates; it computes sizing automatically. For old architecture apps, use FlashList v1 docs or evaluate Legend List.

**FlashList advantages:**
- Recycles views instead of creating new ones
- Often improves memory and scroll smoothness for large, complex lists
- Supports item-type-aware recycling with `getItemType`

### 5. Evaluate Legend List

Legend List is a JS/TypeScript list alternative with no native dependency. It supports dynamic item sizes, bidirectional infinite scrolling, chat-friendly bottom alignment, and optional recycling.

Enable `recycleItems` for long lists after confirming item components do not keep item-specific local state or side effects.

## Code Examples

### Variable Height Items (FlashList v1)

```jsx
// Calculate average for estimatedItemSize
// Items are 50px, 100px, 150px
// Average: (50 + 100 + 150) / 3 = 100px

<FlashList
  data={items}
  renderItem={renderItem}
  estimatedItemSize={100}
/>
```

### Mixed Item Types

```jsx
<FlashList
  data={items}
  renderItem={({ item }) => {
    if (item.type === 'header') return <Header {...item} />;
    if (item.type === 'product') return <Product {...item} />;
    return <DefaultItem {...item} />;
  }}
  getItemType={(item) => item.type}  // Helps recycling
/>
```

If the project is still on FlashList v1, keep `estimatedItemSize` alongside `getItemType`.

### FlatList Optimizations (if not using FlashList)

```jsx
<FlatList
  data={items}
  renderItem={renderItem}
  // Performance props
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  initialNumToRender={10}
  windowSize={5}
  // Avoid re-renders
  keyExtractor={(item) => item.id}
  extraData={selectedId}  // Only when selection changes
/>
```

## Performance Comparison

| Component | 5000 Items Load | Scroll FPS | Memory |
|-----------|-----------------|------------|--------|
| ScrollView | 1-3 seconds freeze | < 30 | High |
| FlatList | ~100ms | ~45 | Medium |
| FlashList | ~50ms | ~54 | Low |

## Decision Matrix

| Scenario | Recommendation |
|----------|---------------|
| < 20 static items | ScrollView OK |
| 20-100 items | FlatList minimum |
| > 100 items | FlashList or Legend List |
| Complex item layouts | FlashList with `getItemType`, or Legend List |
| Fixed height items | FlatList: `getItemLayout`; FlashList v1: `estimatedItemSize`; FlashList v2+: stable item structure |

## Common Pitfalls

- **Inline renderItem functions**: Causes re-renders. Define outside or use `useCallback`.
- **Missing keyExtractor**: Use unique IDs, not array index when possible.
- **Assuming all FlashList versions need `estimatedItemSize`**: FlashList v2 ignores it. Check the installed version before suggesting it.
- **Heavy item components**: Keep list items light. Move side effects out.

## Related Skills

- [js-profile-react.md](./js-profile-react.md) - Profile list rendering
- [js-measure-fps.md](./js-measure-fps.md) - Measure scroll performance
