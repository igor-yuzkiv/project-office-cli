# Flow: task — work with the project's tasks

Everyday interface to the project's tasks and comments through the `project-office` CLI.

**The workflow itself — which command to run when, which statuses the agent may move, what
goes into a comment vs the task's own fields — is defined in
`<repo>/.project-office/AGENTS.md`, not here.** Read it before acting. If it is missing, offer
to seed it (setup flow, step D1); if it is silent on what you are about to do, ask the user
instead of deciding alone.

This flow only covers what AGENTS.md does not: where to find a command, and where this flow
stops.

## Commands

The operation → command map is in `references/office-cli.md`. A command's exact options,
semantics and output come from `project-office instructions <command>` — read it before first
use in a session rather than guessing flags.

Multi-line `--description` / `--content` goes through a file or stdin, per
`references/office-cli.md` §"Multi-line / large input".

## Before acting

- **Read first.** Locate the task and read its current state and comments; scan the task list
  for related or prior work so you don't duplicate it.
- **Referenced docs only.** If the task explicitly names a document key or documentation link,
  read those and nothing else (`flows/documentation.md`).
- **Clarify only real gaps.** Facts about code → explore / Grep. A genuine preference or scope
  gap → one `AskUserQuestion`. Do not interview.
- **Report what changed.** After applying a change, re-read the task and say what actually
  changed.

## Creating a task

A task this flow can create is one that is already decided: `--name` plus a `--description`
stating the outcome, why it matters, and the target repo absolute path (the task itself has no
repo field — `project-office project:view` lists the linked repos, the current one marked
`(this repo)`).

Ground it in what is known. Never invent requirements — surface open questions to the user
rather than writing them into the description as fact.

## Boundary

Known, bounded changes only. Work that needs an interview to discover requirements,
decomposition into several tasks, or a plan the user must sign off is outside this flow — say
so and stop rather than half-scoping it here.

Richer structure a task needs (an implementation plan, acceptance criteria) is written as
markdown inside the task `description` — there are no extra fields for it.

## Access invariants

CLI-only, marker ownership — see `SKILL.md`. They apply here.
