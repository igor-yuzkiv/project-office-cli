# `doc:view`

Fetches a single project document by ULID or key and prints it.

## Call

```
project-office doc:view --doc DOC-MTM-1
project-office doc:view -d DOC-MTM-1 --format json
```

## Options

- `-d, --doc <document>` — **required**. The document's ULID or human key (e.g. `DOC-MTM-1`).
- `-f, --format <json|markdown>` — optional, default `markdown`.

## Output

- `markdown` (default): frontmatter with `id, key, status, tags, path`, then `# {title}`
  followed by the content as body text.
- `json`: the raw API response object.

## Errors

Omitting `--doc` fails immediately with a non-zero exit and a "required option" message on
stderr — no request is made. An unknown ULID/key surfaces as a backend error.
