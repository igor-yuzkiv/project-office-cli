import { renderMarkdown } from '@/shared/libs/output'
import type { MarkdownProperties } from '@/shared/libs/output'
import type { StartTaskResponse } from '@/entities/task/types'
import { EMPTY_DESCRIPTION_PLACEHOLDER } from '@/shared/config'

function buildStartTaskProperties(response: StartTaskResponse): MarkdownProperties {
    const { task } = response
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

function buildStartTaskContent(response: StartTaskResponse): string {
    const { task, comments } = response
    const description = `# ${task.name}\n\n${task.description || EMPTY_DESCRIPTION_PLACEHOLDER}`
    const commentLines = comments.length
        ? comments
              .map((comment) => `- **${comment.author.name}** (${comment.created_at}): ${comment.content}`)
              .join('\n')
        : '_No comments yet._'

    return `${description}\n\n## Recent comments\n\n${commentLines}`
}

export function renderStartTaskAsMarkdown(response: StartTaskResponse): string {
    return renderMarkdown(buildStartTaskContent(response), buildStartTaskProperties(response))
}
