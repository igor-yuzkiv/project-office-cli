# Rule: Configuration

Scope: **global runtime configuration** for the CLI itself. Project-office-scoped and
per-user configuration are separate concerns and are not covered here.

## Where configuration lives

- Global configuration is read from a `.env` file at the repository root, loaded
  automatically by Bun.
- `.env` holds real local values and is **git-ignored**. Never commit it.
- A committed **`.env.example`** documents every variable the CLI reads, with safe
  placeholder values (no secrets). Keep it in sync: adding or removing a variable means
  updating `.env.example` in the same change.
- Environment variable names are `UPPER_SNAKE_CASE`.

## Typing

Declare the shape of the environment in `src/env.d.ts` by augmenting Bun's `Env`
interface, so `Bun.env` is fully typed:

```ts
// src/env.d.ts
declare module "bun" {
  interface Env {
    BACKEND_URL: string;
  }
}
```

- Read configuration through the typed `Bun.env` (for example `Bun.env.BACKEND_URL`),
  not untyped `process.env`.
- Every variable added to `.env.example` gets a matching entry in `src/env.d.ts`.

If configuration reads need validation or defaults, centralize them in
`shared/libs/config/` rather than scattering `Bun.env` access across the codebase.
