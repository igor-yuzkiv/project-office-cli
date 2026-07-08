# Rule: Development workflow

How to approach changes in this repository. The CLI-boundary rules live in
`CLAUDE.md` (non-negotiables) and are not repeated here.

## Workflow phases

Every task must move through the phases below in order. The principles below
(`Clarify before acting`, `Change strategy`, `Incremental implementation`, `Do not`)
govern how each phase is carried out.

## Workflow state

The workflow does not end after implementation or after the corrections loop.

The agent must keep track of the current phase and the remaining phases. Corrections made
during phase 3 do not reset the workflow and do not remove the requirement to run review
and ask about documentation.

After every phase 3 report, the agent must make the next checkpoint explicit:

* if the user requests corrections, apply them and return to phase 3 reporting;
* if the user confirms that no corrections are needed, immediately move to phase 4 review;
* after phase 4 review is resolved, immediately move to phase 5 documentation;
* the task is not complete until the documentation question has been asked and handled.

Do not treat “no corrections”, “looks good”, “ok”, “approved”, or similar confirmation as
permission to stop. Treat it as the transition from phase 3 to phase 4.

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
strategy` and `Incremental implementation` and respecting `Do not`.

The short version: stay inside the requested scope, avoid opportunistic refactoring or
unrelated cleanup, and change contracts only when the task requires it.

Prefer incremental changes that are easy to review and verify.

### 3. Reporting and corrections

After implementation, report briefly:

* what was changed;
* what was verified;
* important risks or assumptions;
* anything that still needs attention.

At the end of the report, explicitly ask the user whether any corrections are needed.

The report must also state the next workflow step: if the user confirms that no corrections
are needed, the agent must run the review phase next.

Do not run an independent code review automatically at this point, and do not re-run one
after every correction. Apply whatever corrections the user gives, report again, and repeat
until the user confirms no further corrections are needed.

Once the user confirms that no further corrections are needed, do not stop. Continue
immediately to phase 4.

### 4. Review

Run an independent code review — a separate subagent, review lane, or equivalent mechanism
when available — in either of these cases, whichever comes first:

* the user explicitly asks for a review, at any point;
* the user has confirmed no further corrections are needed in phase 3.

Do not run a review after every individual change during phase 3. Review belongs either to
an explicit user request or to the single checkpoint after the corrections loop.

If the review surfaces findings, treat them like any other correction: apply them or discuss
them with the user, then report again and continue once resolved.

After review is complete and all findings are resolved, do not stop. Continue immediately
to phase 5.

### 5. Documentation

Documentation is a separate phase after implementation, reporting/corrections, and review.

After review is complete and all review findings are resolved, the agent must explicitly ask
the user whether documentation is needed by using `AskUserQuestion`.

Do not skip this question because the change looks small, because no documentation file
seems obvious, or because the user did not mention documentation earlier.

Do not create or update documentation unless the user confirms it.

When documentation is requested:

* decide whether to create a new document or update an existing one;
* keep all project documentation under `docs/`;
* do not add documentation outside `docs/` unless the user explicitly asks for it.

The workflow is complete only after the documentation question has been asked and handled.

## Principles

### Clarify before acting

Ask first for decisions about product behavior, business logic, or external contracts —
not for small local implementation choices.

Stop and ask when:

* requirements, acceptance criteria, or expected product behavior are missing or ambiguous;
* the task implies business logic, validation rules, or domain behavior that is not stated;
* an external contract must be decided, such as an API request/response shape, DTO, or
  command public interface;
* multiple materially different approaches exist and the choice affects behavior or scope;
* the change could affect behavior outside the explicitly requested scope;
* existing code contradicts the task description.

Proceed without asking — investigate, decide, implement — when:

* the decision is a low-blast-radius local technical choice, such as naming, file placement,
  small helper extraction, or internal control flow;
* the scope is obvious and the change stays within it;
* a project convention already answers the question.

Never:

* invent business logic, validation, or domain behavior not specified in the task;
* treat an assumption as a fact — surface it explicitly;
* silently pick between materially different product or contract approaches — surface the
  options.

### Change strategy

Prefer minimal, surgical changes:

* default to the smallest change that solves the requested problem;
* preserve existing architecture, patterns, naming, and conventions unless the task
  explicitly requests refactoring;
* avoid opportunistic cleanup or unrelated “while I am here” refactors;
* minimize file count, diff size, and blast radius;
* prefer extending existing abstractions before introducing new layers;
* when larger refactoring seems beneficial, propose it separately instead of doing it
  automatically.

Decision priority:

1. correctness;
2. minimal change;
3. consistency with the codebase;
4. maintainability;
5. architectural improvements, only when requested.

### Incremental implementation

* Prefer incremental implementation.
* Do not introduce a large abstraction until there are at least two real use cases.
* Do not design a framework around hypothetical future commands.
* If a convention is unclear, choose the simplest option that keeps the boundary clean and
  can be changed later without drama.

### Do not

* Do not add speculative abstractions because they might be useful later.
* Do not silently expand scope after an approved plan or reviewed artifact.
