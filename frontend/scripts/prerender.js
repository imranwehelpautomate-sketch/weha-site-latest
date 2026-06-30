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
const fs = require("fs");
const path = require("path");
const { run } = require("react-snap");
const pkg = require("../package.json");

// Cloudflare Pages serves 200.html for any path with no matching static file,
// acting as the SPA fallback for deep links / refreshes WITHOUT the
// "Infinite loop detected" warning that a `/* /index.html 200` rewrite triggers.
function writeSpaFallback() {
  const buildDir = path.resolve(__dirname, "..", "build");
  const indexHtml = path.join(buildDir, "index.html");
  const fallbackHtml = path.join(buildDir, "200.html");
  if (fs.existsSync(indexHtml)) {
    fs.copyFileSync(indexHtml, fallbackHtml);
    console.log("Wrote SPA fallback: build/200.html");
  } else {
    console.warn("Skipped 200.html: build/index.html not found");
  }
}

run({
  ...(pkg.reactSnap || {}),
  puppeteerExecutablePath:
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    (pkg.reactSnap && pkg.reactSnap.puppeteerExecutablePath) ||
    undefined,
})
  .then(() => {
    writeSpaFallback();
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
