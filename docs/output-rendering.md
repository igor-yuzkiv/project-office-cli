# Output rendering

The shared infrastructure every command uses to print results in either of the CLI's two
output formats — JSON or Markdown — plus the first entity-specific renderer, for Task.

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
  arrays render as `[a, b, c]`. Nested objects are not supported — an entity's render service
  flattens them into scalars/arrays before calling `renderMarkdown`.

```ts
import { renderMarkdown } from '@/shared/libs/output'

renderMarkdown('# Title\n\nBody text', { status: 'open', tags: ['infra', 'output'] })
// ---
// status: open
// tags: [infra, output]
// ---
//
// # Title
//
// Body text
```

Frontmatter values are interpolated as-is — no YAML quoting/escaping beyond this primitive
form. A property value containing `:` or `,` can produce frontmatter a strict YAML parser
rejects; this is a known, accepted limitation of the current iteration, not an oversight.

## `src/entities/task/render/render-task.service.ts`

The first (and so far only) entity-specific renderer, `renderTaskAsMarkdown(task: Task): string`.
It decides which `Task` fields become frontmatter properties and which become content, then
calls `renderMarkdown`:

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

## Scope

This iteration covers only the generic renderers and the Task renderer — exercised directly,
not wired into a CLI command. No `task:*` command exists yet to render through end-to-end;
wiring `renderTaskAsMarkdown` into a real command is a separate, later task. Also out of
scope: a format dispatcher/factory, render services for other entities (project/user/tag),
and richer Markdown (tables, nested structures, escaping beyond the primitive YAML shown
above).
