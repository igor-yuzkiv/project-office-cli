---
paths:
  - "src/shared/config/**"
  - "src/shared/libs/settings/**"
  - "src/**"
---

# Rule: Configuration

Scope: configuration for `project-office-cli` itself.

The project has two configuration homes. There is no `.env` / environment-variable
mechanism — the CLI must behave identically regardless of the directory it is launched
from, so nothing about its own configuration may depend on process env or a
directory-relative dotenv file.

* `src/shared/config/` — fixed program configuration that defines how the CLI works;
  values here are constants, not collected at runtime.
* Per-user **CLI settings** (`src/shared/libs/settings/`) — values that differ per
  machine/user (backend URLs, the API token). Collected once, interactively, by
  `project-office install`, and persisted at `~/.project-office-cache/settings.json`
  (never committed, machine-local, `0600`).

Project Office workspace state, per-repository `.project-office` metadata, and the local
project cache are separate concerns — see `docs/project-office-context.md`.

## CLI settings or `shared/config`

Use this test:

**Does the value differ per machine/user, or is it a secret?**

If yes — it belongs in `CliSettings` (`src/shared/libs/settings/cli-settings.type.ts`),
collected during `install` via `cliSettingsSetupDefinition`
(`src/shared/config/cli-settings.config.ts`). Give it an in-code default there so the
interactive prompt can be accepted with Enter in the common case — never require the user
to look the value up or type it every install.

If no, and the value defines shared CLI behavior — it belongs in `src/shared/config/`.

## Put in CLI settings

* backend base URL / API base URL;
* tokens, credentials, and secrets;
* anything else genuinely specific to one user's install (not one code deployment).

Secrets always go through `CliSettings`, never through a constant or a committed file.
`cliSettingsProvider.load()` validates that every required field is present and non-empty
before returning settings — add new required fields to that check in the same change that
introduces them.

## Put in `shared/config`

Use `src/shared/config/` for shared program configuration:

* exit codes;
* default command behavior;
* settings file/cache directory names (fixed constants — not env-overridable);
* fixed backend API paths;
* formatting values reused across commands;
* interactive setup prompt definitions (`cliSettingsSetupDefinition`) and their defaults;
* shared enum-like values and status strings.

Split config by concern:

```txt
src/shared/config/
  api.config.ts
  cli-settings.config.ts
  index.ts
```

Every config file should be re-exported through `src/shared/config/index.ts`.

Avoid catch-all config files.

## Adding a new per-user setting

1. Add the field to `CliSettings` in `cli-settings.type.ts`.
2. Add a matching entry to `cliSettingsSetupDefinition` in
   `src/shared/config/cli-settings.config.ts` (set `password: true` for secrets; set
   `value` to a sensible default for anything else).
3. Add it to the required-fields check in `cliSettingsProvider.load()`.
4. Document it under [Configuration](../../docs/configuration.md#cli-settings).

The setup service and provider are generic and need no changes.
