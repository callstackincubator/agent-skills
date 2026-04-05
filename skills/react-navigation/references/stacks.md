---
title: Native Stack Navigator
impact: HIGH
tags: react-navigation, native-stack, navigation, header, header-items, search-bar, large-title, modal, animation, form-sheet
---

# Skill: Native Stack Navigator

## Description

Use `createNativeStackNavigator` for screen-to-screen flows.

## When to Use

- Building the default push-based flow for an app
- Using platform-native headers, large titles, or a native search bar
- Presenting modal or sheet screens with native-stack presentations

## Basic Example

**Static API**

```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const AppStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
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
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
```

## Common Features

### Large Title

Use `headerLargeTitleEnabled: true` for an iOS large title that collapses into the regular header on scroll.

**Static API**

```tsx
const AppStack = createNativeStackNavigator({
  screens: {
    Library: {
      screen: LibraryScreen,
      options: {
        headerLargeTitleEnabled: true,
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
      <Stack.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          headerLargeTitleEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
}
```

- Only supported on iOS.
- The scroll view in the screen must use `contentInsetAdjustmentBehavior="automatic"`.
- Don't set a background color on the header if large title is enabled as it makes title invisible on iOS 26.
- Don't set `headerTransparent: false` if large title is enabled.
- If the scrollable area does not fill the screen, the large title will not collapse on scroll.

### Header Search Bar

Use `headerSearchBarOptions` to render a native search bar. If the search configuration depends on screen state, update it with `navigation.setOptions(...)`.

**Static API**

```tsx
const AppStack = createNativeStackNavigator({
  screens: {
    Search: {
      screen: SearchScreen,
      options: {
        headerSearchBarOptions: {
          placeholder: 'Search',
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
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerSearchBarOptions: {
            placeholder: 'Search',
          },
        }}
      />
    </Stack.Navigator>
  );
}
```

- The scroll view in the screen must use `contentInsetAdjustmentBehavior="automatic"`.
- If the screen doesn't have a scroll view, use `headerTopInsetEnabled: true`.

### Header Buttons and Custom Content

Use `unstable_headerLeftItems` and `unstable_headerRightItems` for native iOS header buttons or menus. Use `headerLeft`, `headerRight`, `headerTitle`, and `headerBackground` for custom React content, and as a fallback on other platforms.

**Static API**

```tsx
import { Button, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const AppStack = createNativeStackNavigator({
  screens: {
    Profile: {
      screen: ProfileScreen,
      options: {
        headerTitle: ({ tintColor, children }) => (
          <Text style={{ color: tintColor, fontSize: 18 }}>{children}</Text>
        ),
        headerBackground: () => (
          <View style={{ flex: 1, backgroundColor: '#fff' }} />
        ),
        unstable_headerLeftItems: () => [
          {
            type: 'button',
            label: 'Edit',
            onPress: () => {
              // Do something
            },
          },
        ],
        unstable_headerRightItems: () => [
          {
            type: 'button',
            label: 'Done',
            icon: {
              type: 'sfSymbol',
              name: 'checkmark',
            },
            onPress: () => {
              // Do something
            },
          },
        ],
        headerLeft: ({ tintColor }) => (
          <Button title="Edit" color={tintColor} onPress={() => {}} />
        ),
        headerRight: ({ tintColor }) => (
          <Button title="Done" color={tintColor} onPress={() => {}} />
        ),
      },
    },
  },
});
```

**Dynamic API**

```tsx
import { Button, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerTitle: ({ tintColor, children }) => (
            <Text style={{ color: tintColor, fontSize: 18 }}>{children}</Text>
          ),
          headerBackground: () => (
            <View style={{ flex: 1, backgroundColor: '#fff' }} />
          ),
          unstable_headerLeftItems: () => [
            {
              type: 'button',
              label: 'Edit',
              onPress: () => {
                // Do something
              },
            },
          ],
          unstable_headerRightItems: () => [
            {
              type: 'button',
              label: 'Done',
              icon: {
                type: 'sfSymbol',
                name: 'checkmark',
              },
              onPress: () => {
                // Do something
              },
            },
          ],
          headerLeft: ({ tintColor }) => (
            <Button title="Edit" color={tintColor} onPress={() => {}} />
          ),
          headerRight: ({ tintColor }) => (
            <Button title="Done" color={tintColor} onPress={() => {}} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}
```

- `unstable_headerLeftItems` and `unstable_headerRightItems` are only supported on iOS and override `headerLeft` and `headerRight` when both are specified.
- Use `headerLeft` when replacing the back button. Add `headerBackVisible: true` if the back button should still be shown alongside the custom left element.
- `headerTitle` is useful when the title needs custom typography or extra layout, but custom title elements do not animate with the native title transition.
- Use `headerBackground` for a gradient, image, or custom background view. For translucent native headers on iOS, prefer `headerTransparent: true` with `scrollEdgeEffects` for iOS 26+ or `headerBlurEffect` for earlier versions.
- Some behavior differs between iOS versions. On iOS 26+, `unstable_headerRightItems` can collapse into the system overflow menu when there is not enough space.
- Custom items with `type: 'custom'` in `unstable_headerRightItems` are not collapsed into the overflow menu.
- Labels are used when items collapse into the overflow menu, and for accessibility.

### Screen Presentations

Use the screen `presentation` option to control whether a screen is pushed normally or shown as a modal or sheet.

**Static API**

```tsx
const AppStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    Compose: {
      screen: ComposeScreen,
      options: {
        presentation: 'modal',
        animation: 'slide_from_bottom',
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
        name="Compose"
        component={ComposeScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
}
```

- Use `card` for the default push presentation.
- Use `modal` for a standard modal presentation.
- Use `containedModal` for a current-context modal presentation on iOS and the default modal presentation on Android.
- Use `fullScreenModal` when the screen should take over the whole screen. On iOS, this presentation cannot be dismissed by gesture.
- Use `transparentModal` or `containedTransparentModal` when the previous screen should remain visible behind translucent content.
- Use `formSheet` when the design calls for a native sheet. Use [form-sheet.md](./form-sheet.md) for detents and platform-specific caveats.
- Use the `animation` option in the section below when the default transition does not fit the flow.

### Transition Animations

Use `animation` option to customize the transition animation.

**Static API**

```tsx
const AppStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    Details: {
      screen: DetailsScreen,
      options: {
        animation: 'fade_from_bottom',
        animationDuration: 300,
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
          animation: 'fade_from_bottom',
          animationDuration: 300,
        }}
      />
    </Stack.Navigator>
  );
}
```

- Supported `animation` values include `default`, `fade`, `fade_from_bottom`, `simple_push`, `slide_from_bottom`, `slide_from_right`, `slide_from_left`, `flip`, and `none`.
- `flip` requires `presentation: 'modal'` on iOS.
- `slide_from_right` and `slide_from_left` fall back to the default transition on iOS.
- `simple_push` removes the shadow and native header transition on iOS and falls back to the default transition on Android.
- Use `animationTypeForReplace: 'pop'` when `navigation.replace(...)` should feel like going back, such as auth or onboarding flows.
- Use `animationDuration` on iOS to tune `slide_from_bottom`, `fade_from_bottom`, `fade`, and `simple_push`. It does not apply to `default`, `flip`, or screens presented as `modal` or `formSheet`.
- Gesture-related transition options are only supported on iOS.
- Use `gestureEnabled` to disable swipe-to-dismiss when the animation should only run programmatically.
- Use `fullScreenGestureEnabled` to start the dismiss gesture anywhere on the screen. This uses `simple_push`-style behavior, and the default iOS transition cannot be matched due to platform limitations.
- Use `animationMatchesGesture` when the interactive dismiss gesture should follow the `animation` option. It does not affect screens presented modally.
- Use `fullScreenGestureShadowEnabled` to control the shadow shown during a full-screen dismiss gesture.
- On iOS, `gestureDirection: 'vertical'` implies `animation: 'slide_from_bottom'` together with full-screen dismissal gestures.

## Notes

- For scrollable content and `contentInsetAdjustmentBehavior="automatic"`, native stack needs it to be in the first-descendant chain — no views should be rendered before the scrollable view.

## Canonical Docs

- [Native Stack Navigator](https://reactnavigation.org/docs/native-stack-navigator)
- [Moving between screens](https://reactnavigation.org/docs/navigating)
- [Configuring the header bar](https://reactnavigation.org/docs/headers)
- [Opening a modal](https://reactnavigation.org/docs/modal)

## Related Skills

- [form-sheet.md](./form-sheet.md)
- [safe-areas.md](./safe-areas.md)
