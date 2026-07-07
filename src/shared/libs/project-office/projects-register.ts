import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { Project } from '@/entities/project/types'
import type { ProjectRegistryRecord, ProjectRepositoryDefinition } from '@/shared/libs/project-office/types'
import {
    PROJECT_OFFICE_PROJECTS_CACHE_DIR,
    PROJECT_OFFICE_REPO_DIR,
    PROJECT_OFFICE_REPO_SETTINGS_FILE,
} from '@/shared/config'

class ProjectsRegister {
    private getProjectRecordPath(projectId: string): string {
        return join(PROJECT_OFFICE_PROJECTS_CACHE_DIR, `${projectId}.json`)
    }

    async getProjectRecord(projectId: string): Promise<ProjectRegistryRecord | null> {
        const path = this.getProjectRecordPath(projectId)
        if (!existsSync(path)) {
            return null
        }

        const parsed = JSON.parse(await Bun.file(path).text()) as ProjectRegistryRecord
        return { project: parsed.project, repos: Array.isArray(parsed.repos) ? parsed.repos : [] }
    }

    async setProjectRecord(projectId: string, project: Project): Promise<ProjectRegistryRecord> {
        const existing = await this.getProjectRecord(projectId)
        const record: ProjectRegistryRecord = { project, repos: existing?.repos ?? [] }

        await mkdir(PROJECT_OFFICE_PROJECTS_CACHE_DIR, { recursive: true })
        await writeFile(this.getProjectRecordPath(projectId), `${JSON.stringify(record, null, 4)}\n`)
        return record
    }

    async linkRepositoryToProject(
        projectId: string,
        repositoryLink: ProjectRepositoryDefinition
    ): Promise<ProjectRegistryRecord> {
        const existing = await this.getProjectRecord(projectId)
        if (!existing) {
            throw new Error(`No project record found for "${projectId}" — call setProjectRecord first.`)
        }

        const repos = [
            ...existing.repos.filter((existingRepo) => existingRepo.path !== repositoryLink.path),
            repositoryLink,
        ]
        const record: ProjectRegistryRecord = { project: existing.project, repos }

        await mkdir(PROJECT_OFFICE_PROJECTS_CACHE_DIR, { recursive: true })
        await writeFile(this.getProjectRecordPath(projectId), `${JSON.stringify(record, null, 4)}\n`)
        return record
    }

    async writeRepositorySettings(repoDir: string, repositoryLink: ProjectRepositoryDefinition): Promise<void> {
        const dir = join(repoDir, PROJECT_OFFICE_REPO_DIR)
        await mkdir(dir, { recursive: true })
        await writeFile(join(dir, PROJECT_OFFICE_REPO_SETTINGS_FILE), `${JSON.stringify(repositoryLink, null, 4)}\n`)
    }
}

export const projectsRegister = new ProjectsRegister()
