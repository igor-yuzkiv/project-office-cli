import { httpClient } from '@/shared/libs/http'
import type { PaginatedResponse } from '@/shared/types'
import type {
    Task,
    TaskOverview,
    TaskFetchParams,
    TaskSearchParams,
    CreateTaskInput,
    UpdateTaskInput,
} from '@/entities/task/types'

interface TaskResponse {
    data: Task
}

export async function fetchTasksRequest(
    projectId: string,
    params?: TaskFetchParams
): Promise<PaginatedResponse<TaskOverview>> {
    const { include, ...rest } = params ?? {}
    return httpClient
        .get<PaginatedResponse<TaskOverview>>(`projects/${projectId}/tasks/list`, {
            params: { ...rest, include: include?.join(',') },
        })
        .then((response) => response.data)
}

export async function searchTasksRequest(
    projectId: string,
    params: TaskSearchParams
): Promise<PaginatedResponse<TaskOverview>> {
    const { query = '', filters = [], include, ...pagination } = params
    return httpClient
        .post<PaginatedResponse<TaskOverview>>(`projects/${projectId}/tasks/search`, {
            query,
            filters,
            include,
            ...pagination,
        })
        .then((response) => response.data)
}

export async function fetchTaskRequest(projectId: string, taskId: string): Promise<TaskResponse> {
    return httpClient.get<TaskResponse>(`projects/${projectId}/tasks/${taskId}`).then((response) => response.data)
}

export async function createTaskRequest(projectId: string, data: CreateTaskInput): Promise<TaskResponse> {
    return httpClient.post<TaskResponse>(`projects/${projectId}/tasks`, data).then((response) => response.data)
}

export async function updateTaskRequest(
    projectId: string,
    taskId: string,
    data: UpdateTaskInput
): Promise<TaskResponse> {
    return httpClient.put<TaskResponse>(`projects/${projectId}/tasks/${taskId}`, data).then((response) => response.data)
}
