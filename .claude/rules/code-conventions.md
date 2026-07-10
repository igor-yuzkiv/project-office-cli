# Rule: Code conventions

Conventions for writing code in this repository. General work principles live in
`principles.md`; project structure and CLI-specific naming / command style live in the scoped
rules (`architecture.md`, `conventions.md`).

## KISS / simple-first

Keep implementations simple, direct, and easy to review. Solve the current problem without
speculative architecture, generic abstractions, or future-proofing unless the task requires
it. Prefer boring, readable code over clever code.

- Make the smallest reasonable change that solves the task.
- Reuse existing project patterns when they fit.
- Avoid broad refactors unless they are part of the task scope.
- Do not add layers, services, managers, factories, or helpers just to look "architectural".
- Extract a function only when it makes the code easier to read, test, or reuse right now.
- Prefer explicit flow over generic, configuration-driven behavior.
- Do not introduce a large abstraction until there are at least two real use cases, and do not design a framework around hypothetical future commands.
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
