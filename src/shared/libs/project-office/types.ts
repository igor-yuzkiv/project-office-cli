import type { Project } from '@/entities/project/types'

export interface ProjectRepositoryDefinition {
    projectId?: string
    path: string
    name: string
    description?: string
    stack?: string[]
}

export interface ProjectRegistryRecord {
    project: Project
    repos: ProjectRepositoryDefinition[]
}
