import type { UserOverviewDto } from '@/entities/user/types'
import type { Project } from '@/entities/project/types'
import type { ProjectRepositoryDefinition } from '@/shared/libs/project-office'

export interface ServerStatus {
    reachable: boolean
    authenticated: boolean
    user?: UserOverviewDto
    baseUrl?: string
    error?: string
}

export type RepoStatus =
    | { linked: false }
    | {
          linked: true
          repoRoot: string
          settingsPath: string
          projectId: string
          name: string
          description?: string
          stack?: string[]
      }

export interface CacheStatus {
    present: boolean
    repos: ProjectRepositoryDefinition[]
}

export interface StatusReport {
    cli: { installed: boolean }
    server: ServerStatus
    repo: RepoStatus
    project: Project | null
    cache: CacheStatus
    ready: boolean
    issues: string[]
}
