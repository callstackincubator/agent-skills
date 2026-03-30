#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
vendored_root="$(cd "$script_dir/.." && pwd)"
cleanup_script="$script_dir/cleanup-generated.sh"

create_vendored_workspace() {
  local workspace
  workspace="$(mktemp -d)"

  mkdir -p "$workspace"

  if [[ -f "$vendored_root/skills-lock.json" ]]; then
    cp "$vendored_root/skills-lock.json" "$workspace/skills-lock.json"
  fi

  if [[ -d "$vendored_root/.agents" ]]; then
    cp -R "$vendored_root/.agents" "$workspace/.agents"
  fi

  printf '%s\n' "$workspace"
}

sync_vendored_workspace() {
  local workspace="$1"
  local rehome_global_agents="${2:-0}"

  # Some CLI flows still materialize skills in HOME instead of the project.
  if [[ "$rehome_global_agents" == "1" && -d "$HOME/.agents" && ! -d "$workspace/.agents" ]]; then
    mv "$HOME/.agents" "$workspace/.agents"
  fi

  rm -rf "$vendored_root/.agents"

  if [[ -d "$workspace/.agents" ]]; then
    mv "$workspace/.agents" "$vendored_root/.agents"
  fi

  if [[ -f "$workspace/skills-lock.json" ]]; then
    cp "$workspace/skills-lock.json" "$vendored_root/skills-lock.json"
  fi

  "$cleanup_script"
}
