# `task:comments`

Lists comments on a task (`GET tasks/{task}/comments`) in the current Project Office
project.

## Usage

```bash
project-office task:comments --task TASK-1
project-office task:comments -t TASK-1 --format json
project-office task:comments -t TASK-1 --page 1 --per-page 20
```

## Options

| Option                  | Default         | Purpose                                                                  |
| ----------------------- | --------------- | ------------------------------------------------------------------------ |
| `-t, --task <task>`     | **required**    | Task ULID or key (e.g. `TASK-1`).                                        |
| `-f, --format <format>` | `markdown`      | `json` or `markdown`. See [Output rendering](../../output-rendering.md). |
| `--page <page>`         | backend default | Page number.                                                             |
| `--per-page <perPage>`  | backend default | Items per page (backend caps `comments` at 100).                         |

There is no `--sort-by`/`--sort-order`/`--include` — the comments endpoint does not support
them.

## Output

- **`json`** — the raw paginated `fetchTaskCommentsRequest` response (`renderJson`).
- **`markdown`** — `renderTaskCommentsAsMarkdown`: one `- **{author}** ({created_at}):
{content}` line per comment as content; pagination meta (`total`, `page`, `per_page`) as
  frontmatter properties.
