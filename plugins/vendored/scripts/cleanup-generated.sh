#!/bin/zsh
set -euo pipefail

cd "$(dirname "$0")/.."

find . -mindepth 1 -maxdepth 1 \
  ! -name ".agents" \
  ! -name "scripts" \
  ! -name "README.md" \
  ! -name "skills-lock.json" \
  -exec /bin/rm -rf {} +
