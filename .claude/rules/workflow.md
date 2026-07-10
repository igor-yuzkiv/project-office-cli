# Rule: Development workflow

How to approach changes in this repository. The CLI-boundary rules and stack live in
`CLAUDE.md`; general principles live in `principles.md`.

## Human-in-the-loop gates

The user controls phase transitions. The agent never crosses a phase boundary or runs a
gated action on its own — it stops, reports briefly, and waits for the user's explicit
approval (ask via `AskUserQuestion`). Until the user says go, the agent stays in the current
phase.

Gated actions — never without explicit approval, even mid-phase:

- moving from one workflow phase to the next;
- running an independent review;
- running tests;
- running the full validation suite (all checks at once);
- any project-office status transition (e.g. `in_progress → ready_to_test`).

The agent never sets `completed` / `closed` — those are the user's, always (see
`.project-office/AGENTS.md`).

Inside the current phase, without asking, the agent may only:

- implement the requested change within scope;
- run the minimal relevant cheap checks for that change (see Validation gate).

## Workflow phases

Every task moves through the phases below in order, with a gate between each. The general
principles in `principles.md` and the code conventions in `code-conventions.md` govern how
each phase is carried out.

### 1. Intake and analysis

Requirements may arrive from a Project Office task or directly in chat. Treat both as the
source of what needs to be built.

Before writing code, understand:

- the requested behavior;
- the affected scope;
- the existing contracts and constraints;
- the risks and possible side effects.

When requirements are incomplete or ambiguous, resolve them per **Clarify before acting**
(`principles.md`) first.

**Gate → Implementation:** present the understanding and the intended approach; wait for the
user's approval before writing code.

### 2. Implementation

Implement the requested change with the minimal necessary edits, following **Change
strategy** (`principles.md`) and the code conventions in `code-conventions.md`. Stay inside
the requested scope — no opportunistic refactoring or unrelated cleanup — and change
contracts only when the task requires it.

When the change touches a command's name, options, output, or a CLI precondition, keep the
agent-facing surface in sync (`agent-facing-upkeep.md`).

Run the minimal relevant cheap checks for the change to confirm it holds together (see
Validation gate). Do not run the full suite, tests, or a review here.

**Gate → Validation and review:** report what changed and which cheap checks were run; wait
for the user's approval before running review, the full validation suite, or tests.

### 3. Validation and review

Runs only after the user approves — nothing in this phase is auto-triggered.

- **Review** — run an independent review (separate subagent / review lane) only when the
  user approves it; it must be independent from the implementation context.
- **Full validation / tests** — run the full suite and tests only when the user approves,
  choosing what is relevant to the change.

After validation/review, report briefly:

- what was changed;
- what was verified (and what was not);
- important risks or assumptions;
- anything that still needs attention.

Ask whether corrections are needed and handle them per **Corrections** below. Do not advance
to documentation, and do not change task status, without the user's approval.

**Gate → Documentation / hand-off:** wait for the user's approval before moving to
documentation or making any project-office status transition.

### 4. Documentation

A separate phase, entered only after the user approves it.

Before writing or updating documentation, explicitly ask the user whether documentation is
needed (`AskUserQuestion`). Do not create or update documentation unless the user confirms.

When documentation is requested:

- decide whether to create a new document or update an existing one;
- keep all project documentation under `docs/`;
- do not add documentation outside `docs/` unless the user explicitly asks for it.

## Corrections

When the user gives corrections, do not restart the flow. Handle them in place:

- apply the requested changes only, within their scope;
- re-run only the minimal relevant cheap checks;
- do not re-run review or tests, do not advance phases, do not change task status;
- report the result and wait for the user's next instruction.

Re-running review, the full suite, or tests after corrections happens only with the user's
approval — same gate as the first time.

## Validation gate

Validation is proportional and selective — match the checks to the change instead of running
everything:

- Pick only the cheap checks relevant to what changed — a logic/type change → `bunx tsc
  --noEmit`; a change affecting formatting → `bunx prettier --check src/`. Skip what the
  change does not touch.
- The agent runs these relevant cheap checks on its own to close implementation.
- The full run — all checks plus any tests, and `bun run build` / `compile` when bundling is
  affected, typically before hand-off — is a gated action: run it only with the user's
  approval.

Concrete commands live in `CLAUDE.md` (Verification) and `package.json`.
