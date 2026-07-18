# Rule: Review gate

At the plan-approval checkpoint, a plan or proposal that needs sign-off goes through the
Plannotator gate, not chat alone. Applies to assembled review-worthy text (plans, task
proposals, decompositions, technical docs, migration/architecture proposals) — never to code,
diffs, or source.

## Run

    command -v plannotator >/dev/null && echo present || echo missing
    plannotator annotate "/tmp/<slug>-review.md" --json

Write the artifact to a temp `.md` outside the repo. Always `annotate` (never `review`); prefer
`--json`. If the binary is missing or the user opts out, fall back to chat approval and say so.

## Result

Approved when the user closes with no comments, approves explicitly (`ok` / `go` / `approved` /
`погоджено`), or the output is empty / `{"decision":"dismissed"|"approved"}`. Otherwise the
comments are change requests: apply them, reopen, repeat. Clean up temp files after.
