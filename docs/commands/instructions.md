# `instructions`

Prints agent-facing instructions for this CLI or a specific command, so an agent can look up
how to call a command without guessing from `--help` (which documents flags, not their
semantics or the output shape).

## Usage

```bash
project-office instructions
project-office instructions task:view
```

- No argument — prints the overview: CLI purpose, the single-project scope rule, the
  `--format` default, how to look up a command's instructions, and an index of available
  command keys.
- `<command>` — prints that command's instructions (e.g. `task:view`, `project:view`,
  `install`, `debug`).
- Unknown `<command>` — prints an error and the list of available keys to stderr, exits
  non-zero.

There is no `--format` option; output is always plain markdown/text on stdout (or an error
on stderr for an unknown key).

## Content source

Instruction text is **not** the same content as this `docs/commands/` tree — it lives in
`src/commands/instructions/content/*.md`, one file per covered command plus `overview.md`,
and is wired through `src/commands/instructions/instructions.registry.ts`
(`Record<command-key, text>`). Bun's text-import (`import x from './file.md' with { type:
'text' }`) embeds each file's content into the compiled binary, so `instructions` works from
`dist/project-office` with no filesystem access to `content/` at runtime.

The overview's command index is generated at runtime from
`Object.keys(instructionsRegistry)`, so it cannot drift out of sync with the registry.

Two sources exist on purpose: this `docs/` tree is for humans; the embedded content is
tuned for an agent (purpose, exact invocation, option semantics, output shape, scope rule,
common errors, copy-ready examples). See
[`.claude/rules/agent-facing-upkeep.md`](../../.claude/rules/agent-facing-upkeep.md) —
adding or changing a command requires keeping its embedded instruction file in sync in the
same change.

## Covered commands

`project:view`, `task:list`, `task:search`, `task:view`, `task:comments`, `install`,
`debug`. `instructions` itself is documented only in the overview's prose, not as a
registry/index entry.
