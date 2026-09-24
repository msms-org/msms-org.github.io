#!/usr/bin/env bash
#
# Regenerates the web version of every governing document.
# The .tex files stay in tex/. Pandoc emits an HTML fragment
# for each, which Jekyll then wraps via the prose layout.
#
# Usage:  ./build-docs.sh
#

set -euo pipefail

# --- preflight -------------------------------------------------------------

if ! command -v pandoc >/dev/null 2>&1; then
  cat >&2 <<'EOF'
error: pandoc is required but not installed.

Install it with one of:

  macOS:          brew install pandoc
  Debian/Ubuntu:  sudo apt install pandoc
  Windows:        https://pandoc.org/installing.html

Then re-run this script.
EOF
  exit 1
fi

# --- build -----------------------------------------------------------------

DOCS=(
  constitution
  bylaws
  financial-regulations
  membership-regulations
  code-of-conduct
)

mkdir -p documents

for name in "${DOCS[@]}"; do
  src="tex/${name}.tex"

  if [[ ! -f "$src" ]]; then
    echo "skip: $src not found"
    continue
  fi

  echo "converting $src"

  pandoc "$src" \
    -f latex \
    -t html5 \
    --wrap=none \
    --section-divs \
    --shift-heading-level-by=1 \
    -o "documents/${name}-body.html"
done

echo "done. documents/*-body.html regenerated."cho "done. documents/*-body.html regenerated."
