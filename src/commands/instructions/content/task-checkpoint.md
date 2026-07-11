# `task:checkpoint`

Records an intermediate checkpoint on a task while work is in progress — a decision made, a
finding, a partial result. **Does not change the task's status.**

## Call

```
project-office task:checkpoint --task TASK-1 --subject "Investigated the bug" --comment "Root cause found in the parser."
project-office task:checkpoint -t TASK-1 --subject "Draft ready" --comment @/tmp/checkpoint.md
echo "Details..." | project-office task:checkpoint -t TASK-1 --subject "Progress" --comment -
```

## Options

- `-t, --task <task>` — **required**. The task's ULID or human key.
- `--subject <subject>` — **required**. Short label for the checkpoint.
- `--comment <comment>` — **required**. Inline text, `@<path>` to read from a file, or `-`
  (also accepted: `@-`) to read from stdin.
- `-f, --format <json|markdown>` — optional, default `markdown`.

The backend stores this as a regular comment whose content starts with the marker
`[Checkpoint] {subject}`, followed by the comment body.

## Output

- `markdown` (default): the created comment's content and properties (id, author, timestamps).
- `json`: the raw API response (`data` is the created comment).

## Errors

Missing `--task`, `--subject`, or `--comment` fails client-side with a non-zero exit — no
request is made. An invalid task id/key surfaces as a backend error.
