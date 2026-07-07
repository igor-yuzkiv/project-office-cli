# `install`

One-time local setup for this CLI: collects per-user settings (backend URLs and the API
token) and writes them to the settings file. You should not normally need to run this
yourself — it requires an interactive terminal (masked token prompt) and is a
human/operator step, not an agent workflow action. It is documented here for completeness.

## Call

```
project-office install
```

## Behavior

- Fails with a non-zero exit if the CLI is already installed (settings file exists) — no
  prompts, no file changes.
- Otherwise prompts for settings one at a time: `backendBaseUrl`, `backendUserProfilePath`,
  `apiBaseUrl` each offer a default you can accept by pressing Enter; `apiToken` is masked
  and has no default. Writes all of them to the settings file, then creates the local
  project cache directory used by `project:connect` / `project:link-repo`.

Everything the CLI needs to reach the backend is now stored per-user in the settings file —
there is no environment variable to configure separately, and settings are read the same
way regardless of which directory a command is run from.

No `--format` option — this command has no structured output to render.

Installing does **not** connect any repo to a project — run `project:link-repo` afterward
(see `project-office instructions project:link-repo`) to set that up.
