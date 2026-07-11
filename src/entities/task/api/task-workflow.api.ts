import { httpClient } from '@/shared/libs/http'
import type {
    Task,
    TaskComment,
    StartTaskInput,
    StartTaskResponse,
    CheckpointTaskInput,
    HandoffTaskInput,
} from '@/entities/task/types'

interface StartTaskApiResponse {
    task: Task
    comments: TaskComment[]
}

interface CommentResponse {
    data: TaskComment
}

interface TaskResponse {
    data: Task
}

export async function startTaskRequest(
    projectId: string,
    taskId: string,
    data: StartTaskInput = {}
): Promise<StartTaskResponse> {
    return httpClient
        .post<StartTaskApiResponse>(`projects/${projectId}/tasks/${taskId}/workflow/start`, data)
        .then((response) => response.data)
}

export async function checkpointTaskRequest(
    projectId: string,
    taskId: string,
    data: CheckpointTaskInput
): Promise<CommentResponse> {
    return httpClient
        .post<CommentResponse>(`projects/${projectId}/tasks/${taskId}/workflow/checkpoint`, data)
        .then((response) => response.data)
}

export async function handoffTaskRequest(
    projectId: string,
    taskId: string,
    data: HandoffTaskInput
): Promise<TaskResponse> {
    return httpClient
        .post<TaskResponse>(`projects/${projectId}/tasks/${taskId}/workflow/handoff`, data)
        .then((response) => response.data)
}
