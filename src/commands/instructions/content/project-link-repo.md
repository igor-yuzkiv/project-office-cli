# `project:link-repo`

Links a repository to a Project Office project: ensures the project's local cache file
exists, records the repo in it, and writes `<repo>/.project-office/repo-settings.json` —
this is the **only** command allowed to write that file. Once run, every other command in
that repo resolves its project id from `repo-settings.json` automatically.

## Call

```
project-office project:link-repo --project 01k... --name my-repo
project-office project:link-repo --project 01k... --name my-repo --path /abs/path/to/repo
project-office project:link-repo --project 01k... --name my-repo --description "..." --stack TypeScript --stack Bun
```

## Options

- `--project <id>` — **required**. Project id to link.
- `--name <name>` — **required**. Repo name recorded in the project cache.
- `--path <dir>` — optional, default the current directory. Absolute or relative path to the
  repo being linked; `repo-settings.json` is written under `<path>/.project-office/`.
- `--description <description>` — optional.
- `--stack <tech>` — optional, repeatable (one `--stack` per technology).
- `-f, --format <json|markdown>` — optional, default `markdown`.

## Behavior

1. If the project has no cache file yet, fetches it (`project:show`) and creates one — same
   as `project:connect`.
2. Records/replaces the repo entry for `--path` in the project's cache `repos[]`, keyed by
   path — running this again for the same path updates that entry rather than duplicating
   it (idempotent).
3. Writes the same repo entry — `{ "projectId": "<id>", "path": "...", "name": "...", "description": "...", "stack": [...] }`
   (omitted fields excluded) — to `<path>/.project-office/repo-settings.json`.

## Output

- `markdown` (default): a short confirmation with `projectId` and `repoPath` as frontmatter
  properties.
- `json`: `{ "projectId": "...", "repoPath": "..." }`.

## Notes

You should not create or edit `repo-settings.json` yourself under any circumstances — always
go through this command, even to fix or re-point an existing link.
