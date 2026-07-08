# `project:connect`

Fetches a project by id and creates or updates its local cache file
(`~/.project-office-cache/projects/<id>.json`). This is a bootstrap command — you should not
normally need to run it directly (see `project:link-repo`, which calls the same fetch when
needed). It never touches `<repo>/.project-office/repo-settings.json`.

## Call

```
project-office project:connect --project 01k...
project-office project:connect --project 01k... --format json
```

## Options

- `--project <id>` — **required**. Project id to fetch and cache.
- `-f, --format <json|markdown>` — optional, default `markdown`.

## Behavior

- Always fetches the project fresh from the backend (`project:show`).
- If no cache file exists for that id, creates one with `repos: []`.
- If a cache file already exists, replaces only the `project` snapshot — any recorded
  `repos` are preserved.

## Output

- `markdown` (default): the fetched project — frontmatter with `id, prefix, status,
start_date, end_date, tags, created_at, updated_at`, then `# {name}` and the description.
  Unlike `project:view`, no repository sections — this command runs outside any repo context.
- `json`: the project object only (not wrapped in a `data` envelope, no `current_repo`/`repos`).
