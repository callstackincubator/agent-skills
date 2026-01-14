# Agent Skills

A collection of agent-optimized skills for AI coding assistants. Skills provide structured, actionable instructions for domain-specific tasks.

## Available Skills

| Skill | Description |
|-------|-------------|
| [react-native-best-practices](./skills/react-native-best-practices/) | React Native performance optimization |

## React Native Best Practices

Performance optimization skills based on [**The Ultimate Guide to React Native Optimization**](https://www.callstack.com/campaigns/download-the-ultimate-guide-to-react-native-optimization) by [Callstack](https://www.callstack.com/).

Covers:
- **JavaScript/React**: Profiling, FPS, re-renders, lists, state management, animations
- **Native**: iOS/Android profiling, TTI, memory management, Turbo Modules
- **Bundling**: Bundle analysis, tree shaking, R8, app size optimization

### Quick Start

Point your AI assistant to the skill:

```
Read skills/react-native-best-practices/SKILL.md for React Native performance guidelines
```

Or reference specific topics:

```
Look up js-profile-react.md for React DevTools profiling instructions
```

### Code Examples

The [callstack/optimization-best-practices](https://github.com/callstack/optimization-best-practices) repository contains runnable code examples for:
- React Compiler setup
- Dedicated React Native SDKs vs web polyfills
- R8 code shrinking on Android

## Usage with AI Assistants

See [AGENTS.md](./AGENTS.md) for integration instructions with:
- Cursor
- GitHub Copilot
- Claude
- Other AI coding assistants

## Structure

```
skills/
└── react-native-best-practices/
    ├── SKILL.md              # Main skill file with quick reference
    └── references/           # Detailed skill files
        ├── images/           # Visual references for profilers, diagrams
        ├── js-*.md           # JavaScript/React skills
        ├── native-*.md       # Native iOS/Android skills
        └── bundle-*.md       # Bundling & app size skills
```

## Contributing

Contributions welcome! Skills should be:
- **Actionable**: Step-by-step instructions, not theory
- **Searchable**: Clear headings and keywords
- **Complete**: Include code examples and common pitfalls

---

## Made with ❤️ at Callstack

React Native performance skills based on The Ultimate Guide to React Native Optimization.

[Callstack](https://www.callstack.com/) is a group of React and React Native experts. Contact us at [hello@callstack.com](mailto:hello@callstack.com) if you need help with performance optimization or just want to say hi!

Like what we do? ⚛️ [Join the Callstack team](https://www.callstack.com/careers) and work on amazing React Native projects!
