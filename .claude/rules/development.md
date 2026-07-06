# Rule: Development workflow

How to approach changes in this repository. The CLI-boundary rules live in
`CLAUDE.md` (non-negotiables) and are not repeated here.

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
