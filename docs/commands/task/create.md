# `task:create`

Creates a task in the current Project Office project.

## Usage

```bash
project-office task:create --name "Fix login bug"
project-office task:create --name "Fix login bug" --description "Steps to reproduce..."
project-office task:create --name "Fix login bug" --description @/tmp/description.md
project-office task:create --name "Fix login bug" --tags "bug,backend,urgent"
```

## Options

| Option                         | Default      | Purpose                                                                                                             |
| ------------------------------ | ------------ | --------------------------------------------------------------------------------------------------------------------- |
| `--name <name>`                | — (required) | Task name.                                                                                                          |
| `--description <description>`  | —            | Inline text, `@<path>` to read from a file, or `-` to read from stdin.                                             |
| `--tags <tags>`                | —            | Comma-separated tag names (e.g. `"bug,backend,urgent"`). No tag ids needed — the backend finds or creates each tag by name. |
| `-f, --format <format>`        | `markdown`   | `json` or `markdown`. See [Output rendering](../../output-rendering.md).                                           |

Priority, task list, start date, and due date cannot be set through this command — every
created task gets the backend's defaults (`priority: none`, `task_list: null`, no dates).

## Output

Same shape as [`task:view`](./view.md): `markdown` (default) renders through
`renderTaskAsMarkdown`; `json` returns the raw API response object. The create response may
omit `project`/`task_list`/`tags` — those render as `null`/`[]` when absent, since the
mapping treats them as optional.

## Errors

Validation (tag names, etc.) happens on the backend and surfaces as a backend error.
