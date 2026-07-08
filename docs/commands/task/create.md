# `task:create`

Creates a task in the current Project Office project.

## Usage

```bash
project-office task:create --name "Fix login bug"
project-office task:create --name "Fix login bug" --description "Steps to reproduce..." --priority high
project-office task:create --name "Fix login bug" --description @/tmp/description.md
project-office task:create --name "Fix login bug" --tag tag_1 --tag tag_2
```

## Options

| Option                                     | Default      | Purpose                                                                                                                                                                              |
| ------------------------------------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--name <name>`                            | — (required) | Task name.                                                                                                                                                                           |
| `--description <description>`              | —            | Inline text, `@<path>` to read from a file, or `-` to read from stdin.                                                                                                               |
| `--priority <priority>`                    | —            | `none`, `low`, `medium`, `high`, or `urgent` (case-insensitive) — mapped client-side to the backend's numeric priority. An unrecognized value fails immediately, before any request. |
| `--start-date <date>`, `--due-date <date>` | —            | Passed through as-is; the backend validates the format.                                                                                                                              |
| `--task-list <taskListId>`                 | —            | Task list id.                                                                                                                                                                        |
| `--tag <tagId>`                            | `[]`         | Repeatable — one `--tag` per tag id; the backend validates that each tag exists.                                                                                                     |
| `-f, --format <format>`                    | `markdown`   | `json` or `markdown`. See [Output rendering](../../output-rendering.md).                                                                                                             |

## Output

Same shape as [`task:view`](./view.md): `markdown` (default) renders through
`renderTaskAsMarkdown`; `json` returns the raw API response object. The create response may
omit `project`/`task_list`/`tags` — those render as `null`/`[]` when absent, since the
mapping treats them as optional.

## Errors

An unrecognized `--priority` value fails client-side before any request. All other
validation (dates, tag existence) happens on the backend and surfaces as a backend error.
