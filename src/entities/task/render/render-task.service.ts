import { renderMarkdown } from '@/shared/libs/output'
import type { MarkdownProperties } from '@/shared/libs/output'
import type { PaginatedResponse } from '@/shared/types'
import type { Task, TaskOverview } from '@/entities/task/types'
import { EMPTY_DESCRIPTION_PLACEHOLDER } from '@/shared/config'

function buildTaskProperties(task: Task): MarkdownProperties {
    return {
        key: task.key,
        status: task.status,
        priority: task.priority.name,
        project: task.project?.name ?? null,
        task_list: task.task_list?.name ?? null,
        start_date: task.start_date,
        due_date: task.due_date,
        tags: task.tags?.map((tag) => tag.name) ?? [],
        created_at: task.created_at,
        updated_at: task.updated_at,
    }
}

function buildTaskContent(task: Task): string {
    return `# ${task.name}\n\n${task.description || EMPTY_DESCRIPTION_PLACEHOLDER}`
}

export function renderTaskAsMarkdown(task: Task): string {
    return renderMarkdown(buildTaskContent(task), buildTaskProperties(task))
}

function buildTaskListProperties(response: PaginatedResponse<TaskOverview>): MarkdownProperties {
    return {
        total: response.meta.total,
        page: response.meta.current_page,
        per_page: response.meta.per_page,
    }
}

function buildTaskListContent(tasks: TaskOverview[]): string {
    return tasks.map((task) => `${task.key} ${task.name}`).join('\n')
}

export function renderTaskListAsMarkdown(response: PaginatedResponse<TaskOverview>): string {
    return renderMarkdown(buildTaskListContent(response.data), buildTaskListProperties(response))
}
