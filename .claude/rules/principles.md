# Rule: General principles

Principles for any work in this repository — code, docs, plans, task proposals, even
reorganizing these rules. Code-writing conventions live in `code-conventions.md`; workflow
phases live in `workflow.md`.

## Clarify before acting

Ask first for decisions about product behavior, business logic, or external contracts — not
for small local implementation choices.

Stop and ask when:

- requirements, acceptance criteria, or expected product behavior are missing or ambiguous;
- the task implies business logic, validation rules, or domain behavior that is not stated;
- an external contract must be decided, such as an API request/response shape, DTO, or command public interface;
- multiple materially different approaches exist and the choice affects behavior or scope;
- the change could affect behavior outside the explicitly requested scope;
- existing code contradicts the task description.

Proceed without asking — investigate, decide, implement — when:

- the decision is a low-blast-radius local technical choice, such as naming, file placement, small helper extraction, or internal control flow;
- the scope is obvious and the change stays within it;
- a project convention already answers the question.

Never:

- invent business logic, validation, or domain behavior not specified in the task;
- treat an assumption as a fact — surface it explicitly;
- silently pick between materially different product or contract approaches — surface the options.

## Change strategy

Prefer minimal, surgical changes:

- default to the smallest change that solves the requested problem;
- preserve existing architecture, patterns, naming, and conventions unless the task explicitly requests refactoring;
- avoid opportunistic cleanup or unrelated "while I am here" refactors;
- minimize file count, diff size, and blast radius;
- prefer extending existing abstractions before introducing new layers;
- when larger refactoring seems beneficial, propose it separately instead of doing it automatically;
- do not silently expand scope after an approved plan or reviewed artifact.

Decision priority: correctness → minimal change → consistency with the codebase →
maintainability → architectural improvements (only when requested).

## Git safety

Hard constraints — never bypass without explicit user confirmation:

- Never create commits automatically.
- Never push changes automatically.
- Never perform merge, rebase, or reset operations without explicit user confirmation.
