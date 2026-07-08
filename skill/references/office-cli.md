# Office CLI — operation → command binding

This file is the **single place** that binds the office operations the skill speaks in
(find / read / create / update / comment) to the **concrete backend commands**. Today the
backend is the **Task Manager** app, reached through the `project-office` CLI (an HTTP client
to that backend). To move the office onto a different system later, rewrite this file only —
the skill flows stay unchanged.

It is intentionally **hybrid**: it holds the *office policy* the CLI does not know (allowed
status transitions, project scope, what the agent may not do). It does **not** re-document each
command's flags and output — read those from the CLI itself with
`project-office instructions <command>`. Where the two differ, the office policy below **wins**.

## 1. How to reach the office

- **Check readiness first: `project-office status`.** It never fails (exits 0), needs no marker,
  and reports in fields whether the CLI is installed, the repo is linked, the server is
  reachable/authenticated, and `ready`. Run it before assuming any state instead of probing files
  or catching errors — see `references/context-resolution.md` §"Check readiness first".
- **Only the `project-office` CLI.** All Task Manager data is read and written **exclusively**
  through `project-office` — never a direct backend API call, database access, or filesystem
  shortcut. Those are not available to the agent and must not be attempted.
- **One resolved project, no `--project`.** Every task/comment command operates inside the single
  project the CLI resolves from its launch directory — it walks up to
  `<repo>/.project-office/repo-settings.json` and reads its `projectId`. Run commands **from
  inside the linked repo**; do not pass or assume a project id. The **only** commands taking an
  explicit `--project <id>` are the two bootstrap commands `project:connect` and
  `project:link-repo` (they establish the link — see the `setup` flow).
- **Never hand-write `repo-settings.json`.** It is written **exclusively** by `project:link-repo`
  (even to fix or re-point a link). Do not create or edit it directly.
- **Look up exact usage from the CLI, not from memory.** For any command's precise options,
  semantics and output shape, run `project-office instructions <command>` — prefer it over
  `--help` (which lists flags but not their meaning or the output shape). Overview:
  `project-office instructions`. Command keys:
  `status`, `project:view`, `project:connect`, `project:link-repo`, `task:list`,
  `task:view`, `task:create`, `task:update`, `task:comments`, `task:comment-add`,
  `task:comment-update`, `install`.
- **Output format.** Every read command takes `-f, --format <json|markdown>` (default
  `markdown`: YAML frontmatter of properties, then body). Pass `--format json` only when you
  need to parse a field programmatically.
- **The binary.** The skill assumes `project-office` is on `PATH`. It reads its backend
  configuration (`API_BASE_URL`, `BACKEND_*`) from the environment, so it must be installed as a
  globally runnable command. Its one-time per-user setup is `project-office install` (stores the
  API token) — see the `setup` flow; if a command reports it is not installed / has no context,
  fall back to that.

## 2. Office overrides of the stock CLI

Where the CLI's own behavior differs from these, **these win**:

- **`completed` requires the user's explicit go-ahead; `closed` is user-only.** The agent may
  claim and progress a task but stops short of unilaterally finishing it — see §4 "Status
  policy".
- **`task:update` changes only `status` and `description`.** Name, priority, dates, task list
  and tags are set at **create** time and cannot be changed through this command; do not promise
  to change them here.
- **No draft / milestone / doc / acceptance-criteria / plan / notes concepts.** The backend
  models only **tasks + comments** (§3). Progress, decisions and open questions live in
  **comments**; richer scoping (an implementation plan, criteria) goes as structured markdown
  **inside the task `description`**, not as separate fields.

## 3. Office model (entities)

| Entity      | What it is                                    | Created / updated with                              |
| ----------- | --------------------------------------------- | --------------------------------------------------- |
| **Project** | the office itself (resolved from the repo)     | read-only here: `project:view`                      |
| **Task**    | a unit of work                                | `task:create` / `task:update` (status+description)  |
| **Comment** | a note / question / progress entry on a task  | `task:comment-add` / `task:comment-update`          |

- **IDs.** A task is addressed by its human key (`TASK-1`) or its ULID; `-t, --task` accepts
  either. Read the real key back from `task:create` / `task:list` output — never invent one.
- **Priority** (create only): one of `none, low, medium, high, urgent`.
- **Status:** `open → in_progress → completed → closed` (§4).

## 4. Status policy

Backend statuses: **`open`** → **`in_progress`** → **`completed`** → **`closed`**.

**Allowed agent transitions — only these:**
- `open → in_progress` — when actually starting work on the task (claiming it), not before;
- `in_progress → completed` — **only after the user explicitly confirms** the work is finished
  and can be handed off.

**User-only:** `closed` (and any archival/final disposition). A task that **can't proceed** is
not parked in a status — leave it `in_progress`, raise it with the user, and record the blocker
as a **comment**.

## 5. Operation → command

Run from inside the linked repo (no `--project`). For the exact options and output of any command
below, first run `project-office instructions <command>`.

### Find / read (do this before changing anything)
```bash
project-office project:view                         # the office/project itself
project-office task:list                             # list tasks (pagination/sort flags exist)
project-office task:view --task TASK-1               # a single task (frontmatter + description)
project-office task:comments --task TASK-1           # comments on a task
```

### Create (write so a future agent needs no prior context)
```bash
project-office task:create --name "<title>" \
  --description "<outcome, why it matters, and the target repo absolute path>" \
  --priority high
# large/multi-line description: --description @/tmp/<slug>.md   (see §6)
# optional at create time only: --tag <tagId> (repeatable), --start-date, --due-date, --task-list <id>
```

### Update (status and/or description only)
```bash
project-office task:update --task TASK-1 --status in_progress          # claim
project-office task:update --task TASK-1 --status completed            # only after the user confirms
project-office task:update --task TASK-1 --description @/tmp/TASK-1.md  # replace description
```

### Comment (progress / decisions / open questions)
```bash
project-office task:comment-add --task TASK-1 --content "<progress, decision, or open question>"
project-office task:comment-update --task TASK-1 --content "<...>"   # see instructions for which comment it targets
```

## 6. Multi-line / large input (`--description`, `--content`)

`--description` and `--content` accept text three ways — prefer the file/stdin forms for
anything multi-line, since shell heredocs and the `$'…\n'` shorthand are unreliable in agent
sandboxes:

1. **From a file:** compose the body in a scratch file, then pass it with `@`:
   ```bash
   project-office task:update --task TASK-1 --description @/tmp/TASK-1.md
   ```
2. **From stdin:** pass `-` and pipe:
   ```bash
   cat /tmp/TASK-1.md | project-office task:update --task TASK-1 --description -
   ```
3. **Inline** for a short single line: `--description "One line."`
