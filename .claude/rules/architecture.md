---
paths:
  - "src/**/*.ts"
---

# Rule: Project architecture and structure

Where code lives and how the project grows. This is **not** Feature-Sliced Design — it
only borrows the entity/shared separation. Do not pull in FSD layers, slices, or
conventions beyond what is described here.

## Structure

```text
src/
  commands/   # CLI command definitions
  entities/   # domain entities
  shared/     # reusable infrastructure and utilities
```

## entities

Domain entities live in `src/entities`, one folder per entity (`task/`, `project/`,
`user/`). An entity folder may contain `api/`, `types/`, `config/`, `index.ts`.

Use entity folders for entity types, API request functions, entity-specific
configuration/constants, and entity-specific helpers. Keep entity logic close to the
entity it belongs to. Do not put CLI command orchestration in `entities` — commands
belong in `commands`.

### Entity API requests

- Every entity that talks to the backend has an `api/` folder with a barrel export.
- `api/` may hold one or more request files, split by endpoint group:
  `task.api.ts`, `task-comments.api.ts`.
- Each function implements exactly one endpoint and carries the `Request` suffix.

```ts
// entities/task/api/task.api.ts
export async function fetchTasksRequest(
  params?: TaskFetchParams,
): Promise<PaginatedResponse<Task>> {
  const { include, ...rest } = params ?? {};
  return httpClient
    .get<PaginatedResponse<Task>>('/tasks', {
      params: { ...rest, include: include?.join(',') },
    })
    .then((res) => res.data);
}

export async function searchTasksRequest(
  params: TaskSearchParams,
): Promise<PaginatedResponse<Task>> {
  return httpClient
    .post<PaginatedResponse<Task>>('/tasks/search', params)
    .then((res) => res.data);
}
```

### Cross-cutting entities

Some entities are universal — they attach to any consumer (`comment`, `tag`,
`attachment`).

- A universal entity module operates only on itself, by its own id:
  `deleteCommentRequest(commentId)`, `updateCommentRequest(commentId, data)`. It must
  not know its consumers — `fetchTaskCommentsRequest(taskId)` does not belong here.
- Operations scoped to a consumer by its id belong to that consumer's entity:
  `fetchTaskCommentsRequest` lives in `entities/task/api/`. When `project` needs
  comments, it gets its own `fetchProjectCommentsRequest` in `entities/project/api/`.
- Duplication across consumers is acceptable and preferred over shared abstractions.

## commands

CLI command definitions live in `src/commands`, grouped by responsibility, with names
matching the public CLI shape (`src/commands/task/view/` → `project-office task:view`).

Each command folder owns command registration and command-specific input handling.
Command modules may call shared libraries or entity APIs, but should not hold reusable
domain logic that belongs elsewhere.

## shared

Reusable code lives in `src/shared`. Only put something here when it is genuinely
reusable across multiple parts of the project. Do not use `shared` as a dumping ground.

- `shared/utils` — small, focused utilities grouped by responsibility
  (`date.util.ts`, `string.util.ts`, `primitive.util.ts`).
- `shared/libs` — reusable service/library wrappers grouped in folders (`http/`,
  `config/`, `output/`): HTTP client setup, config loading, output rendering,
  filesystem helpers, third-party adapters.

## Exports

Use the **Barrel Pattern** where it improves module boundaries and import ergonomics.
Prefer grouped exports through `index.ts` for modules consumed from outside their
folder. Do not create barrel files just for ceremony.

```ts
// good
import { viewTaskCommand } from '@/commands/task';

// avoid deep imports when a stable public export exists
import { viewTaskCommand } from '@/commands/task/view/view-task.command';
```
