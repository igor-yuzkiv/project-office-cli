import { httpClient } from '@/shared/libs/http'
import type { Project, ProjectFetchParams } from '@/entities/project/types'

interface ProjectResponse {
    data: Project
}

export async function fetchProjectRequest(projectId: string, params?: ProjectFetchParams): Promise<ProjectResponse> {
    const { include } = params ?? {}
    return httpClient
        .get<ProjectResponse>(`projects/${projectId}`, { params: { include: include?.join(',') } })
        .then((response) => response.data)
}
