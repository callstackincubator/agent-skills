# install-marketplace

CLI for installing a remote Codex plugin marketplace from a GitHub repository into either project or global configuration.

It clones the remote repository, reads `.codex-plugin/manifest.json`, copies each plugin into the target `.agents/plugins/` directory, and merges the manifest entries into the selected marketplace file without rewriting plugin paths.

It supports one command today:

- `marketplace add <org/repo>`

Install targets:

- personal Codex configuration under `~/.agents/plugins/marketplace.json`
- project configuration under `<cwd>/.agents/plugins/marketplace.json`

Run with:

```bash
bun run src/index.ts add callstackincubator/agent-skills
```

Flags:

```bash
bun run src/index.ts add callstackincubator/agent-skills --project
bun run src/index.ts add callstackincubator/agent-skills --global
bun run src/index.ts add callstackincubator/agent-skills --ref feat/codex-plugin
bun run src/index.ts add callstackincubator/agent-skills --project --yes
```

Intended published usage:

```bash
npx marketplace add callstackincubator/agent-skills
npx marketplace add callstackincubator/agent-skills --ref feat/codex-plugin
```
