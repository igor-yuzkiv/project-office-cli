# Office CLI — how to reach the office

Binds the operations the skill speaks in to concrete `project-office` commands, and holds the
access invariants. It does **not** re-document each command's flags and output — read those from
the CLI itself with `project-office instructions <command>`.

**Which command to run when** (the project's workflow) is defined in
`<repo>/.project-office/AGENTS.md`, not here. This file only says what each command *is*.

## Access invariants

Canonical home: `SKILL.md`. Restated here because this file may be handed to a subagent on its
own.

- **The `project-office` CLI is the only way to reach the office.** Run it from inside the linked
  repo — nothing else is available to the agent.
- **Check readiness with `project-office status`, once per session** (again only after a command
  fails unexpectedly — each run probes the server). It never fails (exits 0), needs no marker, and
  prints an ordered preflight checklist ending in `Result: ready|failed`. Prefer it over probing
  files or catching errors.
- **One resolved project, no `--project`.** Every task/comment/doc command operates inside the
  single project the repo is linked to — do not pass or assume a project id. The only command
  taking an explicit `--project <id>` is `project:link-repo`, which establishes the link (setup
  flow).
- **Never hand-write `repo-settings.json`.** It is written exclusively by `project:link-repo`
  (even to fix or re-point a link). Do not create or edit it directly.
- **Look up exact usage from the CLI, not from memory.** For a command's precise options,
  semantics and output shape, run `project-office instructions <command>` — prefer it over
  `--help`, which lists flags but not their meaning or the output shape. Overview:
  `project-office instructions`.
- **Output format.** Every read command takes `-f, --format <json|markdown>` (default
  `markdown`). Pass `--format json` only when you need to parse a field programmatically.
- **The binary.** `project-office` is assumed on `PATH`. Its one-time per-user setup is
  `project-office install` — interactive, run by the user, not the agent (see the `setup` flow).

## Local artifacts

Two files, both owned by the CLI:

- **`<repo>/.project-office/repo-settings.json`** — the marker linking one repo to one project
  (ownership — see the invariants above).
- **`~/.project-office-cache/projects/<projectId>.json`** — an optional local cache: the project's
  last-fetched snapshot plus every repo linked to it on this machine. Not required for commands;
  it is what `project:view` surfaces as the sibling repos.

## Operation → command

Run from inside the linked repo. Read a command's instructions before its first use in a session.
`TASK-1` / `DOC-MTM-1` below are placeholder keys — real keys are `PREFIX-<number>`.

| Operation | Command |
| --- | --- |
| Preflight readiness | `project-office status` |
| View the project (+ current and linked repos) | `project-office project:view` |
| List tasks | `project-office task:list` |
| View one task (inspect without starting work) | `project-office task:view --task TASK-1` |
| Read a task's comments | `project-office task:comments --task TASK-1` |
| Create a task | `project-office task:create --name "<title>" --description <text\|@file\|->` |
| Update a task's own fields (name / description / tags) | `project-office task:update --task TASK-1 …` |
| Start work on a task (→ `in_progress`, returns full context) | `project-office task:start --task TASK-1 [--comment <text\|@file\|->]` |
| Checkpoint a milestone (structured comment, no status change) | `project-office task:checkpoint --task TASK-1 --subject "<milestone>" --comment <text\|@file\|->` |
| Hand off for testing (→ `ready_to_test` + resolution) | `project-office task:handoff --task TASK-1 --resolution <text\|@file\|->` |
| Add an ad-hoc comment (note not worth a checkpoint) | `project-office task:comment-add --task TASK-1 --content <text\|@file\|->` |
| Update a comment | `project-office task:comment-update --task TASK-1 --comment <id> --content …` (ids come from `task:comments --format json`) |
| View a document (context source, when referenced) | `project-office doc:view --doc DOC-MTM-1` |
| Create a document (only when explicitly asked) | `project-office doc:create --title "<title>" --content <text\|@file\|->` |
| Update a document (only when explicitly asked) | `project-office doc:update --doc DOC-MTM-1 --content <text\|@file\|->` |
| Bootstrap: link this repo | `project-office project:link-repo` (setup flow; it fetches and caches the project itself — `project:connect` is rarely needed directly) |
| Per-user install (human, interactive) | `project-office install` |

Task status moves as a side effect of `task:start` and `task:handoff`, which record context along
with it. `task:update --status` exists but bypasses that record — use it only when the user
explicitly directs a status change that the workflow commands don't cover.

## Multi-line / large input (`--description`, `--content`, `--resolution`)

Prefer the file/stdin forms for anything multi-line — shell heredocs and the `$'…\n'` shorthand
are unreliable in agent sandboxes:

1. **From a file:**
```bash
   project-office task:update --task TASK-1 --description @/tmp/TASK-1.md
```
2. **From stdin** (`-` or `@-`):
```bash
   cat /tmp/TASK-1.md | project-office task:update --task TASK-1 --description -
```
3. **Inline** for a short single line: `--description "One line."`
