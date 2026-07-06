# Rule: Development workflow

How to approach changes in this repository. The CLI-boundary rules live in
`CLAUDE.md` (non-negotiables) and are not repeated here.

## Workflow phases

Every task must move through the phases below in order. The principles below
(`Clarify before acting`, `Change strategy`, `Incremental implementation`, `Do not`)
govern how each phase is carried out.

### 1. Intake and analysis

Requirements may arrive either from a Project Office task or directly in chat. Treat both
as the source of what needs to be built.

Before writing code, understand:

* the requested behavior;
* the affected scope;
* the existing contracts and constraints;
* the risks and possible side effects.

When requirements are incomplete or ambiguous, resolve them per `Clarify before acting`
before moving on — that section defines what to ask about and what to decide alone.

### 2. Implementation

Implement the requested change with the minimal necessary edits, following `Change
strategy` and `Incremental implementation` and respecting `Do not`. The short version:
stay inside the requested scope, no opportunistic refactoring or unrelated cleanup, and
change contracts only when the task requires it.

Prefer incremental changes that are easy to review and verify.

### 3. Review and reporting

After implementation, run an independent code review when the agent environment provides
such a mechanism.

The review must be independent from the implementation context: use a separate subagent,
review lane, or equivalent mechanism when available.

After review, report briefly:

* what was changed;
* what was verified;
* important risks or assumptions;
* anything that still needs attention.

At the end of the report, explicitly ask the user whether any corrections are needed.

Do not move to the documentation phase until the user either confirms that no corrections
are needed or provides corrections and they are handled.

### 4. Documentation

Documentation is a separate phase after implementation, review, reporting, and user
correction approval.

Before writing or updating documentation, explicitly ask the user whether documentation is
needed by using `AskUserQuestion`.

Do not create or update documentation unless the user confirms it.

When documentation is requested:

* decide whether to create a new document or update an existing one;
* keep all project documentation under `docs/`;
* do not add documentation outside `docs/` unless the user explicitly asks for it.

## Principles

### Clarify before acting

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

### Change strategy

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

### Incremental implementation

- Prefer incremental implementation.
- Do not introduce a large abstraction until there are at least two real use cases.
- Do not design a framework around hypothetical future commands.
- If a convention is unclear, choose the simplest option that keeps the boundary clean
  and can be changed later without drama.

### Do not

- Do not add speculative abstractions because they might be useful later.
- Do not silently expand scope after an approved plan or reviewed artifact.
