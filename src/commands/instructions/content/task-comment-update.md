# `task:comment-update`

Updates an existing comment on a task.

## Call

```
project-office task:comment-update --task TASK-1 --comment 42 --content "Revised wording."
project-office task:comment-update -t TASK-1 --comment 42 --content @/tmp/comment.md
```

## Options

- `-t, --task <task>` — **required**. The task's ULID or human key.
- `--comment <comment>` — **required**. Numeric comment id, scoped to `--task`.
- `--content <content>` — **required**. Inline text, `@<path>` to read from a file, or `-`
  to read from stdin.
- `-f, --format <json|markdown>` — optional, default `markdown`.

## Output

- `markdown` (default): the updated comment's content as body text, with `id, author,
created_at, updated_at` as frontmatter properties.
- `json`: the raw API response object.

## Errors

Missing `--task`/`--comment`/`--content`, or a non-numeric `--comment`, fails immediately
with a non-zero exit — no request is made. A comment id that doesn't belong to `--task`
surfaces as a backend error.
