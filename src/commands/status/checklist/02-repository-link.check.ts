import type { StatusCheckResult } from '@/commands/status/status.type.ts'
import { selectedProjectContext } from '@/shared/libs/project-office'

export async function checkRepositoryLink(): Promise<StatusCheckResult> {
    try {
        const settings = selectedProjectContext.getRepositorySettings()
        return {
            passed: true,
            messages: [
                'Current repository is linked to a Project Office project.',
                `Project: ${settings.name}`,
                `Project ID: ${settings.projectId}`,
            ],
        }
    } catch (error) {
        return { passed: false, messages: [error instanceof Error ? error.message : String(error)] }
    }
}
