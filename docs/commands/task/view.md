# `task:view`

Shows a single task (`GET tasks/{task}`) in the current Project Office project.

## Usage

```bash
project-office task:view --task TASK-1
project-office task:view -t TASK-1 --format json
```

## Options

| Option                  | Default      | Purpose                                                               |
| ----------------------- | ------------ | --------------------------------------------------------------------- |
| `-t, --task <task>`     | **required** | Task ULID or key (e.g. `TASK-1`).                                     |
| `-f, --format <format>` | `markdown`   | `json` or `markdown`. See [Output rendering](../../output-rendering.md). |

The command exits with commander's own "required option" error if `--task` is omitted.

## Output

- **`json`** — the raw `fetchTaskRequest` response (`renderJson`).
- **`markdown`** — `renderTaskAsMarkdown`: `key`, `status`, `priority`, `project`,
  `task_list`, `start_date`, `due_date`, `tags`, `created_at`, `updated_at` as frontmatter
  properties; `# {name}` + `description` as content.
