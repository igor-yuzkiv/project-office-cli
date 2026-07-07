# `project:view`

Fetches the current Project Office project and prints it, hydrated with the repos locally
linked to it (from the project cache, if one exists). The project is always the one
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
created_at, updated_at`, then `# {name}` followed by the description as body text. If the
  project has a local cache with linked repos, a `## Repositories` section lists each as
  `- {name} ({path})`; omitted entirely when there are none.
- `json`: the project object with an added `repos` array (each entry is a
  `ProjectRepositoryDefinition`) — empty if no local cache exists for this project yet.

The repos list always comes from the local project cache
(`~/.project-office-cache/projects/<id>.json`), not from the backend — it reflects only
repos linked via `project:link-repo` on this machine.

## Errors

An unresolved Project Office context (no `.project-office/repo-settings.json` found walking
up from the launch directory) throws before the request is made — run
`project:link-repo` first.
