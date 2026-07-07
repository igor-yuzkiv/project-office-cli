# Project Office context

How the CLI figures out **which Project Office project it is working in** without the agent
passing a `projectId` on every command, and how it keeps an optional local record of
projects and the repos linked to them.

There is no separate local "Project Office" folder — a project lives entirely on the
backend. Locally there are only two things:

1. **`<repo>/.project-office/repo-settings.json`** — the marker that ties one repo to one
   project id. Read by every command that needs a project; written **exclusively** by
   [`project:link-repo`](./commands/project-link-repo.md).
2. **`~/.project-office-cache/projects/<projectId>.json`** — an optional, purely local cache
   of a project's snapshot plus the repos linked to it. Nothing requires it to exist for
   commands to work; it exists for offline metadata and repo-mapping convenience.

Fixed CLI configuration for both lives in `src/shared/config/project-office.config.ts`:
`PROJECT_OFFICE_REPO_DIR` (`.project-office`), `PROJECT_OFFICE_REPO_SETTINGS_FILE`
(`repo-settings.json`), `PROJECT_OFFICE_PROJECTS_CACHE_DIR`
(`~/.project-office-cache/projects`, sharing the same cache root as
[CLI settings](./configuration.md#cli-settings)).

## `selectedProjectContext` — the read side

`src/shared/libs/project-office/selected-project-context.ts` exports a singleton,
`selectedProjectContext` (class `SelectedProjectContext`). It mirrors `cliSettingsProvider`:
a `bootstrap()` called once at startup, plus accessors for the rest of the CLI.
`src/index.ts` calls `selectedProjectContext.bootstrap()` after `cliSettingsProvider.bootstrap()`.

- **`bootstrap(launchDir = process.cwd())`** — walks **up** from `launchDir` looking for
  `.project-office/repo-settings.json`, parses it into `selectedRepo`. If `selectedRepo.projectId`
  is set, also loads that project's local cache record into `projectCache` via
  [`projectsRegister.getProjectRecord`](#projectsregister--the-write-side). Non-fatal by
  design (see below); returns `selectedRepo` or `null`.
- **`getProjectId()`** — the resolved `projectId`. Throws if no context resolved, or if
  `repo-settings.json` carries no valid `projectId`.
- **`getSelectedRepo()`** — the resolved `repo-settings.json` content
  (`ProjectRepositoryDefinition`). Throws if no context resolved.
- **`getProjectCache()`** — the resolved local project cache (`ProjectRegistryRecord`).
  Throws if none was loaded, pointing at `project:connect` / `project:link-repo`.

### Non-fatal bootstrap, fatal access

`bootstrap` runs for **every** command, including commands that don't need a project (for
example `install`, or the bootstrap commands themselves before any marker exists) — so it
never throws and never prints: running with no marker file, or a broken one, leaves the
context unresolved and lets the command proceed.

The failure surfaces only when a command that actually needs the context **accesses** it:
`getProjectId()` / `getSelectedRepo()` / `getProjectCache()` throw, keeping the underlying
resolution error (broken JSON, missing file) so the message names the real cause.

## `projectsRegister` — the write side

`src/shared/libs/project-office/projects-register.ts` exports a singleton,
`projectsRegister` (class `ProjectsRegister`) — the only code that reads or writes the local
project cache and `repo-settings.json`.

- **`getProjectRecord(projectId)`** — reads `~/.project-office-cache/projects/<projectId>.json`,
  or `null` if it doesn't exist.
- **`setProjectRecord(projectId, project)`** — creates the project's cache record on first
  call (`repos: []`), or replaces just the `project` snapshot on later calls — `repos` is
  preserved across updates.
- **`linkRepositoryToProject(projectId, repositoryLink)`** — requires the cache record to
  already exist (call `setProjectRecord` first). Replaces any existing entry for the same
  `path` in `repos[]` rather than appending a duplicate — repeated linking of the same repo
  is idempotent.
- **`writeRepositorySettings(repoDir, repositoryLink)`** — writes
  `<repoDir>/.project-office/repo-settings.json`. **Never call this directly from anywhere
  except [`project:link-repo`](./commands/project-link-repo.md).**

### Types

`src/shared/libs/project-office/types.ts`:

```ts
interface ProjectRepositoryDefinition {
    projectId?: string
    path: string
    name: string
    description?: string
    stack?: string[]
}

interface ProjectRegistryRecord {
    project: Project
    repos: ProjectRepositoryDefinition[]
}
```

`ProjectRepositoryDefinition` is both the shape written to `repo-settings.json` and the
shape of each entry in a project cache's `repos[]` — a local repo↔project link, not a full
repo description.

## Establishing context: the bootstrap commands

Nothing writes `repo-settings.json` automatically. Two commands exist for that:

- [`project:connect`](./commands/project-connect.md) — fetches a project and creates/updates
  its local cache record only. Never touches `repo-settings.json`.
- [`project:link-repo`](./commands/project-link-repo.md) — ensures the project's cache
  record exists (same fetch as `project:connect` if it doesn't), records the current repo in
  it, and writes `repo-settings.json`. This is the only command allowed to do the latter.

Every other command resolves its project automatically through `selectedProjectContext`
once `repo-settings.json` exists — no `--project` option needed or accepted.
