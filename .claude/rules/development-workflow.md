# Rule: Development workflow

How to approach changes in this repository. The CLI-boundary rules live in
`CLAUDE.md` (non-negotiables) and are not repeated here.

## The workflow

Work every task through these steps in order. The principles below (`Clarify before
acting`, `Change strategy`, `Incremental implementation`, `Do not`) govern *how* each step
is carried out.

1. **Receive the requirements.** They arrive either as a Project Office task or as a direct
   message in chat. Treat both as the source of what to build.
2. **Analyze the task.** Understand the scope, the expected behavior, the risks, and the
   existing contracts and constraints it touches before writing any code.
3. **Ask when requirements are incomplete or ambiguous** — following `Clarify before
   acting`. Do not ask about small local technical choices the agent can decide itself.
4. **Implement with minimal changes** — following `Change strategy` and `Incremental
   implementation`. No opportunistic refactoring, no scope expansion.
5. **Run an independent code review.** After implementing, hand the change to a *separate*
   reviewer — a distinct subagent or review lane, not the same context that wrote the code.
   Do this whenever the agent environment provides such a mechanism. Keep it tool-neutral:
   use an independent reviewer/subagent **when available**.
6. **Use the environment's own term for that reviewer.** Different agent environments name
   this differently. Check the current environment's docs/conventions and use its correct
   term for an independent reviewer or subagent. If the environment offers no such
   mechanism, say so plainly and do a self-review pass in a clearly separate lane instead.
7. **Report what was done.** Give the user a short summary: the important changes, the
   risks, what was verified, and what still needs attention.
8. **Open the review gate.** The implementation is not accepted until the user confirms it.
   Route the sign-off through the review gate (see `review-gate.md`), not a bare chat "ok?".
9. **After acceptance, decide whether documentation is needed.** Documentation is needed
   when the change is a new feature, an architecture change, an important contract, a new
   workflow, or a decision that will matter for future development. Routine, self-evident
   changes do not need docs.
10. **If documentation is needed, ask the user** whether they want to add or update it
    before writing anything.
11. **Choose new vs. existing doc.** Decide whether to create a new document or update an
    existing one.
12. **Keep all project documentation under `docs/`.** Every document for this project lives
    in the `docs` folder.

## Clarify before acting

Ask first for decisions about product behavior, business logic, or external contracts —
not for small local implementation choices.

Stop and ask when:

- Requirements, acceptance criteria, or expected product behavior are missing or ambiguous.
- The task implies business logic, validation rules, or domain behavior that is not stated.
- An external contract must be decided (API request/response shape, DTO, a command's
  public interface).
- Multiple materially different approaches exist and the choice affects behavior or scope.
- The change could affect behavior outside the explicitly requested scope.
- Existing code contradicts the task description.

Proceed without asking (investigate, decide, implement) when:

- The decision is a low-blast-radius local technical choice (naming, file placement, a
  small helper extraction, internal control flow).
- The scope is obvious and the change stays within it.
- A project convention already answers the question.

Never:

- Invent business logic, validation, or domain behavior not specified in the task.
- Treat an assumption as a fact — surface it explicitly.
- Silently pick between materially different product/contract approaches — surface the options.

## Change strategy

Prefer minimal, surgical changes:

- Default to the smallest change that solves the requested problem.
- Preserve existing architecture, patterns, naming, and conventions unless the task
  explicitly requests refactoring.
- Avoid opportunistic cleanup or unrelated "while I am here" refactors.
- Minimize file count, diff size, and blast radius.
- Prefer extending existing abstractions before introducing new layers.
- When larger refactoring seems beneficial, propose it separately instead of doing it
  automatically.

Decision priority: correctness → minimal change → consistency with the codebase →
maintainability → architectural improvements (only when requested).

## Incremental implementation

- Prefer incremental implementation.
- Do not introduce a large abstraction until there are at least two real use cases.
- Do not design a framework around hypothetical future commands.
- If a convention is unclear, choose the simplest option that keeps the boundary clean
  and can be changed later without drama.

## Do not

- Do not add speculative abstractions because they might be useful later.
- Do not silently expand scope after an approved plan or reviewed artifact.
