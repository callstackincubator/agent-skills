#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "Usage: $0 <package> <skill-name>" >&2
  exit 1
fi

script_dir="$(cd "$(dirname "$0")" && pwd)"
source "$script_dir/lib.sh"

package="$1"
skill_name="$2"

workspace="$(create_vendored_workspace)"

cleanup() {
  rm -rf "$workspace"
}
trap cleanup EXIT

(
  cd "$workspace"
  npx skills add "$package" --skill "$skill_name" -y
)

sync_vendored_workspace "$workspace" "${SKILLS_UPDATE_REHOME:-0}"
