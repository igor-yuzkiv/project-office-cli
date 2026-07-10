# Flow: documentation — read / create / update project docs

Project Office has a Documentation Hub: documents that serve as **extra context**, never a
required step of every task. The whole flow is one rule:

> **Read when referenced, write only when asked.**

Exact options, output, and error behaviour for each command come from
`project-office instructions doc:view | doc:create | doc:update` — this flow only says *when*
to reach for them and where the boundaries are.

## When to read

Read a document (`doc:view`) **only when it is explicitly referenced** — read the referenced
docs and nothing else. Trigger to read:

- the user asks to use a document as context;
- the user's message contains a document key (e.g. `DOC-MTM-1`);
- the task description contains a document key, a documentation link, or tells you to take a
  document as context.

```bash
project-office doc:view --doc DOC-MTM-1
```

If several documents are named, read exactly those. Never browse, search, or read unrelated
project documentation on your own.

## When to create

Create a document (`doc:create`) **only on an explicit request** — the user asks for it, or
the task description requires creating one as part of its scope. `doc:create` always makes a
root-level document (no parent/path). Whether a doc belongs in the office or the repo is a
workflow rule — see `<repo>/.project-office/AGENTS.md`.

```bash
project-office doc:create --title "…" --content @/tmp/doc.md
```

## When to update

Update a document (`doc:update`) **only on an explicit request** — the user or the task
requires it, the document key is given, and the intended change is clear from context. Never
update a doc as opportunistic cleanup. If the target document or the change is unclear, ask —
do not guess.

```bash
project-office doc:update --doc DOC-MTM-1 --content @/tmp/doc.md
```

Multi-line `--content` goes through a file or stdin the same way task input does
(`references/office-cli.md` §"Multi-line / large input").

## Light flow (detect → read → use → write-on-request → show)

1. **Detect a reference** — does the user or the task explicitly name a document key or
   documentation? If not, this flow does nothing.
2. **Read only referenced docs** — `doc:view` the named documents; ignore everything else.
3. **Use as context** — factor them into planning or implementation.
4. **Write only on request** — create or update only when explicitly asked.
5. **Show the result** — after a create/update, re-read with `doc:view` and report briefly
   what changed.

## Boundary

Documentation is a context source, not a task stage. No search, no listing, no doc comments,
no related-docs graph, no full lifecycle — just the three commands above under the one rule.
The access invariants (CLI-only) in `SKILL.md` apply here too.
