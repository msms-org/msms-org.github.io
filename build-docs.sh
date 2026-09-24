#!/usr/bin/env bash
#
# Regenerates the web version of every governing document.
# The .tex files stay in tex/. Pandoc emits an HTML fragment
# for each, which Jekyll then wraps via the prose layout.
#
# Usage:  ./build-docs.sh
#

set -euo pipefail

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
    --no-highlight \
    --section-divs \
    -o "documents/${name}-body.html"
done

echo "done. documents/*-body.html regenerated."
