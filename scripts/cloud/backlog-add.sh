#!/usr/bin/env bash
# backlog-add.sh — add ONE line to BACKLOG.md in the repo (inserted right under "## Open")
# and commit it. Cloud-safe (needs $GITHUB_TOKEN). BACKLOG-only commits are skipped by the
# Vercel Ignored Build Step, so this never triggers a deploy.
# Usage: backlog-add.sh "- [ ] 2026-09-24 seo-report: <action>"      (open item)
#        backlog-add.sh "- setlist-watch 2026-09-24: shipped X"      (note)
# To EDIT the file (mark an item done): backlog-edit.sh — see README.
set -euo pipefail
REPO="${REPO:-BynumEnterprise/ella-fellas-splash}"; BRANCH="${BRANCH:-main}"
: "${GITHUB_TOKEN:?BACKLOG_FAILED: GITHUB_TOKEN not set (Vault secret 'github_pat')}"
LINE="${1:?line required}"
DIR="$(cd "$(dirname "$0")" && pwd)"
TMP="/tmp/backlog.$$.md"
for attempt in 1 2 3; do
  curl -fsS -H "Authorization: Bearer $GITHUB_TOKEN" -H "Accept: application/vnd.github.raw+json" \
    "https://api.github.com/repos/$REPO/contents/BACKLOG.md?ref=$BRANCH" -o "$TMP.cur"
  LINE="$LINE" python3 - "$TMP.cur" "$TMP" <<'PY'
import os,sys
src=open(sys.argv[1],encoding="utf-8").read().split("\n")
line=os.environ["LINE"].rstrip("\n")
out=[]; done=False
for l in src:
    out.append(l)
    if not done and l.strip()=="## Open":
        out.append(line); done=True
if not done: out.append(line)
open(sys.argv[2],"w",encoding="utf-8").write("\n".join(out))
PY
  if bash "$DIR/push.sh" "backlog: $(echo "$LINE" | cut -c1-60)" "BACKLOG.md=$TMP"; then rm -f "$TMP" "$TMP.cur"; echo "BACKLOG_OK"; exit 0; fi
  sleep 3
done
echo "BACKLOG_FAILED" >&2; exit 1
