# `debug`

Internal developer command that smoke-tests the API client layer end to end (resolves the
project scope and calls the task-fetching client methods, printing raw results). It exists
for local development of this CLI itself, not as a data-access tool — prefer `task:list` /
`task:view` for anything you actually need to read.

## Call

```
project-office debug
```

No options, no `--format` — output is unstructured debug logging, not meant to be parsed.
