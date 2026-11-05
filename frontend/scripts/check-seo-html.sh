#!/usr/bin/env bash
# FR-024 check (D137, D138): every sitemap URL must ship real HTML, a <title>
# and an <h1>, to a plain request and to a Googlebot user agent.
# Run after every deploy:  scripts/check-seo-html.sh https://wehelpautomate.com
# Works against a preview link or a local server too (the sitemap's origin is
# swapped for the base URL given).
set -u
base="${1:?usage: check-seo-html.sh BASE_URL}"
base="${base%/}"
bot='Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'

sitemap="$(curl -fsSL -m 30 "$base/sitemap.xml")" || { echo "FAIL cannot read $base/sitemap.xml"; exit 2; }
paths="$(printf '%s\n' "$sitemap" | grep -o '<loc>[^<]*</loc>' | sed -E 's#<loc>https?://[^/]+##; s#</loc>##')"
[ -n "$paths" ] || { echo "FAIL no <loc> entries in sitemap"; exit 2; }

fail=0
while IFS= read -r p; do
  for ua in plain googlebot; do
    if [ "$ua" = plain ]; then html="$(curl -fsSL -m 30 "$base$p")"
    else html="$(curl -fsSL -m 30 -A "$bot" "$base$p")"; fi || { echo "FAIL $p ($ua): request failed"; fail=1; continue; }
    miss=""
    printf '%s' "$html" | grep -qiE '<title[^>]*>[^<]+</title>' || miss="$miss title"
    printf '%s' "$html" | grep -qiE '<h1[ >]' || miss="$miss h1"
    if [ -n "$miss" ]; then echo "FAIL $p ($ua): missing$miss"; fail=1; fi
  done
done <<< "$paths"

[ "$fail" -eq 0 ] && echo "PASS $(printf '%s\n' "$paths" | wc -l | tr -d ' ') URLs, title and h1, plain and Googlebot"
exit "$fail"
