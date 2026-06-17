#!/usr/bin/env bash
# IndexNow submit script for ellafellas.com
# Pings Bing/Yandex/Seznam/Naver (+ DuckDuckGo, AI search). Google ignores IndexNow.
# Usage: ./indexnow-submit.sh            -> submits every URL in the live sitemap
#        ./indexnow-submit.sh URL [URL]  -> submits only the given URLs (for new pages)
set -e
KEY="26160855c2b548e9cd84c65b4eb52dd4"
HOST="ellafellas.com"
KEYLOC="https://ellafellas.com/${KEY}.txt"
if [ "$#" -gt 0 ]; then
  URLS=$(printf '%s\n' "$@")
else
  URLS=$(curl -s "https://ellafellas.com/sitemap.xml" | grep -oE '<loc>[^<]+</loc>' | sed -E 's/<\/?loc>//g')
fi
JSON=$(printf '%s\n' "$URLS" | python3 -c "
import sys,json
urls=[l.strip() for l in sys.stdin if l.strip()]
print(json.dumps({'host':'$HOST','key':'$KEY','keyLocation':'$KEYLOC','urlList':urls}))
")
echo "Submitting $(printf '%s\n' "$URLS" | grep -c . ) URLs to IndexNow..."
curl -s -w '\nHTTP %{http_code}\n' -X POST https://api.indexnow.org/indexnow \
  -H "Content-Type: application/json" -d "$JSON"