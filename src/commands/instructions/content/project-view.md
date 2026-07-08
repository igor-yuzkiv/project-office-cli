# `project:view`

Fetches the current Project Office project and prints it, together with the repository the
command was run from (the current repo) and the other repos locally linked to the project
(from the project cache, if one exists). The project is always the one resolved from the
launch directory — there is no `--project` option. This is the command to use when you need
the project's `id`/`name` or the current repo's recorded `name`/`path` — do not read
`.project-office/repo-settings.json` yourself.

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

- `markdown` (default): frontmatter with `id, prefix, status, start_date, end_date, tags,
created_at, updated_at`, then `# {name}` followed by the description as body text. A
  `## Current repository` section shows the repo the command was run from as
  `- {name} ({path})`. If the project has a local cache with linked repos, a
  `## Repositories` section lists each as `- {name} ({path})`, marking the current one with
  `(this repo)`; omitted entirely when there are none.
- `json`: `{ project, current_repo, repos }` — `project` is the project object,
  `current_repo` is the repo the command was run from, `repos` is every repo linked on this
  machine (each repo entry is a `ProjectRepositoryDefinition`; `repos` is empty if no local
  cache exists for this project yet).

The repos list always comes from the local project cache
(`~/.project-office-cache/projects/<id>.json`), not from the backend — it reflects only
repos linked via `project:link-repo` on this machine.

## Errors

An unresolved Project Office context (no `.project-office/repo-settings.json` found walking
up from the launch directory) throws before the request is made — run
`project:link-repo` first.
