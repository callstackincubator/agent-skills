#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
source "$script_dir/lib.sh"

workspace="$(create_vendored_workspace)"

cleanup() {
  rm -rf "$workspace"
}
trap cleanup EXIT

(
  cd "$workspace"
  npx skills experimental_install
)

sync_vendored_workspace "$workspace" "${SKILLS_UPDATE_REHOME:-0}"
