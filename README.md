# Project Office CLI

Agent-facing CLI for the Project Office / MVP Task Manager application. It is the
**controlled interface AI agents use** to read and update tasks — never the database,
the backend API, or the web app's internals directly.

- The web application is the **human** interface.
- `project-office-cli` is the **agent** interface: every command talks to the backend
  through its own HTTP client, resolves the current project automatically from a
  per-repo link, and renders output in a form agents can parse (`json`) or read
  (`markdown`).
- It compiles to a standalone [Bun](https://bun.sh) binary agents can run directly.

## Quick start

```bash
bun install
bun run dev status                                              # check readiness — always exits 0
bun run dev install                                              # one-time per-user setup
bun run dev project:link-repo --project <id> --name "<repo>"    # link a repo to a project
```

See `package.json` for the full script list (`build`, `compile`, `lint`) and
[`CLAUDE.md`](./CLAUDE.md) for how changes here are verified.

## Documentation

Detailed, up-to-date docs live under [`docs/`](./docs):

- [Project overview (Ukrainian)](./docs/overview-uk.md) — plain-language walkthrough of
  what this is and how the pieces fit together.
- [Configuration](./docs/configuration.md) — the per-user settings file.
- [Project Office context](./docs/project-office-context.md) — how the CLI resolves its
  project scope and the local project cache.
- [Output rendering](./docs/output-rendering.md) — the shared `json`/`markdown`
  renderers every command uses.
- [HTTP client](./docs/http-client.md) — backend requests and error/exit-code mapping.
- [Command reference](./docs/commands) — one file per command, grouped under
  [`project/`](./docs/commands/project) and [`task/`](./docs/commands/task), plus
  top-level `install`, `instructions`, and `status`.

Agent-facing instructions (a separate, purpose-tuned source served by the CLI itself via
`project-office instructions`) live in
[`src/commands/instructions/content/`](./src/commands/instructions/content).

## Core principles

- Agents work inside one explicit, pre-resolved project scope — no `--project` option
  except on the two bootstrap commands (`project:connect`, `project:link-repo`).
- Agents never get direct filesystem or database access; everything goes through this
  CLI.
- Human-facing UI (the web app) and agent-facing commands (this CLI) stay separate.
- Keep the implementation simple and boring until the real workflow demands otherwise.
