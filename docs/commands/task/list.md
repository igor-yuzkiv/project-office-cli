# `task:list`

Lists tasks in the current Project Office project (`GET tasks/list`), no query text or
filtering — this is the only way to fetch tasks. Tasks with status `closed` are excluded
from the response (backend-side); they still exist, just not through this endpoint — use
[`task:view`](./view.md) with a known key/id to fetch one.

## Usage

```bash
project-office task:list
project-office task:list --format json
project-office task:list --page 2 --per-page 20
project-office task:list --sort-by due_date --sort-order asc
project-office task:list --include project,tags
```

## Options

| Option                  | Default                        | Purpose                                                                                         |
| ----------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------- |
| `-f, --format <format>` | `markdown`                     | `json` or `markdown`. See [Output rendering](../../output-rendering.md).                        |
| `--page <page>`         | backend default                | Page number.                                                                                    |
| `--per-page <perPage>`  | backend default                | Items per page (backend enforces no upper bound for `list`).                                    |
| `--sort-by <field>`     | `updated_at` (backend default) | Field to sort by.                                                                               |
| `--sort-order <order>`  | `desc` (backend default)       | `asc` or `desc`.                                                                                |
| `--include <fields>`    | —                              | Comma-separated `TaskInclude` values (`project`, `taskList`, `createdBy`, `updatedBy`, `tags`). |

## Output

- **`json`** — the raw paginated `fetchTasksRequest` response (`renderJson`).
- **`markdown`** — `renderTaskListAsMarkdown`: a `{key} {name}` list (one task per line) as
  content; pagination meta (`total`, `page`, `per_page`) as frontmatter properties.
