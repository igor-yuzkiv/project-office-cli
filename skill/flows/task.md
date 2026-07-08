# Flow: task — read / create / update project tasks

Read and maintain the project's tasks and comments through the `project-office` CLI. Everyday
interface: read, find, update, and light (skeleton) create. Not for interview-driven scoping,
decomposition, or critic-gated planning — see Boundary.

Concrete commands for every operation are in `references/office-cli.md`.

## Operations
- **Find / read** — search tasks, list them, view a task and its comments (always via the CLI).
- **Update** — `status` and/or `description` (the only fields `task:update` changes); record
  progress, decisions and open questions as **comments**.
- **Status** — allowed agent transitions only: `open → in_progress` (claim), `in_progress →
  completed` (**only after the user confirms**). `closed` is user-only.
- **Skeleton create** — a simple, already-decided task: `--name` + a `--description` that states
  the outcome, why it matters, and the target repo absolute path; optional `--priority`.
- **Comments** — the single place for anything that is not name/description/status: progress
  notes, decisions, and open questions (`task:comment-add`).

## Light flow (read → clarify → apply → show)
1. **Read first** — locate and view the task; search for related/prior work so you don't
   duplicate.
2. **Clarify only real gaps** — facts about code → explore / Grep; a genuine preference or scope
   gap → one `AskUserQuestion`. Do not interview.
3. **Apply via the CLI** — the mapped command (multi-line `--description` / `--content` via a file
   or stdin, per `references/office-cli.md` §6 "Multi-line / large input").
4. **Show the result** — re-view the task (and its comments) and report exactly what changed.

## Boundary
Known, bounded changes only. If the work needs an interview to discover requirements,
decomposition into several tasks, or a critic / plan sign-off — say so and defer to a planning
effort; don't half-do scoping here. The backend has no drafts, milestones, acceptance-criteria or
plan fields — if a request needs that structure, capture it as markdown inside the `description`
and flag that richer planning happens elsewhere.

## Policies
- **Name the target repo** (absolute path) in the task `description` — the backend task has no
  repo field. The current repo's path/name are in its `.project-office/repo-settings.json`;
  sibling repos on the same project are in the local cache (see `references/context-resolution.md`
  §"Knowing the project and its repos").
- **Ground claims; never invent** requirements — keep open questions visible as a task comment
  (`task:comment-add`), not as invented description text.
- **Never hand-write `repo-settings.json`** and never reach the backend except through the CLI.
