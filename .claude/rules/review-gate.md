# Rule: Review gate via Plannotator

Any assembled text artifact that needs the user's review, approval, or sign-off MUST be opened through the **Plannotator annotation gate** instead of asking for approval only in chat.

This gate is for **review-worthy text artifacts**, not for code review.

Valid artifacts include:

* implementation plans;
* proposed tasks;
* task decompositions or lists of proposed tasks;
* technical docs;
* architecture notes;
* migration/refactor proposals;
* release notes or handoff notes;
* any other assembled markdown/text document that the user should review as a whole before the agent continues.

Code is not reviewed through this gate. Do not use this for `git diff`, pull requests, or source-code review.

## When to use

Use this gate when the artifact is already assembled and the next step depends on the user's approval.

If you are about to ask the user to bless a whole document, plan, proposal, decomposition, or similar artifact, open it in Plannotator.

## Questions vs. artifact approval

Normal chat questions are allowed while building the artifact.

Use chat questions for small decisions such as:

* choosing between approaches;
* confirming scope;
* resolving unclear requirements;
* picking naming, structure, or granularity.

But once the artifact is assembled, chat confirmation is not enough. The artifact must go through Plannotator.

Correct flow:

```text
clarify details → assemble the artifact → open it in Plannotator → act on the result
```

## Preflight

Before using Plannotator, check that the binary is available:

```bash
command -v plannotator >/dev/null && echo present || echo missing
```

If Plannotator is missing, unavailable, or the user explicitly opts out, fall back to plain chat approval. In that case, show the full artifact in chat and clearly state that Plannotator was not used.

## Run the gate

Write the artifact to a temporary markdown file outside the repository, then open it in annotation mode:

```bash
plannotator annotate "/tmp/<slug>-review.md" --json
```

Always use:

```bash
plannotator annotate
```

Never use:

```bash
plannotator review
```

Do not pass source files, diffs, or repository files directly to Plannotator. Review a temporary markdown copy of the assembled artifact.

Prefer `--json` so the result can be parsed reliably.

## Approval convention

Plannotator has a Close button and inline comments. Treat the artifact as approved when either condition is true:

1. The user closes the UI with no comments.
2. The returned comments include an explicit approval such as `approved`, `ok`, `go`, `погоджено`, or equivalent wording.

The following outputs also count as approval:

```text
empty output
{"decision":"dismissed"}
{"decision":"approved"}
The user approved.
```

If comments are returned without explicit approval, treat them as change requests.

In that case:

1. apply the requested changes to the artifact;
2. open the revised artifact in Plannotator again;
3. repeat until the user closes cleanly or explicitly approves.

## After approval

After the artifact is approved, continue using the approved version only.

Do not silently expand the scope or materially change the approved artifact after approval. If the artifact changes materially, run the updated version through Plannotator again.

Clean up temporary review files when done.
