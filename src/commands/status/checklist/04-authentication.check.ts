import type { StatusCheckResult } from '@/commands/status/status.type.ts'
import { fetchUserProfileRequest } from '@/entities/user'
import { HttpError } from '@/shared/libs/http'
import { ExitCode } from '@/shared/config'

export async function checkAuthentication(): Promise<StatusCheckResult> {
    try {
        await fetchUserProfileRequest()
        return { passed: true, messages: ['CLI token is present and accepted by the server.'] }
    } catch (error) {
        if (error instanceof HttpError) {
            if (error.exitCode === ExitCode.BackendUnavailable) {
                return { passed: false, messages: ['Cannot verify CLI token because the server is not reachable.'] }
            }

            return { passed: false, messages: [error.backendMessage ?? 'CLI token was rejected by the server.'] }
        }

        return { passed: false, messages: [error instanceof Error ? error.message : String(error)] }
    }
}
