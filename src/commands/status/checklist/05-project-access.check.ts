import type { StatusCheckResult } from '@/commands/status/status.type.ts'
import { fetchProjectRequest } from '@/entities/project'
import { selectedProjectContext } from '@/shared/libs/project-office'
import { HttpError } from '@/shared/libs/http'
import { ExitCode } from '@/shared/config'

export async function checkProjectAccess(): Promise<StatusCheckResult> {
    let projectId: string
    try {
        projectId = selectedProjectContext.getProjectId()
    } catch (error) {
        return { passed: false, messages: [error instanceof Error ? error.message : String(error)] }
    }

    const projectIdMessage = `Project ID: ${projectId}`

    try {
        const response = await fetchProjectRequest(projectId)
        return { passed: true, messages: ['Linked project exists on the server.', `Project: ${response.data.name}`] }
    } catch (error) {
        if (error instanceof HttpError && error.exitCode === ExitCode.BackendUnavailable) {
            return {
                passed: false,
                messages: ['Cannot verify linked project because the server is not reachable.', projectIdMessage],
            }
        }

        return {
            passed: false,
            messages: [error instanceof Error ? error.message : String(error), projectIdMessage],
        }
    }
}
