# Agent Skills

Markdown-only repo with agent skills for React Native and GitHub workflows. No build step.

## Repo Structure

```
skills/
├── react-native-best-practices/
│   ├── SKILL.md                    # Main entry point with quick reference + problem→skill mapping
│   └── references/
│       ├── images/                 # Visual references (profiler screenshots, diagrams)
│       ├── js-*.md                 # JavaScript/React skills
│       ├── native-*.md             # iOS/Android native skills
│       └── bundle-*.md             # Bundling & app size skills
│
└── github-patterns/
    ├── SKILL.md                    # Main entry point with workflow patterns
    └── references/
```

All reference files are flat in `references/` — no subfolders. Prefix groups related skills.

## When Editing

- Follow format of existing reference files
- Keep "Quick" sections ≤10 lines
- Update `SKILL.md` tables when adding/removing references
- Maintain bidirectional "Related Skills" links

## Details

- [Skill file conventions](./docs/skill-conventions.md)
- [AI assistant integration guide](./docs/ai-assistant-integration.md)
