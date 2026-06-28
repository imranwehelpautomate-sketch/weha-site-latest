/**
 * Prerender wrapper for react-snap (postbuild step).
 *
 * Why a wrapper instead of the bare `react-snap` bin:
 *   The Chromium executable differs per environment.
 *     - Cloudflare Pages build: leave PUPPETEER_EXECUTABLE_PATH unset, so
 *       react-snap uses the Chromium that puppeteer downloads at install time.
 *     - Local / container builds with a system Chromium: set
 *       PUPPETEER_EXECUTABLE_PATH (e.g. /root/bin/chromium) and it is used.
 *
 * All other options (the route list, skipThirdPartyRequests, etc.) are read
 * from the "reactSnap" block in package.json so there is a single source of
 * truth.
 */
const { run } = require("react-snap");
const pkg = require("../package.json");

run({
  ...(pkg.reactSnap || {}),
  puppeteerExecutablePath:
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    (pkg.reactSnap && pkg.reactSnap.puppeteerExecutablePath) ||
    undefined,
})
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
