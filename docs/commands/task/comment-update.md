# `task:comment-update`

Updates an existing comment on a task.

## Usage

```bash
project-office task:comment-update --task TASK-1 --comment 42 --content "Revised wording."
project-office task:comment-update -t TASK-1 --comment 42 --content @/tmp/comment.md
```

## Options

| Option                  | Default      | Purpose                                                                |
| ----------------------- | ------------ | ---------------------------------------------------------------------- |
| `-t, --task <task>`     | — (required) | Task ULID or key.                                                      |
| `--comment <comment>`   | — (required) | Numeric comment id, scoped to `--task`. Must match `/^\d+$/`.          |
| `--content <content>`   | — (required) | Inline text, `@<path>` to read from a file, or `-` to read from stdin. |
| `-f, --format <format>` | `markdown`   | `json` or `markdown`. See [Output rendering](../../output-rendering.md).  |

## Output

- **`markdown`** (default) — the updated comment's content as body text, with `id, author,
created_at, updated_at` as frontmatter properties (`renderTaskCommentAsMarkdown`).
- **`json`** — the raw API response object.

## Errors

Missing `--task`/`--comment`/`--content`, or a non-numeric `--comment`, fails immediately
with a non-zero exit — no request is made. A comment id that doesn't belong to `--task`
surfaces as a backend error.
