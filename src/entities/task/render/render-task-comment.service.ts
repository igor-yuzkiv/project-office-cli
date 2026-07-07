import { renderMarkdown } from '@/shared/libs/output'
import type { MarkdownProperties } from '@/shared/libs/output'
import type { PaginatedResponse } from '@/shared/types'
import type { TaskComment } from '@/entities/task/types'

function buildTaskCommentsProperties(response: PaginatedResponse<TaskComment>): MarkdownProperties {
    return {
        total: response.meta.total,
        page: response.meta.current_page,
        per_page: response.meta.per_page,
    }
}

function buildTaskCommentsContent(comments: TaskComment[]): string {
    return comments
        .map((comment) => `- **${comment.author.name}** (${comment.created_at}): ${comment.content}`)
        .join('\n')
}

export function renderTaskCommentsAsMarkdown(response: PaginatedResponse<TaskComment>): string {
    return renderMarkdown(buildTaskCommentsContent(response.data), buildTaskCommentsProperties(response))
}
