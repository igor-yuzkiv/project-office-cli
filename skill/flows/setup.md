# Flow: setup — link this repo to a project / configure context

Link the current code repo to a Task Manager backend project and configure its per-project office
context. Never plans or writes product code, and never creates the backend project itself — that
already exists in Task Manager; setup only links this repo to it by `projectId`.

## A. Read the state — `project-office status`

Run **`project-office status`** first (it never fails, needs no marker) and act on its fields.
If `status` itself does not run, confirm the binary is on `PATH` (`command -v project-office`) and
ask the user to place/symlink it before continuing.

- **`installed: false`** (`next_action: install`) — the CLI has no per-user settings yet. Tell the
  user to run **`project-office install`** themselves — it is interactive (a masked token prompt)
  and needs a real terminal plus the backend env (`BACKEND_BASE_URL`, `BACKEND_USER_PROFILE_PATH`,
  `API_BASE_URL`). Do **not** try to run it for them. Resume once installed (re-run `status`).
- **`server_reachable: false` / `server_authenticated: false`** — surface `server.error`; a down
  backend, a missing/expired token, or a missing `API_BASE_URL` in the CLI's environment is a
  different problem from "not linked". Resolve it before linking, or the link's verification (C4)
  will fail too.

## B. Determine the situation

From `status`: **`linked: false`** → this repo is not linked → link it (C), then configure context
(D). **`linked: true`** + the user wants to re-point or refresh → re-run C with the new
`projectId`, then D. Confirm the repo root (has `.git`, or the user names it) — take its absolute
path.

## C. Link the repo (via `project:link-repo` — never by hand)

The marker `repo-settings.json` is written **only** by the CLI. Do not create or edit it yourself.

1. **Ask the user for the `projectId`** — the Task Manager backend project this repo maps to. It
   is not discoverable from the CLI; the user must supply it.
2. **Gather repo metadata** for the link: `--name` (required), and optionally `--description` and
   one `--stack` per technology. Default `--path` is the current directory; pass an explicit
   `--path <repo root>` if the agent is not sitting at the repo root.
3. **Run the link command** from the repo:
   ```bash
   project-office project:link-repo --project <projectId> --name "<repo name>" \
     --description "<what this repo is>" --stack <tech> --stack <tech>
   ```
   This writes `<repo>/.project-office/repo-settings.json` and creates/updates the project's local
   cache record. For its exact options, `project-office instructions project:link-repo`.
4. **Verify:** run `project-office project:view` from the repo — it should resolve the project via
   the new marker and print it. If it errors, surface the message (bad `projectId`, missing token
   → back to A, or connectivity) and fix before moving on.

## D. Configure per-project context (skill superstructure)

1. **Seed the per-repo AGENTS.md.** Copy `templates/repo-agents.md` →
   `<repo>/.project-office/AGENTS.md`, filling in `<project_name>` / `<projectId>` (read them back
   from `project:view`). If it already exists, replace only the block between
   `<!-- project-office:managed:start -->` and `:end` (refresh the general rules) and leave the
   user's "Project-specific conventions" untouched.
2. **Offer Claude Code discovery** (`AskUserQuestion`): import the repo's office rules from
   `CLAUDE.md` or `CLAUDE.local.md` so Claude Code loads them at session start instead of relying
   on the model to notice a pointer. Options: **CLAUDE.md** (committed, shared),
   **CLAUDE.local.md** (personal, git-ignored), **skip** (add nothing). Add this line outside code
   spans/blocks so Claude Code treats it as an import:
   `@.project-office/AGENTS.md`
   On **skip**, add nothing; the project-office skill still reads `.project-office/AGENTS.md` when
   it engages.
3. **gitignore.** Add `.project-office/repo-settings.json` to the repo `.gitignore` (personal link
   carrying an absolute path + `projectId`). Leave `.project-office/AGENTS.md` **committable**
   (shared project rules).

## E. Report

The linked `projectId` and project name, what happened, the repo path, whether a
CLAUDE.md/CLAUDE.local.md import was added (or skipped), and that per-project rules live in
`.project-office/AGENTS.md`.
