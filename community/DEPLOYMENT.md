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
