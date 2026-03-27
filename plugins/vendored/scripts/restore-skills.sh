#!/bin/zsh
set -euo pipefail

cd "$(dirname "$0")/.."

npx skills experimental_install
"$(dirname "$0")/cleanup-generated.sh"
