# `doc:update`

Updates a document in the current Project Office project.

## Usage

```bash
project-office doc:update --doc DOC-MTM-1 --title "Updated title"
project-office doc:update -d DOC-MTM-1 --content "Updated content..."
project-office doc:update -d DOC-MTM-1 --content @/tmp/doc.md
project-office doc:update -d DOC-MTM-1 --tags "architecture,backend"
project-office doc:update -d DOC-MTM-1 --tags ""
```

## Options

| Option                          | Default      | Purpose                                                                                                                    |
| -------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `-d, --doc <document>`           | — (required) | Document ULID or key.                                                                                                      |
| `--title <title>`                | —            | New document title.                                                                                                        |
| `--content <content>`            | —            | Inline text, `@<path>` to read from a file, or `-` to read from stdin.                                                     |
| `--tags <tags>`                  | —            | Comma-separated tag names — **replaces the document's entire tag set** (not additive). Pass `""` to remove all tags. No tag ids needed. |
| `-f, --format <format>`          | `markdown`   | `json` or `markdown`. See [Output rendering](../../output-rendering.md).                                                   |

At least one of `--title` / `--content` / `--tags` is required — omitting all of them fails
immediately with a clear error and no request is made.

Parent/path cannot be changed through this command.

## Output

Same shape as [`doc:view`](./view.md): `markdown` (default) renders the updated document
through `renderDocumentAsMarkdown`; `json` returns the raw API response.

## Errors

Missing all of `--title`/`--content`/`--tags` fails client-side. An invalid document id/key
surfaces as a backend error.
