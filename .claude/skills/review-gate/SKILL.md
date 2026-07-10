---
name: review-gate
description: >-
  Gate an assembled text artifact (plan, proposed task, technical/architecture
  doc, migration proposal, handoff notes) through Plannotator for the user's
  whole-document approval before continuing. Use once such an artifact is
  assembled and the next step depends on the user approving it as a whole —
  invoke it before asking for that approval in chat. Not for code review
  (diffs, PRs, source).
allowed-tools: Bash, Read, Write, Edit
---

# Review gate via Plannotator

Any assembled text artifact that needs the user's review, approval, or sign-off MUST be
opened through the Plannotator annotation gate, not approved in chat alone. This gate is for
review-worthy **text artifacts**, never for code review (`git diff`, PRs, source).

Applies to: implementation plans, proposed tasks, task decompositions, technical docs,
architecture notes, migration/refactor proposals, release/handoff notes, or any assembled
markdown the user should review as a whole before you continue.

## When to run

The moment an artifact is assembled and the next step depends on the user's approval — i.e.
you are about to ask the user to bless a whole document. Chat questions are still fine *while
building* the artifact (choosing approaches, confirming scope, resolving requirements,
picking naming/granularity); once it is assembled, chat confirmation is not enough:

```text
clarify details → assemble the artifact → open it in Plannotator → act on the result
```

## Preflight

Check the binary is available:

```bash
command -v plannotator >/dev/null && echo present || echo missing
```

If it is missing, unavailable, or the user opts out → fall back to chat approval: show the
full artifact in chat and state that Plannotator was not used.

## Run the gate

Write the artifact to a temporary markdown file **outside the repository**, then open it in
annotation mode:

```bash
plannotator annotate "/tmp/<slug>-review.md" --json
```

- Always `plannotator annotate` — never `plannotator review`.
- Prefer `--json` so the result parses reliably.
- Do not pass source files, diffs, or repository files — only a temporary markdown copy.

## Approval convention

Treat the artifact as **approved** when either:

1. The user closes the UI with no comments.
2. The comments include an explicit approval (`approved`, `ok`, `go`, `погоджено`, or equivalent).

These outputs also count as approval:

```text
empty output
{"decision":"dismissed"}
{"decision":"approved"}
The user approved.
```

Comments returned without explicit approval are change requests:

1. apply the requested changes to the artifact;
2. open the revised artifact in Plannotator again;
3. repeat until the user closes cleanly or explicitly approves.

## After approval

Continue using the approved version only. Do not silently expand scope or materially change
the approved artifact; if it changes materially, run it through Plannotator again. Clean up
temporary review files when done.
