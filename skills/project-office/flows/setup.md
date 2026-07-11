# Flow: setup — link this repo to a project / configure context

Link the current code repo to a Project Office project and configure its per-project office
context. Never plans or writes product code, and never creates the project itself — that already
exists; setup only links this repo to it by `projectId`.

## A. Read the state — `project-office status`

Read the state from **`project-office status`** — reuse this session's result if you already have
a fresh one; re-run it only when the state may have changed (e.g. after `install` or linking).
If `status` itself does not run, confirm the binary is on `PATH` (`command -v project-office`) and
ask the user to place/symlink it before continuing.

Act on the first failing check:

- **CLI settings** failing — the CLI has no per-user settings yet. Tell the user to run
  **`project-office install`** themselves — it is interactive (prompts for backend URLs with
  defaults and a masked API token) and needs a real terminal. Do **not** try to run it for them.
  Resume once installed (re-run `status`).
- **Server connection / Authentication** failing — surface that check's messages; a down server
  or a missing/expired token is a different problem from "not linked". Resolve it before linking,
  or the link's verification (C4) will fail too.
- **Repository link** failing — this repo is not linked; that is what this flow fixes (C).
- **Project access** failing — the repo is linked, but the linked project is missing or
  inaccessible. Surface the check's messages; re-linking with a valid `projectId` (C) may be
  needed — confirm the id with the user, do not guess one.

## B. Determine the situation

From `status`: **Repository link failing** → link this repo (C), then configure context (D).
**All checks passing** + the user wants to re-point to another project → re-run C with the new
`projectId`, then D. **All checks passing** + the user asks to refresh/update the office context
(e.g. after a skill update) → F. Confirm the repo root (has `.git`, or the user names it) — take
its absolute path.

## C. Link the repo (via `project:link-repo` — never by hand; see `SKILL.md` invariants)

1. **Ask the user for the `projectId`** — the project this repo maps to. It is not discoverable
   from the CLI; the user must supply it.
2. **Gather repo metadata** for the link: `--name` (required), and optionally `--description` and
   one `--stack` per technology. Default `--path` is the current directory; pass an explicit
   `--path <repo root>` if the agent is not sitting at the repo root. Exact options:
   `project-office instructions project:link-repo`.
3. **Run the link command** from the repo:
```bash
   project-office project:link-repo --project <projectId> --name "<repo name>" \
     --description "<what this repo is>" --stack <tech> --stack <tech>
```
4. **Verify:** run `project-office project:view` from the repo — it should print the project. If
   it errors, surface the message (bad `projectId`, missing token → back to A, or connectivity)
   and fix before moving on.

## D. Configure per-project context

1. **Seed the per-repo AGENTS.md.** Copy `templates/repo-agents.md` →
   `<repo>/.project-office/AGENTS.md`, filling in `<project_name>` / `<projectId>` (read them back
   from `project-office project:view` — `id` is in the frontmatter, the name is the `#` heading).
   If it already exists, replace only the block between `<!-- project-office:managed:start -->`
   and `<!-- project-office:managed:end -->` and leave the user's own sections untouched.
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

Tell the user: the linked project (`projectId` + name), the repo path, what was done or skipped
(including the CLAUDE.md/CLAUDE.local.md import choice), and that the project's working rules now
live in `.project-office/AGENTS.md` and can be edited there.

## F. Refresh — re-sync an already-linked repo after a skill update

1. **Compare the managed block** in `<repo>/.project-office/AGENTS.md` with the one in
   `templates/repo-agents.md` (between `<!-- project-office:managed:start -->` and
   `<!-- project-office:managed:end -->`). If they differ, re-run D1 — it replaces only that block
   and leaves the user's sections untouched. If the file has no managed markers at all, do not
   overwrite it: show the user the current template block and let them merge it in, so their own
   rules survive.
2. **Re-verify the surroundings:** the `.gitignore` entry for
   `.project-office/repo-settings.json` (D3) and the `@.project-office/AGENTS.md` import line
   (D2). Add the gitignore entry if missing; if the import line is absent and you cannot tell
   whether it was skipped on purpose, ask (D2) rather than adding it silently.
3. **Report** what was refreshed. Everything below the managed block (the project's own
   conventions) is user-owned once seeded — never overwrite it during refresh; if the template's
   defaults evolved there too, say so and let the user merge manually.
