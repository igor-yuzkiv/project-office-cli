import type { StatusCheckResult } from '@/commands/status/status.type'
import { fetchUserProfileRequest } from '@/entities/user'
import { HttpError } from '@/shared/libs/http'
import { ExitCode } from '@/shared/config'
import { cliSettingsProvider } from '@/shared/libs/settings'

function getConfiguredApiBaseUrl(): string | undefined {
    try {
        return cliSettingsProvider.get('apiBaseUrl')
    } catch {
        return undefined
    }
}

export async function checkServerConnection(): Promise<StatusCheckResult> {
    const baseUrl = getConfiguredApiBaseUrl()
    const urlMessage = `URL: ${baseUrl ?? 'unknown — CLI settings not loaded'}`

    try {
        await fetchUserProfileRequest()
        return { passed: true, messages: ['Project Office API is reachable.', urlMessage] }
    } catch (error) {
        if (error instanceof HttpError && error.exitCode !== ExitCode.BackendUnavailable) {
            return { passed: true, messages: ['Project Office API is reachable.', urlMessage] }
        }

        return { passed: false, messages: ['Project Office API is not reachable.', urlMessage] }
    }
}
