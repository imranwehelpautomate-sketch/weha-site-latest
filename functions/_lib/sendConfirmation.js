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

function quoteExcerpt(text) {
  const t = String(text == null ? "" : text).trim();
  if (!t) return null;
  const MAX = 150;
  const clipped = t.length > MAX ? t.slice(0, MAX).trimEnd() + "\u2026" : t;
  return `"${clipped}"`;
}

function contentFor(record) {
  const greeting = `Hi ${firstName(record.name)},`;
  const processQuote = quoteExcerpt(record.process);

  if (record.form_name === "booking_request") {
    const blocks = [{ type: "p", text: "Your audit is booked." }];

    // Normalized call length (booking always stores 15 or 30; default 15).
    const durMin = [15, 30].includes(Number(record.duration_minutes)) ? Number(record.duration_minutes) : 15;

    const slot = record.slot_iso_utc ? formatSlot(record.slot_iso_utc, record.timezone) : null;
    if (slot) {
      blocks.push({ type: "p", text: `${slot} \u00b7 ${durMin} min` });
    }

    // Google Meet join button, only when a link was generated for this booking.
    if (record.meet_link) {
      blocks.push({ type: "button", text: "Join with Google Meet", href: record.meet_link });
    }

    blocks.push({
      type: "p",
      text: "What this call actually is: no pitch decks, just a focused conversation where we map your process and show where automation takes over.",
    });

    if (processQuote) {
      blocks.push({ type: "quote", label: "You told us:", text: processQuote });
    }

    blocks.push({
      type: "bullets",
      lead: `To make the most of our ${durMin} minutes, it helps if you have ready:`,
      items: [
        "A rough sense of how many hours a week the process costs you",
        "Which tool(s) are involved",
        "Whoever on the team owns the task day-to-day",
      ],
    });

    blocks.push({
      type: "p",
      text: "After the call: we'll send a short summary plus one automation recommendation to follow up on. No obligation.",
    });

    blocks.push({ type: "p", text: "Need to reschedule? Just reply to this email." });

    return { subject: "Your AI Audit is booked.", greeting, blocks };
  }

  if (record.form_name === "contact_message") {
    const blocks = [{ type: "p", text: "Thanks, your audit request is in." }];

    if (processQuote) {
      blocks.push({ type: "quote", label: "You told us:", text: processQuote });
    }

    blocks.push({
      type: "numbered",
      lead: "Here's exactly what happens next:",
      items: [
        "We reply within 24 hours, and it's a real person.",
        "If it's a fit, we'll offer times for a free 15-minute audit call.",
        "On that call we map your workflow and show one automation you could ship immediately.",
      ],
    });

    blocks.push({
      type: "p",
      text: "No sales scripts, no pitch decks, just a conversation about your workflow.",
    });

    return { subject: "We've got your request.", greeting, blocks };
  }

  // playbook_lead / calculator_lead / audit_request / anything else -> generic
  const blocks = [
    {
      type: "p",
      text: "Thanks for reaching out to WeHA. We've received your details and someone from our team will be in touch soon.",
    },
  ];
  if (processQuote) {
    blocks.push({ type: "quote", label: "You told us:", text: processQuote });
  }
  return { subject: "Thanks for your interest in WeHA", greeting, blocks };
}

function blockToText(b) {
  if (b.type === "quote") {
    return b.label ? `${b.label}\n${b.text}` : b.text;
  }
  if (b.type === "button") {
    return `${b.text}: ${b.href}`;
  }
  if (b.type === "bullets") {
    return [b.lead, ...b.items.map((i) => `- ${i}`)].join("\n");
  }
  if (b.type === "numbered") {
    return [b.lead, ...b.items.map((i, idx) => `${idx + 1}. ${i}`)].join("\n");
  }
  return b.text || "";
}

function renderText({ greeting, blocks }) {
  return [greeting, ...blocks.map(blockToText), SIGNOFF].join("\n\n");
}

function blockToHtml(b) {
  if (b.type === "quote") {
    const label = b.label
      ? `<p style="margin:0 0 6px;font-weight:600;color:${TEXT};">${escapeHtml(b.label)}</p>`
      : "";
    return `${label}<blockquote style="margin:0 0 14px;padding:10px 14px;border-left:3px solid ${ACCENT};background:${PAGE_BG};color:${MUTED};font-style:italic;border-radius:4px;">${escapeHtml(b.text)}</blockquote>`;
  }
  if (b.type === "button") {
    return `<p style="margin:0 0 18px;"><a href="${escapeHtml(b.href)}" style="display:inline-block;background:${ACCENT};color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:11px 22px;border-radius:8px;">${escapeHtml(b.text)}</a></p>`;
  }
  if (b.type === "bullets" || b.type === "numbered") {
    const tag = b.type === "bullets" ? "ul" : "ol";
    const lead = b.lead ? `<p style="margin:0 0 8px;">${escapeHtml(b.lead)}</p>` : "";
    const items = b.items.map((i) => `<li style="margin:0 0 6px;">${escapeHtml(i)}</li>`).join("");
    return `${lead}<${tag} style="margin:0 0 14px;padding-left:20px;">${items}</${tag}>`;
  }
  return `<p style="margin:0 0 14px;">${escapeHtml(b.text || "")}</p>`;
}

function renderHtml({ greeting, blocks }) {
  const body = blocks.map(blockToHtml).join("");
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

    const { subject, greeting, blocks } = contentFor(record);

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
        html: renderHtml({ greeting, blocks }),
        text: renderText({ greeting, blocks }),
      }),
    });
  } catch (_) {
    // Swallow all errors so a confirmation email never breaks the save/response.
  }
}
