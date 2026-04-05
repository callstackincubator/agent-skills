---
title: Header
impact: MEDIUM
tags: react-navigation, header, title, header-buttons, header-background, react-navigation-elements
---

# Skill: Header

## Description

Use this when customizing the header in bottom tabs or drawer which render a JS-based header.

For native stack headers, use [stacks.md](./stacks.md) instead.

## When to Use

- Styling the built-in header in bottom tabs or drawer screens
- Adding header buttons, custom title content, or a custom background

## Basic Example

The shared header options work the same in bottom tabs and drawer. The examples below use bottom tabs.

**Static API**

```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const AppTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        title: 'Home',
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#111',
        headerRight: () => <HeaderAction />,
      },
    },
  },
});
```

**Dynamic API**

```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#111',
          headerRight: () => <HeaderAction />,
        }}
      />
    </Tab.Navigator>
  );
}
```

- Use `title`, `headerStyle`, `headerTintColor`, `headerTitleStyle`, and `headerTitleAlign` for the default header. Put shared config in navigator `screenOptions` and per-screen overrides in `options`.
- Use `headerShown: false` for screens that contain a navigator - the header from the child navigator should be shown instead.

## Common Features

### Buttons and Custom Content

Use `headerLeft`, `headerRight`, `headerTitle`, and `headerBackground` when the default header layout is fine but specific pieces need customization.

**Static API**

```tsx
import { Button, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const AppTabs = createBottomTabNavigator({
  screens: {
    Inbox: {
      screen: InboxScreen,
      options: {
        headerLeft: ({ tintColor }) => (
          <Button title="Edit" color={tintColor} onPress={() => {}} />
        ),
        headerTitle: ({ tintColor, children }) => (
          <Text style={{ color: tintColor, fontSize: 18 }}>{children}</Text>
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
import { Button, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Inbox"
        component={InboxScreen}
        options={{
          headerLeft: ({ tintColor }) => (
            <Button title="Edit" color={tintColor} onPress={() => {}} />
          ),
          headerTitle: ({ tintColor, children }) => (
            <Text style={{ color: tintColor, fontSize: 18 }}>{children}</Text>
          ),
          headerRight: ({ tintColor }) => (
            <Button title="Done" color={tintColor} onPress={() => {}} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
```

- `headerLeft` and `headerRight` receive props such as `tintColor`, `pressColor`, and `pressOpacity`.
- `headerTitle` is useful when the title needs custom typography, icons, or extra layout.
- Use `headerTitleContainerStyle`, `headerLeftContainerStyle`, and `headerRightContainerStyle` to customize the container styles.

### Search Bar

Use `headerSearchBarOptions` to add a search button that expands into a search input in the header. If the search configuration depends on screen state, update it with `navigation.setOptions(...)`.

**Static API**

```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const AppTabs = createBottomTabNavigator({
  screens: {
    Search: {
      screen: SearchScreen,
      options: {
        headerSearchBarOptions: {
          placeholder: 'Search',
          onChangeText: (text) => {
            // Do something
          },
        },
      },
    },
  },
});
```

**Dynamic API**

```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerSearchBarOptions: {
            placeholder: 'Search',
            onChangeText: (text) => {
              // Do something
            },
          },
        }}
      />
    </Tab.Navigator>
  );
}
```

### Translucent Headers

Use `headerTransparent: true` to let content show underneath the header. Combine it with `headerBackground` for effects such as a blur, gradient, or image background.

**Static API**

```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

const AppTabs = createBottomTabNavigator({
  screens: {
    Feed: {
      screen: FeedScreen,
      options: {
        headerTransparent: true,
        headerBackground: () => (
          <BlurView
            tint="light"
            intensity={100}
            style={StyleSheet.absoluteFill}
          />
        ),
      },
    },
  },
});
```

**Dynamic API**

```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          headerTransparent: true,
          headerBackground: () => (
            <BlurView
              tint="light"
              intensity={100}
              style={StyleSheet.absoluteFill}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
```

- `headerStyle` does not apply when `headerBackground` is used. Style the element returned from `headerBackground` instead.
- Transparent headers overlap the content below. Add top spacing manually using `useHeaderHeight` hook from `@react-navigation/elements`

## Canonical Docs

- [Configuring the header bar](https://reactnavigation.org/docs/headers)
- [Bottom Tabs Navigator](https://reactnavigation.org/docs/bottom-tab-navigator)
- [Drawer Navigator](https://reactnavigation.org/docs/drawer-navigator)

## Related Skills

- [bottom-tabs.md](./bottom-tabs.md)
- [drawers.md](./drawers.md)
- [stacks.md](./stacks.md)
