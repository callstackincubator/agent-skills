#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
vendored_root="$(cd "$script_dir/.." && pwd)"
cleanup_script="$script_dir/cleanup-generated.sh"
home_agents_dir="${HOME}/.agents"

cd "$vendored_root"
# Update the vendored project in place when the CLI supports project-scoped updates.
npx -y skills update

# In CI, allow explicitly re-homing a generated global .agents tree back into vendored/.
if [[ "${SKILLS_UPDATE_REHOME:-0}" == "1" && -d "$home_agents_dir/skills" ]]; then
  rm -rf "$vendored_root/.agents"
  mv "$home_agents_dir" "$vendored_root/.agents"
fi

"$cleanup_script"
