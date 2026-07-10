# `doc:update`

Updates a document in the current Project Office project.

## Call

```
project-office doc:update --doc DOC-MTM-1 --title "Updated title"
project-office doc:update -d DOC-MTM-1 --content "Updated content..."
project-office doc:update -d DOC-MTM-1 --content @/tmp/doc.md
project-office doc:update -d DOC-MTM-1 --content -
project-office doc:update -d DOC-MTM-1 --tags "architecture,backend"
project-office doc:update -d DOC-MTM-1 --tags ""
```

## Options

- `-d, --doc <document>` — **required**. The document's ULID or human key.
- `--title <title>` — optional. New document title.
- `--content <content>` — optional. Inline text, `@<path>` to read from a file, or `-` (also
  accepted: `@-`) to read from stdin. Stored and rendered as **markdown** in Task Manager —
  use headings, lists, `code`, and tables to structure it.
- `--tags <tags>` — optional. Comma-separated tag names — **replaces the document's entire
  tag set** (not additive). No tag ids needed — the backend finds or creates each tag by
  name. Pass an empty string (`--tags ""`) to remove all tags.
- `-f, --format <json|markdown>` — optional, default `markdown`.

At least one of `--title` / `--content` / `--tags` is required — omitting all of them fails
immediately with a clear error and no request is made.

Parent/path cannot be changed through this command.

## Output

Same shape as `doc:view`: `markdown` (default) renders the updated document through the same
frontmatter/content mapping; `json` returns the raw API response.

## Errors

Missing all of `--title`/`--content`/`--tags` fails client-side. An invalid document id/key
surfaces as a backend error.
