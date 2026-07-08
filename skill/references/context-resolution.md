# Shared: locate the project

Before touching any project data, know **which project you operate on** and whether the current
repo is linked and the CLI ready. This file is the single source for that. (The skill's own
bundled files need no discovery — `references/` is relative to the loaded `SKILL.md`'s folder.)

## Check readiness first — `project-office status`

**Run `project-office status` before anything else.** It never fails (exits 0), needs no marker,
and reports the whole state in fields instead of throwing — so you never have to guess whether the
CLI is installed or the repo is linked by probing files. Read the frontmatter fields (or
`--format json` for the object):

- **`installed`** — the CLI has per-user settings (token). `false` → the user must run
  `project-office install` (see the `setup` flow).
- **`linked`** + **`project_id`** — whether *this* repo is linked to a project, and which. `false`
  → run the `setup` flow to link it.
- **`server_reachable`** / **`server_authenticated`** — backend connectivity and token validity.
  Either `false` → check `server.error`; a down backend, a missing/expired token, or a missing
  `API_BASE_URL` in the CLI's environment looks different from "not linked".
- **`ready`** — `installed && linked` **only** (it does *not* include server reachability).
  Proceed with task/comment commands when `ready: true` **and** `server_reachable` /
  `server_authenticated` are both true. If `ready: true` but the server is unreachable or
  unauthenticated, real commands will still fail — resolve `server.error` first (this is also how
  a missing `API_BASE_URL` in the CLI's environment surfaces).
- When `linked`, `status` also carries the `project` snapshot and the cache `repos[]` (below), so
  a single call usually gives you everything you need to start — but `project` is `null` when the
  server probe failed, even though the repo is linked.

## The model — no office folder

A project office is a **backend project**; there is no local office directory. Locally there are
only two artifacts, both owned by the CLI:

- **`<repo>/.project-office/repo-settings.json`** — the marker that links **one repo** to **one
  `projectId`**. Shape: `{ projectId, path, name, description?, stack? }`. Written **exclusively**
  by `project:link-repo`; never hand-edit it. This is the marker `status` reports as `linked`.
- **`~/.project-office-cache/projects/<projectId>.json`** — an optional local cache
  (`{ project, repos[] }`): the project's last-fetched snapshot plus every repo linked to it.
  Not required for commands; it is what `status`/`project:view` surface as the sibling repos.

If you ever need to find the marker without the CLI (e.g. `status` unavailable), walk cwd and
ancestors for it — but prefer `status`:

```bash
d="$PWD"; while [ "$d" != "/" ]; do \
  [ -f "$d/.project-office/repo-settings.json" ] && echo "$d/.project-office/repo-settings.json" && break; \
  d=$(dirname "$d"); done
```

Every command (except the bootstrap `project:connect` / `project:link-repo`) resolves the
`projectId` itself from this marker — run them **from inside the linked repo**, no `--project`,
no subshell. Expand `~` and make paths absolute before any file operation.

## Knowing the project and its repos

- The **project itself** (name, description, status) is in `status` when linked, or via
  `project-office project:view`.
- **Sibling repos** linked to the same project are in `status` (`cache.repos`) or the cache file
  `~/.project-office-cache/projects/<projectId>.json` `repos[]` (each entry:
  `{ projectId, path, name, description?, stack? }`). Absent cache is fine — it is optional.

The repo is linked (and the cache seeded) by the `setup` flow; the `task` flow only reads context
to resolve the project and its target repos.
