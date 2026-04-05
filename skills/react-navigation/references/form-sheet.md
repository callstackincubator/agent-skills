---
title: Form Sheets with Native Stack
impact: MEDIUM
tags: react-navigation, native-stack, form-sheet, bottom-sheet, modal, detents
---

# Skill: Form Sheets with Native Stack

## Description

Use native-stack `presentation: 'formSheet'` when a screen should open as a sheet.

## When to Use

- Presenting secondary flows such as edit forms, filters, pickers, or lightweight detail screens
- Keeping the current screen visible underneath a native sheet presentation

## Basic Example

**Static API**

```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const AppStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    EditProfile: {
      screen: EditProfileScreen,
      options: {
        presentation: 'formSheet',
        headerShown: false,
        sheetAllowedDetents: 'fitToContents',
      },
    },
  },
});
```

**Dynamic API**

```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          presentation: 'formSheet',
          headerShown: false,
          sheetAllowedDetents: 'fitToContents',
        }}
      />
    </Stack.Navigator>
  );
}
```

## Configuring Sheet Sizes

By default, a form sheet takes the full screen height. Use `sheetAllowedDetents` to control the heights where the sheet can rest.

- Use `'fitToContents'` to size the sheet from its content.
- Use an ascending array of fractions such as `[0.25, 0.5, 1]` for fixed detents.
- On Android, only the first 3 detents are used.
- Use `sheetInitialDetentIndex` to choose the opening detent, or `'last'` for the largest one.

### Fit to Contents

`sheetResizeAnimationEnabled` is Android only and controls the default resize animation when using `'fitToContents'`.

**Static API**

```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const AppStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    Filters: {
      screen: FiltersScreen,
      options: {
        presentation: 'formSheet',
        sheetAllowedDetents: 'fitToContents',
      },
    },
  },
});
```

**Dynamic API**

```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Filters"
        component={FiltersScreen}
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: 'fitToContents',
        }}
      />
    </Stack.Navigator>
  );
}
```

On iOS, a top-level `flex: 1` content container works with `'fitToContents'`.

On Android, `'fitToContents'` does not work with a top-level `flex: 1` content container. The sheet can disappear and leave only the dimmed backdrop visible.

### Fixed Detents and Initial Detent

`sheetShouldOverflowTopInset` is Android only and changes whether detent fractions are measured against the full stack height or the inset-adjusted height.

**Static API**

```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const AppStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    Details: {
      screen: DetailsScreen,
      options: {
        presentation: 'formSheet',
        sheetAllowedDetents: [0.25, 0.5, 1],
        sheetInitialDetentIndex: 1,
      },
    },
  },
});
```

**Dynamic API**

```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.25, 0.5, 1],
          sheetInitialDetentIndex: 1,
        }}
      />
    </Stack.Navigator>
  );
}
```

On iOS, fixed detents do not automatically make content fill the sheet height. Use `contentStyle.backgroundColor` if the uncovered area would otherwise look translucent.

## Customizing Appearance

- `sheetGrabberVisible` is iOS only and shows the grabber.
- `sheetCornerRadius` overrides the default corner radius.
- `sheetElevation` is Android only, adjusts the top-edge shadow, and cannot be changed after mount.
- `sheetLargestUndimmedDetentIndex` controls when the background stays undimmed: `'none'` always dims, `'last'` never dims, and a number keeps the background undimmed up to that detent index. On iOS, the system can still add dimming if the sheet grows beyond that height without a detent change, such as when the keyboard appears.
- `contentStyle.backgroundColor` sets an explicit background color for the whole sheet. This is especially useful on iOS with fixed detents, where the content does not automatically fill the sheet height.

**Static API**

```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const AppStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    Composer: {
      screen: ComposerScreen,
      options: {
        presentation: 'formSheet',
        sheetAllowedDetents: [0.5, 1],
        sheetGrabberVisible: true,
        sheetCornerRadius: 24,
        sheetElevation: 12,
        sheetLargestUndimmedDetentIndex: 0,
        contentStyle: {
          backgroundColor: '#fff',
        },
      },
    },
  },
});
```

**Dynamic API**

```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Composer"
        component={ComposerScreen}
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.5, 1],
          sheetGrabberVisible: true,
          sheetCornerRadius: 24,
          sheetElevation: 12,
          sheetLargestUndimmedDetentIndex: 0,
          contentStyle: {
            backgroundColor: '#fff',
          },
        }}
      />
    </Stack.Navigator>
  );
}
```

## Scroll Behavior

On iOS, scrolling can expand the sheet to a larger detent by default. `sheetExpandsWhenScrolledToEdge` is iOS only, and setting it to `false` prevents that behavior.

For this to work, the `ScrollView` must be reachable by following the first child at each level from the screen component (aka first descendant chain).

**Static API**

```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const AppStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    Comments: {
      screen: CommentsScreen,
      options: {
        presentation: 'formSheet',
        sheetAllowedDetents: [0.5, 1],
        sheetExpandsWhenScrolledToEdge: false,
      },
    },
  },
});
```

**Dynamic API**

```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Comments"
        component={CommentsScreen}
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.5, 1],
          sheetExpandsWhenScrolledToEdge: false,
        }}
      />
    </Stack.Navigator>
  );
}
```

On Android, nested `ScrollView` usage may require `nestedScrollEnabled`, and still does not work when the content is shorter than the scroll view.

## Notes

- On Android, `presentation: 'formSheet'` screens do not currently support nested stack navigators or `headerShown`.

## Canonical Docs

- [Native Stack Navigator](https://reactnavigation.org/docs/native-stack-navigator)

## Related Skills

- [stacks.md](./stacks.md)
- [safe-areas.md](./safe-areas.md)
