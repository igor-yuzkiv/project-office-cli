# `task:comment-add`

Adds a comment to a task.

## Call

```
project-office task:comment-add --task TASK-1 --content "Looks good to me."
project-office task:comment-add -t TASK-1 --content @/tmp/comment.md
echo "Reviewed and approved." | project-office task:comment-add -t TASK-1 --content -
```

## Options

- `-t, --task <task>` — **required**. The task's ULID or human key.
- `--content <content>` — **required**. Inline text, `@<path>` to read from a file, or `-`
  (also accepted: `@-`) to read from stdin.
- `-f, --format <json|markdown>` — optional, default `markdown`.

The command sends a single comment wrapped as `{ comments: [{ content }] }` — the backend
endpoint accepts a batch, but this command only ever submits one.

## Output

- `markdown` (default): one `- **{author}** ({created_at}): {content}` line for the created
  comment, with a `count` frontmatter property.
- `json`: the raw API response (`data` is an array, even though only one comment was sent).

## Errors

Missing `--task` or `--content` fails immediately with a non-zero exit — no request is made.
