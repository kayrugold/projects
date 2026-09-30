# Studio redesign — local review

## Backup

The pre-redesign working tree is saved in `.local-backups/website-before-redesign-20260927-145013.tar.gz` (19,231,235 bytes). It includes the approved Infinite Drafting presentation and all pre-existing uncommitted source changes. Restoration instructions and the archive checksum are in `.local-backups/RESTORE.md`. The backup folder is ignored by Git.

## What changed

- Field Desk: a clearer introduction, featured Infinite Drafting release, three visitor paths, and a terminal hint.
- Forge: category filters, consistent launch/details actions, readable descriptions, and status labels.
- Project details: shared overview, first-use guidance, development notes, artwork, capabilities, and collapsible original technical notes. Projects that previously lacked a Details page now have one.
- Rookery: open feedback workshop, practical exploration prompts, report preview, optional device details, email-draft and clipboard actions. No mandatory Discord onboarding or attendance counter. Email still requires the visitor to send the draft in their email app.
- Xyrtania: a focused alpha-project introduction, game launch/new-tab options, concept artwork, development context, feedback link, and opt-in soundtrack. Randomized player/latency counters were removed. Existing artwork is explicitly identified as concept art, not a gameplay screenshot or release-date commitment.
- Shell: compact mobile navigation, navigation subtitles, lighter CRT effect with a saved on/off control, keyboard-visible focus, reduced-motion styling, and terminal command suggestions/Tab completion.
- Historical journal entries retain their original content with a current note explaining that the old attendance-based testing plan has been replaced.

## Files for this redesign

New source files: `src/components/StudioPages.tsx`, `src/data/projectGuides.ts`, `src/studio.css`.

Modified: `.gitignore`, `src/App.tsx`, `src/XyrtaniaCinematicSite.tsx`, `src/components/TerminalPrompt.tsx`, `src/data/forge.ts`, `src/data/projects.ts`, `src/data/chronicles.ts`.

This note is also new. The new `src/data/infiniteDrafting.ts` file belongs to the earlier approved product-page work and is included in the backup; it must be included when committing the website.

## Deployment

No commit, push, or Cloudflare configuration change was made. Continue using the existing WSL → GitHub → Cloudflare workflow. Cloudflare builds the website using the root package scripts. The separate `infinite-drafting/` application is not deployed by these presentation changes.

The local preview is at `http://127.0.0.1:5173/`. The default dev script still uses port 3000; the preview uses 5173 because this Windows environment did not allow port 3000. The local Windows build dependencies are ignored by Git.

## Review routes

- `#field-desk`: homepage
- `#forge`: project gallery and filters
- `#andysaudiolooper`: example detail page with technical notebook
- `#gnomon-navigator`: example new detail page
- `#rookery`: feedback workshop
- `#xyrtania`: gateway
- `#infinite-drafting`: approved product page

No store release, backend reporting service, or new Discord configuration is implied by this redesign. The game and prototype implementations are unchanged.

## Verification completed

- TypeScript check and full Vite/PWA production build passed.
- Browser checks covered homepage navigation, Forge category filtering, an existing technical detail page, a new detail page and direct-link reload, app launch/close, Gateway launch/return, feedback validation and opt-in report preview, terminal Tab completion/command execution, and CRT preference persistence.
- Layouts inspected at 390px and 1280px widths; inspected pages had no horizontal document overflow.
- All nine local Forge launch files and ten Forge artwork paths exist.
- No email was sent. The report's email-client handoff was not exercised; the preview and validation were checked locally.
- Existing non-blocking build warnings remain for the deprecated audio glob option and older Browserslist data.

## Restore to the approved redesign — September 28

Restored the pre-Beacon, pre-community snapshot `website-before-beacon-terminal-20260928.tar.gz`. This keeps the approved navigation, product pages, Rookery feedback workshop, and Xyrtania Gateway, with the terminal as it was at that point. Discord remains the existing community destination.

The Beacon, native chat, forums, contextual discussions, identity code, and Cloudflare community endpoint were removed from the active project. The complete state before this rollback is saved in `.local-backups/website-before-community-rollback-20260928.tar.gz`; retired source is also in `.local-backups/retired-community-20260928/`.

No Git commit, push, Discord configuration, or deployment was performed.

## Xyrtania launch and presentation — September 28

Backup before this pass: `.local-backups/website-before-xyrtania-fixes-20260928.tar.gz`.

Reproduced the Forge's blank embedded Xyrtania frame. The same public game URL loaded directly and progressed from its loading screen to its main menu. All website launch paths now open Xyrtania in a separate game tab; ordinary local tools retain their embedded launcher. Gateway and homepage use normal external links; Forge, specs, and terminal launches share the external-game handling. This avoids the failing iframe path; the underlying frame failure was not conclusively isolated. Multiplayer/account flows were not changed or verified.

Added homepage hero access and a flagship section. Rebuilt the gateway with inspectable concept art, a selectable field guide, an optional soundtrack, and a hidden rune. Restored the richer terminal (project search, commands, prime checks, adventure, Easter eggs) and added `/xyrtania`. The Beacon is a collapsed, single-line strip below the homepage's content and accessible with `/beacon`.

No community backend or native forum/chat restored in this pass. The discussion architecture question remains open. No Git push or remote deployment performed.
