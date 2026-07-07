---
paths:
  - "src/commands/**/*.ts"
---

# Rule: Agent instructions upkeep

The CLI exposes agent-facing instructions through the `instructions` command
(`project-office instructions [command]`). Their content is a **separate source** from the
human docs under `docs/` — dedicated instruction files in
`src/commands/instructions/content/`, wired through `instructions.registry.ts` and served
embedded in the compiled binary.

Because that content is maintained by hand, it drifts from reality the moment a command
changes. Keeping it in sync is **mandatory**, not optional.

## When you add a new command

Adding a command is not complete until its instructions exist:

1. Add a per-command instruction file in `src/commands/instructions/content/`
   (agent-adapted: purpose, exact invocation, option semantics, output shape, scope rule,
   common errors/exit behavior, copy-ready examples).
2. Register it in `instructions.registry.ts` under the command's CLI key
   (e.g. `task:view`) so lookup and the overview index pick it up.
3. Extend the overview (`content/overview.md`) — the command index always, and the shared
   context when the new command introduces a concept agents must know.

## When you change an existing command

If you change a command's name, options, output format, or behavior, update its
instruction file (and the overview if the command's key or a shared concept changed) in the
same change. The instruction must match the command's real options and output.

## Scope

This rule governs the agent instructions only. The human docs under `docs/` follow their
own flow (see `development-workflow.md`); do not conflate the two sources.
