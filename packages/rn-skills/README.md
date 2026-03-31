# rn-skills

CLI for recommending and managing React Native agent skills from detected project dependencies, with curated mappings for common React Native libraries, wrapping the [Vercel `skills` CLI](https://vercel.com/docs/agent-resources/skills) - which is used underneath this package.

It scans every `package.json` under the target directory, compares discovered libraries against a curated lookup table, and uses the Vercel `skills` CLI to report, install, or remove relevant skills.

## Installation

Run it without installing permanently:

```bash
npx rn-skills
```

Or install it globally:

```bash
npm i -g rn-skills
```

## Commands

```bash
rn-skills
rn-skills auto
rn-skills report
rn-skills interactive
rn-skills list-supported
```

What each command does:

- `rn-skills`: defaults to `auto`
- `auto`: install all missing skills and remove extra managed RN skills without prompts
- `report`: print detected libraries, recommended skills, missing skills, and extra managed RN skills without changing anything
- `interactive`: print the same report and ask which missing skills to install and which extra skills to remove
- `list-supported`: print the curated library-to-skill mappings bundled in the lookup table

`auto` and `interactive` only remove skills managed by this CLI's lookup table. They do not remove unrelated installed skills.

## Flags

These flags are supported for all commands:

```bash
--cwd <path>   Scan and operate on a different project root
--global       Compare against and modify global skills instead of project skills
--no-remove    Keep extra managed skills installed; only add missing skills
--help, -h     Print usage
```

`--no-remove` is useful with `auto` and `interactive` when you want recommendations and installs, but do not want the CLI to prune managed skills that are currently not needed by the detected dependencies.

Examples:

```bash
rn-skills --help
rn-skills report --cwd /path/to/repo
rn-skills auto --global
rn-skills auto --no-remove
rn-skills list-supported
```

## Typical Usage

Inspect recommendations without making changes:

```bash
rn-skills report --cwd /path/to/repo
```

Apply everything automatically:

```bash
rn-skills
```

Apply missing skills without removing currently installed managed ones:

```bash
rn-skills auto --no-remove
```

Review and choose interactively:

```bash
rn-skills interactive
```

See which libraries and skills are included in our curated mappings:

```bash
rn-skills list-supported
```

## Prior Art

This tool uses the [Vercel `skills` CLI](https://vercel.com/docs/agent-resources/skills) under the hood.

---

## Made with ❤️ at Callstack

This CLI is made by Callstack. Excluding ones maintained by Callstack, all other tools, libraries and skills - especially the Vercel `skills` CLI - are not related to Callstack in any way; their maintainers are not related nor endorse this project.

[Callstack](https://www.callstack.com/) is a group of React and React Native experts. Contact us at [hello@callstack.com](mailto:hello@callstack.com) if you need help with performance optimization or just want to say hi!

Like what we do? ⚛️ [Join the Callstack team](https://www.callstack.com/careers) and work on amazing React Native projects!
