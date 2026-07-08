# `task:update`

Updates a task in the current Project Office project.

## Usage

```bash
project-office task:update --task TASK-1 --status in_progress
project-office task:update -t TASK-1 --description "Updated details..."
project-office task:update -t TASK-1 --name "Renamed task"
project-office task:update -t TASK-1 --tags "bug,backend,urgent"
project-office task:update -t TASK-1 --tags ""
project-office task:update -t TASK-1 --status completed --description -
```

## Options

| Option                         | Default      | Purpose                                                                                                                    |
| ------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `-t, --task <task>`             | — (required) | Task ULID or key.                                                                                                          |
| `--name <name>`                 | —            | New task name.                                                                                                              |
| `--status <status>`             | —            | `open`, `in_progress`, `completed`, or `closed`.                                                                            |
| `--description <description>`   | —            | Inline text, `@<path>` to read from a file, or `-` to read from stdin.                                                     |
| `--tags <tags>`                 | —            | Comma-separated tag names — **replaces the task's entire tag set** (not additive). Pass `""` to remove all tags. No tag ids needed. |
| `-f, --format <format>`         | `markdown`   | `json` or `markdown`. See [Output rendering](../../output-rendering.md).                                                   |

At least one of `--name` / `--status` / `--description` / `--tags` is required — omitting
all of them fails immediately with a clear error and no request is made.

Task list, priority, start date, and due date cannot be changed through this command.

## Output

Same shape as [`task:view`](./view.md): `markdown` (default) renders the updated task
through `renderTaskAsMarkdown`; `json` returns the raw API response.

## Errors

Missing all of `--name`/`--status`/`--description`/`--tags` fails client-side. An invalid
task id/key surfaces as a backend error.
