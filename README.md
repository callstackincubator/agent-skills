# Agent Skills

A collection of agent-optimized skills for AI coding assistants. The repo ships raw Agent Skills for assistants that can read `skills/` directly, plus marketplace metadata for both Claude Code and Codex plugin workflows.

## Available Skills

| Skill                                                                | Description                                             |
| -------------------------------------------------------------------- | ------------------------------------------------------- |
| [react-native-best-practices](./skills/react-native-best-practices/) | React Native optimization best practices from Callstack |
| [github](./skills/github/)                                           | GitHub workflow patterns for PRs, code review, branching |
| [github-actions](./skills/github-actions/)                           | GitHub Actions workflow patterns for React Native simulator/emulator build artifacts |
| [upgrading-react-native](./skills/upgrading-react-native/)           | React Native upgrade workflow: templates, dependencies, and common pitfalls |
| [react-native-brownfield-migration](./skills/react-native-brownfield-migration/) | Incremental migration strategy to adopt React Native or Expo in native apps using @callstack/react-native-brownfield, with setup, packaging, and phased integration steps |

## React Native Best Practices

Performance optimization skills based on [**The Ultimate Guide to React Native Optimization**](https://www.callstack.com/ebooks/the-ultimate-guide-to-react-native-optimization) by [Callstack](https://www.callstack.com/).

Covers:

- **JavaScript/React**: Profiling, FPS, re-renders, lists, state management, animations
- **Native**: iOS/Android profiling, TTI, memory management, Turbo Modules
- **Bundling**: Bundle analysis, tree shaking, R8, app size optimization

### Quick Start

#### Claude Code

Use the Claude Code marketplace metadata in `.claude-plugin/marketplace.json`.

**1. Add the marketplace:**

```bash
/plugin marketplace add callstackincubator/agent-skills
```

**2. Install the skill you want:**

```bash
/plugin install react-native-best-practices@callstack-agent-skills
```

Other available installs:

```bash
/plugin install github@callstack-agent-skills
/plugin install github-actions@callstack-agent-skills
/plugin install upgrading-react-native@callstack-agent-skills
/plugin install react-native-brownfield-migration@callstack-agent-skills
```

Or use the interactive menu:

```bash
/plugin menu
```

**For local development:**

```bash
claude --plugin-dir ./path/to/agent-skills
```

Once installed, Claude will automatically load the relevant skill based on the task.

#### OpenAI Codex

This repo supports Codex in two different ways.

**Option 1: Install the bundled Codex plugins**

```bash
npx codex-plugin add callstackincubator/agent-skills
```

This reads `.agents/plugins/marketplace.json`, installs the bundled plugins into `.codex/plugins/`, and makes them available after restarting Codex.

**Option 2: Install standalone skills**

All major AI coding assistants support the Agent Skills standard.

**Install via skill-installer:**

```
$skill-installer install react-native-best-practices from callstackincubator/agent-skills
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

#### Other AI Assistants

##### Cursor

**Option 1: Import rules from GitHub**

Cursor’s GitHub / GitLab rule importer only discovers **`.mdc` files** (typically under `.cursor/rules/`). This repository includes those files so import succeeds.

1. Open Cursor Settings (`Cmd+Shift+J` / `Ctrl+Shift+J`)
2. Navigate to **Rules** and use **Import rules from GitHub** (wording may vary by version), or add a remote rule from a Git URL
3. Enter: `https://github.com/callstackincubator/agent-skills.git`

Imported rules are short Cursor **project rules**; they point at the full Agent Skills under `skills/`. Clone or copy the `skills/` tree into your workspace when you want the model to read the complete markdown skills locally (see Option 2).

**Option 2: Local Installation**

```bash
# Project-level
git clone https://github.com/callstackincubator/agent-skills.git .cursor/skills/agent-skills

# User-level (available in all projects)
git clone https://github.com/callstackincubator/agent-skills.git ~/.cursor/skills/agent-skills
```

**Usage:** Type `/` in Agent chat to search and select skills by name.

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

See [AI Assistant Integration Guide](./docs/ai-assistant-integration.md) for detailed setup instructions with Cursor, GitHub Copilot, Claude API, ChatGPT, and other AI coding assistants.

## Structure

### Repo Structure

```
agent-skills/
├── .cursor/
│   └── rules/                 # Cursor importable project rules (.mdc) for “Import rules from GitHub”
├── .claude-plugin/
│   └── marketplace.json     # Claude Code marketplace definition
├── .agents/
│   └── plugins/
│       └── marketplace.json # Codex marketplace definition for bundled plugins
├── plugins/
│   ├── building-react-native-apps/
│   └── testing-react-native-apps/
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
    │   ├── SKILL.md              # Main skill file with PR workflow patterns
    │   └── references/           # Detailed GitHub workflow files
    │
    ├── github-actions/
    │   ├── SKILL.md              # Main skill file for GitHub Actions build artifacts
    │   ├── agents/openai.yaml    # Codex Skills UI metadata
    │   └── references/           # iOS/Android action templates and download flows
    │
    ├── upgrading-react-native/
    │   ├── SKILL.md              # Main skill file with RN upgrade workflow routing
    │   └── references/           # Detailed upgrade flow files
    │
    └── react-native-brownfield-migration/
        ├── SKILL.md              # Main skill file for Expo/bare path routing
        ├── agents/openai.yaml    # Codex Skills UI metadata
        └── references/           # Brownfield packaging and integration flow files
```

Use `.claude-plugin/marketplace.json` for Claude Code plugin installs and `.agents/plugins/marketplace.json` for Codex plugin installs.

The standalone `skills/` directory contains repo-local skills. The `plugins/` directory contains installable Codex plugin bundles.

## Contributing

Contributions welcome! Skills should be:

- **Actionable**: Step-by-step instructions, not theory
- **Searchable**: Clear headings and keywords
- **Complete**: Include code examples and common pitfalls

When adding or editing skills, follow the [agentskills.io specification](https://agentskills.io/specification) and [Claude Code best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices). The maintainer checklist lives in [AGENTS.md](./AGENTS.md), with supporting details in [docs/skill-conventions.md](./docs/skill-conventions.md).

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
## ❓ Frequently Asked Questions (FAQ)

### General

**Q: What are Agent Skills?**

A: Agent Skills are a collection of agent-optimized skills for AI coding assistants. They provide step-by-step, actionable guidance for specific development tasks. The repo ships raw Agent Skills for assistants that can read `skills/` directly, plus marketplace metadata for Claude Code and Codex plugin workflows.

**Q: Which AI assistants support Agent Skills?**

A: Supported assistants:
- **Claude Code** — via `/plugin` marketplace
- **OpenAI Codex** — via bundled plugins or standalone skills
- **Cursor** — via GitHub rule import or local installation
- **Gemini CLI** — via `gemini skills install`
- **OpenCode** — via `.opencode/skill/` directory
- **Other assistants** — reference SKILL.md files directly

### Installation

**Q: How do I install skills in Claude Code?**

A:
```bash
# Add marketplace
/plugin marketplace add callstackincubator/agent-skills

# Install specific skill
/plugin install react-native-best-practices@callstack-agent-skills

# Or use interactive menu
/plugin menu
```

**Q: How do I install in OpenAI Codex?**

A: Two options:

Option 1 (bundled plugins):
```bash
npx codex-plugin add callstackincubator/agent-skills
```

Option 2 (standalone skills):
```bash
git clone https://github.com/callstackincubator/agent-skills.git
cp -r agent-skills/skills/* .codex/skills/
```

**Q: How do I install in Cursor?**

A: Option 1 (GitHub import):
1. Open Cursor Settings (`Cmd+Shift+J`)
2. Navigate to Rules → Import rules from GitHub
3. Enter: `https://github.com/callstackincubator/agent-skills.git`

Option 2 (local):
```bash
git clone https://github.com/callstackincubator/agent-skills.git .cursor/skills/agent-skills
```

**Q: How do I install in Gemini CLI?**

A:
```bash
gemini skills install https://github.com/callstackincubator/agent-skills.git

# Workspace-level
gemini skills install https://github.com/callstackincubator/agent-skills.git --scope workspace
```

**Q: How do I install in OpenCode?**

A:
```bash
# Project-level
git clone https://github.com/callstackincubator/agent-skills.git
cp -r agent-skills/skills/* .opencode/skill/

# User-level
cp -r agent-skills/skills/* ~/.config/opencode/skill/
```

### Available Skills

**Q: What skills are available?**

A: Current skills:
- **react-native-best-practices** — React Native optimization (profiling, FPS, re-renders, lists, memory, bundling)
- **github** — GitHub workflow patterns (PRs, code review, branching)
- **github-actions** — GitHub Actions for React Native build artifacts
- **upgrading-react-native** — React Native upgrade workflow (templates, dependencies, pitfalls)
- **react-native-brownfield-migration** — Incremental migration to React Native/Expo in native apps

**Q: What does react-native-best-practices cover?**

A: Based on Callstack's "Ultimate Guide to React Native Optimization":
- JavaScript/React: Profiling, FPS, re-renders, lists, state management, animations
- Native: iOS/Android profiling, TTI, memory management, Turbo Modules
- Bundling: Bundle analysis, tree shaking, R8, app size optimization

### Usage

**Q: How do I use skills in Claude Code?**

A: After installation, Claude automatically loads relevant skills based on your task. You can also mention skills explicitly with `$skill-name`.

**Q: How do I use skills in Codex?**

A: Type `$` to mention a skill or use `/skills` command to list available skills.

**Q: How do I use skills in Cursor?**

A: Type `/` in Agent chat to search and select skills by name.

**Q: How do I use skills in Gemini CLI?**

A: Management commands:
- `/skills list` — view all discovered skills
- `/skills enable <name>` — enable a skill
- `/skills disable <name>` — disable a skill
- `/skills reload` — refresh skill inventory

**Q: Can I use skills with assistants without native support?**

A: Yes! Reference skill files directly:
```
Read skills/react-native-best-practices/SKILL.md for React Native performance guidelines
```

Or for specific topics:
```
Look up js-profile-react.md for React DevTools profiling instructions
```

### Contributing

**Q: How can I contribute new skills?**

A: Contributions welcome! Skills should be:
- **Actionable** — step-by-step instructions, not theory
- **Searchable** — clear headings and keywords
- **Complete** — include code examples and common pitfalls

Follow the [agentskills.io specification](https://agentskills.io/specification) and [Claude Code best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices).

**Q: What is the skill structure?**

A: Each skill follows:
```
skill-name/
├── SKILL.md              # Main skill file
├── agents/openai.yaml    # Codex metadata (optional)
└── references/           # Detailed skill files
```

### Troubleshooting

**Q: Skills not appearing after installation?**

A: Try:
- Restart your AI assistant
- Check installation path matches expected directory
- Use `/skills reload` (Gemini CLI) or `/skills list` (Codex)

**Q: Cursor GitHub import not working?**

A: Cursor's GitHub rule importer discovers `.mdc` files under `.cursor/rules/`. This repo includes those files. If import fails:
- Try Option 2 (local installation)
- Verify `.cursor/skills/agent-skills/skills/` exists

**Q: Codex plugin not loading?**

A: Check:
- `.codex/plugins/` directory exists
- Plugin was installed via `npx codex-plugin add`
- Restart Codex after installation

**Q: Where can I get help?**

A: Resources:
- [AI Assistant Integration Guide](./docs/ai-assistant-integration.md)
- [Skill Conventions](./docs/skill-conventions.md)
- [GitHub Issues](https://github.com/callstackincubator/agent-skills/issues)