# install-marketplace

CLI for installing a remote Codex plugin marketplace from a GitHub repository into either project or global configuration.

It clones the remote repository, reads `.codex-plugin/manifest.json`, copies plugin directories into `.codex/plugins/`, and writes marketplace entries that point to `./.codex/plugins/<plugin-name>`.

It supports one command today:

- `marketplace add <org/repo>`

Install targets:

- personal Codex marketplace under `~/.agents/plugins/marketplace.json`
- project Codex marketplace under `<cwd>/.agents/plugins/marketplace.json`

Install layout:

- global: marketplace in `~/.agents/plugins/marketplace.json`, plugins copied into `~/.codex/plugins/`
- project: marketplace in `<cwd>/.agents/plugins/marketplace.json`, plugins copied into `<cwd>/.codex/plugins/`

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
