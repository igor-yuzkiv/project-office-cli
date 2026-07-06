# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

> This project uses a project office — for its tasks and documentation see .project-office/AGENTS.md.

## Language

Match the user's language. When the user writes in Ukrainian, respond in Ukrainian —
in chat, in summaries, and in any artifact assembled for the user's review (plans, task
proposals, review-gate documents). Keep code, identifiers, file paths, CLI commands, and
technical terms in their original form; translate the prose around them, not the tokens.

## What this is

`project-office-cli` is an **agent-facing CLI**: the controlled interface between AI
agents and the Project Office / MVP Task Manager web application.

- The web application is the **human** interface. This CLI is the **agent** interface.
- The CLI may call the backend API. Agents must reach Task Manager **only** through
  this CLI — never through direct database access, backend API calls, filesystem
  shortcuts, or web-app internals.
- This is an early local MVP. `src/index.ts` currently does little more than a single
  test request against the backend. Treat the README's "Direction" section (scoped
  context building, controlled read commands, submitting notes/proposals/feedback) as
  the roadmap, not as implemented behavior.

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

Rule files in `.claude/rules/` are **loaded automatically** by Claude Code — they are not
`@`-imported here (that would load them twice). For reference:

- `architecture.md` — structure, entities/commands/shared, entity API, exports (scoped to `src/**`).
- `conventions.md` — file naming, code style, CLI command/option style (scoped to `src/**`).
- `configuration.md` — global runtime configuration; no project-level magic values in code (scoped to env/config files and `src/**`).
- `development-workflow.md` — the task workflow and how to approach changes (always loaded).
- `review-gate.md` — review gate for assembled artifacts needing approval (always loaded).
