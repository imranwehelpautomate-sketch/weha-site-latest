// Creates a Calendar event with a Google Meet link for a booking. Never
// throws. On any failure, returns null and the booking proceeds without
// a link. Uses OAuth refresh-token flow against hello@wehelpautomate.com.
export async function createMeetLink(env, record) {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_REFRESH_TOKEN) return null;
  if (!record.slot_iso_utc) return null;
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        refresh_token: env.GOOGLE_REFRESH_TOKEN,
        grant_type: "refresh_token",
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return null;

    const start = new Date(record.slot_iso_utc);
    const durationMin = record.duration_minutes || 15;
    const end = new Date(start.getTime() + durationMin * 60000);

    const eventRes = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: `WeHA AI Audit: ${record.name || "New lead"}${record.company ? " (" + record.company + ")" : ""}`,
          description: record.process || "",
          start: { dateTime: start.toISOString(), timeZone: "UTC" },
          end: { dateTime: end.toISOString(), timeZone: "UTC" },
          conferenceData: {
            createRequest: {
              requestId: (record.id || String(Date.now())) + "-meet",
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          },
        }),
      }
    );
    const eventData = await eventRes.json();
    if (eventData.hangoutLink) return eventData.hangoutLink;
    const videoEntry = (eventData.conferenceData?.entryPoints || []).find(
      (e) => e.entryPointType === "video"
    );
    return videoEntry?.uri || null;
  } catch (_) {
    return null;
  }
}
