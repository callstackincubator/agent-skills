# rn-skills

CLI for recommending and managing React Native agent skills from detected project dependencies.

It scans every `package.json` under the target directory, compares discovered libraries against a curated lookup table, and uses the Vercel `skills` CLI to report, install, or remove relevant skills.

## Commands

```bash
rn-skills report
rn-skills interactive
rn-skills auto
```

Optional flags:

```bash
rn-skills report --cwd /path/to/repo
rn-skills auto --global
```

## What it does

- `report`: print detected libraries, recommended skills, missing skills, and extra managed RN skills without changing anything
- `interactive`: print the same report and ask which missing skills to install and which extra skills to remove
- `auto`: install all missing skills and remove all extra managed RN skills without prompts

## Installation

```bash
npx rn-skills report
```

## Maintenance

Refresh the skill catalog metadata used by the lookup table:

```bash
npm --prefix packages/rn-skills run sync:lookup
```
