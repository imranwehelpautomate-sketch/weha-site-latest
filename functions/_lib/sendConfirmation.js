// Shared submitter-confirmation email for the Cloudflare Pages Functions.
//
// Sends a short, branded confirmation to the person who submitted a form,
// IN ADDITION TO the existing internal notifyLead alert (which is untouched).
//
// Same Resend fetch pattern as notifyLead, reusing the SAME env.RESEND_API_KEY
// secret. Everything is wrapped in try/catch and guarded, so a failed or
// unconfigured email can NEVER block the API response or break the DB save.
//
//   Signature:  sendConfirmation(env, record)
//   From:       WeHA <hello@wehelpautomate.com>
//   To:         record.email
//   Reply-To:   hello@wehelpautomate.com
//
// Subject/body branch on record.form_name (booking_request / contact_message /
// everything else = generic). No new fields are invented and no fake links added.

const CONFIRM_FROM = "WeHA <hello@wehelpautomate.com>";
const CONFIRM_REPLY_TO = "hello@wehelpautomate.com";
const ACCENT = "#5b3fa6"; // matches the site's primary button color (Ink Violet)
const PAGE_BG = "#f7f6f2"; // site off-white
const CARD_BG = "#ffffff";
const CARD_BORDER = "#ece9e3";
const TEXT = "#2b2a28";
const MUTED = "#6b6862";
const SIGNOFF = "\u2013 The WeHA team"; // en dash, per spec (only place a dash is used)

// Timezone abbreviations aligned with the site's own booking dropdown labels.
const TZ_ABBR = {
  "Asia/Dubai": "GST",
  "Asia/Kolkata": "IST",
  "Asia/Singapore": "SGT",
  "America/New_York": "ET",
  "America/Chicago": "CT",
  "America/Denver": "MT",
  "America/Phoenix": "MST",
  "America/Los_Angeles": "PT",
  "America/Anchorage": "AKT",
  "Pacific/Honolulu": "HST",
  "Australia/Sydney": "AEST",
  "Australia/Brisbane": "AEST",
  "Australia/Adelaide": "ACST",
  "Australia/Darwin": "ACST",
  "Australia/Perth": "AWST",
  "Australia/Hobart": "AEDT",
};

function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

function firstName(name) {
  const n = (name || "").trim().split(/\s+/)[0];
  return n || "there";
}

// e.g. "Friday, 17 July \u00b7 11:15 AM (IST)"
function formatSlot(iso, tz) {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    const zone = tz || "UTC";
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: zone,
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
      .formatToParts(d)
      .reduce((acc, p) => {
        acc[p.type] = p.value;
        return acc;
      }, {});
    const ampm = (parts.dayPeriod || "").toUpperCase();
    const abbr = TZ_ABBR[tz] || tz || "UTC";
    return `${parts.weekday}, ${parts.day} ${parts.month} \u00b7 ${parts.hour}:${parts.minute} ${ampm} (${abbr})`;
  } catch (_) {
    return null;
  }
}

function contentFor(record) {
  const greeting = `Hi ${firstName(record.name)},`;

  if (record.form_name === "booking_request") {
    const lines = ["Your audit is booked."];
    const slot = record.slot_iso_utc ? formatSlot(record.slot_iso_utc, record.timezone) : null;
    if (slot) lines.push(slot);
    lines.push("No sales scripts. Just a focused conversation about your workflow.");
    return { subject: "Your AI Audit is booked.", greeting, lines };
  }

  if (record.form_name === "contact_message") {
    return {
      subject: "We've got your request.",
      greeting,
      lines: [
        "Thanks, your audit request is in.",
        "We reply within 24 hours. No sales scripts, no pitch decks, just a conversation about your workflow.",
      ],
    };
  }

  // playbook_lead / calculator_lead / audit_request / anything else -> generic
  return {
    subject: "Thanks for your interest in WeHA",
    greeting,
    lines: [
      "Thanks for reaching out to WeHA. We've received your details and someone from our team will be in touch soon.",
    ],
  };
}

function renderText({ greeting, lines }) {
  return [greeting, "", ...lines, "", SIGNOFF].join("\n");
}

function renderHtml({ greeting, lines }) {
  const body = lines
    .map((l) => `<p style="margin:0 0 14px;">${escapeHtml(l)}</p>`)
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${PAGE_BG};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAGE_BG};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:${CARD_BG};border:1px solid ${CARD_BORDER};border-radius:14px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        <tr><td style="height:4px;background:${ACCENT};font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td style="padding:26px 28px 6px;">
          <div style="font-weight:700;font-size:18px;letter-spacing:0.5px;color:${ACCENT};">WeHA</div>
        </td></tr>
        <tr><td style="padding:6px 28px 28px;color:${TEXT};font-size:15px;line-height:1.55;">
          <p style="margin:0 0 14px;">${escapeHtml(greeting)}</p>
          ${body}
          <p style="margin:18px 0 0;color:${MUTED};">${escapeHtml(SIGNOFF)}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export async function sendConfirmation(env, record) {
  try {
    // Same secret as notifyLead; only send when configured and we have a recipient.
    if (!env || !env.RESEND_API_KEY) return;
    if (!record || !record.email) return;

    const { subject, greeting, lines } = contentFor(record);

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: CONFIRM_FROM,
        to: record.email,
        reply_to: CONFIRM_REPLY_TO,
        subject,
        html: renderHtml({ greeting, lines }),
        text: renderText({ greeting, lines }),
      }),
    });
  } catch (_) {
    // Swallow all errors so a confirmation email never breaks the save/response.
  }
}
