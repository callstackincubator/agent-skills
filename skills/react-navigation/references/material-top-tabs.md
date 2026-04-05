---
title: Material Top Tabs
impact: MEDIUM
tags: react-navigation, material-top-tabs, swipe, pager-view, lazy, tab-animation
---

# Skill: Material Top Tabs

## Description

Use `createMaterialTopTabNavigator` for swipeable top tabs with a Material-style tab bar.

## When to Use

- Building segmented content that should switch by tap or horizontal swipe
- Having a scrollable tab bar at the top of the screen

## Prerequisites

Install `react-native-pager-view` for material top tabs to work on native platforms.

## Basic Example

**Static API**

```tsx
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const HomeTabs = createMaterialTopTabNavigator({
  screens: {
    Feed: FeedScreen,
    Updates: UpdatesScreen,
  },
});
```

**Dynamic API**

```tsx
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Updates" component={UpdatesScreen} />
    </Tab.Navigator>
  );
}
```

## Common Features

### Displaying Icons

Icons are hidden by default. Set `tabBarShowIcon: true`, then provide `tabBarIcon`. Optionally use `tabBarActiveTintColor` and `tabBarInactiveTintColor` to change the color passed to the icon.

**Static API**

```tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const HomeTabs = createMaterialTopTabNavigator({
  screenOptions: ({ route }) => ({
    tabBarShowIcon: true,
    tabBarIcon: ({ focused, color }) => {
      let iconName;

      switch (route.name) {
        case 'Feed':
          iconName = focused ? 'newspaper' : 'newspaper-outline';
          break;
        default:
          iconName = focused ? 'notifications' : 'notifications-outline';
          break;
      }

      return <Ionicons name={iconName} size={18} color={color} />;
    },
    tabBarActiveTintColor: 'tomato',
    tabBarInactiveTintColor: 'gray',
  }),
  screens: {
    Feed: FeedScreen,
    Updates: UpdatesScreen,
  },
});
```

**Dynamic API**

```tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowIcon: true,
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          switch (route.name) {
            case 'Feed':
              iconName = focused ? 'newspaper' : 'newspaper-outline';
              break;
            default:
              iconName = focused ? 'notifications' : 'notifications-outline';
              break;
          }

          return <Ionicons name={iconName} size={18} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Updates" component={UpdatesScreen} />
    </Tab.Navigator>
  );
}
```

The `tabBarIcon` option can render any React element. Choose between the icon libraries that best fit the app's design and environment:

- `@expo/vector-icons` if Expo SDK is configured in the app
- `react-native-vector-icons` for an app using React Native Community CLI
- `<Image>` for local images

### Scrollable Tab Bar

Use `tabBarScrollEnabled: true` if the list of tabs won't fit on the screen to make the tab bar scrollable. Set a fixed width for each tab with `tabBarItemStyle` to make the scrollable tab bar work better.

Use `tabBarItemStyle` with `{ width: 'auto' }` if the tab button width should fit the label instead of being equally divided.

**Static API**

```tsx
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const HomeTabs = createMaterialTopTabNavigator({
  screenOptions: {
    tabBarScrollEnabled: true,
  },
  screens: {
    Feed: FeedScreen,
    Updates: UpdatesScreen,
    Mentions: MentionsScreen,
    Saved: SavedScreen,
    Archive: ArchiveScreen,
  },
});
```

**Dynamic API**

```tsx
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
      }}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Updates" component={UpdatesScreen} />
      <Tab.Screen name="Mentions" component={MentionsScreen} />
      <Tab.Screen name="Saved" component={SavedScreen} />
      <Tab.Screen name="Archive" component={ArchiveScreen} />
    </Tab.Navigator>
  );
}
```

### Badges

Use `tabBarBadge` to render a custom badge element for a tab.

**Static API**

```tsx
import { Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const HomeTabs = createMaterialTopTabNavigator({
  screens: {
    Inbox: {
      screen: InboxScreen,
      options: {
        tabBarBadge: () => (
          <View
            style={{
              minWidth: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: 'tomato',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 12 }}>3</Text>
          </View>
        ),
      },
    },
    Settings: SettingsScreen,
  },
});
```

**Dynamic API**

```tsx
import { Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Inbox"
        component={InboxScreen}
        options={{
          tabBarBadge: () => (
            <View
              style={{
                minWidth: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: 'tomato',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: 'white', fontSize: 12 }}>3</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
```

### Indicators

Use `tabBarIndicatorStyle` to customize the indicator:

- Use horizontal margin (`{ marginHorizontal: 16 }`) to make the indicator shorter than the tab button width.
- Set width (`{ width: 24 }`) for a fixed-width indicator, with `marginHorizontal: 'auto'` to center it under the tab button.
- Don't set `borderRadius` if `tabBarItemStyle` has `'auto'` width as it's not supported.

If the default styling options aren't sufficient, use `tabBarIndicator` to render a custom indicator.

**Static API**

```tsx
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const HomeTabs = createMaterialTopTabNavigator({
  screenOptions: {
    tabBarIndicatorStyle: {
      backgroundColor: '#111827',
      height: 3,
      marginHorizontal: 16,
    },
  },
  screens: {
    Feed: FeedScreen,
    Updates: UpdatesScreen,
  },
});
```

**Dynamic API**

```tsx
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: {
          backgroundColor: '#111827',
          height: 3,
          marginHorizontal: 16,
        },
      }}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Updates" component={UpdatesScreen} />
    </Tab.Navigator>
  );
}
```

### Custom Tab Bar

Use the `tabBar` option if a custom design is needed. Use the `navigation` prop passed to the tab bar instead of `useNavigation`.

```tsx
import { Text, View } from 'react-native';
import { useLinkBuilder } from '@react-navigation/native';
import { PlatformPressable } from '@react-navigation/elements';

function MyTabBar({ state, descriptors, navigation }) {
  const { buildHref } = useLinkBuilder();

  return (
    <View style={{ flexDirection: 'row' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        return (
          <PlatformPressable
            key={route.key}
            href={buildHref(route.name, route.params)}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            }}
            onLongPress={() =>
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              })
            }
            style={{ flex: 1, alignItems: 'center', paddingVertical: 12 }}
          >
            <Text style={{ opacity: isFocused ? 1 : 0.6 }}>{label}</Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
}
```

**Static API**

```tsx
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const HomeTabs = createMaterialTopTabNavigator({
  tabBar: (props) => <MyTabBar {...props} />,
  screens: {
    Feed: FeedScreen,
    Updates: UpdatesScreen,
  },
});
```

**Dynamic API**

```tsx
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Updates" component={UpdatesScreen} />
    </Tab.Navigator>
  );
}
```

If the custom tab bar also needs proper web links, use `useLinkBuilder` when building each tab button.

### Lazy Rendering

All screens are mounted immediately by default for smoother swiping. Enable `lazy` only when rendering tabs upfront is too expensive.

**Static API**

```tsx
import { ActivityIndicator, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const HomeTabs = createMaterialTopTabNavigator({
  screenOptions: {
    lazy: true,
  },
  screens: {
    Feed: FeedScreen,
    Updates: UpdatesScreen,
    Mentions: MentionsScreen,
  },
});
```

**Dynamic API**

```tsx
import { ActivityIndicator, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        lazy: true,
      }}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Updates" component={UpdatesScreen} />
      <Tab.Screen name="Mentions" component={MentionsScreen} />
    </Tab.Navigator>
  );
}
```

Customize lazy loading behavior with `lazyPlaceholder` to show a custom placeholder before the screen is loaded and `lazyPreloadDistance` to control how many screens away from the focused screen should be preloaded.

## Canonical Docs

- [Material Top Tabs Navigator](https://reactnavigation.org/docs/material-top-tab-navigator)
