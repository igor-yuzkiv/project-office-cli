#!/usr/bin/env bash
#
# PostToolUse hook (Edit|Write): auto-format the edited file with Prettier.
#
# Runs `bunx prettier --write` on the single edited file, but only when it is a .ts file under
# the project's src/ directory. PostToolUse runs after the edit, so it never blocks the agent;
# it stays quiet and never fails the flow (a missing binary or a prettier error is a no-op).

set -uo pipefail

payload="$(cat)"
file_path="$(printf '%s' "$payload" | jq -r '.tool_input.file_path // empty')"

# Nothing to format.
[ -n "$file_path" ] || exit 0

# Only TypeScript files.
case "$file_path" in
  *.ts) ;;
  *) exit 0 ;;
esac

project_dir="${CLAUDE_PROJECT_DIR:-$PWD}"

# Only files under the project's src/ directory (absolute or relative form).
[[ "$file_path" == "$project_dir/src/"* || "$file_path" == src/* ]] || exit 0

# Format just this file; never fail the flow or emit noise.
( cd "$project_dir" && bunx prettier --write "$file_path" ) >/dev/null 2>&1 || true
exit 0
