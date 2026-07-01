export async function syncToSheets(env, record) {
  if (!env.SHEETS_WEBHOOK_URL || !env.SHEETS_SECRET) return;
  try {
    await fetch(env.SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: env.SHEETS_SECRET, record }),
    });
  } catch (_) {
    // Best-effort only — must never affect the API response or D1 write.
  }
}
