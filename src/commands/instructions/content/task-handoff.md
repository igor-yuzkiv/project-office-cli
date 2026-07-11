# `task:handoff`

Hands a task off for testing once the work is implemented and verified: sets its status to
`ready_to_test` and records a resolution comment, atomically.

## Call

```
project-office task:handoff --task TASK-1 --resolution "Implemented and covered with tests."
project-office task:handoff -t TASK-1 --resolution @/tmp/resolution.md
echo "Implemented X, verified with Y." | project-office task:handoff -t TASK-1 --resolution -
```

## Options

- `-t, --task <task>` — **required**. The task's ULID or human key.
- `--resolution <resolution>` — **required**. Inline text, `@<path>` to read from a file, or
  `-` (also accepted: `@-`) to read from stdin.
- `-f, --format <json|markdown>` — optional, default `markdown`.

The backend stores the resolution as a comment whose body is a `# Handoff` heading followed by
{resolution}, and moves the task's status to `ready_to_test` in the same operation — if the
comment fails to create, the status is not changed either.

## Output

- `markdown` (default): the updated task's frontmatter/content (same shape as `task:view`),
  with `status: ready_to_test`.
- `json`: the raw API response (`data` is the updated task).

## Errors

Missing `--task` or `--resolution` fails client-side with a non-zero exit — no request is
made. An invalid task id/key surfaces as a backend error.
