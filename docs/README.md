# Documentation

Human-facing documentation for `project-office-cli`. Agent-facing instructions (a separate,
purpose-tuned source served by the CLI itself) live in
[`src/commands/instructions/content/`](../src/commands/instructions/content/) — see
[Instructions](./commands/instructions.md).

## Getting started

- [Configuration](./configuration.md) — environment variables (`.env`) vs. per-user CLI
  settings (`settings.json`); what each controls and where it lives.
- [`install`](./commands/install.md) — one-time local setup; run this first.
- [Project Office context](./project-office-context.md) — how the CLI resolves which
  project it's operating in, and the local project cache; run
  [`project:link-repo`](./commands/project-link-repo.md) after `install` to connect a repo.

## Commands

Read-only:

- [`project:view`](./commands/project-view.md)
- [`task:list`](./commands/task-list.md)
- [`task:search`](./commands/task-search.md)
- [`task:view`](./commands/task-view.md)
- [`task:comments`](./commands/task-comments.md)

Write:

- [`task:create`](./commands/task-create.md)
- [`task:update`](./commands/task-update.md)
- [`task:comment-add`](./commands/task-comment-add.md)
- [`task:comment-update`](./commands/task-comment-update.md)

Project Office context bootstrap:

- [`project:connect`](./commands/project-connect.md)
- [`project:link-repo`](./commands/project-link-repo.md)

Setup and self-documentation:

- [`install`](./commands/install.md)
- [`instructions`](./commands/instructions.md)

## Architecture and shared infrastructure

- [Output rendering](./output-rendering.md) — the shared `json`/`markdown` renderers every
  command uses, and how each entity's markdown mapping is built.
- [HTTP client](./http-client.md) — the shared `httpClient` every backend request goes
  through, and how failures map to `HttpError` / exit codes.
- [Project Office context](./project-office-context.md) — project scope resolution and the
  local project cache (also linked above, under Getting started).
