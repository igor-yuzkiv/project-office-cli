# `status`

Call this **first**, before any other command, in any new session or when you're unsure
whether the CLI is installed or the current repo is linked to a project. It never fails —
always exits `0` — and reports readiness as an ordered preflight checklist instead of
throwing, so you don't need `try`/`catch` around it.

## Call

```
project-office status
project-office status --format json
```

## Options

- `-f, --format <json|markdown>` — optional, default `markdown`.

## Checks (run in this order, every time — one check failing does not stop the rest)

1. **CLI settings** — the per-user settings file exists and is valid.
2. **Repository link** — the current repo has a valid `<repo>/.project-office/repo-settings.json`.
3. **Server connection** — the Project Office API is reachable.
4. **Authentication** — the CLI token is present and accepted by the server.
5. **Project access** — the linked project actually exists on the server.

A check that depends on an earlier one (e.g. Authentication needs the server to be
reachable) reports "cannot verify …" instead of failing on its own — read its own
`messages` for the reason.

## Output shape (`json`)

```ts
{
    checks: Array<{ title: string; passed: boolean; messages: string[] }>
    result: 'ready' | 'failed' // 'ready' only when every check passed
}
```

`markdown` (default): plain-text checklist, no frontmatter — one block per check
(`[X]`/`[ ]` + title + indented `messages`), then a trailing `Result: ready|failed` line.

## How to use it

- **`result: 'failed'`** — find the first failing check in `checks` and read its
  `messages` for the reason and any remediation hint (e.g. run `project-office install`,
  or `project-office project:link-repo --project <id> --name <repo-name>`).
- **`result: 'ready'`** — every check passed; proceed with any other command.
- Checks run independently and in order — a later check may say "cannot verify … because
  the server is not reachable" when an earlier one already failed; that is expected, not a
  bug.
