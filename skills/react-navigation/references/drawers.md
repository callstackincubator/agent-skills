---
title: Drawer Navigator
impact: HIGH
tags: react-navigation, drawer, sidebar, master-detail, header, responsive-layout
---

# Skill: Drawer Navigator

## Description

Use `createDrawerNavigator` for a navigation drawer or sidebar that switches between app sections. If using a drawer for displaying content instead of navigation, use [`react-native-drawer-layout`](https://reactnavigation.org/docs/drawer-layout/) instead.

## When to Use

- Building app sections behind a drawer or sidebar
- Showing a permanent sidebar on larger screens and a drawer on smaller screens
- Using the drawer as the master pane in a master-detail layout

## Prerequisites

Install and configure `react-native-gesture-handler`, `react-native-reanimated`, and `react-native-worklets` for drawer navigator to work on native platforms.

## Basic Example

**Static API**

```tsx
import { createDrawerNavigator } from '@react-navigation/drawer';

const AppDrawer = createDrawerNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
```

**Dynamic API**

```tsx
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function AppDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}
```

## Opening and Closing the Drawer

Use `navigation.openDrawer()`, `navigation.closeDrawer()`, and `navigation.toggleDrawer()` inside drawer screens to open or close the drawer programmatically.

```tsx
import { Button, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View>
      <Button title="Open drawer" onPress={() => navigation.openDrawer()} />
      <Button title="Close drawer" onPress={() => navigation.closeDrawer()} />
      <Button title="Toggle drawer" onPress={() => navigation.toggleDrawer()} />
    </View>
  );
}
```

## Nesting Drawers

When nesting a drawer inside another drawer, use [`react-native-drawer-layout`](https://reactnavigation.org/docs/drawer-layout/) for the outer drawer and keep Drawer navigator for the inner navigation drawer.

```tsx
import * as React from 'react';
import { Text } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';

function App() {
  const [rightDrawerOpen, setRightDrawerOpen] = React.useState(false);

  return (
    <Drawer
      open={rightDrawerOpen}
      onOpen={() => setRightDrawerOpen(true)}
      onClose={() => setRightDrawerOpen(false)}
      drawerPosition="right"
      renderDrawerContent={() => <Text>Right drawer content</Text>}
    >
      <AppDrawer />
    </Drawer>
  );
}
```

Use React context to expose methods for opening or closing the outer drawer from nested screens.

## Common Features

### Displaying Icons

Use `drawerIcon` in `screenOptions` or per-screen `options`. `drawerActiveTintColor` and `drawerInactiveTintColor` control the color passed to the icon and label.

**Static API**

```tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import { createDrawerNavigator } from '@react-navigation/drawer';

const AppDrawer = createDrawerNavigator({
  screenOptions: ({ route }) => ({
    drawerIcon: ({ color, size }) => {
      let iconName;

      switch (route.name) {
        case 'Home':
          iconName = 'home-outline';
          break;
        default:
          iconName = 'person-outline';
          break;
      }

      return <Ionicons name={iconName} size={size} color={color} />;
    },
    drawerActiveTintColor: 'tomato',
    drawerInactiveTintColor: 'gray',
  }),
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
```

**Dynamic API**

```tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function AppDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={({ route }) => ({
        drawerIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home-outline';
              break;
            default:
              iconName = 'person-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        drawerActiveTintColor: 'tomato',
        drawerInactiveTintColor: 'gray',
      })}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}
```

The `drawerIcon` option can render any React element. Choose between the icon libraries that best fit the app's design and environment:

- `@expo/vector-icons` if Expo SDK is configured in the app
- `react-native-vector-icons` for an app using React Native Community CLI
- `<Image>` for local images

### Custom Drawer Content

Use `drawerContent` to customize the content of drawer, such as adding a header, footer, or custom actions, or replacing with a custom design.

Use `DrawerContentScrollView` to automatically adjust insets and `DrawerItemList` to keep default design. Use the `navigation` prop passed to the custom drawer content instead of `useNavigation`.

```tsx
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Help"
        onPress={() => props.navigation.navigate('Help')}
      />
    </DrawerContentScrollView>
  );
}
```

Replace the content with own element if a different design is needed. Use the `state` prop to access the list of screens and `descriptors` to access the options for each screen.

**Static API**

```tsx
import { createDrawerNavigator } from '@react-navigation/drawer';

const AppDrawer = createDrawerNavigator({
  drawerContent: (props) => <CustomDrawerContent {...props} />,
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
    Help: HelpScreen,
  },
});
```

**Dynamic API**

```tsx
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function AppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Help" component={HelpScreen} />
    </Drawer.Navigator>
  );
}
```

### Types of Drawer

Use `drawerType` to choose how the drawer behaves.

Choose between `front`, `back`, and `slide` on smaller screens. Use `permanent` for a sidebar on larger screens. Use `useWindowDimensions` to conditionally set the type based on screen width for responsive layouts.

**Static API**

```tsx
import { useWindowDimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

const AppDrawer = createDrawerNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
}).with(({ Navigator }) => {
  const { width } = useWindowDimensions();

  return (
    <Navigator
      screenOptions={{
        drawerType: width >= 768 ? 'permanent' : 'front',
      }}
    />
  );
});
```

**Dynamic API**

```tsx
import { useWindowDimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function AppDrawer() {
  const { width } = useWindowDimensions();

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: width >= 768 ? 'permanent' : 'front',
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}
```

### Drawer Position

Use `drawerPosition` to place the drawer on the left or right side. The default is `left` in LTR languages and `right` in RTL languages.

**Static API**

```tsx
import { createDrawerNavigator } from '@react-navigation/drawer';

const AppDrawer = createDrawerNavigator({
  screenOptions: {
    drawerPosition: 'right',
  },
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});
```

**Dynamic API**

```tsx
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function AppDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: 'right',
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}
```

### Master Detail Layout

Combine `defaultStatus: 'open'` with `drawerType: 'back'` when the drawer should start open and behave like the master pane behind the detail screen.

**Static API**

```tsx
import { createDrawerNavigator } from '@react-navigation/drawer';

const AppDrawer = createDrawerNavigator({
  defaultStatus: 'open',
  screenOptions: {
    drawerType: 'back',
    drawerStyle: { width: '100%' },
    overlayColor: 'transparent',
  },
  screens: {
    Inbox: InboxScreen,
    Message: MessageScreen,
  },
});
```

**Dynamic API**

```tsx
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function AppDrawer() {
  return (
    <Drawer.Navigator
      defaultStatus="open"
      screenOptions={{
        drawerType: 'back',
        drawerStyle: { width: '100%' },
        overlayColor: 'transparent',
      }}
    >
      <Drawer.Screen name="Inbox" component={InboxScreen} />
      <Drawer.Screen name="Message" component={MessageScreen} />
    </Drawer.Navigator>
  );
}
```

With `defaultStatus: 'open'`, the drawer's default state is open. So if drawer is closed, the back button will open it.

### Customizing Header

Drawer screens show a header by default. Use [header.md](./header.md) for common customization patterns.

A custom header can be shown with the `header` option if a custom design is needed.

**Static API**

```tsx
import { getHeaderTitle } from '@react-navigation/elements';
import { createDrawerNavigator } from '@react-navigation/drawer';

const AppDrawer = createDrawerNavigator({
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
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function AppDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
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
    </Drawer.Navigator>
  );
}
```

- Set `headerShown: false` to hide the header.
- If a custom header uses a non-default height, set `headerStyle: { height: ... }` explicitly to avoid measurement glitches.

## Notes

- Swipe gestures and gesture-handler customization are not supported on web.
- If a drawer is nested under a stack or tab navigator, it renders below that parent navigator's header or tab bar.

## Canonical Docs

- [Drawer Navigator](https://reactnavigation.org/docs/drawer-navigator)
- [Multiple drawers](https://reactnavigation.org/docs/multiple-drawers)
- [Static configuration](https://reactnavigation.org/docs/static-configuration)
- [Configuring the header bar](https://reactnavigation.org/docs/headers)

## Related Skills

- [header.md](./header.md)
- [bottom-tabs.md](./bottom-tabs.md)
- [stacks.md](./stacks.md)
- [safe-areas.md](./safe-areas.md)
