# `project:link-repo`

Links a repository to a Project Office project: ensures the project's local cache record
exists, records the repo in it, and writes `<repo>/.project-office/repo-settings.json` —
the **only** command allowed to write that file. See
[Project Office context](../../project-office-context.md) for the full model. Once run, every
other command in that repo resolves its project id automatically.

## Usage

```bash
project-office project:link-repo --project 01k... --name my-repo
project-office project:link-repo --project 01k... --name my-repo --path /abs/path/to/repo
project-office project:link-repo --project 01k... --name my-repo --description "..." --stack TypeScript --stack Bun
```

## Options

| Option                        | Default           | Purpose                                                                                                              |
| ----------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| `--project <id>`              | — (required)      | Project id to link.                                                                                                  |
| `--name <name>`               | — (required)      | Repo name recorded in the project cache and `repo-settings.json`.                                                    |
| `--path <dir>`                | current directory | Absolute or relative path to the repo being linked; `repo-settings.json` is written under `<path>/.project-office/`. |
| `--description <description>` | —                 | Repo description.                                                                                                    |
| `--stack <tech>`              | `[]`              | Repeatable — one `--stack` per technology.                                                                           |
| `-f, --format <format>`       | `markdown`        | `json` or `markdown`. See [Output rendering](../../output-rendering.md).                                             |

## Behavior

1. If the project has no cache record yet, fetches it and creates one (`projectsRegister.setProjectRecord`)
   — same as [`project:connect`](./connect.md).
2. Builds one `ProjectRepositoryDefinition` from `--project`/`--path`/`--name`/`--description`/`--stack`.
3. Records/replaces that repo's entry in the project cache's `repos[]`, keyed by `path`
   (`projectsRegister.linkRepositoryToProject`) — running this again for the same path
   replaces the entry rather than duplicating it (idempotent).
4. Writes that same `ProjectRepositoryDefinition` to `<path>/.project-office/repo-settings.json`
   (`projectsRegister.writeRepositorySettings`).

## Output

- **`markdown`** (default) — a short confirmation with `projectId` and `repoPath` as
  frontmatter properties.
- **`json`** — `{ "projectId": "...", "repoPath": "..." }`.

## Notes

Never create or edit `repo-settings.json` by hand — always go through this command, even to
fix or re-point an existing link.
