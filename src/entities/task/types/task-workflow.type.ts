import type { Task } from '@/entities/task/types/task.type'
import type { TaskComment } from '@/entities/task/types/task-comment.type'

export interface StartTaskInput {
    comment?: string
}

export interface StartTaskResponse {
    task: Task
    comments: TaskComment[]
}

export interface CheckpointTaskInput {
    subject: string
    comment: string
}

export interface HandoffTaskInput {
    resolution: string
}
