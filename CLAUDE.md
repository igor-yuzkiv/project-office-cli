# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`project-office-cli` is an **agent-facing** CLI that is intended to become the controlled interface between AI agents and the Project Office / MVP Task Manager web application. The web app stays the human interface; this CLI is the agent interface. Agents are meant to work inside an explicit project scope and reach the application only through its API — never through direct database, filesystem, or internal-structure access.

This is an early local MVP: `src/index.ts` currently does nothing more than a single test request against the backend. Treat the README's "Direction" section (scoped context building, controlled read commands, submitting notes/proposals/feedback) as the roadmap, not as implemented behavior. Keep the implementation simple until the actual workflow is clear.

Non-negotiables when building: agents reach Task Manager only through this CLI (never direct DB/API/internal access); work stays inside one project scope; the CLI renders, the backend stays pure JSON.

## Commands

```sh
bun run dev        # run the CLI from source (bun run src/index.ts)
bun run build      # bundle to dist/project-office (bun target)
bun run compile    # produce a standalone compiled binary
bunx prettier --write .   # format
bun test           # run tests (no tests exist yet)
```

There is no lint step and no test suite yet. `src/index.ts` is the single entry point (declared as `module` in package.json).

## Conventions

- **CLI framework:** `commander` (v15) is a dependency and is the intended tool for defining commands/subcommands as the CLI grows.
- **HTTP:** `axios` is used for talking to the backend API. Prefer it for outbound requests to the application layer.
- **Formatting (`.prettierrc`):** no semicolons, single quotes, 4-space indent, 120 print width, es5 trailing commas. Run prettier before committing.

## Bun runtime

Default to Bun instead of Node.js. `tsconfig.json` is configured for Bun bundler mode with strict settings (`noUncheckedIndexedAccess`, `noFallthroughCasesInSwitch`, etc.) and `noEmit` — Bun runs/bundles TypeScript directly, so there is no separate `tsc` build.

- `bun <file>` instead of `node`/`ts-node`; `bun test` instead of jest/vitest; `bun install`; `bun run <script>`; `bunx` instead of `npx`.
- Bun auto-loads `.env` — do not add `dotenv`.
- Prefer Bun built-ins when adding functionality: `Bun.serve()` (not express), `bun:sqlite` (not better-sqlite3), `Bun.redis`, `Bun.sql` (Postgres), built-in `WebSocket` (not `ws`), `Bun.file` (over `node:fs`), `Bun.$` (over execa).
- Bun API docs are available locally under `node_modules/bun-types/docs/**.mdx`.
