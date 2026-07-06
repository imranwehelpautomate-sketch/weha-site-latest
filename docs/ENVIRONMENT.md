# Environment variables and secrets

Every environment value the app reads, what it does, and where it is set. All of
these live in the **Cloudflare Pages project** (Settings → Variables and
secrets) except where noted. **None are ever committed to the repo.** All values
are read exclusively from `env` inside Functions.

If a secret is missing, the feature that depends on it degrades gracefully (the
relevant helper becomes a no-op); it never crashes a form submission.

---

## Email (Resend)

| Variable | Type | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | secret | Auth for all Resend sends (notifications, confirmations, reminders). Also set on the separate reminder worker. |
| `LEAD_TO_EMAIL` | secret | Recipient of the internal "new lead" alert. |
| `LEAD_FROM_EMAIL` | secret | Sender address for the internal alert. |

The submitter-facing confirmation email only needs `RESEND_API_KEY`. The internal
alert (`notify.js`) requires all three of the above to be present or it no-ops.

---

## Google Sheets mirror

| Variable | Type | Purpose |
| --- | --- | --- |
| `SHEETS_WEBHOOK_URL` | secret | The Apps Script Web App `/exec` URL that receives leads. |
| `SHEETS_SECRET` | secret | Shared secret; must match the `SHARED_SECRET` constant inside the Apps Script. |

If either is unset, `syncSheets.js` is a silent no-op.

---

## Google Meet (Calendar API)

| Variable | Type | Purpose |
| --- | --- | --- |
| `GOOGLE_CLIENT_ID` | secret | OAuth client ID for the `hello@wehelpautomate.com` Google project. |
| `GOOGLE_CLIENT_SECRET` | secret | OAuth client secret. |
| `GOOGLE_REFRESH_TOKEN` | secret | Long-lived refresh token (scope `calendar.events`). |

If any is unset, `googleMeet.js` returns null and the booking proceeds without a
Meet link.

---

## Reminder worker (separate project)

The `weha-reminders` Cloudflare Worker has its own secret store (set via
`wrangler secret put` in that project). It needs:

| Variable | Type | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | secret | Same Resend key; sends the 24h/1h reminder emails. |

It binds the same D1 database (`weha-db`) via its `wrangler.toml`.

---

## Frontend analytics (build-time / client)

Analytics IDs (GTM container, PostHog key/host) are configured in the frontend
code / build as appropriate. PostHog only initializes after explicit cookie
consent; GTM loads with a Consent Mode v2 "denied" default until consent is
granted. See `ARCHITECTURE.md` for the consent flow.

---

## Legacy scaffold (not production)

`backend/.env` (git-ignored) belongs to the legacy FastAPI/MongoDB scaffold in
`backend/`, which is not deployed. It is unrelated to the live Cloudflare
Functions and can be ignored.
