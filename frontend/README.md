# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Static prerendering (SEO / LLM crawlability)

This SPA is prerendered to static HTML at build time with
[`react-snap`](https://github.com/stereobooster/react-snap), so crawlers and LLMs
receive fully formed HTML for every route without executing JavaScript.

- `yarn build` runs `craco build`, then the `postbuild` step
  (`node scripts/prerender.js`) prerenders every route listed under the
  `reactSnap` block in `package.json`:
  `/`, `/services`, `/work`, `/about`, `/contact`, `/resources`,
  `/resources/workbooks`, `/resources/workflow-automations`, `/resources/ebooks`.
- Each route is written to `build/<route>/index.html` containing the rendered
  page content (not just an empty `#root`). On the client, `src/index.js`
  uses `hydrateRoot` when prerendered markup is present and `createRoot`
  otherwise.
- Per page `<title>`, meta description, canonical, OpenGraph/Twitter tags and
  JSON-LD are rendered by `src/components/Seo.jsx` (React 19 native head
  hoisting). The base `public/index.html` intentionally ships no `<title>` or
  description so each prerendered page has exactly one of each.

### Chromium for prerendering

`react-snap` drives a headless Chromium via puppeteer.

- On Cloudflare Pages, leave `PUPPETEER_EXECUTABLE_PATH` unset; puppeteer uses
  the Chromium it downloads at install time.
- In a container or local build that already has a system Chromium, set
  `PUPPETEER_EXECUTABLE_PATH` (for example `/root/bin/chromium`) and the wrapper
  in `scripts/prerender.js` will use it.

If a build environment cannot provide any Chromium, the `postbuild` step can be
skipped and the plain `build/` output still deploys as a normal SPA (with the
Cloudflare Pages `_redirects` SPA fallback), just without static prerendering.

### Cloudflare Pages routing

`public/_redirects` contains `/*  /index.html  200`. Cloudflare Pages serves an
existing static file first, so the prerendered per route `index.html` files are
returned directly; only paths with no matching file fall back to the app shell.


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
