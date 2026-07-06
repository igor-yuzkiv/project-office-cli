import axios from 'axios'

import { ExitCode } from '@/shared/config'
import type { BackendErrorBody } from '@/shared/libs/http/http.type'

export class HttpError extends Error {
    readonly status?: number
    readonly exitCode: ExitCode
    readonly backendMessage?: string

    constructor(params: { message: string; exitCode: ExitCode; status?: number; backendMessage?: string }) {
        super(params.message)
        this.name = 'HttpError'
        this.exitCode = params.exitCode
        this.status = params.status
        this.backendMessage = params.backendMessage
    }
}

function extractBackendMessage(data: unknown): string | undefined {
    if (data === null || typeof data !== 'object') {
        return undefined
    }

    const body = data as BackendErrorBody
    if (typeof body.message === 'string') {
        return body.message
    }
    if (typeof body.error === 'string') {
        return body.error
    }

    return undefined
}

function mapStatusToExitCode(status?: number): ExitCode {
    if (status === undefined) {
        return ExitCode.BackendUnavailable
    }
    if (status === 401) {
        return ExitCode.Unauthenticated
    }
    if (status === 403) {
        return ExitCode.Forbidden
    }
    if (status === 404) {
        return ExitCode.NotFound
    }
    if (status === 409) {
        return ExitCode.Conflict
    }
    if (status === 400 || status === 422) {
        return ExitCode.GenericError
    }
    if (status >= 500) {
        return ExitCode.BackendUnavailable
    }

    return ExitCode.GenericError
}

export function mapAxiosErrorToHttpError(error: unknown): HttpError {
    if (!axios.isAxiosError(error)) {
        throw error
    }

    const status = error.response?.status
    const exitCode = mapStatusToExitCode(status)
    const backendMessage = extractBackendMessage(error.response?.data)

    return new HttpError({
        message: `Backend request failed (${status ?? 'network error'})`,
        exitCode,
        status,
        backendMessage,
    })
}
