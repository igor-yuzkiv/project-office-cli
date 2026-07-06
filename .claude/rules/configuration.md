---
paths:
  - ".env.example"
  - "src/env.d.ts"
  - "src/shared/libs/config/**"
  - "src/**"
---

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

## No project-level magic values in code

No **bare magic literal** in `src/`. Every value that carries meaning gets a home: either
a `.env` variable (read through typed `Bun.env`) or a **named** in-code constant. What this
rule forbids outright is an unnamed literal encoding a URL, path, secret, or tunable sitting
inline in the logic. The only real question is *which home* — and there is one test for it.

**The test — env or constant?** Ask: *would two correct runs of this CLI ever need a
different value?*

- Differs by environment, deployment, machine, or user → **`.env`**.
- It is a secret or credential → **`.env`, always** — no exceptions, never a constant.
- Same for every correct run and part of the program's own meaning or the code's contract
  → **named constant** in code.

**Goes to `.env`** (read via `Bun.env`, documented in `.env.example` + `src/env.d.ts`):

- backend base URL and API paths — this project already splits these into `BACKEND_*`
  variables (e.g. `BACKEND_BASE_URL`, `BACKEND_*_PATH`); follow that pattern;
- tokens, credentials, any secret — never inline, never committed;
- filesystem locations the CLI depends on (cache dir, config dir);
- timeouts, retry counts, page sizes, and similar tunables a deployment may want to change.

**Stays a named constant in code** (not env):

- domain constants that are part of the logic (enum values, fixed status strings, exit
  codes, formatting/layout literals);
- values identical in every environment that encode *how the program works*, not *how it
  is deployed*.

**Borderline?** If a value only *might* need to vary and there is no concrete reason a
deployment would change it today, keep it as a named constant — a constant promotes to
`.env` later without drama, so do not add configuration surface speculatively. The
exception overrides this: anything secret or part of an external contract goes to `.env`
now, even when in doubt.

When a value does land in `.env`, adding it means updating `.env.example` and
`src/env.d.ts` in the same change (see above).
