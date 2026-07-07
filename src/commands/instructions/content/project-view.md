# `project:view`

Fetches the current Project Office project and prints it. The project is always the one
resolved from the launch directory — there is no `--project` option.

## Call

```
project-office project:view
project-office project:view --format json
project-office project:view --include tags,createdBy
```

## Options

- `-f, --format <json|markdown>` — optional, default `markdown`.
- `--include <fields>` — optional, comma-separated: `createdBy`, `updatedBy`, `archivedBy`,
  `tags`. Embeds the named relations in the response; omit a relation and its data is not
  returned.

## Output

- `markdown` (default): frontmatter with `prefix, status, start_date, end_date, tags,
created_at, updated_at`, then `# {name}` followed by the description as body text.
- `json`: the raw API response object.

## Errors

An unresolved Project Office context (no `.project-office/settings.json` found from the
launch directory) throws before the request is made — run this from inside a registered
repository or the office itself.
