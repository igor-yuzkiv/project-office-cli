# `project:view`

Shows the current Project Office project, hydrated with the repos locally linked to it
(from the project cache, if one exists). The project is always resolved from the
[Project Office context](../project-office-context.md) (`getProjectId()`) — there is no
`--project` option.

## Usage

```bash
project-office project:view
project-office project:view --format json
project-office project:view --include tags,createdBy
```

## Options

| Option                  | Default    | Purpose                                                                                                            |
| ----------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------ |
| `-f, --format <format>` | `markdown` | `json` or `markdown`. See [Output rendering](../output-rendering.md).                                              |
| `--include <fields>`    | —          | Comma-separated `ProjectInclude` values (`createdBy`, `updatedBy`, `archivedBy`, `tags`) to embed in the response. |

## Output

- **`json`** — the `fetchProjectRequest` response data with an added `repos` array (each
  entry a `ProjectRepositoryDefinition`); empty if no local project cache exists yet.
- **`markdown`** — `renderProjectAsMarkdown`: `prefix`, `status`, `start_date`, `end_date`,
  `tags`, `created_at`, `updated_at` as frontmatter properties; `# {name}` + `description`
  as content, followed by a `## Repositories` section (`- {name} ({path})` per repo) when
  the project has at least one repo linked locally — omitted entirely otherwise.

The `repos` list is read from the local project cache
(`~/.project-office-cache/projects/<id>.json`) via `projectsRegister.getProjectRecord` — see
[Project Office context](../project-office-context.md). It reflects only repos linked on
this machine via [`project:link-repo`](./project-link-repo.md), not backend data.
