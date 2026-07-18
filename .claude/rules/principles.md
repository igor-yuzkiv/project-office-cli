# Rule: General principles

Principles for any work in this repository — code, docs, plans, task proposals, even
reorganizing these rules. Git safety (commit/push/reset/rebase/merge) is enforced mechanically
in `.claude/settings.json`, not by prose here.

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

## KISS / simple-first

Keep implementations simple, direct, and easy to review. Solve the current problem without
speculative architecture, generic abstractions, or future-proofing unless the task requires
it. Prefer boring, readable code over clever code.

- Reuse existing project patterns when they fit.
- Do not add layers, services, managers, factories, or helpers just to look "architectural".
- Extract a function only when it makes the code easier to read, test, or reuse right now.
- Prefer explicit flow over generic, configuration-driven behavior.
- Do not introduce a large abstraction until there are at least two real use cases; do not design a framework around hypothetical future commands.
- Do not prepare for imaginary future requirements — leave the code easy to change later.

A good change should be understandable from the diff without a map, a compass, and a senior
architect.

## Code style

Prefer **self-documenting code**: the code should explain itself before comments are needed.

- Prefer intention-revealing names over short or generic ones; a slightly longer name is fine when it aids understanding. Avoid abbreviations unless established in the project domain.
- Introduce explanatory variables and extracted functions when they improve readability.
- Do not add comments that restate what the code already expresses.
- Preserve existing comments unless they are incorrect or obsolete.
- Comments explain **why**, not **what** — non-obvious intent, constraints, trade-offs, external behavior, or a decision that would otherwise look strange.

```ts
// good
const taskId = options.task;

// avoid
// Get task id from options
const taskId = options.task;
```
