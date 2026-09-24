#!/usr/bin/env bash
# backlog-get.sh — print the CURRENT BACKLOG.md from the repo (API, not the raw CDN which lags).
# Usage: backlog-get.sh > /tmp/BACKLOG.md   then edit, then: push.sh "backlog: mark done" BACKLOG.md=/tmp/BACKLOG.md
set -euo pipefail
REPO="${REPO:-BynumEnterprise/ella-fellas-splash}"; BRANCH="${BRANCH:-main}"
: "${GITHUB_TOKEN:?GITHUB_TOKEN not set (Vault secret 'github_pat')}"
curl -fsS -H "Authorization: Bearer $GITHUB_TOKEN" -H "Accept: application/vnd.github.raw+json" \
  "https://api.github.com/repos/$REPO/contents/BACKLOG.md?ref=$BRANCH"
