# `install`

Local setup (and re-setup) for this CLI: collects per-user settings (backend URLs and the
API token) and writes them to the settings file. Safe to re-run. You should not normally
need to run this yourself — it requires an interactive terminal (masked token prompt) and
is a human/operator step, not an agent workflow action. It is documented here for
completeness.

## Call

```
project-office install
```

## Behavior

- Prompts for settings one at a time: `backendBaseUrl`, `backendUserProfilePath`,
  `apiBaseUrl` each offer a default you can accept by pressing Enter — the currently loaded
  value if the CLI is already installed, otherwise the built-in default; `apiToken` is
  masked and always prompted fresh (no default). Running install again re-collects and
  overwrites the existing settings file rather than failing.
- Validates the collected values before writing anything; if any required field is empty,
  prints a combined error and exits non-zero without touching the settings file.
- Writes the settings to the settings file, then creates the local project cache directory
  used by `project:connect` / `project:link-repo`.

Everything the CLI needs to reach the backend is now stored per-user in the settings file —
there is no environment variable to configure separately, and settings are read the same
way regardless of which directory a command is run from.

No `--format` option — this command has no structured output to render.

Installing does **not** connect any repo to a project — run `project:link-repo` afterward
(see `project-office instructions project:link-repo`) to set that up.
