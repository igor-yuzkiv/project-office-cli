# Project Office context

How the CLI figures out **which Project Office it is working in** without the agent
passing a `projectId` on every command. The marker directory and file names are fixed CLI
configuration in `src/shared/config/project-office.config.ts` (`PROJECT_REPO_CONTEXT_DIR` /
`PROJECT_REPO_SETTINGS_FILE` for the launch-side marker, `PROJECT_OFFICE_CONTEXT_DIR` /
`PROJECT_OFFICE_SETTINGS_FILE` for the office hop). The provider is modeled on
`cliSettingsProvider` — see [CLI settings](./configuration.md#cli-settings).

Most commands operate inside a single Project Office project and need its `projectId`. The
agent should not have to know or pass that id — the CLI resolves it from the directory the
command was launched in.

## `projectOfficeContextProvider`

`src/shared/libs/project-office/project-office-context.provider.ts` exports a singleton,
`projectOfficeContextProvider`. It mirrors `cliSettingsProvider`: a `bootstrap()` called
once at startup, plus accessors for the rest of the CLI. `src/index.ts` calls
`projectOfficeContextProvider.bootstrap()` after `cliSettingsProvider.bootstrap()`.

- **`bootstrap(launchDir = process.cwd())`** — resolves the context and stores the resolved
  **office** settings in memory. It is non-fatal by design (see below) and returns the
  office settings or `null`.
- **`getOfficeSettings()`** — the resolved office settings. Throws if no context resolved.
- **`getProjectId()`** — the office's `projectId`. Throws if no context resolved, or if the
  office settings carry no valid `projectId`.

## Resolution

From `launchDir`, `bootstrap` walks **up** the directory tree looking for a marker file:

```txt
.project-office/settings.json
```

The marker's `kind` field decides what happens next:

- **`kind: "repo"`** — the command runs inside a code repository. Repo settings carry an
  absolute `office_path`; the provider follows it to the office's own
  `.project-office/settings.json` and reads the office settings from there. Repo settings
  are **only** an intermediate hop — they are never stored in state.

  ```json
  { "kind": "repo", "office_path": "/absolute/path/to/project-office" }
  ```

- **`kind: "office"`** — the command already runs inside the Project Office; the marker's
  settings are the office settings, used directly.

  ```json
  { "kind": "office", "projectId": "project_123" }
  ```

Only the **office** settings are kept in memory after `bootstrap`. Extra fields in either
file (name, description, `repos[]`, …) are tolerated and ignored.

## Non-fatal bootstrap, fatal access

`bootstrap` runs for **every** command, including commands that do not use the office
context (for example `install`). So it never fails and never prints: running with no marker
file — or with a broken one — leaves the context `null` and lets the command proceed.

The failure surfaces only when a command that actually needs the context **accesses** it:
`getProjectId()` / `getOfficeSettings()` throw. The provider keeps the underlying resolution
error (broken JSON, a dangling `office_path`, an unknown `kind`) and re-throws it at access
time, so the message names the real cause rather than a generic "no context".

`projectId` is validated lazily, in `getProjectId()` only — an office marker with a valid
`kind` but no `projectId` yet still resolves as a context, and `getOfficeSettings()` works;
only asking for the `projectId` fails.

> A command that needs a project should exit with `ExitCode.ConfigError` when
> `getProjectId()` throws. No command consumes the context yet, so that mapping lives in the
> commands that will.
