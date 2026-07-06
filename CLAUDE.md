# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

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

## Project rules

Load and follow these rules:

- @.claude/rules/architecture.md — project structure, entities/commands/shared, entity
  API organization, exports.
- @.claude/rules/conventions.md — code style and CLI command/option style.
- @.claude/rules/development.md — how to approach changes (clarify, minimal changes,
  incremental implementation).
- @.claude/rules/configuration.md — global runtime configuration (env file, typing).
- @.claude/rules/review-gate.md — review gate for assembled artifacts needing approval.
