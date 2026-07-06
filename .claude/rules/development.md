# Rule: Development workflow

How to approach changes in this repository. The CLI-boundary rules live in
`CLAUDE.md` (non-negotiables) and are not repeated here.

## Clarify before acting

Stop and ask before making changes when any of the following is true:

- Requirements, acceptance criteria, or expected behavior are missing or ambiguous.
- Multiple reasonable implementation approaches exist and the task does not specify which.
- The task implies business logic that is not explicitly stated.
- An architectural decision is needed (new abstraction, new layer, API contract, DTO shape).
- The change could affect behavior outside the explicitly requested scope.
- Existing code contradicts the task description.

Never:

- Invent business logic, validation rules, or domain behavior not specified in the task.
- Choose between multiple valid approaches without surfacing the options and asking.
- Treat an assumption as a fact — surface it explicitly.
- Proceed when scope is unclear, even if a reasonable guess exists.

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
