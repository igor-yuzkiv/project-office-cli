# `task:update`

Updates a task in the current Project Office project. The backend only accepts changes to
**status** and **description** — name, priority, dates, task list, and tags cannot be
changed through this command.

## Call

```
project-office task:update --task TASK-1 --status in_progress
project-office task:update -t TASK-1 --description "Updated details..."
project-office task:update -t TASK-1 --status completed --description -
```

## Options

- `-t, --task <task>` — **required**. The task's ULID or human key.
- `--status <status>` — optional. One of `open`, `in_progress`, `completed`, `closed`.
- `--description <description>` — optional. Inline text, `@<path>` to read from a file, or
  `-` to read from stdin.
- `-f, --format <json|markdown>` — optional, default `markdown`.

At least one of `--status` / `--description` is required — omitting both fails immediately
with a clear error and no request is made.

## Output

Same shape as `task:view`: `markdown` (default) renders the updated task through the same
frontmatter/content mapping; `json` returns the raw API response.

## Errors

Missing both `--status` and `--description` fails client-side. An invalid task id/key
surfaces as a backend error.
