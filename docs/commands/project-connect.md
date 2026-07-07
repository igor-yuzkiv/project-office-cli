# `project:connect`

Fetches a project by id and creates or updates its local cache record
(`~/.project-office-cache/projects/<id>.json`). See
[Project Office context](../project-office-context.md) for the full model. A bootstrap
command — never touches `<repo>/.project-office/repo-settings.json`.

## Usage

```bash
project-office project:connect --project 01k...
project-office project:connect --project 01k... --format json
```

## Options

| Option                  | Default      | Purpose                                                               |
| ----------------------- | ------------ | --------------------------------------------------------------------- |
| `--project <id>`        | — (required) | Project id to fetch and cache.                                        |
| `-f, --format <format>` | `markdown`   | `json` or `markdown`. See [Output rendering](../output-rendering.md). |

## Behavior

- Always fetches the project fresh from the backend.
- Creates the cache record with `repos: []` if none exists yet for that id.
- If a cache record already exists, replaces only the `project` snapshot — any recorded
  `repos` are preserved (`projectsRegister.setProjectRecord`).

## Output

Same shape as [`project:view`](./project-view.md): `markdown` (default) renders the fetched
project through `renderProjectAsMarkdown`; `json` returns the project object.
