# Ella Fellas — CLOUD TOOLKIT (headless runbook)

Every scheduled job runs in the cloud with NO local folder, NO browser, NO mirror.
Everything a job needs lives in: the GitHub repo (source of truth), Supabase `ovfepswitaqpczalsejq`
(secrets in Vault + job state + newsletter tables), Vercel (deploys), and the site mailer.

## 0. Secrets (Supabase Vault, project ovfepswitaqpczalsejq) — read with the Supabase MCP execute_sql
    select name, decrypted_secret from vault.decrypted_secrets where name in ('github_pat','cron_secret','google_sa_key_b64');
| name | what |
|---|---|
| `github_pat` | fine-grained PAT, contents:write on BynumEnterprise/ella-fellas-splash |
| `cron_secret` | Bearer for POST https://ellafellas.com/api/newsletter/send (mailer + newsletter) |
| `google_sa_key_b64` | base64 service-account JSON → GSC (ellafellas.com, shopellafellas.com) + GA4 property 540438741 |
Never paste secrets into commits, posts, emails, or BACKLOG.

## 1. Bootstrap (first bash call of every run)
    export GITHUB_TOKEN='<github_pat>' CRON_SECRET='<cron_secret>' GOOGLE_SA_KEY_B64='<google_sa_key_b64>'
    curl -fsSL https://raw.githubusercontent.com/BynumEnterprise/ella-fellas-splash/main/scripts/cloud/bootstrap.sh | bash -s -- /tmp/ef
(bash env does not persist between tool calls — re-export in each call that needs them, or `source /tmp/ef/env.sh` after writing one.)

## 2. Read repo data — ALWAYS pin to the latest sha (raw main CDN lags minutes)
    sha=$(curl -s "https://api.github.com/repos/BynumEnterprise/ella-fellas-splash/commits/main" | python3 -c 'import json,sys;print(json.load(sys.stdin)["sha"])')
    curl -s "https://raw.githubusercontent.com/BynumEnterprise/ella-fellas-splash/$sha/data/tour-dates.json"
List a folder: `curl -s https://api.github.com/repos/BynumEnterprise/ella-fellas-splash/contents/content/news`

## 3. Write — ONE commit per run (one deploy)
    bash /tmp/ef/push.sh "post: 2026-09-24 <title>" content/news/<slug>.md=/tmp/<slug>.md data/tour-dates.json=/tmp/tour-dates.json
Prints `PUSH_OK commit=<sha>`. Anything else = not pushed. Bracket paths fine. Binaries fine.
Then verify the deploy: Vercel MCP list_deployments (project prj_vkJYYAIj8U8FDynY7y1tlgFiK7Cs, team team_x3bYBz7i6rdkVoVNOnbULMkC) → READY, then curl the live URL and grep for your new string.

## 4. BACKLOG.md (lives in the repo; BACKLOG-only commits do NOT deploy — Vercel Ignored Build Step)
    bash /tmp/ef/backlog-add.sh "- [ ] 2026-09-24 seo-report: <action>"        # add under ## Open
    bash /tmp/ef/backlog-get.sh > /tmp/BACKLOG.md   # edit (mark done) → bash /tmp/ef/push.sh "backlog: mark done" BACKLOG.md=/tmp/BACKLOG.md
Build-ignored paths (no deploy): BACKLOG.md, OPS_NOTES.md, docs/, scripts/, content/newsletter/.

## 5. Email the owner (real send, not a draft)
    bash /tmp/ef/mail.sh "Subject here" /tmp/body.md
Fallback only if HTTP != 200: Gmail MCP create_draft with subject prefixed "⚠️ MAILER DOWN — ".

## 6. Google Search Console + GA4 (headless — no Chrome)
    python3 /tmp/ef/google_api.py gsc 2026-09-14 2026-09-20 query 25
    python3 /tmp/ef/google_api.py gsc 2026-09-14 2026-09-20 page 25
    python3 /tmp/ef/google_api.py gsc-sitemaps
    python3 /tmp/ef/google_api.py gsc-inspect https://ellafellas.com/tour
    python3 /tmp/ef/google_api.py ga4 '{"dateRanges":[{"startDate":"7daysAgo","endDate":"yesterday"}],"dimensions":[{"name":"sessionDefaultChannelGroup"}],"metrics":[{"name":"sessions"}]}'
GSC Performance lags ~2-3 days. The Pages/Indexing *report* has no API — use gsc-inspect per URL for index status.

## 7. Job state + newsletter tables (Supabase ovfepswitaqpczalsejq, via execute_sql)
- `job_state(job text pk, state jsonb, updated_at)` — per-job memory (qa-gate, priority-shipping, …):
      select state from job_state where job='product-qa-gate';
      insert into job_state(job,state) values('product-qa-gate','{...}'::jsonb) on conflict (job) do update set state=excluded.state, updated_at=now();
- `newsletter_issues(send_date pk, subject, featured_product, song_of_day, markdown)` — archive; rotation checks read the last 14 days.
- `newsletter_affiliate_ledger(send_date, show_id, city, show_date, sid, destination, deep_link, affiliate_url)` — one row per linked show per issue.

## 8. IndexNow
push.sh pings automatically for content/news + content/guides. For tour/set-times/setlist URLs:
    bash <(curl -fsSL https://raw.githubusercontent.com/BynumEnterprise/ella-fellas-splash/main/scripts/indexnow-submit.sh) https://ellafellas.com/tour/<id>/setlist

## 9. What still needs the desktop app (browser)
Reading Ticketmaster inventory (JS-rendered, bot-walled) and eyeballing Amazon product pages. When browser tools are absent, jobs skip those sub-steps, say so in the report, and never guess.
