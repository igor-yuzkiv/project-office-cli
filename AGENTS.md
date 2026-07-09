# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

> This project uses a project office — for its tasks and documentation see .project-office/AGENTS.md.

## Language

Match the user's language in chat, summaries, and any artifact assembled for review
(plans, task proposals, review-gate documents). Keep code, identifiers, file paths, CLI
commands, and technical terms in their original form; translate the prose around them,
not the tokens.

## What this is

`project-office-cli` is an **agent-facing CLI**: the controlled interface between AI
agents and the Project Office / MVP Task Manager web application.

- The web application is the **human** interface. This CLI is the **agent** interface.
- The CLI may call the backend API. Agents must reach Task Manager **only** through
  this CLI — never through direct database access, backend API calls, filesystem
  shortcuts, or web-app internals.
- This started as an early local MVP; the command set now covers task/project reads and
  writes, install/status/instructions. See the root [`README.md`](./README.md) for a
  current overview and links into `docs/`.

Keep the implementation simple until the actual workflow is clear.

## Non-negotiables

- Agents reach Task Manager **only** through this CLI. The CLI may call the backend;
  agents must not bypass it to reach the backend, database, filesystem, or internal
  application structure directly.
- Work stays inside one explicit project scope.
- The backend owns data and returns pure JSON. The CLI owns rendering useful, readable
  terminal output for agents.
- Build the controlled agent-facing interface, nothing more — do not turn this into a
  general automation framework or add speculative abstractions.

## Runtime and stack

- **Bun** runtime — the CLI is compiled into a standalone binary agents can execute.
- TypeScript, Commander, Axios, ESLint, Prettier.
- Prefer small, explicit implementation over large abstractions. Do not over-engineer
  contracts, layers, or architecture before the real workflow proves them necessary.

## Verification

`package.json` scripts are the source of truth for build/run:

- `bun run dev` — run the CLI from source.
- `bun run build` — bundle to `dist/project-office`.
- `bun run compile` — compile a standalone binary to `dist/project-office`.

After changing source, verify with:

- `bunx tsc --noEmit` — type-check.
- `bunx prettier --check src/` — formatting.

## Project rules

- `architecture.md` — structure, entities/commands/shared, entity API, exports (scoped to `src/**`).
- `conventions.md` — file naming, code style, CLI command/option style (scoped to `src/**`).
- `agent-facing-upkeep.md` — keeping agent-facing `instructions` content and the `status`
  checklist in sync when commands or their dependencies change (scoped to `src/commands/**`).
- `development-workflow.md` — the task workflow and how to approach changes (always loaded).
- `review-gate.md` — review gate for assembled artifacts needing approval (always loaded).
