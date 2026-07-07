# `project:view`

Shows the current Project Office project. The project is always resolved from the
[Project Office context](../project-office-context.md) (`getProjectId()`) — there is no
`--project` option.

## Usage

```bash
project-office project:view
project-office project:view --format json
project-office project:view --include tags,createdBy
```

## Options

| Option | Default | Purpose |
| --- | --- | --- |
| `-f, --format <format>` | `markdown` | `json` or `markdown`. See [Output rendering](../output-rendering.md). |
| `--include <fields>` | — | Comma-separated `ProjectInclude` values (`createdBy`, `updatedBy`, `archivedBy`, `tags`) to embed in the response. |

## Output

- **`json`** — the raw `fetchProjectRequest` response (`renderJson`).
- **`markdown`** — `renderProjectAsMarkdown`: `prefix`, `status`, `start_date`, `end_date`,
  `tags`, `created_at`, `updated_at` as frontmatter properties; `# {name}` + `description`
  as content.
