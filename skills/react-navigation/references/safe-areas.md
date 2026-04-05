---
title: Safe Areas
impact: HIGH
tags: react-navigation, safe-area, inset, safe-area-context, scroll-view, flatlist, edge-to-edge
---

# Skill: Safe Areas

## Description

Use this reference when content or scroll containers must avoid notches, system bars, home indicators, and other system UI.

React Navigation already handles safe areas for its built-in UI such as headers, tab bars, and drawers. Apply insets manually only for your own screen content or when you replace the built-in navigation UI with custom components.

## When to Use

- Content is hidden behind the status bar, navigation bar, notch, or home indicator
- A screen uses a custom header, custom tab bar, or custom drawer content
- Fixed UI such as hero media, floating actions, or bottom actions needs selective safe-area padding

## Edge-to-Edge on Android

Edge-to-edge makes the app content extend behind translucent system bars on Android, similar to how it works on iOS. Enable edge-to-edge for consistent safe area handling across platforms.

Android enables edge-to-edge by default from Android 15 (API level 35) for apps targeting API level 35. Edge-to-edge cannot be disabled from Android 16 (API level 36). For older Android versions, edge-to-edge can be enabled from React Native 0.81 onwards in `android/gradle.properties`:

```ini
edgeToEdgeEnabled=true
```

## Using `contentInsetAdjustmentBehavior` for `ScrollView`

When the main screen content scrolls (such as a `ScrollView`, `FlatList`, `SectionList` etc.) on iOS, prefer `contentInsetAdjustmentBehavior="automatic"` so the scroll view adjusts for safe areas while still allowing edge-to-edge scrolling behavior.

```tsx
import { ScrollView } from 'react-native';

function ArticleScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      {/* content */}
    </ScrollView>
  );
}
```

On Android, conditionally use the `useSafeAreaInsets` hook from `react-native-safe-area-context` to apply paddings.

## Using `useSafeAreaInsets`

Use the `useSafeAreaInsets` hook from `react-native-safe-area-context` for custom layouts. It gives precise control over which edges should receive padding.

```tsx
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function ScreenContent() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      {/* content */}
    </View>
  );
}
```

- Prefer the hook over `SafeAreaView`, as `SafeAreaView` can behave poorly during animations, and mixing `SafeAreaView` with the hook can cause flicker.
- It is usually not necessary to wrap the app in `SafeAreaProvider` as it's done internally by React Navigation. Only add it when using in components not in stack, bottom tabs or drawer navigators.
- Apply insets to only the specific edges that extend to the screen edge
- Keep landscape orientation in mind, as the top and bottom insets become left and right insets
- Do not wrap the whole app in a `SafeAreaView` to avoid wasting space.

## Canonical Docs

- [React Navigation: Supporting safe areas](https://reactnavigation.org/docs/handling-safe-area/)
- [React Native: ScrollView](https://reactnative.dev/docs/scrollview)
- [React Navigation: Native Stack Navigator](https://reactnavigation.org/docs/native-stack-navigator)
- [React Native 0.81: Android 16 support and edge-to-edge](https://reactnative.dev/blog/2025/08/12/react-native-0.81)
- [react-native-safe-area-context](https://github.com/AppAndFlow/react-native-safe-area-context)

## Related Skills

- [stacks.md](./stacks.md)
- [bottom-tabs.md](./bottom-tabs.md)
- [native-bottom-tabs.md](./native-bottom-tabs.md)
- [drawers.md](./drawers.md)
