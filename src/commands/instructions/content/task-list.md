# `task:list`

Lists tasks in the current Project Office project. No query text or filtering — this is
the only way to fetch tasks. Tasks with status `closed` are never returned — they still
exist, just not through this command; use `task:view` with a known key/id to fetch one.

## Call

```
project-office task:list
project-office task:list --format json
project-office task:list --page 2 --per-page 20
project-office task:list --sort-by due_date --sort-order asc
project-office task:list --include project,tags
```

## Options

- `-f, --format <json|markdown>` — optional, default `markdown`.
- `--page <page>`, `--per-page <perPage>` — optional pagination; backend applies its own
  defaults when omitted.
- `--sort-by <field>`, `--sort-order <asc|desc>` — optional; backend default is
  `updated_at`/`desc`.
- `--include <fields>` — optional, comma-separated: `project`, `taskList`, `createdBy`,
  `updatedBy`, `tags`.

## Output

- `markdown` (default): one `{key} {name}` line per task as content; frontmatter properties
  are the pagination meta — `total, page, per_page`.
- `json`: the raw paginated API response, including `data`, `links`, and full `meta`.
