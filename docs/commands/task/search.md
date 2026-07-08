# `task:search`

Searches tasks in the current Project Office project (`POST tasks/search`). This first
iteration supports only free-text `--query` — structured filters are a later addition.

## Usage

```bash
project-office task:search --query "login bug"
project-office task:search -q "login bug" --format json
project-office task:search -q "login bug" --page 1 --per-page 10 --include tags
```

## Options

| Option                  | Default                        | Purpose                                                                                         |
| ----------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------- |
| `-f, --format <format>` | `markdown`                     | `json` or `markdown`. See [Output rendering](../../output-rendering.md).                        |
| `-q, --query <query>`   | —                              | Free-text search query.                                                                         |
| `--page <page>`         | backend default                | Page number.                                                                                    |
| `--per-page <perPage>`  | backend default                | Items per page (backend caps `search` at 100).                                                  |
| `--sort-by <field>`     | `updated_at` (backend default) | Field to sort by.                                                                               |
| `--sort-order <order>`  | `desc` (backend default)       | `asc` or `desc`.                                                                                |
| `--include <fields>`    | —                              | Comma-separated `TaskInclude` values (`project`, `taskList`, `createdBy`, `updatedBy`, `tags`). |

Structured filters (`FilterPayloadItem[]`) are not exposed by this command yet; the request
is always sent with an empty `filters` array.

## Output

Same shape as [`task:list`](./list.md): `json` returns the raw paginated response;
`markdown` renders through `renderTaskListAsMarkdown` (`{key} {name}` list + pagination
meta).
