#!/bin/zsh
set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "Usage: $0 <package> <skill-name>" >&2
  exit 1
fi

cd "$(dirname "$0")/.."

package="$1"
skill_name="$2"

npx skills add "$package" --skill "$skill_name" -y
"$(dirname "$0")/cleanup-generated.sh"
