import { renderMarkdown } from '@/shared/libs/output'
import type { MarkdownProperties } from '@/shared/libs/output'
import type { Task } from '@/entities/task/types'

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
    return `# ${task.name}\n\n${task.description ?? ''}`
}

export function renderTaskAsMarkdown(task: Task): string {
    return renderMarkdown(buildTaskContent(task), buildTaskProperties(task))
}
