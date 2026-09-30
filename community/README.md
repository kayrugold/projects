# Studio community: local preview and Cloudflare setup

The forum, contextual discussions/reviews, and site chat share `community/api.mjs`. Development uses local SQLite; production uses Cloudflare Pages Functions and a D1 binding. Production setup and the rollback checkpoint are recorded in DEPLOYMENT.md.

## Local preview

Use Node 24 (or 22.13+) and `npm run dev`. Local posts are stored in `.local-community/community.sqlite`, which is excluded from Git and backups of source. This preview accepts loopback connections only. It skips Turnstile only inside the development middleware; production does not accept an environment string as a bypass.

## Before enabling publicly

1. Create a D1 database and apply `community/schema.sql` to it.
2. Bind it to the Cloudflare Pages project as `DB` (configure preview and production independently).
3. Create a Turnstile widget for the actual website hostname. Set `TURNSTILE_SITE_KEY` and secret `TURNSTILE_SECRET` on Pages.
4. Set `SITE_ORIGIN` to the exact public origin, including https and no trailing slash. Set secret `ABUSE_SALT` to a long random value used to hash network addresses for rate limiting.
5. Deploy the repository with the root `functions` folder alongside the Vite build. Build command remains `npm run build`; output is `dist`. A Git push to master triggers the production deployment; only push when authorized by Andy.
6. Create your community identity on the public site, download an encrypted recovery file, and store it securely. Copy its public fingerprint into `MODERATOR_KEY_ID`, then redeploy to enable the moderator desk. Never put private or recovery keys in source or environment variables.
7. Verify joining, posting, replying, reporting, moderation, and chat on the deployed preview before announcing public access. Missing configuration intentionally returns a community-unavailable message; it does not silently accept unverified registrations.

No wallet, cryptocurrency payment, email address, or Xyrtania account is needed. Community identities are separate P-256 signing keys stored in the browser. Clearing browser data without a recovery file loses that identity. Public posts and fingerprints persist in D1. Cloudflare still processes network information for hosting and abuse controls. Turnstile, signed requests, replay rejection, rate limits, reporting, and moderator tools reduce abuse; they cannot guarantee a bot-free community.

Chat polls every eight seconds only while its drawer is open and the document is visible. Latest 100 messages/topics and 200 replies are displayed. This uses your Cloudflare resources and is independent of Discord.

## Xyrtania status

`functions/api/xyrtania-status.js` checks the public game host with a HEAD request, cached for one minute. It does not check multiplayer availability or collect player counts. The details page labels those limitations explicitly.

## Validation

- `node --test tests/community.mjs`
- `node tests/terminal-beacon.cjs`
- `node node_modules/typescript/bin/tsc --noEmit`
- `npm run build`

The Infinite Drafting demo is a separate Vite entry (`demo.html`) using the actual app's CanvasWorkspace component. It has temporary drawing state only and is loaded when a visitor clicks Start demo.
`src/demo.tsx` imports `infinite-drafting/src/components/CanvasWorkspace.tsx` and its types. Include these currently untracked application sources along with the new website files when preparing your Git commit; a source-only partial commit would fail to build.
