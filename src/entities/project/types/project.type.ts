import type { UserOverviewDto } from '@/entities/user'
import type { Tag } from '@/entities/tag'

export type ProjectStatus = 'draft' | 'active' | 'on_hold' | 'completed' | 'archived'

export type ProjectInclude = 'createdBy' | 'updatedBy' | 'archivedBy' | 'tags'

export interface Project {
    id: string
    name: string
    prefix: string
    status: ProjectStatus
    description: string | null
    start_date: string | null
    end_date: string | null
    archived_at: string | null
    archived_by: UserOverviewDto | null
    created_by: UserOverviewDto
    updated_by: UserOverviewDto
    created_at: string
    updated_at: string
    tags: Tag[]
}

export interface ProjectFetchParams {
    include?: ProjectInclude[]
}
