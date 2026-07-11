# Project Office CLI

Agent-facing CLI for the Project Office backend. It is the controlled interface AI
agents use to read and update project tasks through the backend API.

- The web application is the **human** interface.
- `project-office-cli` is the **agent** interface.
- Every command talks to the backend through the CLI HTTP client.
- Project context is resolved automatically from a per-repository link.
- Output is available as agent-readable `markdown` or parseable `json`.

The CLI is written in TypeScript for [Bun](https://bun.sh) and can be compiled to a
standalone binary named `project-office`.

## Requirements

- Bun
- A running Project Office backend
- A backend API token for the user that will run the CLI

## Installation

Install dependencies:

```bash
bun install
```

Run the CLI from source while developing:

```bash
bun run dev --help
```

Build a Bun-targeted output file:

```bash
bun run build
```

Compile a standalone executable:

```bash
bun run compile
./dist/project-office --help
```

## Quick Start

Configure local settings:

```bash
project-office install
```

Link the current repository to a Project Office project:

```bash
project-office project:link-repo --project 01kexample --name "my-repo"
```

Check readiness:

```bash
project-office status
```

Create and read tasks:

```bash
project-office task:list
project-office task:create --name "Fix login bug" --tags "bug,backend"
project-office task:view --task TASK-123
```

Drive a task through its workflow — the agent's intents; the status transitions live on the
backend:

```bash
project-office task:start --task TASK-123 --comment "Plan: endpoints, then tests."
project-office task:checkpoint --task TASK-123 --subject "Milestone reached" --comment "Details..."
project-office task:handoff --task TASK-123 --resolution "Implemented and verified."
```

Create and read project documentation:

```bash
project-office doc:create --title "Architecture notes" --tags "architecture"
project-office doc:view --doc DOC-MTM-1
```

When running from source, replace `project-office` with:

```bash
bun run dev
```

## Configuration

`project-office install` stores per-user settings outside the repository:

```txt
~/.project-office-cache/settings.json
```

The settings file contains the backend URL and API token, is written with `0600`
permissions, and must not be committed.

Repository links are stored in:

```txt
<repo>/.project-office/repo-settings.json
```

Create or update that file only through `project-office project:link-repo`.

## Project Context

Most commands operate inside one resolved Project Office project. Agents do not pass
`--project` for normal task work. Instead, the CLI walks up from the current directory
until it finds:

```txt
<repo>/.project-office/repo-settings.json
```

The marker contains the project id used for API requests. It is written only by:

```bash
project-office project:link-repo --project 01kexample --name "my-repo"
```

The CLI can also keep an optional local project cache under:

```txt
~/.project-office-cache/projects/<projectId>.json
```

The cache stores a project snapshot plus the local repositories linked to it. See
[Project Office context](./docs/project-office-context.md) for the technical model.

## Commands

| Command | Purpose |
| --- | --- |
| `install` | Configure local CLI settings. |
| `status` | Run a readiness checklist. |
| `project:connect` | Fetch and cache a project locally. |
| `project:link-repo` | Link the current repository to a project. |
| `project:view` | Show the resolved project context. |
| `task:list` | List open tasks in the current project. |
| `task:view` | Show one task. |
| `task:create` | Create a task. |
| `task:update` | Update a task. |
| `task:start` | Claim a task (→ `in_progress`) and return its context with recent comments. |
| `task:checkpoint` | Record a milestone as a structured comment (no status change). |
| `task:handoff` | Hand a task off for testing (→ `ready_to_test`) with a resolution. |
| `task:comments` | List task comments. |
| `task:comment-add` | Add a task comment. |
| `task:comment-update` | Update a task comment. |
| `doc:view` | Show one project document. |
| `doc:create` | Create a root project document. |
| `doc:update` | Update a project document. |
| `instructions` | Print bundled agent-facing command instructions. |

Most data-returning commands support:

```bash
--format markdown
--format json
```

`markdown` is the default. Use `json` when another tool needs to parse the response.

## Documentation

Detailed documentation lives under [`docs/`](./docs):

- [Configuration](./docs/configuration.md) - the per-user settings file.
- [Project Office context](./docs/project-office-context.md) - how the CLI resolves its
  project scope and the local project cache.
- [Output rendering](./docs/output-rendering.md) - the shared `json`/`markdown`
  renderers every command uses.
- [HTTP client](./docs/http-client.md) - backend requests and error/exit-code mapping.
- [Command reference](./docs/commands) - one file per command, grouped under
  [`project/`](./docs/commands/project) and [`task/`](./docs/commands/task), plus
  top-level `install`, `instructions`, and `status`.

Agent-facing instructions are served by the CLI itself via `project-office instructions`
and live in [`src/commands/instructions/content/`](./src/commands/instructions/content).
Keep the human documentation and bundled agent instructions aligned when command behavior
changes.

## Development

```bash
bun run lint
bun run build
bun run compile
```

The project intentionally keeps command behavior explicit: each command owns its options,
API call, and output selection. Shared infrastructure lives under `src/shared/`.

## Core Principles

- Agents work inside one explicit, pre-resolved project scope. There is no `--project`
  option except on the bootstrap commands (`project:connect`, `project:link-repo`).
- Agents do not access backend internals or the database directly; task work goes through
  this CLI.
- Human-facing UI and agent-facing commands stay separate.
- Keep the implementation simple until the workflow demands more structure.
