# Configuration

Per-user **CLI settings** — data the CLI collects once and stores locally. Lives in
`settings.json`, collected by the [install command](commands/install.md).

## CLI settings

Per-user settings the CLI collects during [install](commands/install.md) and stores in
`settings.json`. The [available settings](#available-settings) section grows as new
settings are added.

### Contract

`CliSettings` (`src/shared/libs/settings/cli-settings.type.ts`) is the settings contract and
the final shape of the settings file. Current shape:

```json
{
    "backendBaseUrl": "<backend base url>",
    "backendUserProfilePath": "<user-profile path>",
    "apiBaseUrl": "<backend API base url>",
    "apiToken": "<your token>"
}
```

### Storage

| What               | Path (default)                          |
| ------------------ | --------------------------------------- |
| Settings directory | `~/.project-office-cache/`              |
| Settings file      | `~/.project-office-cache/settings.json` |

The directory and file names are fixed constants in `src/shared/config/cli-settings.config.ts`
(`SETTINGS_DIR`, `SETTINGS_FILE`) — not configurable per machine.

Secrets are stored in plaintext, so the file is written with permissions `0600` (owner
read/write only). It lives outside the repository and is never committed.

### Available settings

Each setting is documented here. Add a new subsection when a setting is introduced.

#### `backendBaseUrl`

- **Type:** `string`
- **Prompt:** plain text; defaults to the built-in backend URL.
- **Purpose:** used to build the token-creation link shown while collecting `apiToken`.

#### `backendUserProfilePath`

- **Type:** `string`
- **Prompt:** plain text; defaults to the built-in profile path.
- **Purpose:** appended to `backendBaseUrl` to build the token-creation link.

#### `apiBaseUrl`

- **Type:** `string`
- **Prompt:** plain text; defaults to the built-in API base URL.
- **Purpose:** base URL the [HTTP client](./http-client.md) uses for all CLI requests.

#### `apiToken`

- **Type:** `string` (secret)
- **Prompt:** masked; during setup the CLI shows the token-creation URL built from the
  `backendBaseUrl`/`backendUserProfilePath` values just entered in the same run.
- **Purpose:** API token used to authorize backend requests.

### Building blocks

All under `src/shared/libs/settings/`, except `cliSettingsDefinition` (see below):

- **`CliSettings`** (`cli-settings.type.ts`) — the settings contract (see above).
- **`cliSettingsDefinition`** (`src/shared/config/cli-settings.config.ts`) — a function
  `(values?: Partial<CliSettings>) => CliSettingsDefinition` describing how to collect each
  setting: `label`, `prompt` (a function that can read previously-collected values, used to
  build the dynamic token-creation URL), optional `value` (falls back to the passed-in
  `values`, then a built-in default), optional `password` (masked input), `required`, and an
  optional `validate(value)` check. The definition is keyed by `CliSettings` keys, so adding a
  setting is a type-checked change.
- **`cliSettingsProvider`** (`cli-settings.provider.ts`) — singleton that owns settings
  persistence and access:
    - `bootstrap()` — reads and validates the settings file; on success loads the settings and
      returns them, on failure (missing/corrupt/invalid file) prints the error and returns
      `null` instead of throwing, so CLI startup never halts on a missing/unreadable config.
    - `assertValid(settings)` — runs `validate()` and throws a combined `key → message` error
      if anything is invalid; used by `bootstrap()` and by [`install`](commands/install.md)
      before persisting newly-collected settings.
    - `validate(settings)` — checks a (partial) settings object against `cliSettingsDefinition`
      (required fields, optional `validate` checks) and returns an array of
      `{ key, message }` errors.
    - `save(settings)` — creates the directory if needed and writes the settings file
      (`0600`, pretty JSON).
    - `isLoaded()` — whether settings have been successfully loaded this run.
    - `get(key)` — returns a single setting value by key.
    - `getAll()` — returns the whole `CliSettings` object.

    `get`/`getAll` require settings to have been loaded first. `src/index.ts` calls
    `bootstrap()` once before any command runs, so settings are already loaded (or
    known-missing) by the time a command's action executes.

### Adding a new setting

1. Add the field to `CliSettings` in `cli-settings.type.ts`.
2. Add a matching entry to `cliSettingsDefinition` in `src/shared/config/cli-settings.config.ts`
   (set `password: true` for secrets, `required: true` unless the setting is genuinely
   optional, and a `validate` function for any extra check beyond "required").
3. Document it under [Available settings](#available-settings).

`cliSettingsProvider` is generic and needs no changes.
