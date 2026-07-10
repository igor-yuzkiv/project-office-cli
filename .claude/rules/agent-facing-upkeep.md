---
paths:
  - "src/commands/**/*.ts"
---

# Rule: Agent-facing surface upkeep

Two parts of this CLI describe its behavior to agents rather than implement it directly:
the **agent instructions** (`instructions` command) and the **status checklist**
(`status` command). Both are hand-maintained and drift from reality the moment the
underlying command or dependency changes. Keeping them in sync is **mandatory**, not
optional.

## Agent instructions

The CLI exposes agent-facing instructions through the `instructions` command
(`project-office instructions [command]`). Their content is a **separate source** from the
human docs under `docs/` — dedicated instruction files in
`src/commands/instructions/content/`, wired through `instructions.registry.ts` and served
embedded in the compiled binary.

### When you add a new command

Adding a command is not complete until its instructions exist:

1. Add a per-command instruction file in `src/commands/instructions/content/`
   (agent-adapted: purpose, exact invocation, option semantics, output shape, scope rule,
   common errors/exit behavior, copy-ready examples).
2. Register it in `instructions.registry.ts` under the command's CLI key
   (e.g. `task:view`) so lookup and the overview index pick it up.
3. Extend the overview (`content/overview.md`) — the command index always, and the shared
   context when the new command introduces a concept agents must know.

### When you change an existing command

If you change a command's name, options, output format, or behavior, update its
instruction file (and the overview if the command's key or a shared concept changed) in the
same change. The instruction must match the command's real options and output.

## Status checklist

`project-office status` (`src/commands/status/checklist/`) is the preflight check
agents run to know whether the CLI is ready to use — installed, linked to a project,
reachable, authenticated, with access to that project. It only tells the truth if it
actually probes everything the CLI's operation depends on.

Whenever you implement or change something the CLI's operation depends on (a new
precondition, a new local artifact, a new required backend call, a new failure mode that
other commands rely on not hitting), add a new checklist file (`NN-<name>.check.ts`,
registered in `checklist/index.ts`) or update an existing check so `status` reflects it.
A dependency the checklist doesn't verify is one agents will only discover by hitting a
real command failure — which is exactly what `status` exists to prevent.

## Scope

This rule governs the agent-facing surface only (`instructions` content and the `status`
checklist). The human docs under `docs/` follow their own flow (see
`workflow.md`); do not conflate the two sources.
