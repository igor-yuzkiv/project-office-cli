---

paths:

* ".env.example"
* "src/env.d.ts"
* "src/shared/config/**"
* "src/**"

---

# Rule: Configuration

Scope: configuration for `project-office-cli` itself.

The project has two configuration homes:

* `.env` — runtime values that may differ between correct runs;
* `src/shared/config/` — shared program configuration that defines how the CLI works.

Project Office workspace state, per-repository `.project-office` metadata, and per-user
settings are separate concerns.

## Environment variables

Runtime configuration is read from `.env` at the repository root.

`.env` contains real local values and is git-ignored. Never commit it.

`.env.example` documents every variable the CLI reads, using safe placeholder values only.
When adding, renaming, or removing an environment variable, update `.env.example` in the
same change.

Environment variable names use `UPPER_SNAKE_CASE`.

Declare all environment variables in `src/env.d.ts`:

```ts
declare module "bun" {
  interface Env {
    BACKEND_BASE_URL: string
  }
}
```

Read environment variables through `Bun.env`, not `process.env`.

## Env or config

Use this test:

**Would two correct runs of this CLI reasonably need different values?**

If yes, put the value in `.env`.

If no, and the value defines shared CLI behavior, put it in `src/shared/config/`.

## Put in `.env`

Use `.env` for:

* backend base URL;
* tokens, credentials, and secrets;
* local filesystem locations that depend on the user's machine;
* feature flags intended to vary between runs;
* timeouts, retry limits, page sizes, or similar tunables when they really need runtime
  control.

Secrets always belong in `.env`. Never commit them.

## Put in `shared/config`

Use `src/shared/config/` for shared program configuration:

* exit codes;
* default command behavior;
* settings file names and directory names;
* fixed backend API paths;
* formatting values reused across commands;
* interactive setup prompt definitions;
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

## Borderline values

If a value might vary someday but has no real reason to vary today, keep it in
`shared/config`.

Promote it to `.env` only when runtime control becomes necessary.

Secrets are the exception: keep them out of the repository from day one.
