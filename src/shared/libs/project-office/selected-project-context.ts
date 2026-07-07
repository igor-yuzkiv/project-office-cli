import { existsSync } from 'node:fs'
import { dirname, join, parse } from 'node:path'

import type { ProjectRegistryRecord, ProjectRepositoryDefinition } from '@/shared/libs/project-office/types'
import { projectsRegister } from '@/shared/libs/project-office/projects-register'
import { PROJECT_OFFICE_REPO_DIR, PROJECT_OFFICE_REPO_SETTINGS_FILE } from '@/shared/config'

class SelectedProjectContext {
    private selectedRepo: ProjectRepositoryDefinition | null = null
    private projectCache: ProjectRegistryRecord | null = null
    private resolutionError: Error | null = null

    async bootstrap(launchDir: string = process.cwd()): Promise<ProjectRepositoryDefinition | null> {
        this.resolutionError = null
        this.projectCache = null

        try {
            this.selectedRepo = await this.resolve(launchDir)
            if (this.selectedRepo.projectId) {
                this.projectCache = await projectsRegister.getProjectRecord(this.selectedRepo.projectId)
            }
        } catch (error) {
            this.selectedRepo = null
            this.resolutionError = error instanceof Error ? error : new Error(String(error))
        }

        return this.selectedRepo
    }

    getProjectId(): string {
        const { projectId } = this.requireSelectedRepo()
        if (typeof projectId !== 'string' || projectId.length === 0) {
            throw new Error(
                `Repo settings are missing a valid "projectId" in ${PROJECT_OFFICE_REPO_DIR}/${PROJECT_OFFICE_REPO_SETTINGS_FILE}. Run \`project-office project:link-repo\` first.`
            )
        }

        return projectId
    }

    getSelectedRepo(): ProjectRepositoryDefinition {
        return this.requireSelectedRepo()
    }

    getProjectCache(): ProjectRegistryRecord {
        if (this.projectCache) {
            return this.projectCache
        }

        throw new Error(
            `No local project cache found for "${this.getProjectId()}" — run \`project-office project:connect\` ` +
                'or `project:link-repo` first.'
        )
    }

    private requireSelectedRepo(): ProjectRepositoryDefinition {
        if (this.selectedRepo) {
            return this.selectedRepo
        }

        if (this.resolutionError) {
            throw this.resolutionError
        }

        throw new Error(
            'No Project Office context — run this command from inside a repository containing ' +
                `${PROJECT_OFFICE_REPO_DIR}/${PROJECT_OFFICE_REPO_SETTINGS_FILE}.`
        )
    }

    private async resolve(launchDir: string): Promise<ProjectRepositoryDefinition> {
        const markerPath = this.findMarkerUpwards(launchDir)
        if (!markerPath) {
            throw new Error(
                `No ${PROJECT_OFFICE_REPO_DIR}/${PROJECT_OFFICE_REPO_SETTINGS_FILE} found from ${launchDir}.`
            )
        }

        return await this.readMarker(markerPath)
    }

    private findMarkerUpwards(startDir: string): string | null {
        let currentDir = startDir
        const { root } = parse(startDir)

        while (true) {
            const markerPath = join(currentDir, PROJECT_OFFICE_REPO_DIR, PROJECT_OFFICE_REPO_SETTINGS_FILE)
            if (existsSync(markerPath)) {
                return markerPath
            }

            if (currentDir === root) {
                return null
            }

            currentDir = dirname(currentDir)
        }
    }

    private async readMarker(markerPath: string): Promise<ProjectRepositoryDefinition> {
        const raw = await Bun.file(markerPath).text()

        let parsed: unknown
        try {
            parsed = JSON.parse(raw)
        } catch {
            throw new Error(`Failed to parse ${markerPath} — it is not valid JSON.`)
        }

        if (parsed === null || typeof parsed !== 'object') {
            throw new Error(`Invalid Project Office settings at ${markerPath} — expected a JSON object.`)
        }

        return parsed as ProjectRepositoryDefinition
    }
}

export const selectedProjectContext = new SelectedProjectContext()
