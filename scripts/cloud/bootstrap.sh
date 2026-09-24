#!/usr/bin/env bash
# bootstrap.sh — fetch the Ella Fellas CLOUD TOOLKIT into a scratch dir (default /tmp/ef).
# One-liner for any scheduled task, no mount needed:
#   curl -fsSL https://raw.githubusercontent.com/BynumEnterprise/ella-fellas-splash/main/scripts/cloud/bootstrap.sh | bash -s -- /tmp/ef
# If GITHUB_TOKEN is exported, files are fetched via the API (never stale); otherwise via raw (may lag ~5 min).
set -euo pipefail
DEST="${1:-/tmp/ef}"; mkdir -p "$DEST"
REPO="BynumEnterprise/ella-fellas-splash"
for f in push.sh backlog-add.sh backlog-get.sh mail.sh google_api.py README.md; do
  if [ -n "${GITHUB_TOKEN:-}" ]; then
    curl -fsS -H "Authorization: Bearer $GITHUB_TOKEN" -H "Accept: application/vnd.github.raw+json" "https://api.github.com/repos/$REPO/contents/scripts/cloud/$f?ref=main" -o "$DEST/$f"
  else
    curl -fsSL "https://raw.githubusercontent.com/$REPO/main/scripts/cloud/$f" -o "$DEST/$f"
  fi
done
chmod +x "$DEST"/*.sh "$DEST"/*.py
echo "TOOLKIT_OK $DEST ($(ls "$DEST" | tr '\n' ' '))"
