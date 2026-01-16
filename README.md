# Agent Skills

A collection of agent-optimized skills for AI coding assistants. Skills provide structured, actionable instructions for domain-specific tasks.

## Available Skills

| Skill                                                                | Description                                             |
| -------------------------------------------------------------------- | ------------------------------------------------------- |
| [react-native-best-practices](./skills/react-native-best-practices/) | React Native optimization best practices from Callstack |

## React Native Best Practices

Performance optimization skills based on [**The Ultimate Guide to React Native Optimization**](https://www.callstack.com/campaigns/download-the-ultimate-guide-to-react-native-optimization) by [Callstack](https://www.callstack.com/).

Covers:

- **JavaScript/React**: Profiling, FPS, re-renders, lists, state management, animations
- **Native**: iOS/Android profiling, TTI, memory management, Turbo Modules
- **Bundling**: Bundle analysis, tree shaking, R8, app size optimization

### Quick Start

#### Install as Claude Code Plugin

**1. Add the marketplace:**
```bash
/plugin marketplace add callstackincubator/agent-skills
```

**2. Install the skill:**
```bash
/plugin install react-native-best-practices@callstack-agent-skills
```

Or use the interactive menu:
```bash
/plugin menu
```

**For local development:**
```bash
claude --plugin-dir ./path/to/agent-skills
```

Once installed, Claude will automatically use the React Native best practices skill when working on React Native projects.

#### Use with Other AI Assistants

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

## Other AI Assistants

See [AGENTS.md](./AGENTS.md) for integration instructions with Cursor, GitHub Copilot, Claude API, and other AI coding assistants.

## Structure

### Plugin Structure

```
agent-skills/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
└── skills/
    └── react-native-best-practices/
        ├── SKILL.md              # Main skill file with quick reference
        └── references/           # Detailed skill files
            ├── images/           # Visual references for profilers, diagrams
            ├── js-*.md           # JavaScript/React skills
            ├── native-*.md       # Native iOS/Android skills
            └── bundle-*.md       # Bundling & app size skills
```

The plugin follows the [Claude Code plugin structure](https://docs.anthropic.com/en/docs/claude-code/plugins):

- `.claude-plugin/plugin.json` - Plugin metadata and configuration
- `skills/` - Agent Skills that Claude automatically uses based on task context

## Contributing

Contributions welcome! Skills should be:

- **Actionable**: Step-by-step instructions, not theory
- **Searchable**: Clear headings and keywords
- **Complete**: Include code examples and common pitfalls

## Roadmap / Work in Progress

This is just the start! The following features are planned or in progress.

### Visual Feedback Integration (Planned)

Several skills involve interpreting visual profiler output (flame graphs, treemaps, memory snapshots). AI agents cannot yet process these autonomously.

**Affected skills:**

- `js-profile-react.md` - React DevTools flame graphs
- `js-measure-fps.md` - FPS graphs and performance overlays
- `native-profiling.md` - Xcode Instruments / Android Studio Profiler
- `native-measure-tti.md` - TTI timeline visualization
- `native-view-flattening.md` - View hierarchy inspection
- `bundle-analyze-js.md` - Bundle treemap visualization
- `bundle-analyze-app.md` - App size breakdown (Emerge Tools, Ruler)

**Planned solution:** MCP (Model Context Protocol) integration for screenshot capture and visual analysis. Contributions welcome!

### Complementary Skills

For complete coverage, consider pairing with:

- [Vercel React Best Practices](https://github.com/vercel-labs/agent-skills/tree/react-best-practices/skills/react-best-practices) - React/Next.js web optimization (40+ rules)

### Future Work

- [ ] MCP integration for visual profiler feedback
- [ ] Additional skills for debugging, testing, and CI/CD
- [ ] More code examples and interactive tutorials

---

## Made with ❤️ at Callstack

React Native performance skills based on The Ultimate Guide to React Native Optimization.

[Callstack](https://www.callstack.com/) is a group of React and React Native experts. Contact us at [hello@callstack.com](mailto:hello@callstack.com) if you need help with performance optimization or just want to say hi!

Like what we do? ⚛️ [Join the Callstack team](https://www.callstack.com/careers) and work on amazing React Native projects!
