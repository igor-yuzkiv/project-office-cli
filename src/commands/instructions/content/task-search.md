# `task:search`

Searches tasks in the current Project Office project by free text. This iteration supports
only `--query` — structured filters are not exposed yet.

## Call

```
project-office task:search --query "login bug"
project-office task:search -q "login bug" --format json
project-office task:search -q "login bug" --page 1 --per-page 10 --include tags
```

## Options

- `-q, --query <query>` — the search text.
- `-f, --format <json|markdown>` — optional, default `markdown`.
- `--page <page>`, `--per-page <perPage>` — optional pagination; backend caps `per_page` at
  100 for this endpoint.
- `--sort-by <field>`, `--sort-order <asc|desc>` — optional; backend default is
  `updated_at`/`desc`.
- `--include <fields>` — optional, comma-separated: `project`, `taskList`, `createdBy`,
  `updatedBy`, `tags`.

## Output

Same shape as `task:list`: `markdown` (default) is one `{key} {name}` line per task plus
pagination meta (`total, page, per_page`) as frontmatter; `json` is the raw paginated
response.
