# `task:comments`

Lists comments on a task.

## Call

```
project-office task:comments --task TASK-1
project-office task:comments -t TASK-1 --format json
project-office task:comments -t TASK-1 --page 1 --per-page 20
```

## Options

- `-t, --task <task>` — **required**. The task's ULID or human key (e.g. `TASK-1`).
- `-f, --format <json|markdown>` — optional, default `markdown`.
- `--page <page>`, `--per-page <perPage>` — optional pagination; backend caps `per_page` at
  100 for this endpoint.

There is no `--sort-by`, `--sort-order`, or `--include` for this command — the endpoint does
not support them.

## Output

- `markdown` (default): one `- **{author}** ({created_at}): {content}` line per comment as
  content; frontmatter properties are the pagination meta — `total, page, per_page`.
- `json`: the raw paginated API response.

## Errors

Omitting `--task` fails immediately with a non-zero exit and a "required option" message on
stderr — no request is made.
