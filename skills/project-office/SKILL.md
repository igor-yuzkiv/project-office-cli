---
name: project-office
description: >-
  Read, find, create, update or comment on the tasks of the single project
  this repository is linked to. Use whenever the user refers to a task by its
  key (PROJECT_PREFIX-<number>, e.g. MTM-7), mentions the task board, asks to
  work with a task, its comments, or a project document (e.g. DOC-PROJECT_PREFIX-<number>, e.g. DOC-MTM-1), or to link this repo to a project.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, AskUserQuestion
---

# Project Office

Handle a request by selecting the right flow and following the matching
`flows/<flow>.md` — the flows encode the CLI's real contract, so improvising
steps here desyncs you from the binary.

## Step 1 — Load project context

1. **Check readiness — run `project-office status` once per session**, and again
   only after a command fails unexpectedly; each run probes the server, so don't
   repeat it before every action. It never fails (exits 0, needs no marker) and
   prints an ordered preflight checklist ending in `Result: ready` or
   `Result: failed`. On `failed`, the first failing check's messages name the
   problem and the remediation; do not probe files by hand to guess the state.
2. **Read `<repo>/.project-office/AGENTS.md` if it exists** — it holds this
   project's working rules: the task workflow, which status transitions the agent
   may make and when, and any per-project customizations. Follow it alongside the
   flow. (A fresh `setup` that links the repo has no AGENTS.md yet — that's
   expected; setup creates it.) If the repo is linked but AGENTS.md is missing,
   offer to seed it from `templates/repo-agents.md` (setup flow, step D1).

## Step 2 — Select the flow

**If `status` reports `Result: failed`** the **setup** flow must run first,
whatever the request — it reads the failing check and routes accordingly: a
failing repository link means linking this repo; a failing CLI-settings / server
/ authentication check means surfacing that check's remediation to the user first
(linking would not help). Otherwise pick by intent:

- **setup** → `flows/setup.md` — the repo is not linked yet, or the user asks to
  link this repo to a project, to (re)configure the per-project office context, or to
  refresh/update it to the current skill version.
- **task** → `flows/task.md` — the user refers to a task (`PREFIX-<number>`), the
  task board, or asks to read / find / create / update a task or its comments.
- **documentation** → `flows/documentation.md` — the user or a task explicitly
  references a project document (a `DOC-…` key, a documentation link, or a request
  to read / create / update a doc). A light, context-only flow: read when
  referenced, write only when asked.

If genuinely ambiguous, ask one question before proceeding.

## Invariants (all flows)

- **All project data is reached only through the `project-office` CLI**
  (`references/office-cli.md`) — never direct backend API calls, database access,
  or filesystem shortcuts.
- **Never hand-write or edit `<repo>/.project-office/repo-settings.json`** — it is
  written exclusively by `project:link-repo` (even to fix or re-point a link).
- **Read a command's exact options and output from the CLI itself** with
  `project-office instructions <command>` — do not guess flags or rely on memory.
- **Workflow rules (status transitions, when to ask the user) come from
  `<repo>/.project-office/AGENTS.md`**, not from this skill.
