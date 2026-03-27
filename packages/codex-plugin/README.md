# codex-plugin

CLI for installing a remote Codex plugin marketplace from a GitHub repository into either project or global configuration.

It clones the remote repository, reads `.agents/plugins/marketplace.json`, copies plugin directories into `.codex/plugins/`, and writes marketplace entries that point to `./.codex/plugins/<plugin-name>`.

Expected repository structure:

- `.agents/plugins/marketplace.json` is the source marketplace file committed to the repo
- `plugins/<plugin-name>` contains each plugin directory

In the repo marketplace, `source.path` values should be relative to the repo root:

- `./plugins/building-react-native-apps`
- `./plugins/testing-react-native-apps`

During installation, the CLI rewrites those entries to the installed layout under `.codex/plugins/`.

It supports one command today:

- `codex-plugin add <org/repo>`

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
npx codex-plugin add callstackincubator/agent-skills
npx codex-plugin add callstackincubator/agent-skills --ref feat/codex-plugin
```
