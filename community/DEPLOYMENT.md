# Deployment checkpoint — 2026-09-29

Previous production commit: 0e58356e18d89e4a60ca80aae9cf63510dbc993f
Previous Cloudflare deployment: 0d24ce45-64eb-465d-a015-9760248b2808
Source backup: .local-backups/website-before-public-deployment-20260929.tar.gz

Production Pages project: andysdevstudio (master, npm run build, dist)
Dedicated D1: andysdevstudio-community / 61e416da-709c-4a20-9caf-152a163d6fef
Database schema initialized from community/schema.sql.

Secrets are stored only in Cloudflare, never committed. Existing databases remain unchanged.
Only /api/* invokes Pages Functions; static website assets remain served by Pages directly.

If a deployment is unhealthy, use Cloudflare Deployments to roll back to the previous production deployment above. That restores the prior website without deleting community data. Investigate and correct source before the next push. Never reset or force-push over other work.

## Moderation controls release — 2026-09-29

Apply `community/moderation-migration.sql` to the existing community D1 before deploying. It adds a controls table and joined view without modifying existing posts or identities; the previous release remains compatible. Local preview applies the same schema automatically.

Pre-migration D1 Time Travel bookmark: `00000008-00000000-000050f5-92a1aae5f5098c713527289c58f58fbb` (subject to Cloudflare retention). Source backup: `.local-backups/before-moderation-controls-20260929.tar.gz`.

Authors can permanently clear their own post content; the moderator can clear any post. Deletion clears title/body and reports, retaining a labeled thread anchor and replies. It is not undoable through the site. Cloudflare database backups may retain old content during their retention period. Hide/restore is separate and reversible. Pinning and reply locks apply to topics; highlights also apply to replies/chat. Moderator desk pages through reported/all/hidden posts and suspended members. Moderator cannot suspend their own identity. Signed requests and existing anti-abuse controls apply to every action.
