import type { UserOverviewDto } from '@/entities/user'

export interface CommentCan {
    update: boolean
    delete: boolean
}

export interface TaskComment {
    // Serialized as a string by the backend even though the primary key is an int (doc-0004 §4.7).
    id: string
    content: string
    author: UserOverviewDto
    created_at: string
    updated_at: string
    can: CommentCan
}

// `POST tasks/{task}/comments` creates multiple comments at once (doc-0004 §4.8).
export interface CreateTaskCommentsInput {
    comments: Array<{ content: string }>
}

export interface UpdateTaskCommentInput {
    content: string
}
