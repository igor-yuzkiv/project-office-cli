# `doc:view`

Shows a single document (`GET projects/{project}/docs/{document}`) in the current Project
Office project.

## Usage

```bash
project-office doc:view --doc DOC-MTM-1
project-office doc:view -d DOC-MTM-1 --format json
```

## Options

| Option                    | Default      | Purpose                                                                  |
| ------------------------- | ------------ | ------------------------------------------------------------------------ |
| `-d, --doc <document>`    | **required** | Document ULID or key (e.g. `DOC-MTM-1`).                                 |
| `-f, --format <format>`   | `markdown`   | `json` or `markdown`. See [Output rendering](../../output-rendering.md). |

The command exits with commander's own "required option" error if `--doc` is omitted.

## Output

- **`json`** — the raw `fetchDocumentRequest` response (`renderJson`).
- **`markdown`** — `renderDocumentAsMarkdown`: `id`, `key`, `status`, `tags`, `path` as
  frontmatter properties; `# {title}` + `content` as content.
