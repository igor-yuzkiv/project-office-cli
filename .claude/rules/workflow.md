# Rule: Development workflow

Work moves through two human checkpoints. Between them the agent works on its own and does not
invent extra gates. Git safety (commit/push/reset/rebase/merge) is enforced mechanically in
`.claude/settings.json`, not by prose here.

## Checkpoint 1 — Plan approval

Before writing code for anything non-trivial, present the plan: the intended change, the
affected scope, and what must not change (command names, options, output shapes, CLI
contracts). Wait for approval. `Clarify before acting` (`principles.md`) applies here.

## Implementation (between checkpoints)

Implement within the approved scope, following `principles.md`. If the work must go outside
that scope, stop and report it — do not silently absorb it. When the change touches a
command's name, options, output, or a precondition, keep the agent-facing surface in sync
(`agent-facing-upkeep.md`). Run the minimal relevant cheap checks for what changed — a
logic/type change → `bunx tsc --noEmit`; a formatting-affecting change → `bunx prettier
--check src/`.

## Independent review

Before final review, a separate agent — a different context from the author — reviews the
diff: correctness, scope adherence, regressions, over-engineering. Clear blockers before
handing off. Skip only for trivial changes, and say so. (Skill changes under `skills/**` use an
independent `prompt-engineer` review instead — see `skills.md`.)

## Checkpoint 2 — Final diff review

Present what changed — and what the independent review flagged — before it is considered done.
Run the full suite or tests only when asked.

## Documentation

Ask whether documentation is needed before creating or updating it (`AskUserQuestion`). Keep
project documentation under `docs/`.

## Corrections

Apply corrections in place, within scope. Re-run only the minimal relevant cheap checks. Do
not restart the flow.
