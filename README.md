# Agent Skills

A collection of agent-optimized skills for AI coding assistants. Skills provide structured, actionable instructions for domain-specific tasks.

## Available Skills

| Skill                                                                | Description                                             |
| -------------------------------------------------------------------- | ------------------------------------------------------- |
| [react-native-best-practices](./skills/react-native-best-practices/) | React Native optimization best practices from Callstack |
| [github](./skills/github/)                                           | GitHub workflow patterns for PRs, code review, branching |
| [upgrading-react-native](./skills/upgrading-react-native/)           | React Native upgrade workflow: templates, dependencies, and common pitfalls |
| [nestjs-best-practices](./skills/nestjs-best-practices/)             | NestJS clean architecture, TypeScript conventions, and testing playbook |

## Skill Catalog

This repository includes skills for mobile performance, GitHub workflows, upgrade operations, and backend API architecture.

### Included domains

- **React Native Best Practices**
  - Performance profiling, FPS/TTI measurement, memory patterns, bundle optimization
  - Based on [**The Ultimate Guide to React Native Optimization**](https://www.callstack.com/ebooks/the-ultimate-guide-to-react-native-optimization)
- **Upgrading React Native**
  - RN template diff workflow, dependency upgrade strategy, Expo upgrade flow, verification checklist
- **GitHub**
  - `gh`-based workflows for PRs, branching, and stacked PR operations
- **NestJS Best Practices**
  - TypeScript clean code conventions, NestJS modular architecture, and testing playbook

### Quick Start

#### Install as Claude Code Plugin

**1. Add the marketplace:**
```bash
/plugin marketplace add callstackincubator/agent-skills
```

**2. Install a skill (example):**
```bash
/plugin install react-native-best-practices@callstack-agent-skills
```

Or use the interactive menu:
```bash
/plugin menu
```

Other available skills:

```bash
/plugin install upgrading-react-native@callstack-agent-skills
/plugin install github@callstack-agent-skills
/plugin install nestjs-best-practices@callstack-agent-skills
```

**For local development:**
```bash
claude --plugin-dir ./path/to/agent-skills
```

Once installed, Claude will automatically use matching skills based on the task context.

#### Use with Other AI Assistants

All major AI coding assistants support the Agent Skills standard.

##### Cursor

**Option 1: Install from GitHub (Recommended)**

1. Open Cursor Settings (`Cmd+Shift+J` / `Ctrl+Shift+J`)
2. Navigate to **Rules → Add Rule → Remote Rule (GitHub)**
3. Enter: `https://github.com/callstackincubator/agent-skills.git`

**Option 2: Local Installation**

```bash
# Project-level
git clone https://github.com/callstackincubator/agent-skills.git .cursor/skills/agent-skills

# User-level (available in all projects)
git clone https://github.com/callstackincubator/agent-skills.git ~/.cursor/skills/agent-skills
```

**Usage:** Type `/` in Agent chat to search and select skills by name.

##### OpenAI Codex CLI

**Install via skill-installer:**

```bash
$skill-installer install react-native-best-practices from callstackincubator/agent-skills
$skill-installer install upgrading-react-native from callstackincubator/agent-skills
$skill-installer install github from callstackincubator/agent-skills
$skill-installer install nestjs-best-practices from callstackincubator/agent-skills
```

**Or clone manually:**

```bash
# Project-level
git clone https://github.com/callstackincubator/agent-skills.git
cp -r agent-skills/skills/* .codex/skills/

# User-level
cp -r agent-skills/skills/* ~/.codex/skills/
```

Restart Codex to recognize newly installed skills.

**Usage:** Type `$` to mention a skill or use `/skills` command.

These skills include `agents/openai.yaml` metadata for Codex Skills UI compatibility.

##### Gemini CLI

**Install from repository:**

```bash
gemini skills install https://github.com/callstackincubator/agent-skills.git
```

**Or install to workspace:**

```bash
gemini skills install https://github.com/callstackincubator/agent-skills.git --scope workspace
```

**Management commands:**
- `/skills list` - view all discovered skills
- `/skills enable <name>` / `/skills disable <name>` - toggle availability
- `/skills reload` - refresh skill inventory

##### OpenCode

Clone to any supported skills directory:

```bash
# Project-level
git clone https://github.com/callstackincubator/agent-skills.git
cp -r agent-skills/skills/* .opencode/skill/

# User-level
cp -r agent-skills/skills/* ~/.config/opencode/skill/
```

OpenCode also discovers Claude-compatible paths (`.claude/skills/`, `~/.claude/skills/`).

**Permission control** in `opencode.json`:

```json
{
  "permission": {
    "skill": {
      "*": "allow"
    }
  }
}
```

##### Other Assistants

For assistants without native skills support, point them to the skill file:

```
Read one of:
- skills/react-native-best-practices/SKILL.md
- skills/upgrading-react-native/SKILL.md
- skills/github/SKILL.md
- skills/nestjs-best-practices/SKILL.md
```

Or reference specific topics:

```text
Look up references/stacked-pr-workflow.md for GitHub stacked PR instructions
Look up references/nest-module-architecture.md for NestJS module conventions
Look up references/js-profile-react.md for React Native profiling instructions
```

### React Native Code Examples

The [callstack/optimization-best-practices](https://github.com/callstack/optimization-best-practices) repository contains runnable code examples for:

- React Compiler setup
- Dedicated React Native SDKs vs web polyfills
- R8 code shrinking on Android

## Other AI Assistants

See [AI Assistant Integration Guide](./docs/ai-assistant-integration.md) for detailed setup instructions with Cursor, GitHub Copilot, Claude API, ChatGPT, and other AI coding assistants.

## Structure

### Plugin Structure

```
agent-skills/
├── .claude-plugin/
│   └── marketplace.json     # Marketplace configuration
└── skills/
    ├── react-native-best-practices/
    │   ├── SKILL.md              # Main skill file with quick reference
    │   └── references/           # Detailed skill files
    │       ├── images/           # Visual references for profilers, diagrams
    │       ├── js-*.md           # JavaScript/React skills
    │       ├── native-*.md       # Native iOS/Android skills
    │       └── bundle-*.md       # Bundling & app size skills
    │
    ├── github/
    │   ├── SKILL.md              # Main skill file with workflow patterns
    │   └── references/           # Detailed workflow files
    │
    ├── nestjs-best-practices/
    │   ├── SKILL.md              # Main skill file for NestJS architecture and coding standards
    │   └── references/           # Detailed TypeScript, architecture, and testing guides
    │
    └── upgrading-react-native/
        ├── SKILL.md              # Main skill file for React Native upgrade workflows
        └── references/           # Detailed upgrade routes, dependency strategy, and verification
```

The plugin follows the [Claude Code plugin marketplace structure](https://code.claude.com/docs/en/plugin-marketplaces):

- `.claude-plugin/marketplace.json` - Marketplace configuration with plugin definitions
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

A practical skill collection for React Native, GitHub workflows, and NestJS API development.

[Callstack](https://www.callstack.com/) is a group of React and React Native experts. Contact us at [hello@callstack.com](mailto:hello@callstack.com) if you need help with performance optimization or just want to say hi!

Like what we do? ⚛️ [Join the Callstack team](https://www.callstack.com/careers) and work on amazing React Native projects!
