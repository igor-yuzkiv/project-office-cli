# `install`

How `project-office install` works. This is the local setup — and re-setup — for the CLI.
For the settings it collects and stores (contract, storage, provider API), see
[Configuration](../configuration.md).

## Overview

`project-office install` performs the local setup, and is safe to re-run:

1. runs an interactive prompt flow to collect settings, prefilling each prompt with the
   currently loaded value (if any) so re-running only requires confirming or changing what
   you want to update,
2. validates the collected values and stops (without writing anything) if any are invalid,
3. writes them to the settings file,
4. creates the local project cache directory used by
   [`project:connect`](./project/connect.md) / [`project:link-repo`](./project/link-repo.md).

## Usage

```bash
project-office install
```

The command is interactive and requires a real terminal (TTY) for the masked token
prompt. It is idempotent — running it again re-collects and overwrites the settings file,
using the current values as prompt defaults instead of failing.

## Flow

1. **Collect settings.** The interactive flow asks for each setting one at a time. If CLI
   settings were already loaded at startup, each prompt defaults to the current value —
   otherwise it defaults to the setting's built-in default. Secret values (the API token)
   are read through a masked prompt so they are never echoed. See
   [Configuration](../configuration.md#cli-settings) for the full list.
2. **Validate.** The collected values are checked the same way as on startup (required
   fields present and non-empty, plus any per-field `validate` check). If anything is
   invalid, the command prints a combined `key → message` error and exits non-zero —
   nothing is written to disk.
3. **Persist.** The settings folder is created (lazily, at write time) and the settings
   file is written with permissions `0600`.
4. **Create the project cache directory.** `~/.project-office-cache/projects/` is created
   (see [Project Office context](../project-office-context.md)) — installing does **not**
   link any repo to a project; run [`project:link-repo`](./project/link-repo.md) afterward.
5. **Confirm.** On success the command prints `Project Office CLI installed.`

## Exit codes

| Situation                      | Exit code |
| ------------------------------ | --------- |
| Successful install             | `0`       |
| Collected settings are invalid | non-zero  |
