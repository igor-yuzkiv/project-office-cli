# Output rendering

The shared infrastructure every command uses to print results in either of the CLI's two
output formats — JSON or Markdown — plus the entity-specific renderers for Task, Project,
and task comments. For the commands that consume these renderers, see
[docs/commands/](./commands/).

Deliberately primitive: Markdown output is a YAML frontmatter block (properties) followed by
plain-text content. There is no dispatcher/factory choosing a renderer — a command picks the
renderer itself (`if (options.format === 'markdown') { … } else { … }`).

## `src/shared/libs/output/`

Generic renderers with no knowledge of any entity.

- **`CliOutputFormat`** — `'json' | 'markdown'`, the `--format` option's value.
- **`renderJson(data: unknown): string`** — `JSON.stringify(data, null, 2)`.
- **`renderMarkdown(content: string, properties: MarkdownProperties): string`** — prepends a
  YAML frontmatter block built from `properties` to `content`. If `properties` is empty, no
  frontmatter block is added and `content` is returned unchanged.
- **`MarkdownProperties`** — `Record<string, MarkdownPropertyValue>`.
- **`MarkdownPropertyValue`** — `string | number | boolean | null | Array<string | number>`;
  a scalar renders as a quoted string (`"value"`); `null` renders as the bare YAML `null`;
  a non-empty array renders as a YAML block list (`key:` followed by one `  - item` line per
  entry) and an empty array renders as `key: []`. Nested objects are not supported — an
  entity's render service flattens them into scalars/arrays before calling `renderMarkdown`.

```ts
import { renderMarkdown } from '@/shared/libs/output'

renderMarkdown('# Title\n\nBody text', { status: 'open', due_date: null, tags: ['infra', 'output'] })
// ---
// status: "open"
// due_date: null
// tags:
//   - infra
//   - output
// ---
//
// # Title
//
// Body text
```

Quoting only wraps scalar values in double quotes (escaping embedded `"`); it is not full
YAML escaping. A string value containing a literal newline can still produce frontmatter a
strict YAML parser rejects; this is a known, accepted limitation of the current iteration,
not an oversight.

## `src/entities/task/render/render-task.service.ts`

`renderTaskAsMarkdown(task: Task): string` decides which `Task` fields become frontmatter
properties and which become content, then calls `renderMarkdown` (used by
[`task:view`](./commands/task/view.md)):

| Frontmatter property | Source                                     |
| -------------------- | ------------------------------------------ |
| `key`                | `task.key`                                 |
| `status`             | `task.status`                              |
| `priority`           | `task.priority.name`                       |
| `project`            | `task.project?.name`, or `null`            |
| `task_list`          | `task.task_list?.name`, or `null`          |
| `start_date`         | `task.start_date`                          |
| `due_date`           | `task.due_date`                            |
| `tags`               | `task.tags?.map(tag => tag.name)`, or `[]` |
| `created_at`         | `task.created_at`                          |
| `updated_at`         | `task.updated_at`                          |

Content is `# {task.name}` followed by `task.description` (or an empty string).

The same file also exports `renderTaskListAsMarkdown(response: PaginatedResponse<TaskOverview>): string`,
used by [`task:list`](./commands/task/list.md) and [`task:search`](./commands/task/search.md).
Content is one `{key} {name}` line per task; frontmatter properties are the pagination meta
(`total`, `page`, `per_page`).

## `src/entities/task/render/render-task-comment.service.ts`

`renderTaskCommentsAsMarkdown(response: PaginatedResponse<TaskComment>): string`, used by
[`task:comments`](./commands/task/comments.md). Content is one
`- **{author.name}** ({created_at}): {content}` line per comment; frontmatter properties are
the pagination meta (`total`, `page`, `per_page`) — same shape as the task list renderer.

## `src/entities/project/render/render-project.service.ts`

`renderProjectAsMarkdown(project: Project): string`, used by
[`project:view`](./commands/project/view.md). Mirrors the Task renderer's split: `prefix`,
`status`, `start_date`, `end_date`, `tags` (`project.tags?.map(tag => tag.name) ?? []`),
`created_at`, `updated_at` as frontmatter properties; `# {project.name}` followed by
`project.description` (or an empty string) as content.

## Scope

Out of scope for the current iteration: a format dispatcher/factory (each command still
picks its renderer inline), render services for the remaining entities (user/tag), and
richer Markdown (tables, nested structures, escaping beyond the primitive quoting described
above).
