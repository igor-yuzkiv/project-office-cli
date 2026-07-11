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

## Verification

`package.json` scripts are the source of truth: `bun run dev` (run from source), `bun run
build` / `bun run compile` (binary). After changing source, verify with `bunx tsc --noEmit`
(types) and `bunx prettier --check src/` (formatting).

## Project rules

- `principles.md` — general principles for any work: clarify before acting, change strategy, git safety (always loaded).
- `code-conventions.md` — KISS/simple-first, self-documenting code style, abstraction discipline (always loaded).
- `workflow.md` — task workflow phases with human-in-the-loop gates (always loaded).
- `communication.md` — language and answer style (always loaded).
- `architecture.md` — structure (commands/entities/shared), entity API, exports (scoped to `src/**`).
- `review-gate.md` — review gate for assembled artifacts needing approval (always loaded).
- `conventions.md` — file naming and CLI command/option style (scoped to `src/**`).
- `agent-facing-upkeep.md` — keeping `instructions` content and the `status` checklist in sync (scoped to `src/commands/**`).
- `skills.md` — verification for skill changes via an independent `prompt-engineer` review, in place of the code validators (scoped to `skills/**`).
