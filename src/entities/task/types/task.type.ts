import type { PagingParams, SortParams } from '@/shared/types'
import type { UserOverviewDto } from '@/entities/user'
import type { Tag } from '@/entities/tag'

export type TaskStatus = 'open' | 'ready_for_development' | 'in_progress' | 'ready_to_test' | 'completed' | 'closed'

export type TaskPriorityName = 'None' | 'Low' | 'Medium' | 'High' | 'Urgent'

export interface TaskPriority {
    value: number
    name: TaskPriorityName
}

export type TaskInclude = 'project' | 'taskList' | 'createdBy' | 'updatedBy' | 'tags'

// Only id/name were verified for the embedded project/task_list projections (doc-0004 §4.5).
export interface TaskProjectRef {
    id: string
    name: string
}

export interface TaskListRef {
    id: string
    name: string
}

export interface Task {
    id: string
    project_id: string
    task_list_id: string | null
    key: string
    sequence_number: number
    name: string
    description: string | null
    start_date: string | null
    due_date: string | null
    priority: TaskPriority
    status: TaskStatus
    created_at: string
    updated_at: string
    created_by?: UserOverviewDto
    updated_by?: UserOverviewDto
    tags?: Tag[]
    project?: TaskProjectRef
    task_list?: TaskListRef
}

// Shape returned by `tasks/list` (TaskOverviewResource): no `description` / `sequence_number`.
export type TaskOverview = Pick<
    Task,
    | 'id'
    | 'project_id'
    | 'task_list_id'
    | 'key'
    | 'name'
    | 'start_date'
    | 'due_date'
    | 'priority'
    | 'status'
    | 'created_at'
    | 'updated_at'
    | 'created_by'
    | 'updated_by'
    | 'tags'
    | 'project'
    | 'task_list'
>

export type TaskFetchParams = PagingParams &
    SortParams & {
        include?: TaskInclude[]
    }

export interface CreateTaskInput {
    name: string
    description?: string | null
    tags?: string
}

export interface UpdateTaskInput {
    name?: string
    status?: TaskStatus
    description?: string | null
    tags?: string
}
