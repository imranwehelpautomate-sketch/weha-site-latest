// Verification test for the booking confirmation email duration bug fix.
//
// The bug: the confirmation email always said "To make the most of our 15
// minutes..." even when the user booked a 30-minute call. This test mocks
// global fetch (so no real Resend email is sent), invokes the REAL
// sendConfirmation() from functions/_lib/sendConfirmation.js, and asserts the
// captured email body reflects the correct duration for both 15 and 30 min.
//
// Run:  node tests/confirmation_duration_test.mjs

import { sendConfirmation } from "../functions/_lib/sendConfirmation.js";

const env = { RESEND_API_KEY: "test_key_for_verification" };

function baseBookingRecord(durationMinutes) {
  return {
    id: "test-" + durationMinutes,
    form_name: "booking_request",
    name: "Jane Doe",
    company: "Acme Co",
    email: "jane@example.com",
    process: "Manual invoice reconciliation eats our week.",
    slot_iso_utc: "2025-07-18T05:45:00.000Z",
    timezone: "Asia/Kolkata",
    duration_minutes: durationMinutes,
    meet_link: "https://meet.google.com/abc-defg-hij",
  };
}

async function captureEmail(record) {
  let captured = null;
  // Mock fetch to capture the Resend request payload instead of sending it.
  globalThis.fetch = async (url, opts) => {
    captured = JSON.parse(opts.body);
    return { ok: true, json: async () => ({ id: "mock" }) };
  };
  await sendConfirmation(env, record);
  return captured;
}

function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL: " + msg);
    process.exitCode = 1;
  } else {
    console.log("PASS: " + msg);
  }
}

const results = {};

// --- 15-minute booking ---
const email15 = await captureEmail(baseBookingRecord(15));
results.email15 = email15;
assert(email15 && (email15.text || email15.html), "15-min: email payload produced");
assert(email15.text.includes("our 15 minutes"), "15-min: text says 'our 15 minutes'");
assert(email15.html.includes("our 15 minutes"), "15-min: html says 'our 15 minutes'");
assert(!email15.text.includes("our 30 minutes"), "15-min: text does NOT say 'our 30 minutes'");
assert(email15.text.includes("\u00b7 15 min"), "15-min: slot line shows '15 min'");

// --- 30-minute booking ---
const email30 = await captureEmail(baseBookingRecord(30));
results.email30 = email30;
assert(email30 && (email30.text || email30.html), "30-min: email payload produced");
assert(email30.text.includes("our 30 minutes"), "30-min: text says 'our 30 minutes'");
assert(email30.html.includes("our 30 minutes"), "30-min: html says 'our 30 minutes'");
assert(!email30.text.includes("our 15 minutes"), "30-min: text does NOT say 'our 15 minutes'");
assert(email30.text.includes("\u00b7 30 min"), "30-min: slot line shows '30 min'");

console.log("\n--- 15 min bullet lead ---");
console.log((results.email15.text.match(/To make the most of.*/) || ["(not found)"])[0]);
console.log("--- 30 min bullet lead ---");
console.log((results.email30.text.match(/To make the most of.*/) || ["(not found)"])[0]);

if (process.exitCode === 1) {
  console.log("\nRESULT: TESTS FAILED");
} else {
  console.log("\nRESULT: ALL TESTS PASSED");
}
