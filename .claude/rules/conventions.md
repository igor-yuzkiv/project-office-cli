---
paths:
  - "src/**/*.ts"
---

# Rule: CLI file naming and command style

Stack-specific conventions for this CLI. General code style and simplicity live in
`principles.md`; project structure lives in `architecture.md`.

## File naming

Follow a NestJS-style convention: **kebab-case** filenames shaped as `name.role.ext`.

- Filenames are lowercase; separate words in the `name` with `-`
  (`create-task`, `task-comments`).
- `name` describes the subject (entity, feature, or command); `role` is a suffix from
  the table below. Keep one clear role per file.
- Repeat the entity name in the `name` when it aids clarity and searchability
  (`task.api.ts`, not `api.ts`).
- Each file has one dominant export; the filename reflects that export's subject.
- Match the suffix to the folder: files in `api/` end with `.api.ts`, files under
  `commands/**` with `.command.ts`, and so on.
- Barrels are always `index.ts` — no role suffix.

| Role / suffix | Used for | Example |
| --- | --- | --- |
| `.command.ts` | CLI command definition | `view-task.command.ts` |
| `.api.ts` | entity backend request functions | `task.api.ts`, `task-comments.api.ts` |
| `.type.ts` | types and interfaces | `task.type.ts` |
| `.config.ts` | configuration values (entity/module or `shared/config/`) | `task.config.ts`, `exit-code.config.ts` |
| `.util.ts` | utility functions | `date.util.ts` |
| `.spec.ts` | tests | `task.api.spec.ts` |
| `index.ts` | barrel export | `index.ts` |

The table is the common set, not a closed list. When a file's role is not covered by
it, give it a descriptive role suffix that names its responsibility — `.service.ts`,
`.handler.ts`, `.manager.ts`, and so on — keeping the same `name.role.ext`,
kebab-case, lowercase shape. Reuse an existing suffix consistently instead of coining a
near-synonym for the same role.

## CLI command and option style

This CLI is agent-facing, so commands must be boring, explicit, predictable, and hard
to misunderstand.

- Binary name: `project-office`.
- Use `namespace:action` for grouped commands (`task:view`, `task:update`); simple
  top-level commands stay bare (`install`).
- Use explicit named options; prefer full names for clarity (`--task`, `--project`,
  `--format`).
- Short aliases may be added for frequently used options (`-t`, `-p`, `-f`).
- Avoid hidden positional arguments when a named option would make the command clearer.

```bash
project-office install
project-office task:view --task=TASK-1
project-office task:view -t TASK-1
```
