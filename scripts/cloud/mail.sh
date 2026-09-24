#!/usr/bin/env bash
# mail.sh — send a real email through the site mailer (Resend behind ellafellas.com/api/newsletter/send).
# Cloud-safe: needs only $CRON_SECRET (Vault secret 'cron_secret'). Handles JSON escaping for you.
# Usage: mail.sh "<subject>" <markdown-file> [recipient]      (default recipient = owner)
# Prints the API response + "HTTP <code>". 200 = sent.
set -euo pipefail
: "${CRON_SECRET:?MAIL_FAILED: CRON_SECRET not set (Vault secret 'cron_secret')}"
SUBJECT="${1:?subject required}"; FILE="${2:?markdown file required}"; TO="${3:-bynumenterprisesbe@gmail.com}"
[ -f "$FILE" ] || { echo "MAIL_FAILED: $FILE not found" >&2; exit 1; }
PAYLOAD="$(SUBJECT="$SUBJECT" TO="$TO" python3 -c 'import json,os,sys; print(json.dumps({"test":os.environ["TO"],"subject":os.environ["SUBJECT"],"markdown":open(sys.argv[1],encoding="utf-8").read()}))' "$FILE")"
curl -sS -X POST https://ellafellas.com/api/newsletter/send -H "Authorization: Bearer $CRON_SECRET" -H "Content-Type: application/json" -d "$PAYLOAD" -w '\nHTTP %{http_code}\n'
