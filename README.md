# Promptverse

A public AI prompt arsenal with a Matrix-inspired interface, 180 original templates, and 15 categories. No account or AI subscription is required to browse the library.

## Features

- Three-step, skippable onboarding and recommendations based on selected interests.
- Search across prompt titles, descriptions, tags, categories, and full templates.
- Category and experience filters, featured sorting, and alphabetical sorting.
- Editable prompt templates with reusable context fields and one-click copying.
- Shareable links that open directly into the selected prompt; native sharing where supported, clipboard fallback elsewhere.
- Device-local favorites and preferences.
- Community likes stored in Netlify Blobs, with a Popular view ranked by actual likes.
- Responsive mobile navigation, 44px primary touch targets, keyboard controls, reduced-motion support, and native accessible dialogs.

## Run

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
```

The basic development server serves the library on port 4173. To run the voting API and sandboxed Blobs storage locally:

```sh
npx netlify dev --offline --port 8888 --target-port 5173 --command "node scripts/dev.mjs --port 5173"
```

## Check and build

```sh
npm run check
npm test
npm run build
```

The build validates the library, generates the client data bundle and server allowlist, and copies public assets into `dist`. `netlify.toml` configures the production build and serverless function.

## Deploy to Netlify

Import this repository in Netlify. Use `npm run build` as the build command and `dist` as the publish directory. The project includes everything required for the `/api/likes` function and automatically provisioned Netlify Blobs. No API keys are required for the app itself.

To deploy from an authenticated CLI:

```sh
npx netlify deploy --build --prod
```

Keep visitor access public. A static file upload alone will not deploy the voting function.

## Community ranking

Each anonymous browser receives a random HttpOnly cookie. Votes use one independent storage key per prompt and browser, so repeated likes are idempotent and votes from different visitors do not overwrite one another. Production votes persist across deployments; nonproduction votes use a separate deploy-scoped store. Ties sort alphabetically. The client refreshes votes every 45 seconds and serializes its mutations.

This is an anonymous community ranking, not authenticated one-person-one-vote verification. Clearing cookies or using another browser creates another visitor. Very large voting traffic should move counts to a transactional database and add stronger abuse controls. Counts currently derive from stored vote keys rather than fabricated activity or race-prone read/modify/write increments.

## Privacy

No analytics, sign-in, tracking pixels, or AI execution are included. Preferences and favorites stay in localStorage. Shared links include only the prompt identifier, never personalized field contents. The vote service stores anonymous identifiers and prompt choices. Google Fonts delivers the interface fonts; system fallbacks work if fonts cannot load.

## Extend the library

Edit `prompts.json`, keeping unique IDs and the existing object schema. Update the expected category counts in `scripts/validate.mjs` when expanding the library. Run the checks and build before deploying. All prompt content is original; outputs from any AI assistant still need review.
