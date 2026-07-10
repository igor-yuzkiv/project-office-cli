# `doc:create`

Creates a root-level document in the current Project Office project.

## Call

```
project-office doc:create --title "Architecture notes"
project-office doc:create --title "Architecture notes" --content "Initial notes..."
project-office doc:create --title "Architecture notes" --content @/tmp/doc.md
project-office doc:create --title "Architecture notes" --tags "architecture,backend"
```

## Options

- `--title <title>` — **required**. Document title. Must be unique among the project's root
  documents.
- `--content <content>` — optional. Inline text, `@<path>` to read from a file, or `-` (also
  accepted: `@-`) to read from stdin. Stored and rendered as **markdown** in Task Manager —
  use headings, lists, `code`, and tables to structure it.
- `--tags <tags>` — optional. Comma-separated tag names (e.g. `"architecture,backend"`). No
  tag ids needed — the backend finds or creates each tag by name.
- `-f, --format <json|markdown>` — optional, default `markdown`.

This command always creates the document at the root of the project documentation tree —
there is no way to set a parent through this command.

## Output

- `markdown` (default): same shape as `doc:view` — frontmatter with `id, key, status, tags,
path`, then `# {title}` followed by the content.
- `json`: the raw API response object.

## Errors

Validation (missing title, duplicate root title, over-long tag name, etc.) happens on the
backend and surfaces as a backend error.
