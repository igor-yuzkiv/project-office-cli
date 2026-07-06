# Install command

How `project-office install` works. This is the one-time local setup for the CLI. For the
settings it collects and stores (contract, storage, provider API) and the environment
configuration it depends on, see [Configuration](./configuration.md).

## Overview

`project-office install` performs the one-time local setup:

1. creates the per-user settings folder,
2. runs an interactive setup flow to collect settings,
3. writes them to the settings file.

## Usage

```bash
project-office install
```

The command is interactive and requires a real terminal (TTY) for the masked token
prompt. There is no `reinstall` / `reset` / `update` flow yet — once installed, re-running
`install` is a no-op that reports the CLI is already installed.

## Flow

1. **Validate backend configuration.** If `BACKEND_BASE_URL` or
   `BACKEND_USER_PROFILE_PATH` is missing/empty, the command prints which variable(s) are
   missing and exits non-zero — before any prompt or file write.
2. **Already-installed guard.** If the settings file already exists, the command prints
   `Project Office CLI is already installed.` and exits non-zero, making **no** prompts and
   **no** file changes. The guard is file-based (settings file present), so a partially
   created folder never counts as "installed".
3. **Collect settings.** The interactive setup flow asks for each setting one at a time.
   Secret values (such as the API token) are read through a masked prompt so they are never
   echoed. See [Configuration](./configuration.md#cli-settings) for the full list.
4. **Persist.** The settings folder is created (lazily, at write time) and the settings
   file is written with permissions `0600`.
5. **Confirm.** On success the command prints `Project Office CLI installed.`

## Exit codes

| Situation | Exit code |
| --- | --- |
| Successful install | `0` |
| Missing required backend env var(s) | non-zero |
| Already installed | non-zero |
