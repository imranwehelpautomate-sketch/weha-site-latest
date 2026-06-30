import axios from "axios";
import { submitForm } from "./submitForm";

// Empty base => same-origin "/api" — hits the Cloudflare Pages Function.
// In local dev you can still override via REACT_APP_BACKEND_URL.
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
export const API = `${BACKEND_URL}/api`;

// All form POSTs route through the shared submitForm helper so that a non-2xx
// (e.g. HTTP 422 { detail }) surfaces as a thrown Error(message) the forms can
// display inline, instead of being silently swallowed.
export const submitAuditRequest = (payload) => submitForm("/audit-requests", payload);
export const submitBookingRequest = (payload) => submitForm("/booking-requests", payload);
export const submitContactMessage = (payload) => submitForm("/contact-messages", payload);
export const submitPlaybookLead = (payload) => submitForm("/playbook-requests", payload);
export const submitCalculatorLead = (payload) => submitForm("/calculator-leads", payload);

export async function fetchAvailability(dateYmd, tz) {
  const { data } = await axios.get(`${API}/availability`, {
    params: { date: dateYmd, tz },
  });
  return data; // [{ label, iso_utc, taken }]
}

// WeHA AI — chat with the automation assistant.
// NOTE: WeHA AI was moved out of the live site. The helpers
// (sendWehaAiMessage / fetchWehaAiModels) now live in
// /future-development/frontend/lib/api-weha-ai.js

// Placeholder download URL for the AI Transformation Playbook
export const PLAYBOOK_DOWNLOAD_URL =
  "https://drive.google.com/uc?export=download&id=PLACEHOLDER_PLAYBOOK_ID";
