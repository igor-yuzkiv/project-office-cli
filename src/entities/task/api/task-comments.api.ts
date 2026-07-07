import { httpClient } from '@/shared/libs/http'
import type { PagingParams, PaginatedResponse } from '@/shared/types'
import type { TaskComment, CreateTaskCommentsInput, UpdateTaskCommentInput } from '@/entities/task/types'

interface CommentResponse {
    data: TaskComment
}

interface CommentsResponse {
    data: TaskComment[]
}

export async function fetchTaskCommentsRequest(
    projectId: string,
    taskId: string,
    params?: PagingParams
): Promise<PaginatedResponse<TaskComment>> {
    return httpClient
        .get<PaginatedResponse<TaskComment>>(`projects/${projectId}/tasks/${taskId}/comments`, { params })
        .then((response) => response.data)
}

// Creates multiple comments in one call; the response is not paginated (doc-0004 §4.8).
export async function createTaskCommentsRequest(
    projectId: string,
    taskId: string,
    data: CreateTaskCommentsInput
): Promise<CommentsResponse> {
    return httpClient
        .post<CommentsResponse>(`projects/${projectId}/tasks/${taskId}/comments`, data)
        .then((response) => response.data)
}

export async function updateTaskCommentRequest(
    projectId: string,
    taskId: string,
    commentId: string | number,
    data: UpdateTaskCommentInput
): Promise<CommentResponse> {
    return httpClient
        .put<CommentResponse>(`projects/${projectId}/tasks/${taskId}/comments/${commentId}`, data)
        .then((response) => response.data)
}
