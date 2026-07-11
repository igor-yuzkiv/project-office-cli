# `task:start`

Marks that you have started work on a task. Sets its status to `in_progress` and prints the
task's context together with its most recent comments, so you don't need a separate
`task:view` + `task:comments` call to pick up a task.

## Call

```
project-office task:start --task TASK-1
project-office task:start -t TASK-1 --comment "Picking this up now."
project-office task:start -t TASK-1 --comment @/tmp/start-note.md
project-office task:start -t TASK-1 --format json
```

## Options

- `-t, --task <task>` — **required**. The task's ULID or human key.
- `--comment <comment>` — optional. Inline text, `@<path>` to read from a file, or `-` (also
  accepted: `@-`) to read from stdin. When given, records a comment whose body is a `# Start`
  heading followed by {comment}, at the same time as the status change; when omitted, no comment
  is created.
- `-f, --format <json|markdown>` — optional, default `markdown`.

Idempotent: calling it again on a task that is already `in_progress` is safe — the status is
not changed a second time and no error is raised.

## Output

- `markdown` (default): the task's frontmatter/content (same shape as `task:view`), followed
  by a `## Recent comments` section listing the latest comments.
- `json`: the raw API response, `{ task, comments }` (when `--comment` was given, the newly
  created comment is the first/newest entry in `comments`).

## Errors

An invalid task id/key surfaces as a backend error.
