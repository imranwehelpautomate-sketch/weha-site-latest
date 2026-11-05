/**
 * Prerender wrapper for react-snap, run by the "build" script itself.
 *
 * Not a "postbuild" hook: the Cloudflare Pages build skipped that hook, so
 * every page shipped an empty shell while the build still passed (D137).
 * A failed or empty prerender now fails the build, so Pages keeps the last
 * good deployment live (D138).
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
    // react-snap can "succeed" and still save an empty shell; check every
    // route has a <title> and an <h1> (the FR-024 check, at build time).
    const buildDir = path.resolve(__dirname, "..", "build");
    const empty = (pkg.reactSnap.include || []).filter((route) => {
      const file = path.join(buildDir, route, "index.html");
      const html = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
      return !/<title[^>]*>[^<]+<\/title>/i.test(html) || !/<h1[ >]/i.test(html);
    });
    if (empty.length) {
      console.error("PRERENDER FAILED, no title or h1 in:", empty.join(" "));
      process.exit(1);
    }
    writeSpaFallback();
    process.exit(0);
  })
  .catch((err) => {
    console.error("PRERENDER FAILED, build stopped:", err);
    process.exit(1);
  });
