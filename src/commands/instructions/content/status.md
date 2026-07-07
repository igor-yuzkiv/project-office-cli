# `status`

Call this **first**, before any other command, in any new session or when you're unsure
whether the CLI is installed or the current repo is linked to a project. It never fails —
always exits `0` — and reports readiness in fields instead of throwing, so you don't need
`try`/`catch` around it.

## Call

```
project-office status
project-office status --format json
```

## Options

- `-f, --format <json|markdown>` — optional, default `markdown`.

## Output shape (`json`)

```ts
{
  cli:     { installed: boolean }
  server:  { reachable: boolean, authenticated: boolean, user?: {id, name, email}, baseUrl: string, error?: string }
  repo:    { linked: false } | { linked: true, repoRoot, settingsPath, projectId, name, description?, stack? }
  project: <project object> | null   // only fetched when repo.linked
  cache:   { present: boolean, repos: [...] }  // local project cache, only read when repo.linked
  ready:   boolean       // installed && repo.linked
  issues:  string[]      // non-fatal problems encountered while building this report
}
```

`markdown` (default): frontmatter with `installed, linked, project_id, project,
server_reachable, server_authenticated, ready`; body is a checklist (CLI installed / repo
linked / server reachable / server authenticated), plus an `## Issues` section when `issues`
is non-empty.

## How to use it

- **`ready: false` + `cli.installed: false`** — the CLI has no local settings yet. Tell the
  user, or run `project-office install` if you're allowed to (see
  `project-office instructions install`).
- **`ready: false` + `cli.installed: true` + `repo.linked: false`** — installed, but this
  repo has no `repo-settings.json` yet. Run
  `project-office project:link-repo --project <id> --name <repo-name>`
  (see `project-office instructions project:link-repo`).
- **`ready: true`** — proceed with any other command; `repo.projectId` is the project every
  other command already resolves automatically.
- **`server.reachable: false` or `server.authenticated: false`** — check `server.error`
  before assuming the project/repo state is the problem; a down backend or expired token
  looks different from "not linked".
- **Non-empty `issues`** — something degraded (e.g. a corrupt local project cache) without
  blocking the report; `repo`/`project` may still be valid even if an issue was recorded.

`project` and `cache` are only populated when `repo.linked` is `true` — they stay
`null`/`{present: false, repos: []}` otherwise, at no extra cost.
