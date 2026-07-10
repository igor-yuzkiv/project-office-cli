# Flow: task — read / create / update project tasks

Read and maintain the project's tasks and comments through the `project-office` CLI. Everyday
interface: read, list, update, comment, and light (skeleton) create. Larger scoping — interviews,
decomposition into several tasks, plan sign-off — happens outside this flow; see Boundary.

The operation → command map is in `references/office-cli.md`; a command's exact options and
output come from `project-office instructions <command>`.

## Operations

- **Find / read** — list tasks, view a task, read its comments.
- **Update** — change a task with `task:update` (name, status, description, tags — see its
  instructions for semantics; priority, dates, and task list are not settable through the CLI).
  Keep the `description` the statement of intent; do not overwrite it with running progress.
- **Status** — statuses and who may change them when are defined in
  `<repo>/.project-office/AGENTS.md`, not here. Read it before touching `--status`; when it is
  absent or silent on a transition, ask the user instead of deciding alone (if absent, offer to
  seed it — setup flow, step D1).
- **Skeleton create** — a simple, already-decided task: `--name` + a `--description` that states
  the outcome, why it matters, and the target repo absolute path.
- **Comments — the work log.** Anything that is not name/description/status goes to
  `task:comment-add`: progress notes, decisions, open questions, verification results, and any
  artifacts produced while working that the project should keep for audit and history.

## Light flow (read → clarify → apply → show)

1. **Read first** — locate and view the task and its comments; scan the task list for
   related/prior work so you don't duplicate. If the task description explicitly references
   documentation, a document key, or a documentation link, read only those referenced
   documents before planning or implementation (`flows/documentation.md`) — do not search or
   read unrelated project documentation.
2. **Clarify only real gaps** — facts about code → explore / Grep; a genuine preference or scope
   gap → one `AskUserQuestion`. Do not interview.
3. **Apply via the CLI** — the mapped command (multi-line `--description` / `--content` via a
   file or stdin, per `references/office-cli.md` §"Multi-line / large input").
4. **Show the result** — re-view the task (and its comments) and report exactly what changed.

## Boundary

Known, bounded changes only. If the work needs an interview to discover requirements,
decomposition into several tasks, or a plan the user must sign off, say so and defer to a
planning effort — don't half-do scoping here. The backend models **tasks + comments**; richer
structure a task needs (an implementation plan, criteria) is written as markdown inside the
task `description`.

## Policies

- **Name the target repo** (absolute path) in the task `description` — the backend task has no
  repo field. The current repo and the other repos linked to the project are listed by
  `project-office project:view` (the current one is marked `(this repo)`).
- **Ground claims; never invent** requirements — keep open questions visible as a task comment
  (`task:comment-add`), not as invented description text.
- The access invariants (CLI-only, marker ownership) are in `SKILL.md` — they apply here.
