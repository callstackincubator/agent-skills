---
title: Bottom Tabs
impact: HIGH
tags: react-navigation, bottom-tabs, tab-bar, icons, blur, sidebar, header
---

# Skill: Bottom Tabs

## Description

Use `createBottomTabNavigator` for cross-platform tab navigation with a tab bar that can stay at the bottom on smaller screens and move to the side on larger layouts if the app needs web support.

Conditionally use [native-bottom-tabs.md](./native-bottom-tabs.md) on Android and iOS for a native tab bar.

## When to Use

- Building primary app destinations behind a tab bar
- The app needs to run on web and mobile

## Basic Example

**Static API**

```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const AppTabs = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

## Common Features

### Displaying Icons

Use `tabBarIcon` in `screenOptions` or per-screen `options`. Optionally use `tabBarActiveTintColor` and `tabBarInactiveTintColor` to change the color passed to the icon.

**Static API**

```tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const AppTabs = createBottomTabNavigator({
  screenOptions: ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      switch (route.name) {
        case 'Home':
          iconName = focused ? 'home' : 'home-outline';
          break;
        default:
          iconName = focused ? 'settings' : 'settings-outline';
          break;
      }

      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: 'tomato',
    tabBarInactiveTintColor: 'gray',
  }),
  screens: {
    Home: HomeScreen,
    Settings: SettingsScreen,
  },
});
```

**Dynamic API**

```tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            default:
              iconName = focused ? 'settings' : 'settings-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
```

The `tabBarIcon` option can render any React element. Choose between the icon libraries that best fit the app's design and environment:

- `@expo/vector-icons` if Expo SDK is configured in the app
- `react-native-vector-icons` for an app using React Native Community CLI
- `<Image>` for local images

### Scroll to Top on Tab Press

Use `useScrollToTop` on a scrollable ref inside a screen in the tab navigator to automatically scroll to the top when the tab is pressed while already focused.

```tsx
import * as React from 'react';
import { ScrollView } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';

function FeedScreen() {
  const ref = React.useRef(null);

  useScrollToTop(ref);

  return <ScrollView ref={ref}>{/* content */}</ScrollView>;
}
```

### Custom Background Such as Blur

Use `tabBarBackground` for custom chrome such as blur effects, image, or gradient backgrounds. When the background should show through the tab bar, set `tabBarStyle: { position: 'absolute' }` and use `useBottomTabBarHeight` inside the screens to pad the content.

**Static API**

```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

const AppTabs = createBottomTabNavigator({
  screenOptions: {
    tabBarStyle: { position: 'absolute' },
    tabBarBackground: () => (
      <BlurView tint="light" intensity={100} style={StyleSheet.absoluteFill} />
    ),
  },
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
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
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { position: 'absolute' },
        tabBarBackground: () => (
          <BlurView
            tint="light"
            intensity={100}
            style={StyleSheet.absoluteFill}
          />
        ),
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

### Custom Tab Bar

Use the `tabBar` option if a custom design is needed. Use the `state` prop to access the list of screens and `descriptors` to access the options for each screen. Use the `navigation` prop passed to the tab bar for navigation instead of `useNavigation`.

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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const AppTabs = createBottomTabNavigator({
  tabBar: (props) => <MyTabBar {...props} />,
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
```

**Dynamic API**

```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

### Sidebar

Set `tabBarPosition` to `left` or `right` to render the tab bar as a sidebar. Choose the position based on the screen width for responsive layouts.

**Static API**

```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const AppTabs = createBottomTabNavigator({
  screenOptions: {
    tabBarPosition: 'left',
  },
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
}).with(({ Navigator }) => {
  const dimensions = useWindowDimensions();

  return (
    <Navigator
      screenOptions={{
        tabBarPosition: dimensions.width >= 768 ? 'left' : 'bottom',
      }}
    />
  );
});
```

**Dynamic API**

```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useWindowDimensions } from 'react-native';

const Tab = createBottomTabNavigator();

function AppTabs() {
  const dimensions = useWindowDimensions();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarPosition: dimensions.width >= 768 ? 'left' : 'bottom',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

For a compact sidebar, use `tabBarVariant: 'material'` together with `tabBarLabelPosition: 'below-icon'`.

### Customizing Header

Bottom tabs show a header by default. Use [header.md](./header.md) for common customization patterns.

A custom header can be shown with the `header` option if a custom design is needed.

**Static API**

```tsx
import { getHeaderTitle } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const AppTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        headerStyle: {
          height: 80,
        },
        header: ({ route, options }) => {
          const title = getHeaderTitle(options, route.name);

          return <MyHeader title={title} style={options.headerStyle} />;
        },
      },
    },
  },
});
```

**Dynamic API**

```tsx
import { getHeaderTitle } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerStyle: {
            height: 80,
          },
          header: ({ route, options }) => {
            const title = getHeaderTitle(options, route.name);

            return <MyHeader title={title} style={options.headerStyle} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}
```

- Set `headerShown: false` to hide the header.
- If a custom header uses a non-default height, set `headerStyle: { height: ... }` explicitly to avoid measurement glitches.

## Hiding Tab Bar on Certain Screens

The tab bar is shown on all screens in the tab navigator. To hide the tab bar on certain screens, put those screens in a parent stack navigator instead.

**Static API**

```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const HomeTabs = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Feed: FeedScreen,
    Notifications: NotificationsScreen,
  },
});

const AppStack = createNativeStackNavigator({
  screens: {
    Main: {
      screen: HomeTabs,
      options: {
        headerShown: false,
      },
    },
    Profile: ProfileScreen,
    Settings: SettingsScreen,
  },
});
```

**Dynamic API**

```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
    </Tab.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={HomeTabs}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
```

- Prefer this structure over trying to hide the parent tab bar from screens inside the tab navigator as it can lead to layout glitches.
- Use [stacks.md](./stacks.md) for stack-specific options on the full-screen routes.

## Canonical Docs

- [Bottom Tabs Navigator](https://reactnavigation.org/docs/bottom-tab-navigator)
- [Customizing bottom tab bar](https://reactnavigation.org/docs/customizing-tabbar)
- [Hiding tab bar in specific screens](https://reactnavigation.org/docs/hiding-tabbar-in-screens)

## Related Skills

- [header.md](./header.md)
- [native-bottom-tabs.md](./native-bottom-tabs.md)
- [material-top-tabs.md](./material-top-tabs.md)
- [safe-areas.md](./safe-areas.md)
