import { existsSync } from 'node:fs'
import { dirname } from 'node:path'

import type { Project } from '@/entities/project/types'
import { fetchProjectRequest } from '@/entities/project'
import { fetchUserProfileRequest } from '@/entities/user'
import { HttpError } from '@/shared/libs/http'
import { selectedProjectContext, projectsRegister } from '@/shared/libs/project-office'
import { cliSettingsProvider } from '@/shared/libs/settings'
import { SETTINGS_FILE, ExitCode } from '@/shared/config'
import type { CacheStatus, RepoStatus, ServerStatus, StatusReport } from '@/commands/status/status.type'

function getConfiguredApiBaseUrl(): string | undefined {
    try {
        return cliSettingsProvider.get('apiBaseUrl')
    } catch {
        return undefined
    }
}

async function probeServer(): Promise<ServerStatus> {
    const baseUrl = getConfiguredApiBaseUrl()

    try {
        const response = await fetchUserProfileRequest()
        return { reachable: true, authenticated: true, user: response.data, baseUrl }
    } catch (error) {
        if (error instanceof HttpError) {
            return {
                reachable: error.exitCode !== ExitCode.BackendUnavailable,
                authenticated: false,
                baseUrl,
                error: error.backendMessage ?? error.message,
            }
        }

        return {
            reachable: false,
            authenticated: false,
            baseUrl,
            error: error instanceof Error ? error.message : String(error),
        }
    }
}

function resolveRepo(issues: string[]): RepoStatus {
    const bootstrapError = selectedProjectContext.getBootstrapError()
    if (bootstrapError) {
        issues.push(bootstrapError.message)
    }

    const repositorySettings = selectedProjectContext.repositorySettings
    const settingsPath = selectedProjectContext.getRepositorySettingsPath()
    if (!repositorySettings || !settingsPath) {
        return { linked: false }
    }

    if (!repositorySettings.projectId) {
        issues.push(`${settingsPath} is missing a valid "projectId" — run \`project-office project:link-repo\`.`)
        return { linked: false }
    }

    return {
        linked: true,
        repoRoot: dirname(dirname(settingsPath)),
        settingsPath,
        projectId: repositorySettings.projectId,
        name: repositorySettings.name,
        description: repositorySettings.description,
        stack: repositorySettings.stack,
    }
}

export async function buildStatusReport(): Promise<StatusReport> {
    const issues: string[] = []

    const installed = existsSync(SETTINGS_FILE)
    const server = await probeServer()
    const repo = resolveRepo(issues)

    let project: Project | null = null
    let cache: CacheStatus = { present: false, repos: [] }

    if (repo.linked) {
        try {
            const response = await fetchProjectRequest(repo.projectId)
            project = response.data
        } catch (error) {
            issues.push(error instanceof Error ? error.message : String(error))
        }

        try {
            const record = await projectsRegister.getProjectRecord(repo.projectId)
            cache = { present: record !== null, repos: record?.repos ?? [] }
        } catch (error) {
            issues.push(error instanceof Error ? error.message : String(error))
        }
    }

    return {
        cli: { installed },
        server,
        repo,
        project,
        cache,
        ready: installed && repo.linked,
        issues,
    }
}
