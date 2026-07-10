# Office CLI — how to reach the office

This file binds the office operations the skill speaks in (find / read / create / update /
comment) to the concrete `project-office` commands, and holds the access invariants. It does
**not** re-document each command's flags and output — read those from the CLI itself with
`project-office instructions <command>`.

## Access invariants

Canonical home: `SKILL.md`. Restated here because this file may be handed to a subagent on its
own.

- **Check readiness with `project-office status`, once per session** (again only after a command
  fails unexpectedly — each run probes the server). It never fails (exits 0), needs no marker,
  and prints an ordered preflight checklist ending in `Result: ready|failed`. Prefer it over
  probing files or catching errors.
- **Only the `project-office` CLI.** All Task Manager data is read and written **exclusively**
  through `project-office` — never a direct backend API call, database access, or filesystem
  shortcut. Those are not available to the agent and must not be attempted.
- **One resolved project, no `--project`.** Every task/comment command operates inside the single
  project the CLI resolves from its launch directory — it walks up to
  `<repo>/.project-office/repo-settings.json` and reads its `projectId`. Run commands **from
  inside the linked repo**; do not pass or assume a project id. The **only** commands taking an
  explicit `--project <id>` are the two bootstrap commands `project:connect` and
  `project:link-repo` (they establish the link — see the `setup` flow).
- **Never hand-write `repo-settings.json`.** It is written **exclusively** by `project:link-repo`
  (even to fix or re-point a link). Do not create or edit it directly.
- **Look up exact usage from the CLI, not from memory.** For any command's precise options,
  semantics and output shape, run `project-office instructions <command>` — prefer it over
  `--help` (which lists flags but not their meaning or the output shape). Overview:
  `project-office instructions`.
- **Output format.** Every read command takes `-f, --format <json|markdown>` (default
  `markdown`). Pass `--format json` only when you need to parse a field programmatically.
- **The binary.** The skill assumes `project-office` is on `PATH`. Its one-time per-user setup is
  `project-office install` — interactive, run by the user, not the agent (see the `setup` flow).

## Local artifacts

Locally there are only two files, both owned by the CLI:

- **`<repo>/.project-office/repo-settings.json`** — the marker linking **one repo** to **one
  `projectId`** (ownership — see the invariants above).
- **`~/.project-office-cache/projects/<projectId>.json`** — an optional local cache: the
  project's last-fetched snapshot plus every repo linked to it on this machine. Not required for
  commands; it is what `project:view` surfaces as the sibling repos.

## Operation → command

Run from inside the linked repo (no `--project`). Before using a command for the first time in a
session, read its instructions: `project-office instructions <command>`.

| Operation | Command |
| --- | --- |
| Preflight readiness | `project-office status` |
| View the project (+ current and linked repos) | `project-office project:view` |
| List tasks | `project-office task:list` |
| View one task | `project-office task:view --task TASK-1` |
| Read a task's comments | `project-office task:comments --task TASK-1` |
| Create a task | `project-office task:create --name "<title>" --description <text\|@file\|->` |
| Update a task (name/status/description/tags) | `project-office task:update --task TASK-1 …` |
| Add a comment (progress / decisions / artifacts) | `project-office task:comment-add --task TASK-1 --content <text\|@file\|->` |
| Update a comment | `project-office task:comment-update --task TASK-1 --comment <id> --content …` (comment ids come from `task:comments --format json`) |
| View a document (context source, when referenced) | `project-office doc:view --doc DOC-MTM-1` |
| Create a document (only when explicitly asked) | `project-office doc:create --title "<title>" --content <text\|@file\|->` |
| Update a document (only when explicitly asked) | `project-office doc:update --doc DOC-MTM-1 --content <text\|@file\|->` |
| Bootstrap: link this repo | `project:link-repo` (setup flow only; it fetches and caches the project itself — `project:connect` is rarely needed directly) |
| Per-user install (human, interactive) | `project-office install` |

## Multi-line / large input (`--description`, `--content`)

These options accept text three ways — prefer the file/stdin forms for anything multi-line,
since shell heredocs and the `$'…\n'` shorthand are unreliable in agent sandboxes:

1. **From a file:** compose the body in a scratch file, then pass it with `@`:
   ```bash
   project-office task:update --task TASK-1 --description @/tmp/TASK-1.md
   ```
2. **From stdin:** pass `-` (or `@-` — both are accepted) and pipe:
   ```bash
   cat /tmp/TASK-1.md | project-office task:update --task TASK-1 --description -
   ```
3. **Inline** for a short single line: `--description "One line."`
