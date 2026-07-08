# `task:create`

Creates a task in the current Project Office project.

## Call

```
project-office task:create --name "Fix login bug"
project-office task:create --name "Fix login bug" --description "Steps to reproduce..."
project-office task:create --name "Fix login bug" --description @/tmp/description.md
project-office task:create --name "Fix login bug" --tags "bug,backend,urgent"
```

## Options

- `--name <name>` — **required**. Task name.
- `--description <description>` — optional. Inline text, `@<path>` to read from a file, or
  `-` (also accepted: `@-`) to read from stdin.
- `--tags <tags>` — optional. Comma-separated tag names (e.g. `"bug,backend,urgent"`). No
  tag ids needed — the backend finds or creates each tag by name.
- `-f, --format <json|markdown>` — optional, default `markdown`.

## Output

- `markdown` (default): same shape as `task:view` — frontmatter with `key, status, priority,
project, task_list, start_date, due_date, tags, created_at, updated_at`, then `# {name}`
  followed by the description. The create response may omit `project`/`task_list`/`tags` —
  those render as `null`/`[]` when absent. `priority`, `task_list`, `start_date`, and
  `due_date` are always backend defaults (`none`/`null`) — this command has no way to set
  them.
- `json`: the raw API response object.

## Errors

Validation (tag names, etc.) happens on the backend and surfaces as a backend error.
