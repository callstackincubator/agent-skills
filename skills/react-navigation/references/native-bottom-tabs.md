---
title: Native Bottom Tabs
impact: HIGH
tags: react-navigation, native-bottom-tabs, native-stack, navigate, search-tab, bottom-accessory, sidebar
---

# Skill: Native Bottom Tabs

## Description

Use `createNativeBottomTabNavigator` for a native tab bar on iOS and Android.

Conditionally use [bottom-tabs.md](./bottom-tabs.md) if web support is needed.

## When to Use

- Building primary app destinations behind a tab bar
- The app runs on iOS or Android

## Basic Example

**Static API**

```tsx
import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable';

const AppTabs = createNativeBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
```

**Dynamic API**

```tsx
import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable';

const Tab = createNativeBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

## Avoiding Overlap with the Tab Bar

On iOS, content inset is automatically adjusted for scrollable views to avoid overlap with the tab bar.

For non-scrollable content, or on Android, use the experimental `SafeAreaView` from `react-native-screens/experimental` to apply padding for the tab bar.

```tsx
import { SafeAreaView } from 'react-native-screens/experimental';

function ProfileScreen() {
  return <SafeAreaView edges={{ bottom: true }}>{/* content */}</SafeAreaView>;
}
```

## Common Features

### Displaying Icons

Use `tabBarIcon` in `screenOptions` or per-screen `options`. Optionally use `tabBarActiveTintColor` and `tabBarInactiveTintColor` to change the color of the icon (support varies based on platform).

**Static API**

```tsx
const AppTabs = createNativeBottomTabNavigator({
  screens: {
    Feed: {
      screen: FeedScreen,
      options: {
        tabBarIcon: Platform.select({
          ios: {
            type: 'sfSymbol',
            name: 'favorites',
          },
          default: {
            type: 'image',
            source: require('./assets/feed.png'),
          },
        }),
      },
    },
  },
});
```

**Dynamic API**

```tsx
const Tab = createNativeBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarIcon: Platform.select({
            ios: {
              type: 'sfSymbol',
              name: 'favorites',
            },
            default: {
              type: 'image',
              source: require('./assets/feed.png'),
            },
          }),
        }}
      />
    </Tab.Navigator>
  );
}
```

The `tabBarIcon` option supports multiple types of icons:

- SF Symbols on iOS with `type: 'sfSymbol'` and `name`.
- Local images with `type: 'image'` and `source`.

Prefer SF Symbols on iOS, and image icons for other platforms. Use `Platform.select` to specify different icons per platform if needed.

When using image icons:

- Provide `1x`, `2x`, and `3x` image assets (`image.png`, `image@2x.png`, `image@3x.png`) because iOS does not scale tab icons automatically.
- Set `tinted: false` on iOS (`{ type: 'image', tinted: false, source: require('./assets/feed.png') }`) if the image should keep its original colors. Android always tints image icons.

### Search Tab on iOS 26+

Use the built-in `search` system item together with a nested native stack navigator whose focused screen defines `headerSearchBarOptions`.

**Static API**

```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const SearchStack = createNativeStackNavigator({
  screens: {
    FruitsList: {
      screen: FruitsListScreen,
      options: {
        title: 'Search',
        headerSearchBarOptions: {
          placeholder: 'Search fruits',
        },
      },
    },
  },
});

const AppTabs = createNativeBottomTabNavigator({
  screens: {
    Search: {
      screen: SearchStack,
      options: {
        tabBarSystemItem: 'search',
      },
    },
  },
});
```

**Dynamic API**

```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const Tab = createNativeBottomTabNavigator();

function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FruitsList"
        component={FruitsListScreen}
        options={{
          title: 'Search',
          headerSearchBarOptions: {
            placeholder: 'Search fruits',
          },
        }}
      />
    </Stack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Search"
        component={SearchStack}
        options={{
          tabBarSystemItem: 'search',
        }}
      />
    </Tab.Navigator>
  );
}
```

- This behavior is available on iOS 26 and above.
- The tab bar transforms into a search field only when the selected tab renders a nested native stack navigator.
- The focused screen in that nested native stack must define `headerSearchBarOptions`.

### Bottom Accessory

Use `bottomAccessory` to render content above the tab bar or inline with the collapsed bar.

**Static API**

```tsx
const AppTabs = createNativeBottomTabNavigator({
  screenOptions: {
    bottomAccessory: ({ placement }) => {
      return (
        <View style={{ padding: 16 }}>
          <Text>Placement: {placement}</Text>
        </View>
      );
    },
  },
  screens: {
    Home: HomeScreen,
  },
});
```

**Dynamic API**

```tsx
const Tab = createNativeBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        bottomAccessory: ({ placement }) => {
          return (
            <View style={{ padding: 16 }}>
              <Text>Placement: {placement}</Text>
            </View>
          );
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
    </Tab.Navigator>
  );
}
```

- `placement` is `regular` above the bar or `inline` when the bar is collapsed.
- This is supported on iOS 26 and above.
- The accessory renders twice, once per placement, so shared state should live outside the returned component.

### Sidebar

Use `tabBarControllerMode: 'tabSidebar'` to display the native tab controller as a sidebar.

**Static API**

```tsx
const AppTabs = createNativeBottomTabNavigator({
  screenOptions: {
    tabBarControllerMode: 'tabSidebar',
  },
  screens: {
    Home: HomeScreen,
    Search: SearchScreen,
  },
});
```

**Dynamic API**

```tsx
const Tab = createNativeBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarControllerMode: 'tabSidebar',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
    </Tab.Navigator>
  );
}
```

- `auto` lets the system choose the presentation.
- `tabBar` forces the standard tab bar.
- Sidebar mode is supported on iOS 18 and above and not on tvOS.

### Minimize on Scroll

Use `tabBarMinimizeBehavior` to let the system collapse the tab bar while scrolling.

**Static API**

```tsx
const AppTabs = createNativeBottomTabNavigator({
  screenOptions: {
    tabBarMinimizeBehavior: 'onScrollDown',
  },
  screens: {
    Home: HomeScreen,
  },
});
```

**Dynamic API**

```tsx
const Tab = createNativeBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarMinimizeBehavior: 'onScrollDown',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
    </Tab.Navigator>
  );
}
```

- Supported values are `auto`, `never`, `onScrollDown`, and `onScrollUp`.
- This is supported on iOS 26 and above.

## Notes

- React Native 0.79 or above is required. If you're using Expo, SDK 53 or above is required.
- The app must use the latest `react-native-screens` along with the latest version of `@react-navigation/bottom-tabs` to avoid compatibility issues.
- When using Expo, development builds maybe required to support the latest version of `react-native-screens`.
- Liquid Glass effect on iOS 26+ requires your app to be built with Xcode 26 or above.
- On Android, at most 5 tabs are supported. This is a limitation of the underlying native component.
- No header is shown by default. A basic JS based header can be shown with `headerShown: true` option (see [header.md](./header.md)), or a native header can be shown by nesting a native stack navigator inside each tab screen.

## Canonical Docs

- [Native Bottom Tabs Navigator](https://reactnavigation.org/docs/native-bottom-tab-navigator)
- [Native Stack Navigator](https://reactnavigation.org/docs/native-stack-navigator)

## Related Skills

- [bottom-tabs.md](./bottom-tabs.md)
- [stacks.md](./stacks.md)
- [safe-areas.md](./safe-areas.md)
- [header.md](./header.md)
