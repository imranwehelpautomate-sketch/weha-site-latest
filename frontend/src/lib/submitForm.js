// Shared form-submit helper. POSTs JSON to an /api path, parses the JSON body,
// and on any non-2xx (or network/parse failure) throws an Error whose message is
// the server-provided detail when available, otherwise a friendly fallback.
//
// The backend (FastAPI in dev, Cloudflare Functions in prod) returns validation
// errors as HTTP 422 with { "detail": "<message>" }. Forms catch the thrown
// Error and show err.message inline near the submit button.

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
const API = `${BACKEND_URL}/api`;

export const GENERIC_SUBMIT_ERROR =
  "Something went wrong, please check your details and try again.";

export async function submitForm(path, payload) {
  let res;
  try {
    res = await fetch(`${API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    // Network / CORS / DNS failure - never leave the button stuck.
    throw new Error(GENERIC_SUBMIT_ERROR);
  }

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }

  if (!res.ok) {
    const detail = data && (data.detail || data.error);
    throw new Error(typeof detail === "string" && detail ? detail : GENERIC_SUBMIT_ERROR);
  }

  return data;
}
