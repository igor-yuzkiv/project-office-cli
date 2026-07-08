# `task:comment-add`

Adds a comment to a task.

## Usage

```bash
project-office task:comment-add --task TASK-1 --content "Looks good to me."
project-office task:comment-add -t TASK-1 --content @/tmp/comment.md
echo "Reviewed and approved." | project-office task:comment-add -t TASK-1 --content -
```

## Options

| Option                  | Default      | Purpose                                                                |
| ----------------------- | ------------ | ---------------------------------------------------------------------- |
| `-t, --task <task>`     | — (required) | Task ULID or key.                                                      |
| `--content <content>`   | — (required) | Inline text, `@<path>` to read from a file, or `-` to read from stdin. |
| `-f, --format <format>` | `markdown`   | `json` or `markdown`. See [Output rendering](../../output-rendering.md).  |

The command sends a single comment wrapped as `{ comments: [{ content }] }` — the backend
endpoint accepts a batch (doc-0004 §4.8), but this command only ever submits one.

## Output

- **`markdown`** (default) — one `- **{author}** ({created_at}): {content}` line for the
  created comment, with a `count` frontmatter property (`renderCreatedTaskCommentsAsMarkdown`).
- **`json`** — the raw API response (`data` is an array, even though only one comment was
  sent).

## Errors

Missing `--task` or `--content` fails immediately with a non-zero exit — no request is made.
