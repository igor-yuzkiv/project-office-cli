# Flow: documentation — read / create / update project docs

Project Office documents are **extra context**, never a required step of a task. The whole flow
is one rule:

> **Read when referenced, write only when asked.**

Exact options and output come from `project-office instructions doc:view | doc:create |
doc:update` — this flow only says when to reach for them.

## Read

`doc:view` a document only when it is explicitly referenced — the user names it, the user's
message carries a document key, or the task description references a document or documentation
link. Read exactly those and nothing else; never browse, search, or pull in unrelated docs on
your own. Factor what you read into planning or implementation.

```bash
project-office doc:view --doc DOC-MTM-1
```

## Create / update

Only on an explicit request — the user asks, or the task's scope requires it. Never as
opportunistic cleanup. If the target document or the intended change is unclear, ask rather than
guess. After writing, re-read with `doc:view` and report briefly what changed.

```bash
project-office doc:create --title "…" --content @/tmp/doc.md
project-office doc:update --doc DOC-MTM-1 --content @/tmp/doc.md
```

`doc:create` always makes a root-level document. Whether a doc belongs in the office or in the
repo is a workflow rule — see `<repo>/.project-office/AGENTS.md`.

Multi-line `--content` goes through a file or stdin, per `references/office-cli.md`
§"Multi-line / large input".

## Boundary

Documentation is a context source, not a task stage. No search, no listing, no doc comments, no
related-docs graph — just the three commands above under the one rule. Access invariants are in
`SKILL.md`.
