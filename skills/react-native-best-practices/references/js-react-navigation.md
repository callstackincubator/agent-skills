# React Navigation: Always Use Latest Docs

**Impact**: HIGH  
**Category**: Documentation Accuracy

## Quick Reference

⚠️ **DO NOT rely on training data for React Navigation APIs.** Always fetch the latest documentation.

| Resource | URL |
|----------|-----|
| **Doc Index** | https://reactnavigation.org/llms.txt |
| **Full Docs** | https://reactnavigation.org/llms-full.txt |

### Version URLs

| Version | Status | Index | Full Docs |
|---------|--------|-------|-----------|
| **6.x** | Legacy | `llms-6.x.txt` | `llms-full-6.x.txt` |
| **7.x** | ✅ Stable | `llms.txt` | `llms-full.txt` |
| **8.x** | 🚧 Upcoming | `llms-8.x.txt` | `llms-full-8.x.txt` |

## Deep Dive

### Why This Matters

React Navigation evolves rapidly with breaking changes between major versions. Training data becomes stale quickly, leading to:

- Incorrect API usage
- Deprecated patterns
- Missing new features
- Version mismatches

### When to Fetch Docs

Fetch the latest documentation when the user asks about:

- Setting up navigation in React Native
- Stack, Tab, or Drawer navigators
- Passing parameters between screens
- Deep linking configuration
- Navigation lifecycle and events
- TypeScript types for navigation
- Authentication flows with navigation
- Nested navigators
- Screen options and headers

### Workflow

1. **Identify the version** from user's `package.json` or ask if unclear
2. **Fetch the appropriate `llms-full.txt`** for that version
3. **Search the documentation** for relevant sections
4. **Provide code examples** directly from the official docs
5. **Link to specific docs** for further reading

### Quick Patterns

#### Basic Setup (v7.x)

```bash
npm install @react-navigation/native
npx expo install react-native-screens react-native-safe-area-context
```

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

#### Type-Safe Navigation (TypeScript)

```tsx
type RootStackParamList = {
  Home: undefined;
  Details: { itemId: number };
};

const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
navigation.navigate('Details', { itemId: 42 });
```

#### Deep Linking

```tsx
const linking = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: {
      Home: '',
      Details: 'details/:id',
    },
  },
};

<NavigationContainer linking={linking}>
  {/* ... */}
</NavigationContainer>
```

#### Authentication Flow

```tsx
<Stack.Navigator>
  {isSignedIn ? (
    <Stack.Screen name="Home" component={HomeScreen} />
  ) : (
    <Stack.Screen name="SignIn" component={SignInScreen} />
  )}
</Stack.Navigator>
```

### Common Hooks

| Hook | Purpose |
|------|---------|
| `useNavigation()` | Access navigation object |
| `useRoute()` | Access current route params |
| `useFocusEffect()` | Run effect when screen is focused |
| `useIsFocused()` | Check if screen is focused |

### Core Packages

| Package | Purpose |
|---------|---------|
| `@react-navigation/native` | Core navigation |
| `@react-navigation/native-stack` | Native stack navigator |
| `@react-navigation/bottom-tabs` | Bottom tab navigator |
| `@react-navigation/drawer` | Drawer navigator |
| `@react-navigation/material-top-tabs` | Material top tabs |

## Resources

- **Official Docs**: https://reactnavigation.org/docs/
- **LLM Docs**: https://reactnavigation.org/docs/llms/
- **GitHub**: https://github.com/react-navigation/react-navigation
