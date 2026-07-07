# `task:create`

Creates a task in the current Project Office project.

## Call

```
project-office task:create --name "Fix login bug"
project-office task:create --name "Fix login bug" --description "Steps to reproduce..." --priority high
project-office task:create --name "Fix login bug" --description @/tmp/description.md
project-office task:create --name "Fix login bug" --tag tag_1 --tag tag_2
```

## Options

- `--name <name>` — **required**. Task name.
- `--description <description>` — optional. Inline text, `@<path>` to read from a file, or
  `-` to read from stdin.
- `--priority <priority>` — optional. One of `none`, `low`, `medium`, `high`, `urgent`
  (case-insensitive), mapped client-side to the backend's numeric priority. An unrecognized
  value fails immediately with a clear error — no request is made.
- `--start-date <date>`, `--due-date <date>` — optional, passed through as-is; the backend
  validates the format.
- `--task-list <taskListId>` — optional task list id.
- `--tag <tagId>` — optional, repeatable (one `--tag` per tag id); the backend validates
  that each tag exists.
- `-f, --format <json|markdown>` — optional, default `markdown`.

## Output

- `markdown` (default): same shape as `task:view` — frontmatter with `key, status, priority,
project, task_list, start_date, due_date, tags, created_at, updated_at`, then `# {name}`
  followed by the description. The create response may omit `project`/`task_list`/`tags` —
  those render as `null`/`[]` when absent.
- `json`: the raw API response object.

## Errors

An unrecognized `--priority` value fails client-side before any request. All other
validation (dates, tag existence) happens on the backend and surfaces as a backend error.
