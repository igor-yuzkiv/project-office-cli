import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

import type { ProjectRegistryRecord, ProjectRepositoryDefinition } from '@/shared/libs/project-office/types'
import { projectsRegister } from '@/shared/libs/project-office/projects-register'
import { PROJECT_OFFICE_REPO_DIR, PROJECT_OFFICE_REPO_SETTINGS_FILE } from '@/shared/config'

class SelectedProjectContext {
    private _repositorySettings: ProjectRepositoryDefinition | null = null
    private _projectRecord: ProjectRegistryRecord | null = null
    private bootstrapError: Error | null = null
    private repositorySettingsPath: string | null = null

    async bootstrap(launchDir: string = process.cwd()): Promise<ProjectRepositoryDefinition | null> {
        this.bootstrapError = null
        this._projectRecord = null
        this.repositorySettingsPath = null

        try {
            this._repositorySettings = await this.resolveRepositorySettings(launchDir)
        } catch (error) {
            this._repositorySettings = null
            this.bootstrapError = error instanceof Error ? error : new Error(String(error))
            return this._repositorySettings
        }

        try {
            this._projectRecord = await this.resolveProjectRecord(this.getProjectId())
        } catch (error) {
            this._projectRecord = null
            this.bootstrapError = error instanceof Error ? error : new Error(String(error))
        }

        return this._repositorySettings
    }

    get repositorySettings(): ProjectRepositoryDefinition | null {
        return this._repositorySettings
    }

    get projectRecord(): ProjectRegistryRecord | null {
        return this._projectRecord
    }

    getRepositorySettings(): ProjectRepositoryDefinition {
        if (this._repositorySettings) {
            return this._repositorySettings
        }

        if (this.bootstrapError) {
            throw this.bootstrapError
        }

        throw new Error(
            'No Project Office context — run this command from inside a repository containing ' +
                `${PROJECT_OFFICE_REPO_DIR}/${PROJECT_OFFICE_REPO_SETTINGS_FILE}.`
        )
    }

    getProjectId(): string {
        const { projectId } = this.getRepositorySettings()
        if (typeof projectId !== 'string' || projectId.length === 0) {
            throw new Error(
                `Repo settings are missing a valid "projectId" in ${PROJECT_OFFICE_REPO_DIR}/${PROJECT_OFFICE_REPO_SETTINGS_FILE}. Run \`project-office project:link-repo\` first.`
            )
        }

        return projectId
    }

    getProjectRecord(): ProjectRegistryRecord {
        if (this._projectRecord) {
            return this._projectRecord
        }

        if (this.bootstrapError) {
            throw this.bootstrapError
        }

        throw new Error(
            `No local project record found for "${this.getProjectId()}" — run \`project-office project:connect\` ` +
                'or `project:link-repo` first.'
        )
    }

    getRepositorySettingsPath(): string | null {
        return this.repositorySettingsPath
    }

    getBootstrapError(): Error | null {
        return this.bootstrapError
    }

    private async resolveRepositorySettings(launchDir: string): Promise<ProjectRepositoryDefinition> {
        const path = this.findRepositorySettingsFileUpwards(launchDir)
        this.repositorySettingsPath = path

        if (!path) {
            throw new Error(
                `No ${PROJECT_OFFICE_REPO_DIR}/${PROJECT_OFFICE_REPO_SETTINGS_FILE} found from ${launchDir}.`
            )
        }

        return await this.readRepositorySettingsFile(path)
    }

    private async resolveProjectRecord(projectId: string): Promise<ProjectRegistryRecord> {
        const record = await projectsRegister.getProjectRecord(projectId)
        if (!record) {
            throw new Error(`No local project record found for "${projectId}".`)
        }

        return record
    }

    private findRepositorySettingsFileUpwards(startDir: string): string | null {
        let currentDir = resolve(startDir)

        while (true) {
            const settingsPath = join(currentDir, PROJECT_OFFICE_REPO_DIR, PROJECT_OFFICE_REPO_SETTINGS_FILE)
            if (existsSync(settingsPath)) {
                return settingsPath
            }

            const parentDir = dirname(currentDir)
            if (parentDir === currentDir) {
                return null
            }

            currentDir = parentDir
        }
    }

    private async readRepositorySettingsFile(path: string): Promise<ProjectRepositoryDefinition> {
        const raw = await Bun.file(path).text()

        let parsed: unknown
        try {
            parsed = JSON.parse(raw)
        } catch {
            throw new Error(`Failed to parse ${path} — it is not valid JSON.`)
        }

        if (parsed === null || typeof parsed !== 'object') {
            throw new Error(`Invalid Project Office repository settings at ${path} — expected a JSON object.`)
        }

        const { projectId } = parsed as ProjectRepositoryDefinition
        if (typeof projectId !== 'string' || projectId.length === 0) {
            throw new Error(`Invalid Project Office repository settings at ${path} — missing a valid "projectId".`)
        }

        return parsed as ProjectRepositoryDefinition
    }
}

export const selectedProjectContext = new SelectedProjectContext()
