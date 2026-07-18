---
paths:
  - "skills/**"
---

# Rule: Skill change verification

Skills under `skills/**` are agent-facing prompt / documentation, not code — the development
validators (`bunx tsc --noEmit`, `bunx prettier --check src/`) do not apply and prove nothing
about a skill change. Their place in the independent review is taken by a review of the skill
through the `prompt-engineer` skill.

## Verification stage

The verification for a skill change is an independent `prompt-engineer` review, run per the
independent review in `workflow.md` — only after the user approves it, in a separate lane from
the authoring context, never self-approved.

- Review against the change's own acceptance criteria: is the wording clear and unambiguous,
  are the boundaries explicit, does the skill stay compact and agent-oriented, does it avoid
  duplicating what the CLI already documents, and does it not conflict with the existing
  flows.
- Incorporate the result: apply the needed edits, or state explicitly why an edit is not
  needed. Only then is the skill change verified.

This is the skills equivalent of the code review in `workflow.md`; the gating rules
(who approves, separate review lane) are the same.
