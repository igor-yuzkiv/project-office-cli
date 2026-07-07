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

Same shape as `project:view`: `markdown` (default) renders the fetched project through
`renderProjectAsMarkdown`; `json` returns the project object (not wrapped in a `data`
envelope).
