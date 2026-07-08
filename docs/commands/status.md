# `status`

Reports whether the CLI is ready to use, as a preflight checklist: an ordered set of
independent checks, each shown with its own pass/fail result. Meant to be the first command
run in any session — it **never fails** (always exits `0`), so it can be called
unconditionally before anything else.

## Usage

```bash
project-office status
project-office status --format json
```

## Options

| Option                  | Default    | Purpose                                                               |
| ----------------------- | ---------- | --------------------------------------------------------------------- |
| `-f, --format <format>` | `markdown` | `json` or `markdown`. See [Output rendering](../output-rendering.md). |

## Checks

Defined in `src/commands/status/checklist/` as one file per check (`NN-<name>.check.ts`),
collected into the `checklist` array in `checklist/index.ts` and run **in order** by
`status.command.ts`. Every check runs regardless of whether an earlier one failed — a check
that depends on an earlier precondition (for example, an API call needing the server to be
reachable) detects that itself and reports "cannot verify …" rather than being skipped.

1. **CLI settings** (`01-cli-settings.check.ts`) — the per-user settings file
   (see [Configuration](../configuration.md)) exists and passes validation.
2. **Repository link** (`02-repository-link.check.ts`) — the current repo has a valid
   `<repo>/.project-office/repo-settings.json`
   (see [Project Office context](../project-office-context.md)).
3. **Server connection** (`03-server-connection.check.ts`) — the configured `apiBaseUrl` is
   reachable.
4. **Authentication** (`04-authentication.check.ts`) — the CLI token is accepted by the
   server.
5. **Project access** (`05-project-access.check.ts`) — the project linked by
   `repo-settings.json` actually exists on the server.

Each check returns `{ passed: boolean, messages: string[] }` — a short pass/fail flag plus
one or more human-readable lines (summary first, then optional detail lines such as a file
path or project id).

## Output

- **`markdown`** (default) — plain text, no YAML frontmatter: a `Project Office status`
  header, one block per check —

    ```txt
    [X] Check title
        Message line
        Optional detail line
    ```

    (`[X]` passed, `[ ]` failed) — followed by a trailing `Result: ready` or `Result: failed`
    line.

- **`json`** —
    ```ts
    {
        checks: Array<{ title: string; passed: boolean; messages: string[] }>
        result: 'ready' | 'failed' // 'ready' only when every check passed
    }
    ```

## Adding or changing a check

See [`.claude/rules/agent-facing-upkeep.md`](../../.claude/rules/agent-facing-upkeep.md) —
whenever the CLI comes to depend on something new (a precondition, a local artifact, a
required backend call), add a new checklist file or update an existing one so `status`
keeps telling the truth.
