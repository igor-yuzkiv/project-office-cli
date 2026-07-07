# `install`

One-time local setup for this CLI: collects the per-user API token and writes it to the
settings file. You should not normally need to run this yourself — it requires an
interactive terminal (masked token prompt) and is a human/operator step, not an agent
workflow action. It is documented here for completeness.

## Call

```
project-office install
```

## Behavior

- Fails with a non-zero exit if `BACKEND_BASE_URL` or `BACKEND_USER_PROFILE_PATH` is not
  configured — before any prompt.
- Fails with a non-zero exit if the CLI is already installed (settings file exists) — no
  prompts, no file changes.
- Otherwise prompts for settings (values masked where secret) and writes them to the
  settings file.

No `--format` option — this command has no structured output to render.
