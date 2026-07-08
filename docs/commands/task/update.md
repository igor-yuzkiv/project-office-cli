# `task:update`

Updates a task in the current Project Office project. The backend only accepts changes to
**status** and **description** (doc-0004 §4.6) — name, priority, dates, task list, and tags
cannot be changed through this command.

## Usage

```bash
project-office task:update --task TASK-1 --status in_progress
project-office task:update -t TASK-1 --description "Updated details..."
project-office task:update -t TASK-1 --status completed --description -
```

## Options

| Option                        | Default      | Purpose                                                                  |
| ----------------------------- | ------------ | ------------------------------------------------------------------------ |
| `-t, --task <task>`           | — (required) | Task ULID or key.                                                        |
| `--status <status>`           | —            | `open`, `in_progress`, `completed`, or `closed`.                         |
| `--description <description>` | —            | Inline text, `@<path>` to read from a file, or `-` to read from stdin.   |
| `-f, --format <format>`       | `markdown`   | `json` or `markdown`. See [Output rendering](../../output-rendering.md). |

At least one of `--status` / `--description` is required — omitting both fails immediately
with a clear error and no request is made.

## Output

Same shape as [`task:view`](./view.md): `markdown` (default) renders the updated task
through `renderTaskAsMarkdown`; `json` returns the raw API response.

## Errors

Missing both `--status` and `--description` fails client-side. An invalid task id/key
surfaces as a backend error.
