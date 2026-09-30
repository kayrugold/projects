# Website demo integration

The studio's `/demo.html` imports this app directly from `src/App.tsx`. It uses the real canvas, tools, layers, colors, and guides, rather than a separately maintained imitation.

Only the studio demo HTML sets `data-drafting-demo="true"`. That mode starts with a blank in-memory draft, skips Firebase initialization and authentication, skips saved-draft loading and migration, blocks local persistence, and disables saving/library access. Preferences also remain temporary. Closing or reloading the iframe discards its drawing. The standalone `index.html` does not set this marker and retains the original device/cloud save features.

The studio wrapper passes `embedded` to omit the standalone install button. It deliberately does not import this app's `main.tsx`, which would register a second service worker against the studio's origin. The standalone entry and PWA configuration remain available for a future independent repository and distribution build. This integration does not configure or publish an itch.io, Android, or Windows release.

Changes to shared drawing tools should be made in this directory so the demo and standalone app stay in sync.
