---
name: project-office
description: >-
  Work with a project office — the tasks of a Task Manager backend project that
  the current code repository is linked to. Auto-use inside a repo linked to a
  project office (it contains a .project-office/repo-settings.json marker) to
  read, find, create or update that project's tasks and comments, or to link the
  current repo to a project. All project data is reached only through the
  `project-office` CLI; per-project rules live in <repo>/.project-office/AGENTS.md.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, Task, AskUserQuestion
---

# Project Office

A project office is a **Task Manager backend project** — its tasks and comments — that one or
more code repositories are **linked** to. There is no local office folder: a repo is linked by a
`<repo>/.project-office/repo-settings.json` marker carrying the project's `projectId`, and all
project data is reached **only through the `project-office` CLI**, which resolves that `projectId`
from the current directory. Handle a request by selecting the right flow, then **read and follow
the matching `flows/<flow>.md` exactly** — do not improvise it here.

## Step 1 — Load project context

1. **Check readiness — run `project-office status` first.** It never fails (exits 0, needs no
   marker) and reports, in fields, whether the CLI is `installed`, whether this repo is `linked`
   (+ `project_id`), whether the server is `server_reachable` / `server_authenticated`, and
   `ready` (installed && linked). Do not probe files by hand to guess this. Read
   `references/context-resolution.md` for how to interpret the result and resolve the project.
2. **Read `<repo>/.project-office/AGENTS.md` if it exists** — it holds this project's office
   rules and any per-project customizations; follow it alongside the flow. (A fresh `setup` that
   links the repo has no AGENTS.md yet — that's expected; setup creates it.)

## Step 2 — Select the flow

**If `status` reports `ready: false`** (CLI not installed, or this repo not linked) the **setup**
flow must run first, whatever the request. Otherwise pick by intent:

- **setup** → `flows/setup.md` — the repo is not linked yet, or the user asks to link this repo to
  a project, or to (re)configure the per-project office context.
- **task** → `flows/task.md` — the user refers to a task (`TASK-1`), the task board, or asks to
  read / find / create / update a task or its comments.

If genuinely ambiguous, ask one question before proceeding.

## Invariants (all flows)

- **All project data is reached only through the `project-office` CLI**
  (`references/office-cli.md`) — never direct backend API calls, database, or filesystem
  shortcuts. The CLI resolves the `projectId` from the current directory; there is no `--project`
  option except on the two bootstrap commands (`project:connect`, `project:link-repo`).
- **Never hand-write or edit `<repo>/.project-office/repo-settings.json`** — it is written
  exclusively by `project:link-repo` (even to fix or re-point a link).
- **Read a command's exact options and output from the CLI itself** with
  `project-office instructions <command>` — the office rules in `references/office-cli.md`
  §1 "How to reach the office" tell you when to do this, and **override** the stock CLI wherever
  they differ.
- Honor any per-project rules in `<repo>/.project-office/AGENTS.md`.
- Always read and follow the selected flow file; do not improvise the flow in the router.
