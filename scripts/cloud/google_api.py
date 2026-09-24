#!/usr/bin/env python3
"""google_api.py — HEADLESS Google Search Console + GA4 (no browser, no MCP).
Auth: service account merchant-mcp@ella-fellas-merchant (has GSC + GA4 access).
Env:  GOOGLE_SA_KEY_B64  (Vault secret 'google_sa_key_b64', project ovfepswitaqpczalsejq)
      or GOOGLE_SA_KEY_FILE=/path/to/key.json

Usage:
  google_api.py gsc  <start> <end> <dims> [rowLimit] [site]   dims: query | page | query,page | date | device
  google_api.py gsc-raw '<json body>' [site]                   full searchAnalytics.query body
  google_api.py gsc-sitemaps [site]                            sitemap status/discovered counts
  google_api.py gsc-inspect <url> [site]                       URL Inspection (index status for ONE url)
  google_api.py ga4  '<json runReport body>' [property]        GA4 Data API runReport
  google_api.py token <scope>                                  print a bearer token for ad-hoc curl
Defaults: site=https://ellafellas.com/  property=540438741
Examples:
  google_api.py gsc 2026-09-14 2026-09-20 query 25
  google_api.py ga4 '{"dateRanges":[{"startDate":"7daysAgo","endDate":"yesterday"}],"dimensions":[{"name":"eventName"}],"metrics":[{"name":"eventCount"}],"dimensionFilter":{"filter":{"fieldName":"eventName","stringFilter":{"value":"affiliate_click"}}}}'
"""
import base64, json, os, subprocess, sys, tempfile, time, urllib.error, urllib.parse, urllib.request
SITE="https://ellafellas.com/"; PROP="540438741"
def _key():
    b=os.environ.get("GOOGLE_SA_KEY_B64"); f=os.environ.get("GOOGLE_SA_KEY_FILE")
    if b: return json.loads(base64.b64decode(b))
    if f: return json.load(open(f))
    sys.exit("GOOGLE_SA_KEY_B64 (Vault secret google_sa_key_b64) or GOOGLE_SA_KEY_FILE required")
def _b64(b): return base64.urlsafe_b64encode(b).rstrip(b"=").decode()
def token(scope):
    sa=_key(); now=int(time.time())
    hdr=_b64(json.dumps({"alg":"RS256","typ":"JWT"}).encode())
    clm=_b64(json.dumps({"iss":sa["client_email"],"scope":scope,"aud":"https://oauth2.googleapis.com/token","iat":now,"exp":now+3600}).encode())
    with tempfile.NamedTemporaryFile("w",delete=False,suffix=".pem") as fh: fh.write(sa["private_key"]); kp=fh.name
    sig=subprocess.run(["openssl","dgst","-sha256","-sign",kp],input=f"{hdr}.{clm}".encode(),capture_output=True,check=True).stdout
    os.unlink(kp)
    data=urllib.parse.urlencode({"grant_type":"urn:ietf:params:oauth:grant-type:jwt-bearer","assertion":f"{hdr}.{clm}.{_b64(sig)}"}).encode()
    return json.load(urllib.request.urlopen(urllib.request.Request("https://oauth2.googleapis.com/token",data=data)))["access_token"]
def call(url, tok, body=None, method=None):
    req=urllib.request.Request(url,data=json.dumps(body).encode() if body is not None else None,method=method,headers={"Authorization":f"Bearer {tok}","Content-Type":"application/json"})
    try: return json.load(urllib.request.urlopen(req))
    except urllib.error.HTTPError as e: sys.exit(f"HTTP {e.code}: {e.read().decode()[:500]}")
def main(a):
    if not a: sys.exit(__doc__)
    cmd=a[0]
    if cmd=="token": print(token(a[1])); return
    if cmd.startswith("gsc"):
        tok=token("https://www.googleapis.com/auth/webmasters.readonly")
        if cmd=="gsc":
            start,end,dims=a[1],a[2],a[3].split(","); limit=int(a[4]) if len(a)>4 else 25; site=a[5] if len(a)>5 else SITE
            body={"startDate":start,"endDate":end,"dimensions":dims,"rowLimit":limit}
        elif cmd=="gsc-raw": body=json.loads(a[1]); site=a[2] if len(a)>2 else SITE
        elif cmd=="gsc-sitemaps":
            site=a[1] if len(a)>1 else SITE
            print(json.dumps(call(f"https://www.googleapis.com/webmasters/v3/sites/{urllib.parse.quote(site,safe='')}/sitemaps",tok),indent=1)); return
        elif cmd=="gsc-inspect":
            site=a[2] if len(a)>2 else SITE
            print(json.dumps(call("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",tok,{"inspectionUrl":a[1],"siteUrl":site}),indent=1)); return
        else: sys.exit(__doc__)
        print(json.dumps(call(f"https://www.googleapis.com/webmasters/v3/sites/{urllib.parse.quote(site,safe='')}/searchAnalytics/query",tok,body),indent=1)); return
    if cmd=="ga4":
        tok=token("https://www.googleapis.com/auth/analytics.readonly"); prop=a[2] if len(a)>2 else PROP
        print(json.dumps(call(f"https://analyticsdata.googleapis.com/v1beta/properties/{prop}:runReport",tok,json.loads(a[1])),indent=1)); return
    sys.exit(__doc__)
if __name__=="__main__": main(sys.argv[1:])
