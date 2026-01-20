# AI Assistant Integration Guide

How to use agent skills with various AI coding assistants beyond the primary installation methods in the README.

## Cursor

### Method 1: Rules for AI (Recommended)

Add to your project's `.cursor/rules`:

```
When working on React Native code, reference the skills in skills/react-native-best-practices/SKILL.md for performance optimization guidelines.

For specific issues:
- FPS/jank: Read js-measure-fps.md and js-profile-react.md
- Memory leaks: Read js-memory-leaks.md or native-memory-leaks.md
- Bundle size: Read bundle-analyze-js.md and bundle-barrel-exports.md
- Slow startup: Read native-measure-tti.md
```

### Method 2: Direct Reference

In chat, ask Cursor to read the skill file:

```
Read skills/react-native-best-practices/SKILL.md and help me optimize my FlatList performance
```

### Method 3: @ Mention

Use `@file` to include skill context:

```
@skills/react-native-best-practices/references/js-lists-flatlist-flashlist.md

How can I apply FlashList to my current implementation?
```

## GitHub Copilot

### Copilot Chat

Reference skills directly in chat:

```
#file:skills/react-native-best-practices/SKILL.md

How do I profile React Native performance?
```

### Workspace Instructions

Add to `.github/copilot-instructions.md`:

```markdown
## React Native Performance

When reviewing or writing React Native code, apply the optimization guidelines from:
- skills/react-native-best-practices/SKILL.md (main reference)
- skills/react-native-best-practices/references/ (detailed skills)

Key patterns:
- Use FlashList over FlatList for large lists
- Avoid barrel exports
- Profile before optimizing
```

## Claude (API / Claude.ai Projects)

### Project Knowledge

Upload the `skills/react-native-best-practices/` directory as project knowledge.

### System Prompt

```
You have access to React Native performance optimization skills based on Callstack's Ultimate Guide. The skills are organized as:

- SKILL.md: Quick reference and problem→skill mapping
- references/js-*.md: JavaScript/React optimizations
- references/native-*.md: iOS/Android native optimizations
- references/bundle-*.md: Bundle size optimizations

When the user asks about React Native performance, reference these skills for actionable guidance.
```

## ChatGPT / Custom GPTs

### Custom Instructions

```
When helping with React Native development, I follow performance best practices from Callstack's Ultimate Guide:

JavaScript:
- Profile with React DevTools before optimizing
- Use FlashList for large lists
- Use React Compiler for automatic memoization
- Prefer atomic state (Jotai/Zustand)

Native:
- Measure TTI with react-native-performance
- Use background threads for heavy work
- Prefer async Turbo Module methods

Bundling:
- Avoid barrel exports
- Enable R8 on Android
- Analyze bundle with source-map-explorer
```

## OpenAI Codex / API

### System Message

Include the SKILL.md content in your system message:

```python
system_message = """
You are a React Native performance expert. Apply these guidelines:

{Read and include contents of SKILL.md}

When the user asks about performance, provide specific, actionable advice 
based on these skills. Include code examples.
"""
```

## Windsurf / Codeium

### Rules

Add to project rules:

```yaml
rules:
  - name: React Native Performance
    description: Apply optimization best practices
    files:
      - skills/react-native-best-practices/**/*.md
    context: |
      When working on React Native code, reference performance skills for:
      - FPS optimization
      - Memory management
      - Bundle size reduction
      - TTI improvement
```

## General Tips

### 1. Start with the Main Skill File

Always point assistants to `SKILL.md` first—it contains:
- Quick reference commands
- Problem → skill mapping
- Priority-ordered guidelines

### 2. Use Specific References for Deep Dives

For detailed implementation, reference specific files:

```
Read references/js-profile-react.md for step-by-step React DevTools profiling
```

### 3. Include Images for Vision-Capable Models

The `references/images/` directory contains profiler screenshots and diagrams. Vision-capable models (GPT-4V, Claude 3, Gemini) can interpret these for better context.

### 4. Combine with Project Context

Best results come from combining skills with your actual code:

```
@MyListComponent.tsx
@skills/react-native-best-practices/references/js-lists-flatlist-flashlist.md

Migrate this component to use FlashList
```

### 5. Pair with Complementary Skills

For teams using both React Native and React web, consider combining with:

- [Vercel React Best Practices](https://github.com/vercel-labs/agent-skills/tree/react-best-practices/skills/react-best-practices) - 40+ React/Next.js optimization rules

Example setup in `.cursor/rules`:

```
For React Native: reference skills/react-native-best-practices/SKILL.md
For React/Next.js web: reference skills/react-best-practices/SKILL.md
```

Both skill sets follow the agentskills.io specification and can be used together.
