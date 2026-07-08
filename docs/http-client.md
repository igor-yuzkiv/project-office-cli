# HTTP client

The shared HTTP layer every backend request goes through. For the `apiBaseUrl` it depends
on and the `apiToken` it authorizes requests with, see [CLI settings](./configuration.md#cli-settings).

This is a thin `axios` wrapper — not a framework. It centralizes the backend base URL, the
`Authorization` header, and safe error mapping. It does not implement retries, caching,
request logging, or a response envelope; those are out of scope until a real use case needs
them.

## `httpClient`

`src/shared/libs/http/http.client.ts` exports a plain `axios` instance, `httpClient`:

- **`baseURL`** — `cliSettingsProvider.get('apiBaseUrl')`.
- **Request interceptor** — reads `apiToken` from `cliSettingsProvider.get('apiToken')` and
  sets `Authorization: Bearer <apiToken>` on every request. `cliSettingsProvider` must have
  loaded settings first (see [CLI settings](./configuration.md#cli-settings)); `src/index.ts`
  calls `cliSettingsProvider.bootstrap()` before any command runs.
- **Response interceptor** — on a rejected response, converts the error through
  `mapAxiosErrorToHttpError` (see below) and rejects with that instead of the raw axios error.

`httpClient` returns full `AxiosResponse` objects, same as raw `axios` — callers extract
`.data` themselves, following the existing entity-API convention:

```ts
// entities/task/api/task.api.ts
import { httpClient } from '@/shared/libs/http'

export async function fetchTaskRequest(projectId: string, taskId: string): Promise<TaskResponse> {
    return httpClient.get<TaskResponse>(`projects/${projectId}/tasks/${taskId}`).then((res) => res.data)
}
```

## `HttpError`

`src/shared/libs/http/http.error.ts` exports `HttpError`, the only error shape a caller of
`httpClient` should expect from a failed backend request:

```ts
class HttpError extends Error {
    readonly status?: number
    readonly exitCode: ExitCode
    readonly backendMessage?: string
}
```

Only these safe fields are kept. `HttpError` never carries the raw `AxiosError`, its
`config`, or request/response headers — so a caught `HttpError` can be logged or printed to
the user without risk of leaking the `Authorization` header or the token it carries.

`mapAxiosErrorToHttpError(error)` builds an `HttpError` from an `AxiosError`:

- `status` — `error.response?.status`, `undefined` for a network/timeout failure.
- `backendMessage` — read defensively from `response.data` (`message` or `error` string
  fields only; anything else in the response body is ignored).
- `message` — always a message this function constructs itself (never `error.message` or
  axios's own formatting), so it can't accidentally echo sensitive request details.

A non-`AxiosError` (for example `cliSettingsProvider.get()` throwing because settings were
never loaded) is not wrapped — it passes through unchanged. Only HTTP/axios failures get the
`HttpError` treatment.

## Exit codes

`src/shared/config/exit-codes.config.ts` defines `ExitCode`, and `mapAxiosErrorToHttpError`
maps every response status to one:

| Status                        | `ExitCode`           |
| ----------------------------- | -------------------- |
| `401`                         | `Unauthenticated`    |
| `403`                         | `Forbidden`          |
| `404`                         | `NotFound`           |
| `409`                         | `Conflict`           |
| `400`, `422`                  | `GenericError`       |
| `5xx`                         | `BackendUnavailable` |
| no response (network/timeout) | `BackendUnavailable` |
| anything else                 | `GenericError`       |

Every read/write command consumes `httpClient` indirectly through an entity `api/` function
(e.g. `fetchTaskRequest`, `createTaskRequest`). None of them currently catch a rejected
`HttpError` to map `.exitCode` onto `process.exitCode` — an unhandled backend failure today
surfaces as an uncaught rejection instead of a mapped exit code. The first command that adds
that handling should read `.exitCode` off a caught `HttpError` and assign it to
`process.exitCode`.
