# `task:update`

Updates a task in the current Project Office project.

## Call

```
project-office task:update --task TASK-1 --status in_progress
project-office task:update -t TASK-1 --description "Updated details..."
project-office task:update -t TASK-1 --name "Renamed task"
project-office task:update -t TASK-1 --tags "bug,backend,urgent"
project-office task:update -t TASK-1 --tags ""
project-office task:update -t TASK-1 --status completed --description -
```

## Options

- `-t, --task <task>` — **required**. The task's ULID or human key.
- `--name <name>` — optional. New task name.
- `--status <status>` — optional. One of `open`, `ready_for_development`, `in_progress`,
  `ready_to_test`, `completed`, `closed`.
- `--description <description>` — optional. Inline text, `@<path>` to read from a file, or
  `-` (also accepted: `@-`) to read from stdin.
- `--tags <tags>` — optional. Comma-separated tag names — **replaces the task's entire tag
  set** (not additive). No tag ids needed — the backend finds or creates each tag by name.
  Pass an empty string (`--tags ""`) to remove all tags from the task.
- `-f, --format <json|markdown>` — optional, default `markdown`.

At least one of `--name` / `--status` / `--description` / `--tags` is required — omitting
all of them fails immediately with a clear error and no request is made.

Task list, priority, start date, and due date cannot be changed through this command.

## Output

Same shape as `task:view`: `markdown` (default) renders the updated task through the same
frontmatter/content mapping; `json` returns the raw API response.

## Errors

Missing all of `--name`/`--status`/`--description`/`--tags` fails client-side. An invalid
task id/key surfaces as a backend error.
