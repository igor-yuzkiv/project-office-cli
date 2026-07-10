# `doc:create`

Creates a root document in the current Project Office project.

## Usage

```bash
project-office doc:create --title "Architecture notes"
project-office doc:create --title "Architecture notes" --content "Initial notes..."
project-office doc:create --title "Architecture notes" --content @/tmp/doc.md
project-office doc:create --title "Architecture notes" --tags "architecture,backend"
```

## Options

| Option                         | Default      | Purpose                                                                                                             |
| ------------------------------ | ------------ | --------------------------------------------------------------------------------------------------------------------- |
| `--title <title>`              | — (required) | Document title. Must be unique among the project's root documents.                                                 |
| `--content <content>`          | —            | Inline text, `@<path>` to read from a file, or `-` to read from stdin.                                             |
| `--tags <tags>`                | —            | Comma-separated tag names (e.g. `"architecture,backend"`). No tag ids needed — the backend finds or creates each tag by name. |
| `-f, --format <format>`        | `markdown`   | `json` or `markdown`. See [Output rendering](../../output-rendering.md).                                           |

This command always creates the document at the root of the project documentation tree —
parent/path selection is not supported.

## Output

Same shape as [`doc:view`](./view.md): `markdown` (default) renders through
`renderDocumentAsMarkdown`; `json` returns the raw API response object.

## Errors

Validation (missing title, duplicate root title, over-long tag name, etc.) happens on the
backend and surfaces as a backend error.
