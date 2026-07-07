# `task:view`

Fetches a single task by ULID or key and prints it.

## Call

```
project-office task:view --task TASK-1
project-office task:view -t TASK-1 --format json
```

## Options

- `-t, --task <task>` — **required**. The task's ULID or human key (e.g. `TASK-1`).
- `-f, --format <json|markdown>` — optional, default `markdown`.

## Output

- `markdown` (default): frontmatter with `key, status, priority, project, task_list,
start_date, due_date, tags, created_at, updated_at`, then `# {name}` followed by the
  description as body text.
- `json`: the raw API response object.

## Errors

Omitting `--task` fails immediately with a non-zero exit and a "required option" message on
stderr — no request is made. An unknown ULID/key surfaces as a backend error.
