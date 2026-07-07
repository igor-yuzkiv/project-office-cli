# Configuration

The CLI has two separate configuration concerns, kept intentionally apart:

1. **[Environment configuration](#environment-configuration)** — global runtime config that
   points the CLI at a backend and controls where it stores data. Lives in `.env`, read
   through `Bun.env`.
2. **[CLI settings](#cli-settings)** — per-user data the CLI collects and stores. Lives in
   `settings.json`, collected by the [install command](commands/install.md).

Environment is _how the CLI is deployed_; CLI settings are _the user's own runtime data_.
They are not mixed.

---

## Environment configuration

Global runtime configuration is read from a `.env` file at the repository root (loaded
automatically by Bun) through the typed `Bun.env` — never untyped `process.env`. Variable
names are `UPPER_SNAKE_CASE`. Every variable is documented in the committed `.env.example`
and typed in `src/env.d.ts`; adding or removing one means updating both in the same change.
`.env` holds real local values and is git-ignored.

| Variable                       | Required | Default                 | Purpose                                                                                |
| ------------------------------ | -------- | ----------------------- | -------------------------------------------------------------------------------------- |
| `BACKEND_BASE_URL`             | yes      | —                       | Backend base URL; used for the token-creation link.                                    |
| `BACKEND_USER_PROFILE_PATH`    | yes      | —                       | User-profile path appended to the base URL for the token-creation link.                |
| `API_BASE_URL`                 | yes      | —                       | Backend API base URL used by the [HTTP client](./http-client.md) for all CLI requests. |
| `PROJECT_OFFICE_CACHE_DIR`     | no       | `.project-office-cache` | Settings directory name under the user's home.                                         |
| `PROJECT_OFFICE_SETTINGS_FILE` | no       | `settings.json`         | Settings file name inside the settings directory.                                      |

---

## CLI settings

Per-user settings the CLI collects during [install](commands/install.md) and stores in
`settings.json`. For the MVP they hold a single global `apiToken` used to authorize backend
API requests (global across all projects for now). The
[available settings](#available-settings) section grows as new settings are added.

### Contract

`CliSettings` (`src/shared/libs/settings/cli-settings.type.ts`) is the settings contract and
the final shape of the settings file. Current shape:

```json
{
    "apiToken": "<your token>"
}
```

### Storage

| What               | Path (default)                          |
| ------------------ | --------------------------------------- |
| Settings directory | `~/.project-office-cache/`              |
| Settings file      | `~/.project-office-cache/settings.json` |

The directory and file names come from the environment variables `PROJECT_OFFICE_CACHE_DIR`
and `PROJECT_OFFICE_SETTINGS_FILE` (see [Environment configuration](#environment-configuration)).
They are resolved once — the resolved paths are the single source of truth in
`src/shared/config/cli-settings.config.ts` (`SETTINGS_DIR`, `SETTINGS_FILE`).

Secrets are stored in plaintext, so the file is written with permissions `0600` (owner
read/write only). It lives outside the repository and is never committed.

### Available settings

Each setting is documented here. Add a new subsection when a setting is introduced.

#### `apiToken`

- **Type:** `string` (secret)
- **Prompt:** masked; during setup the CLI shows the token-creation URL built from
  `BACKEND_BASE_URL + BACKEND_USER_PROFILE_PATH`.
- **Purpose:** global API token used to authorize backend requests.

### Building blocks

All under `src/shared/libs/settings/`:

- **`CliSettings`** (`cli-settings.type.ts`) — the settings contract (see above).
- **`cliSettingsSetupDefinition`** (`src/shared/config/cli-settings.config.ts`) — describes
  how to collect each setting: `label`, `prompt`, optional `value`, and optional `password`
  (masked input). The definition is keyed by `CliSettings` keys, so adding a setting is a
  type-checked change. All CLI configuration values (not read straight from `.env`) live
  under `src/shared/config/`, split one file per concern.
- **`cliSettingsSetupService`** (`cli-settings-setup.service.ts`) — the interactive setup
  flow. Iterates the definition, asks one question at a time (masked when `password` is
  set), and returns a `CliSettings` object. It performs collection only and never touches
  the filesystem.
- **`cliSettingsProvider`** (`cli-settings.provider.ts`) — singleton that owns settings
  persistence and access:
    - `save(settings)` — creates the directory if needed and writes the settings file
      (`0600`, pretty JSON).
    - `load()` — reads and validates the settings file; throws a clear error when the file is
      missing, corrupt, or missing a valid `apiToken`.
    - `bootstrap()` — a quiet startup variant: runs `load()` but, instead of throwing, prints
      the error and returns `null`, so CLI startup never halts on a missing/unreadable config.
    - `get(key)` — returns a single setting value by key.
    - `getAll()` — returns the whole `CliSettings` object.

    `get`/`getAll` require settings to have been loaded first. `src/index.ts` calls
    `bootstrap()` once before any command runs, so settings are already loaded (or
    known-missing) by the time a command's action executes. A command that requires
    settings to be present should call `load()` itself when it needs a hard failure
    instead of a silently missing value.

### Adding a new setting

1. Add the field to `CliSettings` in `cli-settings.type.ts`.
2. Add a matching entry to `cliSettingsSetupDefinition` in
   `src/shared/config/cli-settings.config.ts` (set `password: true` for secrets).
3. Document it under [Available settings](#available-settings).

The setup service and provider are generic and need no changes.
