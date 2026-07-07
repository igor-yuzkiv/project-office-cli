# Project Office CLI — agent instructions

`project-office` is the only channel through which you (the agent) may reach Task Manager /
Project Office data. Use it instead of direct database access, backend API calls, or
filesystem shortcuts — those are not available to you and should never be attempted.

## Scope

Every command operates inside a single, already-resolved Project Office project. The project
id is resolved automatically from `<repo>/.project-office/repo-settings.json`, found by
walking up from the directory the CLI was launched in — there is no `--project` option on
these commands, and none should be assumed or passed by hand.

The only exceptions are the two bootstrap commands, `project:connect` and
`project:link-repo` — they take an explicit `--project <id>` because they exist to
_establish_ that context in the first place, before any `repo-settings.json` exists. You
should not normally need to run them yourself; they are typically run once per repo during
setup. `repo-settings.json` is written **exclusively** by `project:link-repo` — never create
or edit it by hand.

## Output format

Every read command accepts `-f, --format <json|markdown>`. The default is `markdown`: a YAML
frontmatter block of properties, then plain-text or list content. Pass `--format json` when
you need to parse the response programmatically instead of reading it.

## Getting a command's instructions

Run `project-office instructions <command>` (e.g. `project-office instructions task:view`) to
print that command's agent-facing instructions — exact invocation, option semantics, and
output shape. Prefer this over `--help`, which documents flags but not their meaning or the
output format.

## Commands
