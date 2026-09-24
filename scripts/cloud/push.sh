#!/usr/bin/env bash
# push.sh — commit one or more files to BynumEnterprise/ella-fellas-splash in ONE commit
# via the GitHub Git Data API (blobs -> tree -> commit -> ref). CLOUD-SAFE: needs only
# $GITHUB_TOKEN (Supabase Vault secret 'github_pat', project ovfepswitaqpczalsejq).
# No local mount, no browser, no mirror. Builds the commit on top of RAW MAIN (HEAD).
#
# Usage:
#   push.sh "<commit message>" <repo-path>=<local-file> [<repo-path>=<local-file> ...]
#   push.sh --delete "<commit message>" <repo-path> [<repo-path> ...]
#
# One call = one commit = one Vercel deploy (unless every path is build-ignored:
# BACKLOG.md, OPS_NOTES.md, docs/, scripts/, content/newsletter/ — see vercel Ignored Build Step).
# Handles binaries and bracket paths (app/tour/[slug]/...) — no URL-encoding needed.
# Retries 3x on a non-fast-forward ref race. Auto-pings IndexNow for content/news + content/guides.
# Prints: PUSH_OK commit=<sha> files=<n>   |   PUSH_FAILED: <reason> (exit 1)
set -euo pipefail
REPO="${REPO:-BynumEnterprise/ella-fellas-splash}"
BRANCH="${BRANCH:-main}"
: "${GITHUB_TOKEN:?PUSH_FAILED: GITHUB_TOKEN not set — read Vault secret 'github_pat' (Supabase ovfepswitaqpczalsejq: select decrypted_secret from vault.decrypted_secrets where name='github_pat') and export it}"
MODE="put"
if [ "${1:-}" = "--delete" ]; then MODE="delete"; shift; fi
MSG="${1:?PUSH_FAILED: commit message required}"; shift
[ "$#" -gt 0 ] || { echo "PUSH_FAILED: no files given" >&2; exit 1; }

MSG="$MSG" REPO="$REPO" BRANCH="$BRANCH" MODE="$MODE" python3 - "$@" <<'PY'
import base64, json, os, sys, time, urllib.request, urllib.error
REPO=os.environ["REPO"]; BRANCH=os.environ["BRANCH"]; TOKEN=os.environ["GITHUB_TOKEN"]; MSG=os.environ["MSG"]; MODE=os.environ["MODE"]
API=f"https://api.github.com/repos/{REPO}"
def call(path, payload=None, method=None, ok404=False):
    url = path if path.startswith("http") else API+path
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, method=method or ("POST" if data else "GET"))
    req.add_header("Authorization", f"Bearer {TOKEN}"); req.add_header("Accept","application/vnd.github+json"); req.add_header("Content-Type","application/json")
    try:
        with urllib.request.urlopen(req) as r: return json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        body=e.read().decode()[:400]
        if e.code==404 and ok404: return None
        raise RuntimeError(f"{e.code} on {url}: {body}")
entries=[]
if MODE=="put":
    for arg in sys.argv[1:]:
        if "=" not in arg: print(f"PUSH_FAILED: expected repo-path=local-file, got {arg}", file=sys.stderr); sys.exit(1)
        rp, local = arg.split("=",1)
        if not os.path.isfile(local): print(f"PUSH_FAILED: local file not found: {local}", file=sys.stderr); sys.exit(1)
        entries.append((rp, local))
else:
    entries=[(p,None) for p in sys.argv[1:]]
last=None
for attempt in range(3):
    try:
        head=call(f"/git/ref/heads/{BRANCH}")["object"]["sha"]
        base_tree=call(f"/git/commits/{head}")["tree"]["sha"]
        tree=[]
        for rp, local in entries:
            if MODE=="delete":
                tree.append({"path":rp,"mode":"100644","type":"blob","sha":None})
            else:
                raw=open(local,"rb").read()
                blob=call("/git/blobs",{"content":base64.b64encode(raw).decode(),"encoding":"base64"})
                tree.append({"path":rp,"mode":"100644","type":"blob","sha":blob["sha"]})
                print(f"  blob {blob['sha'][:7]}  {rp}  ({len(raw)} bytes)", file=sys.stderr)
        t=call("/git/trees",{"base_tree":base_tree,"tree":tree})
        c=call("/git/commits",{"message":MSG,"tree":t["sha"],"parents":[head]})
        call(f"/git/refs/heads/{BRANCH}",{"sha":c["sha"],"force":False},method="PATCH")
        print(f"PUSH_OK commit={c['sha'][:7]} files={len(entries)}")
        # IndexNow (best effort) for public content pages
        urls=[]
        for rp,_ in entries:
            if MODE=="put" and rp.startswith("content/news/") and rp.endswith(".md"): urls.append("https://ellafellas.com/news/"+os.path.basename(rp)[:-3])
            if MODE=="put" and rp.startswith("content/guides/") and rp.endswith(".md"): urls.append("https://ellafellas.com/guides/"+os.path.basename(rp)[:-3])
        if urls:
            try:
                body=json.dumps({"host":"ellafellas.com","key":"26160855c2b548e9cd84c65b4eb52dd4","keyLocation":"https://ellafellas.com/26160855c2b548e9cd84c65b4eb52dd4.txt","urlList":urls}).encode()
                r=urllib.request.urlopen(urllib.request.Request("https://api.indexnow.org/indexnow",data=body,headers={"Content-Type":"application/json"}))
                print(f"  indexnow {r.status} for {len(urls)} url(s)", file=sys.stderr)
            except Exception as e: print(f"  indexnow skipped: {e}", file=sys.stderr)
        sys.exit(0)
    except RuntimeError as e:
        last=str(e)
        if "422" in last or "409" in last: time.sleep(2+attempt*2); continue
        break
print(f"PUSH_FAILED: {last}", file=sys.stderr); sys.exit(1)
PY
