# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

> This project uses a project office — for its tasks and documentation see .project-office/AGENTS.md.

## What this is

`project-office-cli` is the **agent-facing CLI** — the controlled interface between AI agents
and the Project Office / MVP Task Manager. The web app is the **human** interface; this CLI
is the **agent** one. Agents reach Task Manager **only** through this CLI: the CLI may call
the backend, but agents must not bypass it to reach the backend, database, filesystem, or app
internals. Work stays inside one explicit project scope. The backend owns data and returns
JSON; the CLI owns readable terminal output. Stack: **Bun + TypeScript** (Commander, Axios).
See [`README.md`](./README.md) for a current overview.

## Enforcement

Some actions are blocked mechanically (`.claude/settings.json`) — git writes and editing
`.project-office/repo-settings.json` (only `project:link-repo` writes it). Prettier runs
automatically on edited `src/**` files (PostToolUse hook); do not run it yourself.

When an action is blocked: stop and surface it. Do not look for an alternative route around
the block, and do not redesign the change to avoid it silently — report what you needed to do
and why.

## Verification

`package.json` scripts are the source of truth: `bun run dev` (run from source), `bun run
build` / `bun run compile` (binary). After changing source, verify with `bunx tsc --noEmit`
(types) and `bunx prettier --check src/` (formatting).

## Project rules

- `principles.md` — general principles for any work: clarify before acting, change strategy, KISS/simple-first, self-documenting code style (always loaded).
- `workflow.md` — two human checkpoints (plan approval, final diff review) and an independent review (always loaded).
- `architecture.md` — structure (commands/entities/shared), entity API, exports (scoped to `src/**`).
- `conventions.md` — file naming and CLI command/option style (scoped to `src/**`).
- `agent-facing-upkeep.md` — keeping `instructions` content and the `status` checklist in sync (scoped to `src/commands/**`).
- `skills.md` — verification for skill changes via an independent `prompt-engineer` review, in place of the code validators (scoped to `skills/**`).
